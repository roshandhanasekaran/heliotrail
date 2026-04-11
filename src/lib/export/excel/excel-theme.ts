import type ExcelJS from "exceljs";
import type { BrandConfig } from "../types";

export function createHeaderStyle(brand: BrandConfig): Partial<ExcelJS.Style> {
  return {
    font: { bold: true, color: { argb: "FFFFFFFF" }, size: 11 },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${brand.primaryColor.replace("#", "")}` },
    },
    alignment: { vertical: "middle", horizontal: "left" },
    border: {
      bottom: { style: "thin", color: { argb: "FFE5E5E5" } },
    },
  };
}

export function createSectionStyle(brand: BrandConfig): Partial<ExcelJS.Style> {
  return {
    font: { bold: true, size: 11, color: { argb: "FF1A1A1A" } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF5F5F5" },
    },
    border: {
      bottom: { style: "thin", color: { argb: `FF${brand.primaryColor.replace("#", "")}` } },
    },
  };
}

export function createDataStyle(): Partial<ExcelJS.Style> {
  return {
    font: { size: 10, color: { argb: "FF1A1A1A" } },
    alignment: { vertical: "middle" },
    border: {
      bottom: { style: "hair", color: { argb: "FFF0F0F0" } },
    },
  };
}

export function applyBrandedHeader(
  ws: ExcelJS.Worksheet,
  title: string,
  subtitle: string,
  brand: BrandConfig,
) {
  const titleRow = ws.addRow([title]);
  titleRow.font = { bold: true, size: 14, color: { argb: "FF1A1A1A" } };
  titleRow.height = 28;

  const subRow = ws.addRow([subtitle]);
  subRow.font = { size: 10, color: { argb: "FF737373" } };

  const dateRow = ws.addRow([
    `Generated ${new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`,
  ]);
  dateRow.font = { size: 9, color: { argb: "FFA3A3A3" } };

  ws.addRow([]);
}

export function addTableHeaders(
  ws: ExcelJS.Worksheet,
  headers: string[],
  brand: BrandConfig,
) {
  const row = ws.addRow(headers);
  const style = createHeaderStyle(brand);
  row.eachCell((cell) => {
    cell.style = style as ExcelJS.Style;
  });
  row.height = 24;
  ws.views = [{ state: "frozen", ySplit: row.number }];
}

export function addDataRows(
  ws: ExcelJS.Worksheet,
  rows: (string | number | null)[][],
) {
  const style = createDataStyle();
  for (const values of rows) {
    const row = ws.addRow(values.map((v) => v ?? "—"));
    row.eachCell((cell) => {
      cell.style = style as ExcelJS.Style;
    });
  }
}
