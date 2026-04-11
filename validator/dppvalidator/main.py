"""
PV DPP Validator — CIRPASS-2-aligned validation service for PV solar module passports.

Based on the dppvalidator architecture (https://github.com/artiso-ai/dppvalidator)
with PV-specific business rules and JSON Schema validation.

Endpoints:
    POST /validate          — Validate a PV passport JSON payload
    GET  /health            — Health check
    GET  /profiles          — List available validation profiles
    GET  /rules             — List PV business rules
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import jsonschema

app = FastAPI(
    title="PV DPP Validator",
    description="CIRPASS-2-aligned validation service for PV Digital Product Passports",
    version="1.0.0",
)

# --- Schema Loading ---

SCHEMA_PATH = os.environ.get(
    "PV_SCHEMA_PATH", "/app/schemas/pv-passport-v1.json"
)


def load_schema() -> dict:
    path = Path(SCHEMA_PATH)
    if not path.exists():
        # Fallback to local development path
        alt = Path(__file__).parent.parent.parent / "schemas" / "pv-passport-v1.json"
        if alt.exists():
            path = alt
        else:
            return {}
    with open(path) as f:
        return json.load(f)


SCHEMA = load_schema()

# --- Models ---


class ValidationRequest(BaseModel):
    passport: dict[str, Any]
    profile: str = "regulatory-core"  # regulatory-core | industry | full


class ValidationIssue(BaseModel):
    field: str
    message: str
    severity: str  # error | warning


class ValidationResult(BaseModel):
    valid: bool
    profile: str
    errors: list[ValidationIssue]
    warnings: list[ValidationIssue]
    completeness: float  # 0-100
    ruleResults: list[dict[str, Any]]


# --- PV Business Rules ---

PV_RULES = [
    {
        "id": "PV-001",
        "description": "STC rated power must be 50-800W",
        "field": "ratedPowerSTC_W",
    },
    {
        "id": "PV-002",
        "description": "Module efficiency must be 5-30%",
        "field": "moduleEfficiency_percent",
    },
    {
        "id": "PV-003",
        "description": "Module technology must be known enum",
        "field": "moduleTechnology",
    },
    {
        "id": "PV-004",
        "description": "Degradation rate must be 0.1-1.5%/year",
        "field": "warranty.linearDegradation_percent_per_year",
    },
    {
        "id": "PV-005",
        "description": "BOM mass percentages should sum to ~100%",
        "field": "materialComposition.moduleMaterials",
    },
    {
        "id": "PV-006",
        "description": "Temperature coefficients (Pmax, Voc) must be negative",
        "field": "tempCoeff_Pmax",
    },
    {
        "id": "PV-007",
        "description": "Voc must be greater than Vmp",
        "field": "voc_V / vmp_V",
    },
    {
        "id": "PV-008",
        "description": "Isc must be greater than Imp",
        "field": "isc_A / imp_A",
    },
    {
        "id": "PV-009",
        "description": "Certificate validity dates must not be expired",
        "field": "compliance.certificates",
    },
    {
        "id": "PV-010",
        "description": "GTIN must be 8-14 digit numeric",
        "field": "gtin",
    },
    {
        "id": "PV-011",
        "description": "Carbon footprint must be positive if declared",
        "field": "carbonFootprint.declaredValue_kgCO2e",
    },
    {
        "id": "PV-013",
        "description": "Manufacturing date must not be in the future",
        "field": "manufacturingDate",
    },
    {
        "id": "PV-014",
        "description": "Module mass must be 5-50kg",
        "field": "moduleMass_kg",
    },
    {
        "id": "PV-015",
        "description": "Max system voltage must be 600, 1000, or 1500V",
        "field": "maxSystemVoltage_V",
    },
]

VALID_TECHNOLOGIES = {"perc", "topcon", "hjt", "cigs", "cdte", "perovskite", "shj", "ibc"}


def _get_nested(data: dict, path: str) -> Any:
    """Get a nested value from a dict using dot notation."""
    keys = path.split(".")
    current = data
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return None
    return current


def run_pv_business_rules(passport: dict) -> tuple[list[ValidationIssue], list[ValidationIssue], list[dict]]:
    """Run PV-specific business rules against a passport payload."""
    errors: list[ValidationIssue] = []
    warnings: list[ValidationIssue] = []
    results: list[dict] = []

    def _add(rule_id: str, passed: bool, msg: str, field: str, severity: str = "error"):
        results.append({"ruleId": rule_id, "passed": passed, "message": msg})
        if not passed:
            issue = ValidationIssue(field=field, message=f"[{rule_id}] {msg}", severity=severity)
            if severity == "error":
                errors.append(issue)
            else:
                warnings.append(issue)

    # PV-001: STC power range
    power = passport.get("ratedPowerSTC_W")
    if power is not None:
        ok = 50 <= power <= 800
        _add("PV-001", ok, f"STC power {power}W {'is' if ok else 'is NOT'} in valid range (50-800W)", "ratedPowerSTC_W")

    # PV-002: Efficiency range
    eff = passport.get("moduleEfficiency_percent")
    if eff is not None:
        ok = 5 <= eff <= 30
        _add("PV-002", ok, f"Efficiency {eff}% {'is' if ok else 'is NOT'} in valid range (5-30%)", "moduleEfficiency_percent")

    # PV-003: Known technology
    tech = passport.get("moduleTechnology")
    if tech is not None:
        ok = tech in VALID_TECHNOLOGIES
        _add("PV-003", ok, f"Technology '{tech}' {'is' if ok else 'is NOT'} a known enum value", "moduleTechnology")

    # PV-004: Degradation rate
    deg = _get_nested(passport, "warranty.linearDegradation_percent_per_year")
    if deg is not None:
        ok = 0.1 <= deg <= 1.5
        _add("PV-004", ok, f"Degradation rate {deg}%/year {'is' if ok else 'is NOT'} in valid range (0.1-1.5%)", "warranty.linearDegradation_percent_per_year", "warning")

    # PV-005: BOM mass sum
    materials = _get_nested(passport, "materialComposition.moduleMaterials")
    if materials and isinstance(materials, list):
        total = sum(m.get("massPercent", 0) for m in materials if isinstance(m, dict))
        ok = 95 <= total <= 105 if total > 0 else True
        _add("PV-005", ok, f"BOM mass percentages sum to {total:.1f}% (expected ~100%)", "materialComposition.moduleMaterials", "warning")

    # PV-006: Temp coefficients negative
    tc_pmax = passport.get("tempCoeff_Pmax")
    if tc_pmax is not None:
        ok = tc_pmax < 0
        _add("PV-006", ok, f"Temp coeff Pmax = {tc_pmax} {'is' if ok else 'is NOT'} negative", "tempCoeff_Pmax")

    tc_voc = passport.get("tempCoeff_Voc")
    if tc_voc is not None:
        ok = tc_voc < 0
        _add("PV-006", ok, f"Temp coeff Voc = {tc_voc} {'is' if ok else 'is NOT'} negative", "tempCoeff_Voc")

    # PV-007: Voc > Vmp
    voc = passport.get("voc_V")
    vmp = passport.get("vmp_V")
    if voc is not None and vmp is not None:
        ok = voc > vmp
        _add("PV-007", ok, f"Voc ({voc}V) {'>' if ok else '<='} Vmp ({vmp}V)", "voc_V")

    # PV-008: Isc > Imp
    isc = passport.get("isc_A")
    imp = passport.get("imp_A")
    if isc is not None and imp is not None:
        ok = isc > imp
        _add("PV-008", ok, f"Isc ({isc}A) {'>' if ok else '<='} Imp ({imp}A)", "isc_A")

    # PV-009: Certificate validity
    certs = _get_nested(passport, "compliance.certificates")
    if certs and isinstance(certs, list):
        now = datetime.now(timezone.utc).date()
        for cert in certs:
            if isinstance(cert, dict) and "validUntil" in cert:
                try:
                    valid_until = datetime.strptime(cert["validUntil"], "%Y-%m-%d").date()
                    ok = valid_until >= now
                    std = cert.get("standard", "Unknown")
                    _add("PV-009", ok, f"Certificate {std} {'is valid' if ok else 'EXPIRED'} (until {cert['validUntil']})", "compliance.certificates", "warning")
                except ValueError:
                    pass

    # PV-010: GTIN format
    gtin = passport.get("gtin")
    if gtin is not None:
        ok = gtin.isdigit() and 8 <= len(gtin) <= 14
        _add("PV-010", ok, f"GTIN '{gtin}' {'matches' if ok else 'does NOT match'} GS1 format (8-14 digits)", "gtin")

    # PV-011: Carbon footprint positive
    cf = _get_nested(passport, "carbonFootprint.declaredValue_kgCO2e")
    if cf is not None:
        ok = cf > 0
        _add("PV-011", ok, f"Carbon footprint {cf} kgCO2e {'is' if ok else 'is NOT'} positive", "carbonFootprint.declaredValue_kgCO2e")

    # PV-013: Manufacturing date not in future
    mfg_date = passport.get("manufacturingDate")
    if mfg_date is not None:
        try:
            parsed = datetime.fromisoformat(mfg_date.replace("Z", "+00:00"))
            ok = parsed <= datetime.now(timezone.utc)
            _add("PV-013", ok, f"Manufacturing date {mfg_date} {'is' if ok else 'is'} {'in the past' if ok else 'IN THE FUTURE'}", "manufacturingDate")
        except ValueError:
            _add("PV-013", False, f"Manufacturing date '{mfg_date}' is not valid ISO 8601", "manufacturingDate")

    # PV-014: Module mass range
    mass = passport.get("moduleMass_kg")
    if mass is not None:
        ok = 5 <= mass <= 50
        _add("PV-014", ok, f"Module mass {mass}kg {'is' if ok else 'is NOT'} in valid range (5-50kg)", "moduleMass_kg")

    # PV-015: Max system voltage
    voltage = passport.get("maxSystemVoltage_V")
    if voltage is not None:
        ok = voltage in (600, 1000, 1500)
        _add("PV-015", ok, f"Max system voltage {voltage}V {'is' if ok else 'is NOT'} a standard value (600/1000/1500)", "maxSystemVoltage_V")

    return errors, warnings, results


# --- Completeness Calculation ---

REGULATORY_CORE_FIELDS = [
    "pvPassportId", "moduleIdentifier", "modelId", "manufacturer",
    "manufacturingFacility", "moduleTechnology", "ratedPowerSTC_W",
    "moduleEfficiency_percent", "passportStatus", "compliance",
]

INDUSTRY_FIELDS = REGULATORY_CORE_FIELDS + [
    "materialComposition", "carbonFootprint", "warranty",
    "endOfLife", "gtin", "serialNumber", "batchId",
    "voc_V", "isc_A", "vmp_V", "imp_A",
]

FULL_FIELDS = INDUSTRY_FIELDS + [
    "supplyChain", "dynamic", "tempCoeff_Pmax",
    "tempCoeff_Voc", "tempCoeff_Isc", "noct_C",
    "moduleDimensions_mm", "moduleMass_kg", "importer",
]


def calculate_completeness(passport: dict, profile: str) -> float:
    if profile == "full":
        fields = FULL_FIELDS
    elif profile == "industry":
        fields = INDUSTRY_FIELDS
    else:
        fields = REGULATORY_CORE_FIELDS

    present = sum(1 for f in fields if passport.get(f) is not None)
    return round(100 * present / len(fields), 1)


# --- Endpoints ---


@app.get("/health")
def health():
    return {"status": "ok", "service": "pv-dpp-validator", "schemaLoaded": bool(SCHEMA)}


@app.get("/profiles")
def profiles():
    return {
        "profiles": [
            {"id": "regulatory-core", "description": "ESPR Art. 8 minimum — identity, manufacturer, specs, compliance docs", "fieldCount": len(REGULATORY_CORE_FIELDS)},
            {"id": "industry", "description": "Core + BOM, carbon footprint, warranty, circularity", "fieldCount": len(INDUSTRY_FIELDS)},
            {"id": "full", "description": "All layers including dynamic data, supply chain, telemetry", "fieldCount": len(FULL_FIELDS)},
        ]
    }


@app.get("/rules")
def rules():
    return {"rules": PV_RULES}


@app.post("/validate", response_model=ValidationResult)
def validate(req: ValidationRequest):
    passport = req.passport
    profile = req.profile

    if profile not in ("regulatory-core", "industry", "full"):
        raise HTTPException(400, f"Unknown profile: {profile}. Use: regulatory-core, industry, full")

    all_errors: list[ValidationIssue] = []
    all_warnings: list[ValidationIssue] = []

    # Layer 1: JSON Schema validation
    if SCHEMA:
        validator = jsonschema.Draft202012Validator(SCHEMA)
        for error in validator.iter_errors(passport):
            field = ".".join(str(p) for p in error.absolute_path) or "(root)"
            all_errors.append(ValidationIssue(
                field=field,
                message=error.message,
                severity="error",
            ))

    # Layer 4: PV Business Rules
    rule_errors, rule_warnings, rule_results = run_pv_business_rules(passport)
    all_errors.extend(rule_errors)
    all_warnings.extend(rule_warnings)

    # Completeness
    completeness = calculate_completeness(passport, profile)

    return ValidationResult(
        valid=len(all_errors) == 0,
        profile=profile,
        errors=all_errors,
        warnings=all_warnings,
        completeness=completeness,
        ruleResults=rule_results,
    )
