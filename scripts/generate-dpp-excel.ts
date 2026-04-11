/**
 * PV Digital Product Passport — Regulatory-Aligned Excel Template Generator
 *
 * Generates a comprehensive .xlsx file with all DPP data attributes,
 * pre-filled sample data (Waaree WRM-700-TOPCON-BiN-03), regulatory references,
 * and field mappings across wizard → database → CIRPASS-2 → public passport.
 *
 * Usage: npx tsx scripts/generate-dpp-excel.ts
 * Output: PV_DPP_Data_Template.xlsx
 */

import ExcelJS from "exceljs";
import path from "path";

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: "FFFFFFFF" },
  size: 11,
};

const SECTION_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  size: 11,
};

const HEADER_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  vertical: "middle",
  horizontal: "center",
  wrapText: true,
};

const DATA_ALIGNMENT: Partial<ExcelJS.Alignment> = {
  vertical: "top",
  wrapText: true,
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

function headerFill(argb: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb } };
}

/** Apply standard header row styling. */
function styleHeaders(
  ws: ExcelJS.Worksheet,
  color: string,
  headerRow = 1
): void {
  const row = ws.getRow(headerRow);
  row.font = HEADER_FONT;
  row.alignment = HEADER_ALIGNMENT;
  row.fill = headerFill(color);
  row.height = 30;
  row.eachCell((cell) => {
    cell.border = THIN_BORDER;
  });
}

/** Style a data row. */
function styleDataRow(ws: ExcelJS.Worksheet, rowNum: number): void {
  const row = ws.getRow(rowNum);
  row.alignment = DATA_ALIGNMENT;
  row.eachCell((cell) => {
    cell.border = THIN_BORDER;
  });
}

/** Add a section divider row. */
function addSectionRow(
  ws: ExcelJS.Worksheet,
  title: string,
  colCount: number
): number {
  const rowNum = ws.rowCount + 1;
  const row = ws.getRow(rowNum);
  ws.mergeCells(rowNum, 1, rowNum, colCount);
  row.getCell(1).value = title;
  row.getCell(1).font = SECTION_FONT;
  row.getCell(1).fill = headerFill("FFE8E8E8");
  row.getCell(1).alignment = { vertical: "middle" };
  row.height = 24;
  for (let c = 1; c <= colCount; c++) {
    row.getCell(c).border = THIN_BORDER;
  }
  return rowNum;
}

/** Add a data row with values. */
function addDataRow(
  ws: ExcelJS.Worksheet,
  values: (string | number | boolean | null)[]
): number {
  const rowNum = ws.rowCount + 1;
  const row = ws.addRow(values);
  styleDataRow(ws, rowNum);
  return rowNum;
}

// ---------------------------------------------------------------------------
// Sheet colors (one per domain)
// ---------------------------------------------------------------------------
const COLORS = {
  identity: "FF1B4F72", // dark blue
  specs: "FF1A5276", // steel blue
  bom: "FF196F3D", // green
  soc: "FF7D3C98", // purple
  compliance: "FF2E4053", // dark grey-blue
  circularity: "FF117A65", // teal
  carbon: "FF784212", // brown
  supplyChain: "FF6C3483", // violet
  registry: "FF1F618D", // medium blue
  dictionary: "FF283747", // charcoal
};

// ---------------------------------------------------------------------------
// SHEET 1 — Product Identity
// ---------------------------------------------------------------------------
function createIdentitySheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Product Identity", {
    properties: { tabColor: { argb: COLORS.identity } },
  });

  const headers = [
    "Field Name",
    "JSON Path",
    "Database Column",
    "Data Type",
    "Unit",
    "Required",
    "Sample Value",
    "Validation",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  ws.columns = headers.map((h) => ({ header: h, width: h === "Notes" ? 35 : h === "Sample Value" ? 30 : h === "Validation" ? 28 : 20 }));
  styleHeaders(ws, COLORS.identity);

  // --- Product Identification ---
  addSectionRow(ws, "PRODUCT IDENTIFICATION", headers.length);
  const identityRows: (string | number | boolean | null)[][] = [
    ["Passport ID", "pvPassportId", "pv_passport_id", "string", "-", "Yes", "PVP-0000001", "Pattern: PVP-[0-9]{7,}", "ESPR Art. 8 (ISO/IEC 15459)", "L1", "public", "Unique persistent identifier"],
    ["Module Identifier", "moduleIdentifier", "model_id", "string", "-", "Yes", "WRM-700-TOPCON-BiN-03", "Free-form", "ESPR Art. 8", "L1", "public", "Module-level unique ID"],
    ["Serial Number", "serialNumber", "serial_number", "string", "-", "No", "SN-WRM-2026-040001", "Free-form", "ESPR Art. 8", "L1", "public", "Individual module serial"],
    ["Batch / Lot ID", "batchId", "batch_id", "string", "-", "No", "LOT-2026-Q2-SRT-001", "Free-form", "ESPR Art. 8", "L1", "public", "Production batch identifier"],
    ["Model ID", "modelId", "model_id", "string", "-", "Yes", "WRM-700-TOPCON-BiN-03", "Free-form", "ESPR Art. 8", "L1", "public", "Product model reference"],
    ["GTIN", "gtin", "gtin", "string", "-", "No", "08901234567890", "Pattern: [0-9]{8,14}", "GS1 / ESPR Art. 8", "L1", "public", "Global Trade Item Number (GS1)"],
    ["Data Carrier Type", "dataCarrierType", "-", "enum", "-", "No", "qr_gs1_digital_link", "qr_gs1_digital_link | data_matrix | rfid | nfc", "ESPR Art. 8", "L1", "public", "Physical data carrier on product"],
    ["Passport Version", "passportVersion", "passport_version", "string", "-", "No", "v1", "Format: v{N}", "ESPR Art. 10", "L1", "public", "Version for audit trail"],
    ["Passport Status", "passportStatus", "status", "enum", "-", "Yes", "published", "draft | under_review | approved | published | superseded | archived | decommissioned", "ESPR Art. 10", "L1", "public", "Current lifecycle status"],
  ];
  identityRows.forEach((r) => addDataRow(ws, r));

  // --- Manufacturer / Economic Operator ---
  addSectionRow(ws, "MANUFACTURER (ECONOMIC OPERATOR)", headers.length);
  const mfrRows: (string | number | boolean | null)[][] = [
    ["Manufacturer Name", "manufacturer.name", "manufacturer_name", "string", "-", "Yes", "Waaree Energies Ltd.", "Free-form", "ESPR Art. 8", "L1", "public", "Legal entity name"],
    ["Operator Identifier", "manufacturer.operatorIdentifier", "manufacturer_operator_id", "string", "-", "Yes", "EU-EO-WRM-001", "Free-form", "ESPR Art. 8", "L1", "public", "EU economic operator ID"],
    ["Country", "manufacturer.address.country", "manufacturer_country", "string", "-", "No", "IN", "ISO 3166-1 alpha-2 (2 chars)", "ESPR Art. 8, WEEE", "L1", "public", "Registered country code"],
    ["City", "manufacturer.address.city", "-", "string", "-", "No", "Surat", "Free-form", "ESPR Art. 8", "L1", "public", "City"],
    ["Street Address", "manufacturer.address.street", "manufacturer_address", "string", "-", "No", "Survey No. 55, Tena Compound, Surat, Gujarat 394210", "Free-form", "ESPR Art. 8", "L1", "public", "Registered address"],
    ["Contact URL", "manufacturer.contactUrl", "manufacturer_contact_url", "string (URI)", "-", "No", "https://www.waaree.com/contact", "Valid URI", "ESPR Art. 8", "L1", "public", "Contact page URL"],
  ];
  mfrRows.forEach((r) => addDataRow(ws, r));

  // --- Importer (if non-EU manufacturer) ---
  addSectionRow(ws, "IMPORTER (Required for non-EU manufacturers)", headers.length);
  const importerRows: (string | number | boolean | null)[][] = [
    ["Importer Name", "importer.name", "-", "string", "-", "Conditional", "Waaree Europa GmbH", "Free-form", "ESPR Art. 8", "L1", "restricted", "Required if manufacturer outside EU"],
    ["Importer Operator ID", "importer.operatorIdentifier", "-", "string", "-", "Conditional", "EU-EO-IMP-001", "Free-form", "ESPR Art. 8", "L1", "restricted", "EU importer economic operator ID"],
    ["Importer Country", "importer.address.country", "-", "string", "-", "No", "DE", "ISO 3166-1 alpha-2", "ESPR Art. 8", "L1", "restricted", "EU importer country"],
  ];
  importerRows.forEach((r) => addDataRow(ws, r));

  // --- Authorized Representative ---
  addSectionRow(ws, "AUTHORIZED REPRESENTATIVE", headers.length);
  const arRows: (string | number | boolean | null)[][] = [
    ["AR Name", "authorizedRepresentative.name", "-", "string", "-", "No", "-", "Free-form", "ESPR Art. 8", "L1", "restricted", "EU authorized representative"],
    ["AR Operator ID", "authorizedRepresentative.operatorIdentifier", "-", "string", "-", "No", "-", "Free-form", "ESPR Art. 8", "L1", "restricted", "AR economic operator ID"],
  ];
  arRows.forEach((r) => addDataRow(ws, r));

  // --- Manufacturing Facility ---
  addSectionRow(ws, "MANUFACTURING FACILITY", headers.length);
  const facRows: (string | number | boolean | null)[][] = [
    ["Facility Identifier", "manufacturingFacility.facilityIdentifier", "facility_id", "string", "-", "Yes", "FAC-WRM-SRT-001", "Free-form", "ESPR Art. 8", "L1", "public", "Unique facility ID"],
    ["Facility Name", "manufacturingFacility.name", "facility_name", "string", "-", "Yes", "Surat Mega Factory", "Free-form", "ESPR Art. 8", "L1", "public", "Facility name"],
    ["Country", "manufacturingFacility.location.country", "-", "string", "-", "Yes", "IN", "ISO 3166-1 alpha-2", "ESPR Art. 8, WEEE", "L1", "public", "ISO country code"],
    ["City", "manufacturingFacility.location.city", "-", "string", "-", "No", "Surat", "Free-form", "ESPR Art. 8", "L1", "public", "City name"],
    ["Full Address", "manufacturingFacility.location.address", "facility_location", "string", "-", "No", "Gujarat, India", "Free-form", "ESPR Art. 8", "L1", "public", "Full facility address"],
    ["Latitude", "manufacturingFacility.location.latitude", "-", "number", "deg", "No", "21.1702", "Range: -90 to 90", "WEEE", "L2", "restricted", "GPS latitude"],
    ["Longitude", "manufacturingFacility.location.longitude", "-", "number", "deg", "No", "72.8311", "Range: -180 to 180", "WEEE", "L2", "restricted", "GPS longitude"],
    ["Manufacturing Date", "manufacturingDate", "manufacturing_date", "date-time", "-", "No", "2026-04-01T00:00:00Z", "ISO 8601", "ESPR Art. 8", "L1", "public", "Date of manufacture"],
    ["Module Technology", "moduleTechnology", "module_technology", "enum", "-", "Yes", "topcon", "perc | topcon | hjt | cigs | cdte | perovskite | shj | ibc", "ESPR delegated act (pending)", "L1", "public", "Solar cell technology type"],
  ];
  facRows.forEach((r) => addDataRow(ws, r));

  // Freeze header row
  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 2 — Technical Specifications
// ---------------------------------------------------------------------------
function createSpecsSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Technical Specifications", {
    properties: { tabColor: { argb: COLORS.specs } },
  });

  const headers = [
    "Field Name",
    "JSON Path",
    "Database Column",
    "Data Type",
    "Unit",
    "Required",
    "Sample Value",
    "Validation",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  ws.columns = headers.map((h) => ({ header: h, width: h === "Notes" ? 35 : h === "Sample Value" ? 25 : h === "Validation" ? 28 : 20 }));
  styleHeaders(ws, COLORS.specs);

  // --- Electrical (STC) ---
  addSectionRow(ws, "ELECTRICAL PERFORMANCE — Standard Test Conditions (STC: 1000 W/m², 25 °C, AM1.5)", headers.length);
  const elecRows: (string | number | boolean | null)[][] = [
    ["Rated Power (Pmax)", "ratedPowerSTC_W", "rated_power_stc_w", "number", "W", "Yes", 700, "Min: 50, Max: 800", "IEC 61215, ESPR delegated act", "L1", "public", "Nameplate power at STC"],
    ["Module Efficiency", "moduleEfficiency_percent", "module_efficiency_percent", "number", "%", "Yes", 22.53, "Min: 5, Max: 30", "IEC 61215, ESPR delegated act", "L1", "public", "Module-level efficiency at STC"],
    ["Open-Circuit Voltage (Voc)", "voc_V", "voc_v", "number", "V", "No", 46.8, "Min: 0", "IEC 61215", "L1", "public", "Open-circuit voltage at STC"],
    ["Short-Circuit Current (Isc)", "isc_A", "isc_a", "number", "A", "No", 19.42, "Min: 0", "IEC 61215", "L1", "public", "Short-circuit current at STC"],
    ["Voltage at Max Power (Vmp)", "vmp_V", "vmp_v", "number", "V", "No", 39.1, "Min: 0", "IEC 61215", "L1", "public", "MPP voltage"],
    ["Current at Max Power (Imp)", "imp_A", "imp_a", "number", "A", "No", 17.9, "Min: 0", "IEC 61215", "L1", "public", "MPP current"],
    ["Max System Voltage", "maxSystemVoltage_V", "max_system_voltage_v", "number", "V", "No", 1500, "Enum: 600 | 1000 | 1500", "IEC 61215, Safety-critical", "L1", "public", "Maximum system voltage rating"],
  ];
  elecRows.forEach((r) => addDataRow(ws, r));

  // --- Physical ---
  addSectionRow(ws, "PHYSICAL DIMENSIONS & MASS", headers.length);
  const physRows: (string | number | boolean | null)[][] = [
    ["Module Length", "moduleDimensions_mm.length", "module_length_mm", "number", "mm", "No", 2384, "Min: 0", "ESPR Art. 10", "L1", "public", "Module length"],
    ["Module Width", "moduleDimensions_mm.width", "module_width_mm", "number", "mm", "No", 1303, "Min: 0", "ESPR Art. 10", "L1", "public", "Module width"],
    ["Module Depth", "moduleDimensions_mm.depth", "module_depth_mm", "number", "mm", "No", 33, "Min: 0", "ESPR Art. 10", "L1", "public", "Module depth / thickness"],
    ["Module Mass", "moduleMass_kg", "module_mass_kg", "number", "kg", "No", 34.5, "Min: 5, Max: 50", "ESPR Art. 10", "L1", "public", "Total module mass"],
  ];
  physRows.forEach((r) => addDataRow(ws, r));

  // --- Cell ---
  addSectionRow(ws, "CELL SPECIFICATIONS", headers.length);
  const cellRows: (string | number | boolean | null)[][] = [
    ["Cell Count", "-", "cell_count", "number", "count", "No", 132, "-", "IEC 61215", "L1", "public", "Number of cells in module"],
    ["Cell Type", "-", "cell_type", "string", "-", "No", "M10 N-Type Mono TOPCon", "Free-form", "IEC 61215", "L1", "public", "Cell technology description"],
    ["Bifaciality Factor", "-", "bifaciality_factor", "number", "ratio", "No", 0.70, "Range: 0 to 1", "IEC 61215 (bifacial)", "L2", "public", "Rear-side efficiency ratio"],
  ];
  cellRows.forEach((r) => addDataRow(ws, r));

  // --- Temperature Coefficients ---
  addSectionRow(ws, "TEMPERATURE COEFFICIENTS", headers.length);
  const tempRows: (string | number | boolean | null)[][] = [
    ["Temp Coeff Pmax", "tempCoeff_Pmax", "temperature_coefficient_pmax", "number", "%/°C", "No", -0.30, "Max: 0 (must be negative)", "IEC 61215", "L1", "public", "Power temperature coefficient"],
    ["Temp Coeff Voc", "tempCoeff_Voc", "temperature_coefficient_voc", "number", "%/°C", "No", -0.24, "Max: 0 (must be negative)", "IEC 61215", "L1", "public", "Voltage temperature coefficient"],
    ["Temp Coeff Isc", "tempCoeff_Isc", "temperature_coefficient_isc", "number", "%/°C", "No", 0.048, "Typically positive", "IEC 61215", "L1", "public", "Current temperature coefficient"],
    ["NOCT", "noct_C", "noct_celsius", "number", "°C", "No", 43, "Min: 30, Max: 55", "IEC 61215", "L1", "public", "Nominal Operating Cell Temperature"],
  ];
  tempRows.forEach((r) => addDataRow(ws, r));

  // --- Mechanical & Ratings ---
  addSectionRow(ws, "MECHANICAL & RATINGS", headers.length);
  const mechRows: (string | number | boolean | null)[][] = [
    ["Fire Rating", "-", "fire_rating", "string", "-", "No", "Class A", "e.g., Class A, B, C", "IEC 61730 (Safety)", "L2", "public", "Fire safety classification"],
    ["IP Rating", "-", "ip_rating", "string", "-", "No", "IP68", "e.g., IP54, IP65, IP68", "IEC 61730 (Safety)", "L2", "public", "Ingress protection rating"],
    ["Connector Type", "-", "connector_type", "string", "-", "No", "MC4 Compatible", "Free-form", "IEC 61215", "L2", "public", "Connector standard"],
    ["Frame Type", "-", "frame_type", "string", "-", "No", "Anodized Aluminium Alloy 6063-T5", "Free-form", "ESPR Art. 10", "L2", "public", "Frame material description"],
    ["Glass Type", "-", "glass_type", "string", "-", "No", "3.2mm Low-Iron Tempered ARC", "Free-form", "ESPR Art. 10", "L2", "public", "Front cover glass specification"],
  ];
  mechRows.forEach((r) => addDataRow(ws, r));

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 3 — Material Composition (BOM)
// ---------------------------------------------------------------------------
function createBomSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Material Composition (BOM)", {
    properties: { tabColor: { argb: COLORS.bom } },
  });

  const headers = [
    "#",
    "Material Name",
    "Component Type",
    "Mass (g)",
    "Mass %",
    "CAS Number",
    "Is Critical Raw Material",
    "Is Substance of Concern",
    "Recyclability Hint",
    "Recycled Content %",
    "Origin Country",
    "Supplier ID",
    "Regulation",
    "Schema Layer",
    "Access Level",
  ];
  ws.columns = [
    { header: "#", width: 5 },
    { header: "Material Name", width: 30 },
    { header: "Component Type", width: 22 },
    { header: "Mass (g)", width: 12 },
    { header: "Mass %", width: 10 },
    { header: "CAS Number", width: 16 },
    { header: "Is Critical Raw Material", width: 22 },
    { header: "Is Substance of Concern", width: 22 },
    { header: "Recyclability Hint", width: 20 },
    { header: "Recycled Content %", width: 18 },
    { header: "Origin Country", width: 15 },
    { header: "Supplier ID", width: 18 },
    { header: "Regulation", width: 25 },
    { header: "Schema Layer", width: 14 },
    { header: "Access Level", width: 14 },
  ];
  styleHeaders(ws, COLORS.bom);

  addSectionRow(ws, "BILL OF MATERIALS — Waaree WRM-700-TOPCON-BiN-03 (Total mass: ~33,582 g / 34.5 kg)", headers.length);

  const bomData: (string | number | boolean)[][] = [
    [1, "Tempered Solar Glass", "front_cover", 21700, 64.6, "65997-17-3", "No", "No", "fully_recyclable", 15, "IN", "SUP-GL-001", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"],
    [2, "Aluminium Alloy 6063-T5", "frame", 4335, 12.9, "7429-90-5", "No", "No", "fully_recyclable", 40, "IN", "SUP-AL-001", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"],
    [3, "EVA (Ethylene-Vinyl Acetate)", "encapsulant", 2890, 8.6, "24937-78-8", "No", "No", "not_recyclable", 0, "CN", "SUP-EV-001", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"],
    [4, "Monocrystalline Silicon (N-Type)", "solar_cell", 2184, 6.5, "7440-21-3", "Yes", "No", "recoverable", 0, "CN", "SUP-SI-001", "ESPR Art. 10, EU CRM Strategy, WEEE", "L2", "recycler"],
    [5, "Fluoropolymer Backsheet", "rear_cover", 1142, 3.4, "9002-84-0", "No", "No", "limited", 0, "JP", "SUP-BS-001", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"],
    [6, "Copper Ribbon", "interconnects", 672, 2.0, "7440-50-8", "Yes", "No", "recoverable", 30, "IN", "SUP-CU-001", "ESPR Art. 10, EU CRM Strategy, WEEE", "L2", "recycler"],
    [7, "Other (Junction Box, Sealants)", "other", 605, 1.8, "-", "No", "No", "limited", 0, "-", "SUP-JB-001", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"],
    [8, "Tin (Solder)", "solder", 27, 0.08, "7440-31-5", "No", "No", "recoverable", 0, "CN", "SUP-SN-001", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"],
    [9, "Silver Paste", "cell_metallization", 20, 0.06, "7440-22-4", "Yes", "No", "recoverable", 0, "CN", "SUP-AG-001", "ESPR Art. 10, EU CRM Strategy, WEEE", "L2", "recycler"],
    [10, "Lead (Solder Trace)", "solder", 7, 0.02, "7439-92-1", "No", "Yes", "recoverable", 0, "CN", "SUP-PB-001", "REACH (>0.1% w/w), RoHS Annex III 7(a)", "L2", "recycler"],
  ];
  bomData.forEach((r) => addDataRow(ws, r));

  // Add totals row
  const totalRow = ws.addRow(["", "TOTAL", "", 33582, 100.0, "", "", "", "", "", "", "", "", "", ""]);
  totalRow.font = { bold: true };
  totalRow.eachCell((cell) => { cell.border = THIN_BORDER; });

  // Metadata reference
  addSectionRow(ws, "FIELD DEFINITIONS", headers.length);
  addDataRow(ws, ["", "JSON Path", "materialComposition.moduleMaterials[]", "", "", "", "", "", "", "", "", "", "ESPR Art. 10, WEEE Annex V", "L2", "recycler"]);
  addDataRow(ws, ["", "Component Type Enum", "front_cover | frame | solar_cell | encapsulant | interconnects | cell_metallization | rear_cover | junction_box | solder | other", "", "", "", "", "", "", "", "", "", "", "", ""]);
  addDataRow(ws, ["", "Recyclability Enum", "fully_recyclable | recoverable | limited | not_recyclable", "", "", "", "", "", "", "", "", "", "", "", ""]);

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 4 — Substances of Concern
// ---------------------------------------------------------------------------
function createSocSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Substances of Concern", {
    properties: { tabColor: { argb: COLORS.soc } },
  });

  const headers = [
    "#",
    "Substance Name",
    "CAS Number",
    "Concentration (w/w %)",
    "Location in Module",
    "Regulatory Basis",
    "Exemption",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  ws.columns = [
    { header: "#", width: 5 },
    { header: "Substance Name", width: 25 },
    { header: "CAS Number", width: 16 },
    { header: "Concentration (w/w %)", width: 22 },
    { header: "Location in Module", width: 22 },
    { header: "Regulatory Basis", width: 18 },
    { header: "Exemption", width: 25 },
    { header: "Regulation", width: 28 },
    { header: "Schema Layer", width: 14 },
    { header: "Access Level", width: 14 },
    { header: "Notes", width: 40 },
  ];
  styleHeaders(ws, COLORS.soc);

  addSectionRow(ws, "SUBSTANCES OF CONCERN — REACH Art. 33 (>0.1% w/w) & RoHS Annex II", headers.length);

  const socData: (string | number)[][] = [
    [1, "Lead (Pb)", "7439-92-1", 0.02, "Solder joints (cell interconnects)", "RoHS", "RoHS Annex III, Category 7(a) — Lead in solder for large-scale PV", "REACH (EC 1907/2006), RoHS (2011/65/EU)", "L2", "restricted", "Below REACH 0.1% threshold; RoHS-exempt under current Annex III. Subject to periodic review."],
    [2, "Cadmium (Cd)", "7440-43-9", 0, "Not present (N-Type module)", "RoHS", "N/A — not applicable to TOPCon", "RoHS (2011/65/EU)", "L2", "restricted", "Only relevant for CdTe thin-film modules"],
  ];
  socData.forEach((r) => addDataRow(ws, r));

  // Overall status
  addSectionRow(ws, "OVERALL SUBSTANCE COMPLIANCE STATUS", headers.length);
  addDataRow(ws, ["", "REACH Status", "", "", "", "", "", "compliant | non_compliant | exempt | under_review", "L2", "restricted", "Overall REACH compliance for module"]);
  addDataRow(ws, ["", "Sample Value", "", "", "", "", "", "compliant", "", "", ""]);
  addDataRow(ws, ["", "RoHS Status", "", "", "", "", "", "compliant | compliant_with_exemption | exempt | non_compliant", "L2", "restricted", "Overall RoHS compliance for module"]);
  addDataRow(ws, ["", "Sample Value", "", "", "", "", "", "compliant_with_exemption", "", "", "Exemption: Lead in solder — RoHS Annex III 7(a)"]);

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 5 — Compliance & Certificates
// ---------------------------------------------------------------------------
function createComplianceSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Compliance & Certificates", {
    properties: { tabColor: { argb: COLORS.compliance } },
  });

  const headers = [
    "#",
    "Standard",
    "Certificate Number",
    "Issuer",
    "Issued Date",
    "Expiry Date",
    "Status",
    "Document URL",
    "Document Hash (SHA-256)",
    "Scope Notes",
    "Regulation",
    "Schema Layer",
    "Access Level",
  ];
  ws.columns = [
    { header: "#", width: 5 },
    { header: "Standard", width: 22 },
    { header: "Certificate Number", width: 28 },
    { header: "Issuer", width: 26 },
    { header: "Issued Date", width: 14 },
    { header: "Expiry Date", width: 14 },
    { header: "Status", width: 12 },
    { header: "Document URL", width: 35 },
    { header: "Document Hash (SHA-256)", width: 30 },
    { header: "Scope Notes", width: 30 },
    { header: "Regulation", width: 22 },
    { header: "Schema Layer", width: 14 },
    { header: "Access Level", width: 14 },
  ];
  styleHeaders(ws, COLORS.compliance);

  addSectionRow(ws, "CERTIFICATIONS", headers.length);

  const certData: (string | number)[][] = [
    [1, "IEC 61215", "IEC-61215-2024-WRM", "TUV Rheinland", "2025-08-15", "2030-08-15", "valid", "https://vault.heliotrail.io/certs/iec61215-wrm.pdf", "a1b2c3d4e5f6...sha256", "Design qualification — crystalline silicon modules", "ESPR Art. 8, IEC 61215-1:2021", "L1", "public"],
    [2, "IEC 61730", "IEC-61730-2024-WRM", "TUV Rheinland", "2025-08-15", "2030-08-15", "valid", "https://vault.heliotrail.io/certs/iec61730-wrm.pdf", "b2c3d4e5f6a1...sha256", "Safety qualification — electrical & mechanical", "ESPR Art. 8, IEC 61730-1/2:2023", "L1", "public"],
    [3, "IEC 61701", "IEC-61701-2024-WRM", "TUV SUD", "2025-09-01", "2030-09-01", "valid", "https://vault.heliotrail.io/certs/iec61701-wrm.pdf", "c3d4e5f6a1b2...sha256", "Salt mist corrosion testing", "IEC 61701", "L2", "public"],
    [4, "BIS IS 14286", "BIS-R-35791", "Bureau of Indian Standards", "2025-06-01", "2027-06-01", "valid", "https://vault.heliotrail.io/certs/bis-wrm.pdf", "d4e5f6a1b2c3...sha256", "Indian standard for crystalline silicon PV modules", "BIS IS 14286 (India)", "L2", "public"],
    [5, "CE Declaration of Conformity", "CE-DoC-WRM-2025", "Waaree Energies Ltd.", "2025-07-01", "-", "valid", "https://vault.heliotrail.io/certs/ce-doc-wrm.pdf", "e5f6a1b2c3d4...sha256", "EU market conformity — self-declaration by manufacturer", "ESPR Art. 8, EC 2024/1781", "L1", "public"],
  ];
  certData.forEach((r) => addDataRow(ws, r));

  // --- Supporting Documents ---
  addSectionRow(ws, "SUPPORTING DOCUMENTS", headers.length);
  const docHeaders = [
    "#",
    "Document Name",
    "Document Type",
    "Access Level",
    "URL",
    "File Size",
    "MIME Type",
    "Document Hash",
    "Hash Algorithm",
    "Issuer",
    "Issued Date",
    "Description",
    "Regulation",
  ];
  // Re-use same columns layout, just different labeling in the section
  const docData: (string | number)[][] = [
    [1, "Declaration of Conformity", "declaration_of_conformity", "public", "https://vault.heliotrail.io/docs/doc-wrm-001.pdf", "245 KB", "application/pdf", "sha256:abc123...", "sha256", "Waaree Energies Ltd.", "2025-07-01", "EU DoC per ESPR Art. 8", "ESPR Art. 8"],
    [2, "IEC 61215 Test Report", "test_report", "restricted", "https://vault.heliotrail.io/docs/doc-wrm-002.pdf", "1.2 MB", "application/pdf", "sha256:def456...", "sha256", "TUV Rheinland", "2025-08-15", "Full IEC 61215 test results", "IEC 61215"],
    [3, "User Manual", "user_manual", "public", "https://vault.heliotrail.io/docs/doc-wrm-003.pdf", "890 KB", "application/pdf", "sha256:ghi789...", "sha256", "Waaree Energies Ltd.", "2025-07-01", "Installation & operation manual", "ESPR Art. 8"],
    [4, "Installation Instructions", "installation_instructions", "public", "https://vault.heliotrail.io/docs/doc-wrm-004.pdf", "560 KB", "application/pdf", "sha256:jkl012...", "sha256", "Waaree Energies Ltd.", "2025-07-01", "Step-by-step installation guide", "ESPR Art. 8"],
    [5, "Safety Instructions", "safety_instructions", "public", "https://vault.heliotrail.io/docs/doc-wrm-005.pdf", "320 KB", "application/pdf", "sha256:mno345...", "sha256", "Waaree Energies Ltd.", "2025-07-01", "Safety warnings & precautions per IEC 61730", "ESPR Art. 8, IEC 61730"],
    [6, "Recycling Guide", "recycling_guide", "recycler", "https://vault.heliotrail.io/docs/doc-wrm-006.pdf", "410 KB", "application/pdf", "sha256:pqr678...", "sha256", "Waaree Energies Ltd.", "2025-07-01", "End-of-life recycling instructions per WEEE", "WEEE Annex V"],
  ];
  docData.forEach((r) => addDataRow(ws, r));

  // Enum reference
  addSectionRow(ws, "ENUM REFERENCES", headers.length);
  addDataRow(ws, ["", "Certificate Status", "valid | expired | revoked | pending", "", "", "", "", "", "", "", "", "", ""]);
  addDataRow(ws, ["", "Document Types", "declaration_of_conformity | test_report | user_manual | installation_instructions | safety_instructions | datasheet | epd | due_diligence_report | recycling_guide | other", "", "", "", "", "", "", "", "", "", "", ""]);
  addDataRow(ws, ["", "Access Levels", "public | restricted | recycler | authority | internal", "", "", "", "", "", "", "", "", "", ""]);
  addDataRow(ws, ["", "Hash Algorithms", "sha256 | sha384 | sha512", "", "", "", "", "", "", "", "", "", ""]);

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 6 — Circularity & End-of-Life
// ---------------------------------------------------------------------------
function createCircularitySheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Circularity & End-of-Life", {
    properties: { tabColor: { argb: COLORS.circularity } },
  });

  const headers = [
    "Field Name",
    "JSON Path",
    "Database Column",
    "Data Type",
    "Unit",
    "Required",
    "Sample Value",
    "Validation",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  ws.columns = headers.map((h) => ({ header: h, width: h === "Notes" || h === "Sample Value" ? 40 : h === "Validation" ? 28 : 20 }));
  styleHeaders(ws, COLORS.circularity);

  // --- Recyclability ---
  addSectionRow(ws, "RECYCLABILITY & CIRCULAR ECONOMY METRICS", headers.length);
  const recycleRows: (string | number | boolean | null)[][] = [
    ["Recyclability Rate", "-", "recyclability_rate_percent", "number", "%", "No", 92, "Min: 0, Max: 100", "WEEE Annex V (85% target), ESPR Art. 10", "L2", "public", "Overall module recyclability percentage"],
    ["Recycled Content", "-", "recycled_content_percent", "number", "%", "No", 28, "Min: 0, Max: 100", "ESPR Art. 10", "L2", "public", "Percentage of recycled material input"],
    ["Renewable Content", "-", "renewable_content_percent", "number", "%", "No", 0, "Min: 0, Max: 100", "ESPR Art. 10", "L2", "public", "Percentage of renewable material content"],
  ];
  recycleRows.forEach((r) => addDataRow(ws, r));

  // --- Hazardous ---
  addSectionRow(ws, "HAZARDOUS SUBSTANCES DECLARATION", headers.length);
  const hazRows: (string | number | boolean | null)[][] = [
    ["Contains Hazardous Substances", "-", "is_hazardous", "boolean", "-", "No", "Yes", "true | false", "REACH, RoHS, WEEE", "L2", "restricted", "Module contains substances requiring declaration"],
    ["Hazardous Substances Notes", "-", "hazardous_substances_notes", "string", "-", "No", "Contains lead traces in solder alloy (<0.1% by weight). RoHS exemption 7(a) applies. Handle with care during recycling — avoid inhalation of dust.", "Free-form", "REACH, RoHS, WEEE", "L2", "restricted", "Detailed description of hazardous substances, concentrations, and safety precautions"],
  ];
  hazRows.forEach((r) => addDataRow(ws, r));

  // --- Dismantling ---
  addSectionRow(ws, "DISMANTLING & REPAIR INFORMATION", headers.length);
  const disRows: (string | number | boolean | null)[][] = [
    ["Dismantling Time", "endOfLife.dismantlingInstructions", "dismantling_time_minutes", "number", "min", "No", 35, "Min: 0, Max: 120", "WEEE Annex V, ESPR Art. 10", "L2", "recycler", "Estimated time for complete disassembly"],
    ["Dismantling Instructions", "endOfLife.dismantlingInstructions", "dismantling_instructions", "string", "-", "No", "1. Remove junction box and cables\n2. Detach aluminium frame (4 corner screws)\n3. Separate front glass from encapsulant (thermal process 150°C)\n4. Extract solar cells from EVA\n5. Recover copper ribbons\n6. Sort materials for recycling", "Free-form (step-by-step)", "WEEE Annex V, ESPR Art. 10", "L2", "recycler", "Step-by-step disassembly with tools, safety, and process details"],
  ];
  disRows.forEach((r) => addDataRow(ws, r));

  // --- Collection & Recycler ---
  addSectionRow(ws, "COLLECTION & RECYCLER INFORMATION", headers.length);
  const collRows: (string | number | boolean | null)[][] = [
    ["Collection Scheme", "endOfLife.collectionScheme", "collection_scheme", "string", "-", "No", "EU WEEE / India EPR", "Free-form", "WEEE Art. 16", "L2", "public", "Certified collection/take-back scheme"],
    ["Recycler Name", "endOfLife.recyclerPartner", "recycler_name", "string", "-", "No", "Veolia Environmental Services", "Free-form", "WEEE Annex V", "L2", "public", "Certified recycling partner"],
    ["Recycler Contact", "-", "recycler_contact", "string", "-", "No", "recycling@veolia.com", "Free-form", "WEEE Annex V", "L2", "recycler", "Recycler contact information"],
  ];
  collRows.forEach((r) => addDataRow(ws, r));

  // --- Material Recovery ---
  addSectionRow(ws, "MATERIAL RECOVERY OUTCOMES (WEEE Annex V — 85% recovery target)", headers.length);
  const recovHeaders = [
    "Material",
    "JSON Path",
    "Database Column",
    "Recoverable",
    "Expected Recovery %",
    "Actual Recovery %",
    "Mass Recovered (kg)",
    "Recovery Method",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  const recovHeaderRow = ws.addRow(recovHeaders);
  recovHeaderRow.font = { bold: true, color: { argb: "FF333333" } };
  recovHeaderRow.fill = headerFill("FFD5F5E3");
  recovHeaderRow.eachCell((cell) => { cell.border = THIN_BORDER; });

  const recovData: (string | number | boolean)[][] = [
    ["Aluminium", "endOfLife.recoveryOutcomes[0]", "recovery_aluminium", "Yes", 98, "-", "-", "Direct smelting & extrusion", "WEEE Annex V", "L2", "recycler", "95%+ recovery via mechanical separation"],
    ["Glass", "endOfLife.recoveryOutcomes[1]", "recovery_glass", "Yes", 95, "-", "-", "Cullet for glass industry", "WEEE Annex V", "L2", "recycler", "Thermal delamination at 500°C"],
    ["Silicon", "endOfLife.recoveryOutcomes[2]", "recovery_silicon", "Yes", 85, "-", "-", "Chemical purification", "WEEE Annex V, EU CRM", "L2", "recycler", "Acid etching + re-crystallization"],
    ["Copper", "endOfLife.recoveryOutcomes[3]", "recovery_copper", "Yes", 95, "-", "-", "Copper smelting", "WEEE Annex V, EU CRM", "L2", "recycler", "Mechanical separation + smelting"],
    ["Silver", "endOfLife.recoveryOutcomes[4]", "recovery_silver", "Yes", 90, "-", "-", "Chemical extraction", "WEEE Annex V, EU CRM", "L2", "recycler", "Nitric acid leaching process"],
  ];
  recovData.forEach((r) => addDataRow(ws, r));

  // --- EOL Status ---
  addSectionRow(ws, "END-OF-LIFE STATUS", headers.length);
  addDataRow(ws, ["End-of-Life Status", "endOfLife.status", "end_of_life_status", "enum", "-", "No", "in_use", "in_use | decommissioned | in_recycling | recycled | reused | disposed", "WEEE Annex V, ESPR Art. 10", "L2", "public", "Current lifecycle stage of the module"]);

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 7 — Carbon & Environmental
// ---------------------------------------------------------------------------
function createCarbonSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Carbon & Environmental", {
    properties: { tabColor: { argb: COLORS.carbon } },
  });

  const headers = [
    "Field Name",
    "JSON Path",
    "Database Column",
    "Data Type",
    "Unit",
    "Required",
    "Sample Value",
    "Validation",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  ws.columns = headers.map((h) => ({ header: h, width: h === "Notes" ? 40 : h === "Sample Value" ? 28 : h === "Validation" ? 28 : 20 }));
  styleHeaders(ws, COLORS.carbon);

  // --- Carbon Footprint ---
  addSectionRow(ws, "CARBON FOOTPRINT DECLARATION (JRC Harmonized Rules 2025)", headers.length);
  const carbonRows: (string | number | boolean | null)[][] = [
    ["Carbon Footprint (Total)", "carbonFootprint.declaredValue_kgCO2e", "carbon_footprint_kg_co2e", "number", "kg CO2eq", "No", 810, "Min: 0", "ESPR Art. 10, JRC Rules (2025)", "L2", "public", "Total lifecycle carbon footprint (cradle-to-gate)"],
    ["Carbon Intensity", "carbonFootprint.functionalUnit_gCO2eq_per_kWh", "-", "number", "gCO2eq/kWh", "No", 22.5, "Min: 0. Typical PV range: 10.8 - 44", "JRC Harmonized Rules (2025)", "L2", "public", "Carbon intensity per kWh over module lifetime"],
    ["LCA Boundary", "carbonFootprint.boundary", "-", "enum", "-", "No", "cradle_to_gate", "cradle_to_gate | cradle_to_grave", "ESPR Art. 10, ISO 14040", "L2", "public", "Life cycle assessment boundary"],
    ["Methodology", "carbonFootprint.methodology", "carbon_footprint_methodology", "string", "-", "No", "JRC_harmonized_2025", "e.g., JRC_harmonized_2025, PEF, ISO_14040", "ESPR Art. 10, EU PEF 2025", "L2", "public", "Calculation methodology reference"],
    ["Verification Reference", "carbonFootprint.verificationRef", "-", "string", "-", "No", "EPD-WRM-2025-001", "Free-form (EPD ID or verification ref)", "ESPR Art. 10", "L2", "public", "Third-party verification / EPD reference"],
  ];
  carbonRows.forEach((r) => addDataRow(ws, r));

  // --- Warranty & Lifetime ---
  addSectionRow(ws, "WARRANTY & PRODUCT LIFETIME", headers.length);
  const warrantyRows: (string | number | boolean | null)[][] = [
    ["Product Warranty", "warranty.productWarranty_years", "product_warranty_years", "number", "years", "No", 15, "Min: 0", "ESPR Art. 10 (durability)", "L2", "public", "Product defect warranty duration"],
    ["Performance Warranty", "warranty.performanceWarranty", "performance_warranty_percent", "string", "-", "No", "87.4% at year 30", "Free-form or % value", "ESPR Art. 10 (durability)", "L2", "public", "Guaranteed minimum power output"],
    ["Performance Warranty (years)", "-", "performance_warranty_years", "number", "years", "No", 30, "Min: 0", "ESPR Art. 10", "L2", "public", "Performance warranty duration"],
    ["Linear Degradation Rate", "warranty.linearDegradation_percent_per_year", "linear_degradation_percent_per_year", "number", "%/year", "No", 0.40, "Min: 0.1, Max: 1.5", "ESPR Art. 10", "L2", "public", "Annual power degradation rate guarantee"],
    ["Expected Lifetime", "warranty.expectedLifetime_years", "expected_lifetime_years", "number", "years", "No", 30, "Min: 0", "ESPR Art. 10", "L2", "public", "Expected useful product lifetime"],
  ];
  warrantyRows.forEach((r) => addDataRow(ws, r));

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 8 — Supply Chain & Traceability
// ---------------------------------------------------------------------------
function createSupplyChainSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Supply Chain & Traceability", {
    properties: { tabColor: { argb: COLORS.supplyChain } },
  });

  const headers = [
    "Field Name",
    "JSON Path",
    "Data Type",
    "Sample Value",
    "Validation / Enum Values",
    "Regulation",
    "Schema Layer",
    "Access Level",
    "Notes",
  ];
  ws.columns = [
    { header: "Field Name", width: 25 },
    { header: "JSON Path", width: 35 },
    { header: "Data Type", width: 12 },
    { header: "Sample Value", width: 30 },
    { header: "Validation / Enum Values", width: 35 },
    { header: "Regulation", width: 28 },
    { header: "Schema Layer", width: 14 },
    { header: "Access Level", width: 14 },
    { header: "Notes", width: 40 },
  ];
  styleHeaders(ws, COLORS.supplyChain);

  // --- Supply Chain Actors ---
  addSectionRow(ws, "SUPPLY CHAIN ACTORS", headers.length);
  const actorData: (string | number)[][] = [
    ["Actor Name", "supplyChain.actors[].name", "string", "Waaree Energies Ltd.", "Free-form", "ESPR Art. 10", "L2", "authority", "Supply chain participant name"],
    ["Actor ID", "supplyChain.actors[].id", "string", "SC-WRM-001", "Free-form", "ESPR Art. 10", "L2", "authority", "Unique actor identifier"],
    ["Actor Role", "supplyChain.actors[].role", "enum", "manufacturer", "manufacturer | supplier | processor | transporter | recycler | distributor", "ESPR Art. 10", "L2", "authority", "Role in the value chain"],
    ["Actor Country", "supplyChain.actors[].country", "string", "IN", "ISO 3166-1 alpha-2", "ESPR Art. 10", "L2", "authority", "Country of operation"],
  ];
  actorData.forEach((r) => addDataRow(ws, r));

  // --- Supplier Tiers ---
  addSectionRow(ws, "SUPPLIER TIERS (Tier 1-5: Module Assembly → Raw Material)", headers.length);
  const tierHeaders = [
    "Tier",
    "Stage",
    "Actor / Supplier",
    "Facility",
    "Country",
    "UFLPA Compliant",
    "Certifications",
    "Audit Date",
    "Notes",
  ];
  const tierHeaderRow = ws.addRow(tierHeaders);
  tierHeaderRow.font = { bold: true, color: { argb: "FF333333" } };
  tierHeaderRow.fill = headerFill("FFE8DAEF");
  tierHeaderRow.eachCell((cell) => { cell.border = THIN_BORDER; });

  const tierData: (string | number | boolean)[][] = [
    ["Tier 1", "module_assembly", "Waaree Energies Ltd.", "Surat Mega Factory", "IN", "Yes", "ISO 9001, ISO 14001", "2025-11-01", "Final module assembly & QC"],
    ["Tier 2", "cell_manufacturing", "Waaree Solar Cell Division", "Chikhli Cell Plant", "IN", "Yes", "ISO 9001", "2025-10-15", "N-Type TOPCon cell production"],
    ["Tier 3", "ingot_wafer", "LONGi Green Energy", "Kuching Wafer Plant", "MY", "Yes", "ISO 9001, SSI Certified", "2025-09-01", "M10 monocrystalline wafer slicing"],
    ["Tier 4", "polysilicon", "Wacker Chemie AG", "Burghausen Polysilicon Plant", "DE", "Yes", "ISO 9001, ESIA Member", "2025-08-01", "Electronic-grade polysilicon (Siemens process)"],
    ["Tier 5", "quartz_mining", "Unimin Corporation (Covia)", "Spruce Pine Mine", "US", "Yes", "ISO 14001", "2025-07-01", "High-purity quartz source"],
  ];
  tierData.forEach((r) => addDataRow(ws, r));

  // --- Chain of Custody ---
  addSectionRow(ws, "CHAIN OF CUSTODY EVENTS", headers.length);
  const cocHeaders = [
    "Timestamp",
    "Event Type",
    "From Actor",
    "To Actor",
    "Location",
    "Evidence Ref (URI)",
    "Evidence Hash",
    "Regulation",
    "Notes",
  ];
  const cocHeaderRow = ws.addRow(cocHeaders);
  cocHeaderRow.font = { bold: true, color: { argb: "FF333333" } };
  cocHeaderRow.fill = headerFill("FFE8DAEF");
  cocHeaderRow.eachCell((cell) => { cell.border = THIN_BORDER; });

  const cocData: string[][] = [
    ["2025-06-15T08:00:00Z", "production", "Wacker Chemie AG", "LONGi Green Energy", "Burghausen, DE", "https://vault.heliotrail.io/coc/coc-001.pdf", "sha256:aaa111...", "ESPR Art. 10, CSDDD", "Polysilicon shipment"],
    ["2025-07-20T10:00:00Z", "processing", "LONGi Green Energy", "Waaree Solar Cell Division", "Kuching, MY", "https://vault.heliotrail.io/coc/coc-002.pdf", "sha256:bbb222...", "ESPR Art. 10", "Wafer to cell processing"],
    ["2025-09-10T06:00:00Z", "transfer", "Waaree Solar Cell Division", "Waaree Energies Ltd.", "Chikhli → Surat, IN", "https://vault.heliotrail.io/coc/coc-003.pdf", "sha256:ccc333...", "ESPR Art. 10", "Cell transfer to module assembly"],
    ["2026-04-01T09:00:00Z", "production", "Waaree Energies Ltd.", "-", "Surat, IN", "https://vault.heliotrail.io/coc/coc-004.pdf", "sha256:ddd444...", "ESPR Art. 10", "Module assembly completed"],
  ];
  cocData.forEach((r) => addDataRow(ws, r));

  // --- Due Diligence ---
  addSectionRow(ws, "DUE DILIGENCE & COMPLIANCE", headers.length);
  const ddRows: (string | number)[][] = [
    ["Due Diligence Report", "supplyChain.dueDiligenceReport", "hashedDocument", "https://vault.heliotrail.io/dd/dd-2025.pdf", "URI + sha256 hash", "ESPR Art. 10, CSDDD (2024/1760)", "L2", "authority", "Annual supply chain due diligence report"],
    ["UFLPA Compliance Status", "supplyChain.uflpaCompliance.status", "enum", "compliant", "compliant | non_compliant | not_applicable | under_review", "UFLPA (US), EU Forced Labour Reg.", "L2", "authority", "Uyghur Forced Labor Prevention Act compliance"],
    ["UFLPA Attestation", "supplyChain.uflpaCompliance.attestationRef", "hashedDocument", "https://vault.heliotrail.io/dd/uflpa-2025.pdf", "URI + sha256 hash", "UFLPA", "L2", "authority", "UFLPA attestation document"],
    ["SSI Certification Status", "supplyChain.ssiCertification.status", "enum", "in_progress", "certified | in_progress | not_certified", "Solar Stewardship Initiative", "L2", "authority", "SSI Traceability Standard status"],
  ];
  ddRows.forEach((r) => addDataRow(ws, r));

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 9 — CIRPASS Registry Mapping
// ---------------------------------------------------------------------------
function createRegistryMappingSheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("CIRPASS Registry Mapping", {
    properties: { tabColor: { argb: COLORS.registry } },
  });

  const headers = [
    "Registry Field",
    "CIRPASS-2 JSON Path",
    "HelioTrail Source",
    "Database Column",
    "Sample Value",
    "Description",
    "Required for Registry",
    "Regulation",
  ];
  ws.columns = [
    { header: "Registry Field", width: 22 },
    { header: "CIRPASS-2 JSON Path", width: 30 },
    { header: "HelioTrail Source", width: 30 },
    { header: "Database Column", width: 25 },
    { header: "Sample Value", width: 35 },
    { header: "Description", width: 40 },
    { header: "Required for Registry", width: 20 },
    { header: "Regulation", width: 25 },
  ];
  styleHeaders(ws, COLORS.registry);

  // --- Registry Metadata ---
  addSectionRow(ws, "CIRPASS-2 REGISTRY METADATA (POST /metadata/v1)", headers.length);
  const regMetaData: string[][] = [
    ["UPI (Unique Product ID)", "upi", "passportId (pv_passport_id)", "pv_passport_id", "PVP-0000001", "Unique Product Identifier sent to registry", "Yes", "ESPR Art. 9"],
    ["REO ID", "reoId", "manufacturer_operator_id", "manufacturer_operator_id", "EU-EO-WRM-001", "Responsible Economic Operator identifier", "Yes", "ESPR Art. 9"],
    ["Live URL", "liveURL", "Generated: /api/passports/{id}/dpp", "-", "https://heliotrail.com/api/passports/uuid/dpp", "Live DPP data endpoint (JSON)", "Yes", "ESPR Art. 9"],
    ["Backup URL", "backupURL", "Generated: /passport/{public_id}", "-", "https://heliotrail.com/passport/uuid", "Human-readable passport fallback", "Yes", "ESPR Art. 9"],
    ["Commodity Code", "commodityCode", "Hardcoded: 8541", "-", "8541", "HS Code for photovoltaic semiconductor devices", "Yes", "ESPR Art. 9"],
    ["Facilities ID", "facilitiesId[]", "facility_id", "facility_id", '["FAC-WRM-SRT-001"]', "Manufacturing facility identifiers (array)", "Yes", "ESPR Art. 9"],
    ["Granularity Level", "granularityLevel", "Hardcoded: MODEL", "-", "MODEL", "Passport scope: MODEL | BATCH | ITEM", "Yes", "ESPR Art. 9"],
  ];
  regMetaData.forEach((r) => addDataRow(ws, r));

  // --- DPP Payload Mapping ---
  addSectionRow(ws, "DPP PAYLOAD MAPPING — Wizard → Database → CIRPASS-2 JSON → Public Passport", headers.length);
  const mappingHeaders = [
    "Wizard Field (FormData)",
    "Database Column",
    "CIRPASS-2 JSON Path",
    "DPP JSON Path (ESPR-aligned)",
    "Public Passport Section",
    "Public Passport Component",
    "Access Level",
    "Notes",
  ];
  const mappingHeaderRow = ws.addRow(mappingHeaders);
  mappingHeaderRow.font = { bold: true, color: { argb: "FF333333" } };
  mappingHeaderRow.fill = headerFill("FFD6EAF8");
  mappingHeaderRow.eachCell((cell) => { cell.border = THIN_BORDER; });

  const mappingData: string[][] = [
    ["passportId", "pv_passport_id", "pvPassportId", "identity.pvPassportId", "Hero / Overview", "passport-hero.tsx", "public", "Auto-generated PVP-YYYY-NNNN"],
    ["modelId", "model_id", "modelId", "identity.modelId", "Hero / Overview", "passport-hero.tsx", "public", "Selected from MODULE_MODELS"],
    ["serialNumber", "serial_number", "serialNumber", "identity.serialNumber", "Overview (Warranty)", "overview-client.tsx", "public", "Optional"],
    ["batchId", "batch_id", "batchId", "identity.batchId", "Overview (Warranty)", "overview-client.tsx", "public", "Optional"],
    ["gtin", "gtin", "gtin", "identity.gtin", "Overview (Warranty)", "overview-client.tsx", "public", "GS1 barcode number"],
    ["manufacturer", "manufacturer_name", "manufacturer.name", "manufacturer.name", "Overview (Manufacturer)", "overview-client.tsx", "public", "Fixed: Waaree Energies Ltd."],
    ["facility", "facility_id", "manufacturingFacility.facilityIdentifier", "manufacturingFacility.facilityIdentifier", "Overview (Manufacturer)", "overview-client.tsx", "public", "FAC-WRM-SRT-001 or FAC-WRM-CHI-002"],
    ["manufacturingDate", "manufacturing_date", "manufacturingDate", "manufacturingDate", "Overview (Manufacturer)", "overview-client.tsx", "public", "ISO 8601 date"],
    ["technology", "module_technology", "moduleTechnology", "technicalData.moduleTechnology", "Hero / Specs", "passport-hero.tsx", "public", "Mapped: crystalline_silicon_topcon → topcon"],
    ["ratedPower", "rated_power_stc_w", "ratedPowerSTC_W", "technicalData.ratedPowerSTC_W", "Specs (Power Gauge)", "specs-client.tsx", "public", "Watts"],
    ["efficiency", "module_efficiency_percent", "moduleEfficiency_percent", "technicalData.moduleEfficiency_percent", "Specs (Efficiency Gauge)", "specs-client.tsx", "public", "Percentage"],
    ["voc", "voc_v", "voc_V", "technicalData.voc_V", "Specs (Electrical)", "specs-client.tsx", "public", "Open-circuit voltage"],
    ["isc", "isc_a", "isc_A", "technicalData.isc_A", "Specs (Electrical)", "specs-client.tsx", "public", "Short-circuit current"],
    ["vmp", "vmp_v", "vmp_V", "technicalData.vmp_V", "Specs (Electrical)", "specs-client.tsx", "public", "MPP voltage"],
    ["imp", "imp_a", "imp_A", "technicalData.imp_A", "Specs (Electrical)", "specs-client.tsx", "public", "MPP current"],
    ["length/width/depth", "module_length/width/depth_mm", "moduleDimensions_mm.*", "technicalData.moduleDimensions_mm", "Specs (Mechanical)", "specs-client.tsx", "public", "Dimensions in mm"],
    ["mass", "module_mass_kg", "moduleMass_kg", "technicalData.moduleMass_kg", "Specs (Mechanical)", "specs-client.tsx", "public", "Module mass in kg"],
    ["bom[]", "passport_materials[]", "materialComposition.moduleMaterials[]", "materialComposition.moduleMaterials[]", "Circularity (Donut Chart)", "circularity-client.tsx", "recycler", "Array of BOM items"],
    ["certificates[]", "passport_certificates[]", "compliance.certificates[]", "compliance.certificates[]", "Compliance (Cert Cards)", "compliance-client.tsx", "public", "Array of certifications"],
    ["recyclabilityRate", "recyclability_rate_percent", "(in endOfLife)", "circularity.recyclabilityRate_percent", "Circularity (Gauge)", "circularity-client.tsx", "public", "Recyclability percentage"],
    ["recycledContent", "recycled_content_percent", "(in endOfLife)", "circularity.recycledContent_percent", "Circularity (Gauge)", "circularity-client.tsx", "public", "Recycled content percentage"],
    ["eolStatus", "end_of_life_status", "endOfLife.status", "circularity.endOfLifeStatus", "Circularity (Badge)", "circularity-client.tsx", "public", "Current lifecycle status"],
  ];
  mappingData.forEach((r) => addDataRow(ws, r));

  // --- Submission Flow ---
  addSectionRow(ws, "SUBMISSION FLOW & INTEGRITY", headers.length);
  const subData: string[][] = [
    ["Anchor ID", "-", "Auto-generated UUID", "passport_anchors.id", "(auto)", "Unique integrity anchor record", "N/A", "ESPR Art. 10"],
    ["Payload Hash", "-", "SHA-256 of DPP JSON", "passport_anchors.payload_hash", "sha256:e3b0c44...", "Integrity hash of the full DPP payload", "N/A", "ESPR Art. 10"],
    ["Anchor Type", "-", "local | blockchain", "passport_anchors.anchor_type", "local", "Hash storage method", "N/A", "ESPR Art. 10"],
    ["Submission Status", "-", "From registry response", "passport_submissions.submission_status", "accepted", "pending | accepted | rejected | error", "N/A", "ESPR Art. 9"],
    ["Receipt ID", "-", "From registry response", "passport_submissions.response_id", "CIRPASS2-1714234567890-abc123", "CIRPASS-2 receipt identifier", "N/A", "ESPR Art. 9"],
    ["Verification Status", "-", "Updated on acceptance", "passports.verification_status", "verified", "verified | pending | unverifiable | outdated", "N/A", "ESPR Art. 10"],
  ];
  subData.forEach((r) => addDataRow(ws, r));

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// SHEET 10 — Data Dictionary
// ---------------------------------------------------------------------------
function createDataDictionarySheet(wb: ExcelJS.Workbook): void {
  const ws = wb.addWorksheet("Data Dictionary", {
    properties: { tabColor: { argb: COLORS.dictionary } },
  });

  const headers = [
    "#",
    "Category",
    "Field Name",
    "JSON Path (CIRPASS-2)",
    "Data Type",
    "Unit",
    "Required (Reg. Core)",
    "Validation / Enum Values",
    "Regulation Reference",
    "Schema Layer",
    "Access Level",
    "ESPR Article",
  ];
  ws.columns = [
    { header: "#", width: 5 },
    { header: "Category", width: 20 },
    { header: "Field Name", width: 28 },
    { header: "JSON Path (CIRPASS-2)", width: 35 },
    { header: "Data Type", width: 12 },
    { header: "Unit", width: 10 },
    { header: "Required (Reg. Core)", width: 18 },
    { header: "Validation / Enum Values", width: 40 },
    { header: "Regulation Reference", width: 30 },
    { header: "Schema Layer", width: 14 },
    { header: "Access Level", width: 14 },
    { header: "ESPR Article", width: 14 },
  ];
  styleHeaders(ws, COLORS.dictionary);

  let n = 0;
  const row = (cat: string, name: string, path: string, type: string, unit: string, req: string, val: string, reg: string, layer: string, access: string, art: string) => {
    n++;
    addDataRow(ws, [n, cat, name, path, type, unit, req, val, reg, layer, access, art]);
  };

  // Identity
  addSectionRow(ws, "A. PRODUCT IDENTITY & ECONOMIC OPERATORS", headers.length);
  row("Identity", "Passport ID", "pvPassportId", "string", "-", "Yes", "^PVP-[0-9]{7,}$", "ESPR (ISO/IEC 15459)", "L1", "public", "Art. 8");
  row("Identity", "Module Identifier", "moduleIdentifier", "string", "-", "Yes", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Identity", "Serial Number", "serialNumber", "string", "-", "No", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Identity", "Batch ID", "batchId", "string", "-", "No", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Identity", "Model ID", "modelId", "string", "-", "Yes", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Identity", "GTIN", "gtin", "string", "-", "No", "^[0-9]{8,14}$", "GS1, ESPR", "L1", "public", "Art. 8");
  row("Identity", "Data Carrier Type", "dataCarrierType", "enum", "-", "No", "qr_gs1_digital_link | data_matrix | rfid | nfc", "ESPR", "L1", "public", "Art. 8");
  row("Identity", "Passport Version", "passportVersion", "string", "-", "No", "v{N}", "ESPR", "L1", "public", "Art. 10");
  row("Identity", "Passport Status", "passportStatus", "enum", "-", "Yes", "draft | under_review | approved | published | superseded | archived | decommissioned", "ESPR", "L1", "public", "Art. 10");
  row("Manufacturer", "Name", "manufacturer.name", "string", "-", "Yes", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Manufacturer", "Operator ID", "manufacturer.operatorIdentifier", "string", "-", "Yes", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Manufacturer", "Country", "manufacturer.address.country", "string", "-", "No", "ISO 3166-1 alpha-2", "ESPR, WEEE", "L1", "public", "Art. 8");
  row("Manufacturer", "Contact URL", "manufacturer.contactUrl", "string (URI)", "-", "No", "Valid URI", "ESPR", "L1", "public", "Art. 8");
  row("Facility", "Facility ID", "manufacturingFacility.facilityIdentifier", "string", "-", "Yes", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Facility", "Facility Name", "manufacturingFacility.name", "string", "-", "Yes", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Facility", "Country", "manufacturingFacility.location.country", "string", "-", "Yes", "ISO 3166-1 alpha-2", "ESPR, WEEE", "L1", "public", "Art. 8");
  row("Facility", "Manufacturing Date", "manufacturingDate", "date-time", "-", "No", "ISO 8601", "ESPR", "L1", "public", "Art. 8");
  row("Facility", "Module Technology", "moduleTechnology", "enum", "-", "Yes", "perc | topcon | hjt | cigs | cdte | perovskite | shj | ibc", "ESPR delegated act", "L1", "public", "Art. 8");

  // Technical
  addSectionRow(ws, "B. TECHNICAL SPECIFICATIONS", headers.length);
  row("Electrical", "Rated Power (Pmax)", "ratedPowerSTC_W", "number", "W", "Yes", "50-800", "IEC 61215, ESPR", "L1", "public", "Art. 10");
  row("Electrical", "Module Efficiency", "moduleEfficiency_percent", "number", "%", "Yes", "5-30", "IEC 61215, ESPR", "L1", "public", "Art. 10");
  row("Electrical", "Open-Circuit Voltage (Voc)", "voc_V", "number", "V", "No", "Min: 0", "IEC 61215", "L1", "public", "-");
  row("Electrical", "Short-Circuit Current (Isc)", "isc_A", "number", "A", "No", "Min: 0", "IEC 61215", "L1", "public", "-");
  row("Electrical", "Voltage at Max Power (Vmp)", "vmp_V", "number", "V", "No", "Min: 0", "IEC 61215", "L1", "public", "-");
  row("Electrical", "Current at Max Power (Imp)", "imp_A", "number", "A", "No", "Min: 0", "IEC 61215", "L1", "public", "-");
  row("Electrical", "Max System Voltage", "maxSystemVoltage_V", "number", "V", "No", "600 | 1000 | 1500", "IEC 61215 (safety)", "L1", "public", "-");
  row("Physical", "Module Length", "moduleDimensions_mm.length", "number", "mm", "No", "Min: 0", "ESPR", "L1", "public", "Art. 10");
  row("Physical", "Module Width", "moduleDimensions_mm.width", "number", "mm", "No", "Min: 0", "ESPR", "L1", "public", "Art. 10");
  row("Physical", "Module Depth", "moduleDimensions_mm.depth", "number", "mm", "No", "Min: 0", "ESPR", "L1", "public", "Art. 10");
  row("Physical", "Module Mass", "moduleMass_kg", "number", "kg", "No", "5-50", "ESPR", "L1", "public", "Art. 10");
  row("Physical", "Cell Count", "-", "number", "count", "No", "-", "IEC 61215", "L1", "public", "-");
  row("Physical", "Cell Type", "-", "string", "-", "No", "Free-form", "IEC 61215", "L1", "public", "-");
  row("Thermal", "Temp Coeff Pmax", "tempCoeff_Pmax", "number", "%/°C", "No", "Max: 0 (negative)", "IEC 61215", "L1", "public", "-");
  row("Thermal", "Temp Coeff Voc", "tempCoeff_Voc", "number", "%/°C", "No", "Max: 0 (negative)", "IEC 61215", "L1", "public", "-");
  row("Thermal", "Temp Coeff Isc", "tempCoeff_Isc", "number", "%/°C", "No", "Typically positive", "IEC 61215", "L1", "public", "-");
  row("Thermal", "NOCT", "noct_C", "number", "°C", "No", "30-55", "IEC 61215", "L1", "public", "-");
  row("Mechanical", "Bifaciality Factor", "-", "number", "ratio", "No", "0-1", "IEC 61215 (bifacial)", "L2", "public", "-");
  row("Mechanical", "Fire Rating", "-", "string", "-", "No", "e.g., Class A", "IEC 61730", "L2", "public", "-");
  row("Mechanical", "IP Rating", "-", "string", "-", "No", "e.g., IP68", "IEC 61730", "L2", "public", "-");

  // Materials
  addSectionRow(ws, "C. MATERIAL COMPOSITION & SUBSTANCES", headers.length);
  row("BOM", "Material Name", "materialComposition.moduleMaterials[].materialName", "string", "-", "Yes*", "Free-form", "ESPR, WEEE Annex V", "L2", "recycler", "Art. 10");
  row("BOM", "Component Type", "materialComposition.moduleMaterials[].componentType", "enum", "-", "Yes*", "front_cover | frame | solar_cell | encapsulant | interconnects | cell_metallization | rear_cover | junction_box | solder | other", "ESPR", "L2", "recycler", "Art. 10");
  row("BOM", "Mass (g)", "materialComposition.moduleMaterials[].mass_g", "number", "g", "No", "Min: 0", "ESPR, WEEE", "L2", "recycler", "Art. 10");
  row("BOM", "Mass %", "materialComposition.moduleMaterials[].massPercent", "number", "%", "No", "0-100", "ESPR, WEEE", "L2", "recycler", "Art. 10");
  row("BOM", "CAS Number", "materialComposition.moduleMaterials[].casNumber", "string", "-", "No", "Pattern: [0-9]+-[0-9]+-[0-9]+", "REACH", "L2", "recycler", "-");
  row("BOM", "Is Critical Raw Material", "materialComposition.moduleMaterials[].isCriticalRawMaterial", "boolean", "-", "No", "true | false", "EU CRM Strategy", "L2", "recycler", "Art. 10");
  row("SoC", "Substance Name", "materialComposition.substancesOfConcern[].name", "string", "-", "Yes*", "Free-form", "REACH, RoHS", "L2", "restricted", "-");
  row("SoC", "CAS Number", "materialComposition.substancesOfConcern[].casNumber", "string", "-", "Yes*", "Pattern: [0-9]+-[0-9]+-[0-9]+", "REACH", "L2", "restricted", "-");
  row("SoC", "Concentration (w/w %)", "materialComposition.substancesOfConcern[].concentration_w_w_percent", "number", "%", "No", "0-100. REACH threshold: >0.1%", "REACH Art. 33", "L2", "restricted", "-");
  row("SoC", "Regulatory Basis", "materialComposition.substancesOfConcern[].regulatoryBasis", "enum", "-", "No", "REACH | RoHS | SVHC | CLP | other", "REACH, RoHS", "L2", "restricted", "-");
  row("Status", "REACH Status", "materialComposition.reachStatus", "enum", "-", "No", "compliant | non_compliant | exempt | under_review", "REACH (EC 1907/2006)", "L2", "restricted", "-");
  row("Status", "RoHS Status", "materialComposition.rohsStatus", "enum", "-", "No", "compliant | compliant_with_exemption | exempt | non_compliant", "RoHS (2011/65/EU)", "L2", "restricted", "-");

  // Compliance
  addSectionRow(ws, "D. COMPLIANCE & DOCUMENTATION", headers.length);
  row("Certs", "Standard Name", "compliance.certificates[].standard", "string", "-", "Yes*", "Free-form (e.g., IEC 61215)", "ESPR", "L1", "public", "Art. 8");
  row("Certs", "Issuer", "compliance.certificates[].issuer", "string", "-", "Yes*", "Free-form", "ESPR", "L1", "public", "Art. 8");
  row("Certs", "Valid Until", "compliance.certificates[].validUntil", "date", "-", "No", "ISO 8601 date", "ESPR", "L1", "public", "Art. 8");
  row("Docs", "Document URI", "compliance.*.uri", "string (URI)", "-", "Yes*", "Valid URI", "ESPR", "L1", "varies", "Art. 8");
  row("Docs", "Hash Algorithm", "compliance.*.hashAlg", "enum", "-", "Yes*", "sha256 | sha384 | sha512", "ESPR", "L1", "varies", "Art. 10");
  row("Docs", "Document Hash", "compliance.*.hash", "string", "-", "Yes*", "Hex string", "ESPR", "L1", "varies", "Art. 10");

  // Circularity
  addSectionRow(ws, "E. CIRCULARITY & END-OF-LIFE", headers.length);
  row("Circularity", "Recyclability Rate", "-", "number", "%", "No", "0-100. WEEE target: 85%", "WEEE Annex V, ESPR", "L2", "public", "Art. 10");
  row("Circularity", "Recycled Content", "-", "number", "%", "No", "0-100", "ESPR", "L2", "public", "Art. 10");
  row("Circularity", "Dismantling Time", "endOfLife.dismantlingInstructions", "number", "min", "No", "0-120", "WEEE Annex V", "L2", "recycler", "Art. 10");
  row("Circularity", "Collection Scheme", "endOfLife.collectionScheme", "string", "-", "No", "Free-form", "WEEE Art. 16", "L2", "public", "-");
  row("Circularity", "EOL Status", "endOfLife.status", "enum", "-", "No", "in_use | decommissioned | in_recycling | recycled | reused | disposed", "WEEE, ESPR", "L2", "public", "Art. 10");
  row("Recovery", "Material", "endOfLife.recoveryOutcomes[].material", "string", "-", "No", "Free-form", "WEEE Annex V", "L2", "recycler", "-");
  row("Recovery", "Expected Recovery %", "endOfLife.recoveryOutcomes[].expectedRecoveryPercent", "number", "%", "No", "0-100", "WEEE Annex V (85% target)", "L2", "recycler", "-");

  // Carbon
  addSectionRow(ws, "F. CARBON & WARRANTY", headers.length);
  row("Carbon", "Declared Value", "carbonFootprint.declaredValue_kgCO2e", "number", "kg CO2eq", "No", "Min: 0", "ESPR, JRC Rules (2025)", "L2", "public", "Art. 10");
  row("Carbon", "Functional Unit", "carbonFootprint.functionalUnit_gCO2eq_per_kWh", "number", "gCO2eq/kWh", "No", "Min: 0. Typical: 10.8-44", "JRC Rules (2025)", "L2", "public", "Art. 10");
  row("Carbon", "LCA Boundary", "carbonFootprint.boundary", "enum", "-", "No", "cradle_to_gate | cradle_to_grave", "ESPR, ISO 14040", "L2", "public", "Art. 10");
  row("Carbon", "Methodology", "carbonFootprint.methodology", "string", "-", "No", "e.g., JRC_harmonized_2025", "ESPR", "L2", "public", "Art. 10");
  row("Warranty", "Product Warranty", "warranty.productWarranty_years", "number", "years", "No", "Min: 0", "ESPR (durability)", "L2", "public", "Art. 10");
  row("Warranty", "Performance Warranty", "warranty.performanceWarranty", "string", "-", "No", "Free-form (e.g., 87.4% at year 30)", "ESPR (durability)", "L2", "public", "Art. 10");
  row("Warranty", "Degradation Rate", "warranty.linearDegradation_percent_per_year", "number", "%/year", "No", "0.1-1.5", "ESPR", "L2", "public", "Art. 10");
  row("Warranty", "Expected Lifetime", "warranty.expectedLifetime_years", "number", "years", "No", "Min: 0", "ESPR", "L2", "public", "Art. 10");

  // Supply Chain
  addSectionRow(ws, "G. SUPPLY CHAIN & TRACEABILITY", headers.length);
  row("Actors", "Actor Name", "supplyChain.actors[].name", "string", "-", "No", "Free-form", "ESPR, CSDDD", "L2", "authority", "Art. 10");
  row("Actors", "Actor Role", "supplyChain.actors[].role", "enum", "-", "No", "manufacturer | supplier | processor | transporter | recycler | distributor", "ESPR", "L2", "authority", "Art. 10");
  row("Tiers", "Tier Level", "supplyChain.supplierTiers[].tier", "integer", "-", "No", "1-5", "ESPR, UFLPA", "L2", "authority", "Art. 10");
  row("Tiers", "Stage", "supplyChain.supplierTiers[].stage", "enum", "-", "No", "quartz_mining | polysilicon | ingot_wafer | cell_manufacturing | module_assembly", "ESPR, UFLPA", "L2", "authority", "Art. 10");
  row("CoC", "Event Type", "supplyChain.chainOfCustodyEvents[].eventType", "enum", "-", "No", "production | transfer | processing | shipment | receipt | installation | decommission", "ESPR, CSDDD", "L2", "authority", "Art. 10");
  row("Compliance", "UFLPA Status", "supplyChain.uflpaCompliance.status", "enum", "-", "No", "compliant | non_compliant | not_applicable | under_review", "UFLPA, EU FL Reg.", "L2", "authority", "-");
  row("Compliance", "SSI Status", "supplyChain.ssiCertification.status", "enum", "-", "No", "certified | in_progress | not_certified", "Solar Stewardship Initiative", "L2", "authority", "-");

  // Dynamic (Layer 3)
  addSectionRow(ws, "H. DYNAMIC LIFECYCLE DATA (Layer 3 — Advanced)", headers.length);
  row("Performance", "Current Active Power", "dynamic.currentActivePower_W", "number", "W", "No", "Min: 0", "ESPR (future)", "L3", "restricted", "-");
  row("Performance", "Cumulative Energy", "dynamic.cumulativeEnergyGeneration_kWh", "number", "kWh", "No", "Min: 0", "ESPR (future)", "L3", "restricted", "-");
  row("Performance", "Power Retention", "dynamic.powerRetention_percent", "number", "%", "No", "0-100", "ESPR (durability)", "L3", "restricted", "-");
  row("Performance", "Degradation Rate (est.)", "dynamic.estimatedDegradationRate_percent_per_year", "number", "%/year", "No", "0-5", "ESPR", "L3", "restricted", "-");
  row("Health", "Anomaly Flags", "dynamic.anomalyFlags[]", "enum[]", "-", "No", "pid | hotspot | delamination | snail_trails | bypass_diode_failure | microcracks | discoloration | corrosion", "-", "L3", "restricted", "-");
  row("Maintenance", "Maintenance Event Type", "dynamic.maintenanceEvents[].type", "enum", "-", "No", "cleaning | repair | replacement | inspection | other", "-", "L3", "restricted", "-");
  row("Inspection", "Inspection Method", "dynamic.inspectionEvents[].method", "enum", "-", "No", "visual | infrared_thermography | electroluminescence | iv_curve | drone | other", "-", "L3", "restricted", "-");
  row("Site", "Installation Date", "dynamic.installationSite.installationDate", "date", "-", "No", "ISO 8601", "-", "L3", "restricted", "-");
  row("Ownership", "Owner Type", "dynamic.currentOwner.type", "enum", "-", "No", "individual | commercial | utility | government", "-", "L3", "restricted", "-");

  ws.views = [{ state: "frozen", ySplit: 1 }];
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "HelioTrail DPP Generator";
  wb.created = new Date();
  wb.modified = new Date();
  wb.properties.title = "PV Digital Product Passport — Data Template";
  wb.properties.description =
    "Comprehensive regulatory-aligned data template for PV solar module Digital Product Passports. Covers ESPR, REACH, RoHS, WEEE, IEC 61215/61730, and CIRPASS-2 registry requirements.";

  createIdentitySheet(wb);
  createSpecsSheet(wb);
  createBomSheet(wb);
  createSocSheet(wb);
  createComplianceSheet(wb);
  createCircularitySheet(wb);
  createCarbonSheet(wb);
  createSupplyChainSheet(wb);
  createRegistryMappingSheet(wb);
  createDataDictionarySheet(wb);

  const outPath = path.resolve(process.cwd(), "PV_DPP_Data_Template.xlsx");
  await wb.xlsx.writeFile(outPath);

  console.log(`\nGenerated: ${outPath}`);
  console.log(`Sheets: ${wb.worksheets.map((s) => s.name).join(", ")}`);
  console.log(`Total sheets: ${wb.worksheets.length}`);
}

main().catch((err) => {
  console.error("Failed to generate Excel:", err);
  process.exit(1);
});
