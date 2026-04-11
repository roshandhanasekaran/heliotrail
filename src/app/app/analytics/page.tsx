import { createClient } from "@/lib/supabase/server";
import {
  ShieldCheck,
  Globe,
  Award,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Recycle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [{ data: passports }, { data: certificates }, { data: materials }, { data: circularity }] =
    await Promise.all([
      supabase.from("passports").select("*"),
      supabase.from("passport_certificates").select("*"),
      supabase.from("passport_materials").select("*"),
      supabase.from("passport_circularity").select("*"),
    ]);

  const all = passports ?? [];
  const certs = certificates ?? [];
  const mats = materials ?? [];
  const circ = circularity ?? [];

  const validCerts = certs.filter((c) => c.status === "valid").length;
  const pendingCerts = certs.filter((c) => c.status === "pending").length;
  const expiredCerts = certs.filter((c) => c.status === "expired").length;
  const crmMats = [...new Set(mats.filter((m) => m.is_critical_raw_material).map((m) => m.material_name))];
  const socMats = [...new Set(mats.filter((m) => m.is_substance_of_concern).map((m) => m.material_name))];

  const avgRecyclability = circ.length > 0
    ? Math.round(circ.reduce((s, c) => s + (c.recyclability_rate_percent ?? 0), 0) / circ.length)
    : 0;
  const avgRecycledContent = circ.length > 0
    ? Math.round(circ.reduce((s, c) => s + (c.recycled_content_percent ?? 0), 0) / circ.length)
    : 0;

  // Recovery capabilities — derived from actual DB boolean columns
  const recoveryTypes = [
    { key: "recovery_aluminium", label: "Aluminium" },
    { key: "recovery_glass", label: "Glass" },
    { key: "recovery_silicon", label: "Silicon" },
    { key: "recovery_copper", label: "Copper" },
    { key: "recovery_silver", label: "Silver" },
  ] as const;
  const activeRecoveries = recoveryTypes.filter((rt) =>
    circ.some((c) => (c as Record<string, unknown>)[rt.key] === true)
  );

  // WEEE compliance — validate collection_scheme has meaningful content
  const weeeCompliant = circ.filter((c) => {
    const scheme = c.collection_scheme;
    if (!scheme || typeof scheme !== "string") return false;
    const trimmed = scheme.trim().toLowerCase();
    return trimmed.length > 0 && trimmed !== "n/a" && trimmed !== "tbd" && trimmed !== "none" && trimmed !== "-";
  }).length;

  // Carbon footprint — group by model for cleaner display
  const carbonByModel = (() => {
    const grouped = new Map<string, { model: string; carbon: number; methodology: string; count: number }>();
    for (const p of all) {
      if (!p.carbon_footprint_kg_co2e) continue;
      const existing = grouped.get(p.model_id);
      if (existing) {
        existing.count++;
      } else {
        grouped.set(p.model_id, {
          model: p.model_id,
          carbon: p.carbon_footprint_kg_co2e,
          methodology: p.carbon_footprint_methodology ?? "Not specified",
          count: 1,
        });
      }
    }
    return Array.from(grouped.values()).sort((a, b) => b.carbon - a.carbon);
  })();
  const passportsMissingCarbon = all.filter((p) => !p.carbon_footprint_kg_co2e).length;

  // Regulatory readiness checklist
  const checks = [
    { label: "Product Identification (Annex III)", ok: all.length > 0, weight: 12 },
    { label: "Technical Specifications", ok: all.some((p) => p.rated_power_stc_w), weight: 12 },
    { label: "Material Composition (BOM)", ok: mats.length > 0, weight: 15 },
    { label: "Carbon Footprint (ISO 14067)", ok: all.some((p) => p.carbon_footprint_kg_co2e), weight: 15 },
    { label: "Compliance Certificates", ok: validCerts > 0, weight: 12 },
    { label: "Circularity & EoL Data", ok: circ.length > 0, weight: 12 },
    { label: "Supply Chain Due Diligence", ok: false, weight: 10 },
    { label: "Dynamic Performance Data", ok: false, weight: 12 },
  ];
  const readinessScore = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);

  // EU market access — derived from compliance checks
  // Core markets require readinessScore >= 70 + carbon footprint + material composition + valid certificates
  const coreMarketReady =
    readinessScore >= 70 && checks[3].ok && checks[2].ok && checks[4].ok;
  // Extended markets require higher readiness + supply chain due diligence
  const extendedMarketReady = readinessScore >= 85 && checks[6].ok;
  const markets = [
    { country: "DE", name: "Germany", ready: coreMarketReady },
    { country: "FR", name: "France", ready: coreMarketReady },
    { country: "IT", name: "Italy", ready: coreMarketReady },
    { country: "ES", name: "Spain", ready: coreMarketReady },
    { country: "NL", name: "Netherlands", ready: coreMarketReady },
    { country: "PL", name: "Poland", ready: extendedMarketReady },
    { country: "RO", name: "Romania", ready: extendedMarketReady },
  ];
  const readyMarkets = markets.filter((m) => m.ready).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Portfolio Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Regulatory intelligence, compliance health, and material analytics
        </p>
      </div>

      {/* Top row: Readiness + Market Access */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Regulatory readiness */}
        <div className="clean-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                EU ESPR Regulatory Readiness
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                DPP Registry opens July 2026 — compliance status
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                {readinessScore}%
              </p>
              <p className="text-[0.625rem] text-muted-foreground">readiness score</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-2 w-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${readinessScore}%` }}
            />
          </div>

          <div className="mt-4 space-y-2">
            {checks.map((check) => (
              <div
                key={check.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  {check.ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                  )}
                  {check.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground/70">
                  {check.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Market access */}
        <div className="clean-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Globe className="h-4 w-4 text-[#3B82F6]" />
            EU Market Access
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {readyMarkets} of {markets.length} target markets DPP-ready
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {markets.map((m) => (
              <div
                key={m.country}
                className={`flex flex-col items-center gap-1 border p-3 ${
                  m.ready
                    ? "border-primary/20 bg-[var(--passport-green-muted)]"
                    : "border-dashed border-border bg-muted/50"
                }`}
              >
                <span className="text-lg font-bold text-foreground">
                  {m.country}
                </span>
                <span className="text-[0.625rem] text-muted-foreground">
                  {m.name}
                </span>
                {m.ready ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-dashed border-border pt-3 text-xs text-muted-foreground">
            Compliance with EU ESPR and local DPP requirements. Supply chain
            and dynamic data needed for remaining markets.
          </div>
        </div>
      </div>

      {/* Certificate health */}
      <div className="clean-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Award className="h-4 w-4 text-primary" />
          Certificate Health
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {certs.length} certificates across {all.length} passports
        </p>

        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[var(--passport-green-muted)] flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{validCerts}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Valid</p>
              <p className="text-[0.625rem] text-muted-foreground">Compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-[var(--passport-amber-muted)] flex items-center justify-center">
              <span className="text-sm font-bold text-[#F59E0B]">{pendingCerts}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Pending</p>
              <p className="text-[0.625rem] text-muted-foreground">Under review</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-red-50 flex items-center justify-center">
              <span className="text-sm font-bold text-red-500">{expiredCerts}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Expired</p>
              <p className="text-[0.625rem] text-muted-foreground">Needs renewal</p>
            </div>
          </div>
        </div>

        {/* Certificate progress bar */}
        <div className="mt-4 flex h-3 w-full overflow-hidden">
          <div
            className="bg-primary"
            style={{ width: `${(validCerts / certs.length) * 100}%` }}
          />
          <div
            className="bg-[#F59E0B]"
            style={{ width: `${(pendingCerts / certs.length) * 100}%` }}
          />
          <div
            className="bg-[#EF4444]"
            style={{ width: `${(expiredCerts / certs.length) * 100}%` }}
          />
          <div className="flex-1 bg-muted" />
        </div>
      </div>

      {/* Material intelligence + Circularity */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Material intelligence */}
        <div className="clean-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Layers className="h-4 w-4 text-[#3B82F6]" />
            Material Intelligence
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            EU Critical Raw Materials Act 2024 compliance
          </p>

          <div className="mt-4 space-y-3">
            <div className="passport-table">
              <div className="passport-table-header">
                <span>Critical Raw Materials (CRM)</span>
                <span className="font-mono">{crmMats.length}</span>
              </div>
              {crmMats.length > 0 ? (
                crmMats.map((name) => (
                  <div key={name} className="passport-table-row">
                    <span className="table-label flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
                      {name}
                    </span>
                    <span className="table-value text-xs text-[#F59E0B]">
                      CRM Listed
                    </span>
                  </div>
                ))
              ) : (
                <div className="passport-table-row">
                  <span className="table-label text-muted-foreground/70">
                    No critical raw materials
                  </span>
                </div>
              )}
            </div>

            <div className="passport-table">
              <div className="passport-table-header">
                <span>Substances of Concern (SoC)</span>
                <span className="font-mono">{socMats.length}</span>
              </div>
              {socMats.length > 0 ? (
                socMats.map((name) => (
                  <div key={name} className="passport-table-row">
                    <span className="table-label flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      {name}
                    </span>
                    <span className="table-value text-xs text-red-500">
                      REACH SVHC
                    </span>
                  </div>
                ))
              ) : (
                <div className="passport-table-row">
                  <span className="table-label text-muted-foreground/70">
                    No substances of concern
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Circularity */}
        <div className="clean-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Recycle className="h-4 w-4 text-primary" />
            Circularity Intelligence
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Fleet-level circular economy metrics
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <CircularityMetric
              label="Avg Recyclability"
              value={`${avgRecyclability}%`}
              target="Target: >85%"
              ok={avgRecyclability >= 85}
            />
            <CircularityMetric
              label="Avg Recycled Content"
              value={`${avgRecycledContent}%`}
              target="Target: >15%"
              ok={avgRecycledContent >= 15}
            />
            <CircularityMetric
              label="Passports with EoL"
              value={`${circ.length}/${all.length}`}
              target="All passports"
              ok={circ.length === all.length}
            />
            <CircularityMetric
              label="WEEE Compliant"
              value={`${weeeCompliant}`}
              target="EU WEEE required"
              ok={weeeCompliant > 0}
            />
          </div>

          {/* Recovery materials — derived from passport_circularity boolean columns */}
          <div className="mt-4 border-t border-dashed border-border pt-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recovery Capabilities
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {activeRecoveries.length > 0 ? (
                activeRecoveries.map((rt) => (
                  <span
                    key={rt.key}
                    className="inline-flex items-center gap-1 bg-[var(--passport-green-muted)] px-2 py-0.5 text-xs font-medium text-primary"
                  >
                    <Recycle className="h-3 w-3" />
                    {rt.label}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground/70">
                  No recovery data available
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Carbon footprint analysis — grouped by model */}
      <div className="clean-card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Leaf className="h-4 w-4 text-primary" />
          Carbon Footprint Analysis
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Per cradle-to-gate methodology — {carbonByModel.reduce((s, m) => s + m.count, 0)} passports with carbon data across {carbonByModel.length} model lines
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 text-left text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Model</th>
                <th className="py-2 pr-4 text-right text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Passports</th>
                <th className="py-2 pr-4 text-right text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Carbon Footprint</th>
                <th className="py-2 text-left text-[0.625rem] font-bold uppercase tracking-wider text-muted-foreground">Methodology</th>
              </tr>
            </thead>
            <tbody>
              {carbonByModel.map((row) => (
                <tr key={row.model} className="border-b border-dashed border-muted">
                  <td className="py-2.5 pr-4 font-medium text-foreground">{row.model}</td>
                  <td className="py-2.5 pr-4 text-right font-mono text-muted-foreground">{row.count}</td>
                  <td className="py-2.5 pr-4 text-right">
                    <span className="font-mono font-bold text-foreground">{row.carbon}</span>
                    <span className="ml-1 text-xs text-muted-foreground">kg CO₂e</span>
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground/70">{row.methodology}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {passportsMissingCarbon > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[#F59E0B]">
            <AlertTriangle className="h-3.5 w-3.5" />
            {passportsMissingCarbon} passport{passportsMissingCarbon > 1 ? "s" : ""} missing carbon data
          </div>
        )}
      </div>
    </div>
  );
}

function CircularityMetric({
  label,
  value,
  target,
  ok,
}: {
  label: string;
  value: string;
  target: string;
  ok: boolean;
}) {
  return (
    <div className="border border-dashed border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
      <div className="mt-1 flex items-center gap-1">
        {ok ? (
          <CheckCircle2 className="h-3 w-3 text-primary" />
        ) : (
          <AlertTriangle className="h-3 w-3 text-[#F59E0B]" />
        )}
        <span className="text-[0.625rem] text-muted-foreground/70">{target}</span>
      </div>
    </div>
  );
}
