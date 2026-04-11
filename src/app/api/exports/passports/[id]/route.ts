import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PassportReport } from "@/lib/export/pdf/passport-report";
import { loadBrandConfig } from "@/lib/export/brand";
import {
  applyBrandedHeader,
  addTableHeaders,
  addDataRows,
} from "@/lib/export/excel/excel-theme";
import React from "react";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: passportId } = await params;
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "pdf";

  const supabase = await createClient();

  // Fetch passport and related data
  const [
    { data: passport },
    { data: certificates },
    { data: materials },
    { data: circularity },
  ] = await Promise.all([
    supabase.from("passports").select("*").eq("id", passportId).single(),
    supabase.from("passport_certificates").select("*").eq("passport_id", passportId),
    supabase.from("passport_materials").select("*").eq("passport_id", passportId),
    supabase.from("passport_circularity").select("*").eq("passport_id", passportId).single(),
  ]);

  if (!passport) {
    return NextResponse.json({ error: "Passport not found" }, { status: 404 });
  }

  const brand = await loadBrandConfig();

  if (format === "excel") {
    const ExcelJS = (await import("exceljs")).default;
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HelioTrail";
    workbook.created = new Date();

    // Overview sheet
    const ws = workbook.addWorksheet("Overview", { properties: { tabColor: { argb: `FF${brand.primaryColor.replace("#", "")}` } } });
    ws.columns = [
      { width: 28 },
      { width: 36 },
      { width: 20 },
      { width: 20 },
    ];
    applyBrandedHeader(ws, passport.model_id, passport.pv_passport_id, brand);
    addTableHeaders(ws, ["Field", "Value"], brand);
    addDataRows(ws, [
      ["Model", passport.model_id],
      ["Passport ID", passport.pv_passport_id],
      ["Manufacturer", passport.manufacturer_name],
      ["Status", passport.status],
      ["Technology", passport.module_technology],
      ["Rated Power (W)", passport.rated_power_stc_w],
      ["Efficiency (%)", passport.module_efficiency_percent],
      ["Mass (kg)", passport.module_mass_kg],
      ["Carbon Footprint (kg CO₂e)", passport.carbon_footprint_kg_co2e],
      ["Methodology", passport.carbon_footprint_methodology],
      ["Voc (V)", passport.voc_v],
      ["Isc (A)", passport.isc_a],
      ["Dimensions (mm)", passport.length_mm && passport.width_mm
        ? `${passport.length_mm} x ${passport.width_mm}${passport.depth_mm ? ` x ${passport.depth_mm}` : ""}`
        : null],
    ]);

    // Certificates sheet
    if (certificates && certificates.length > 0) {
      const certWs = workbook.addWorksheet("Certificates", { properties: { tabColor: { argb: "FF3B82F6" } } });
      certWs.columns = [
        { width: 30 },
        { width: 24 },
        { width: 14 },
        { width: 16 },
        { width: 24 },
      ];
      applyBrandedHeader(certWs, "Compliance Certificates", passport.model_id, brand);
      addTableHeaders(certWs, ["Standard", "Certificate #", "Status", "Expiry", "Issuing Body"], brand);
      addDataRows(
        certWs,
        certificates.map((c) => [
          c.standard_name,
          c.certificate_number,
          c.status,
          c.expiry_date ? new Date(c.expiry_date).toLocaleDateString("en-GB") : null,
          c.issuing_body,
        ]),
      );
    }

    // Materials sheet
    if (materials && materials.length > 0) {
      const matWs = workbook.addWorksheet("Materials", { properties: { tabColor: { argb: "FFF59E0B" } } });
      matWs.columns = [
        { width: 24 },
        { width: 20 },
        { width: 14 },
        { width: 10 },
        { width: 10 },
      ];
      applyBrandedHeader(matWs, "Material Composition", passport.model_id, brand);
      addTableHeaders(matWs, ["Material", "Component", "Mass (g)", "CRM", "SoC"], brand);
      addDataRows(
        matWs,
        materials.map((m) => [
          m.material_name,
          m.component_type,
          m.mass_g,
          m.is_critical_raw_material ? "Yes" : "No",
          m.is_substance_of_concern ? "Yes" : "No",
        ]),
      );
    }

    const excelBuffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(new Uint8Array(excelBuffer as ArrayBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${passport.model_id}_DPP_Report.xlsx"`,
      },
    });
  }

  // Default: PDF
  const reportData = {
    passport,
    certificates: certificates ?? [],
    materials: materials ?? [],
    circularity: circularity ?? null,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfElement = React.createElement(PassportReport, { data: reportData, brand }) as any;
  const pdfBuffer = await renderToBuffer(pdfElement);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${passport.model_id}_DPP_Report.pdf"`,
    },
  });
}
