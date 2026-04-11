import React from "react";
import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { createPdfStyles } from "./pdf-theme";
import type { BrandConfig } from "../types";

interface PassportReportData {
  passport: {
    model_id: string;
    pv_passport_id: string;
    manufacturer_name: string | null;
    status: string;
    module_technology: string | null;
    rated_power_stc_w: number | null;
    module_efficiency_percent: number | null;
    module_mass_kg: number | null;
    carbon_footprint_kg_co2e: number | null;
    carbon_footprint_methodology: string | null;
    created_at: string;
    updated_at: string;
    // Electrical specs
    voc_v: number | null;
    isc_a: number | null;
    vmp_v: number | null;
    imp_a: number | null;
    // Physical
    length_mm: number | null;
    width_mm: number | null;
    depth_mm: number | null;
  };
  certificates: {
    standard_name: string;
    certificate_number: string | null;
    status: string;
    expiry_date: string | null;
    issuing_body: string | null;
  }[];
  materials: {
    material_name: string;
    component_type: string | null;
    mass_g: number | null;
    is_critical_raw_material: boolean;
    is_substance_of_concern: boolean;
  }[];
  circularity: {
    recyclability_rate_percent: number | null;
    recycled_content_percent: number | null;
    collection_scheme: string | null;
  } | null;
}

export function PassportReport({
  data,
  brand,
}: {
  data: PassportReportData;
  brand: BrandConfig;
}) {
  const styles = createPdfStyles(brand);
  const p = data.passport;
  const now = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const validCerts = data.certificates.filter((c) => c.status === "valid").length;
  const totalMass = data.materials.reduce((s, m) => s + (m.mass_g ?? 0), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{brand.reportHeaderText}</Text>
            <Text style={styles.headerSubtitle}>
              {p.model_id} — {p.pv_passport_id}
            </Text>
          </View>
          <View>
            <Text style={styles.headerDate}>Generated {now}</Text>
            <Text style={styles.headerDate}>
              {p.manufacturer_name ?? "HelioTrail"}
            </Text>
          </View>
        </View>

        {/* Product Identity */}
        <Text style={styles.sectionTitle}>Product Identity</Text>
        <View style={styles.grid2}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Model</Text>
            <Text style={styles.value}>{p.model_id}</Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Passport ID</Text>
            <Text style={styles.value}>{p.pv_passport_id}</Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Manufacturer</Text>
            <Text style={styles.value}>
              {p.manufacturer_name ?? "Not specified"}
            </Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{p.status}</Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Technology</Text>
            <Text style={styles.value}>{p.module_technology ?? "N/A"}</Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Created</Text>
            <Text style={styles.value}>
              {new Date(p.created_at).toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>

        {/* Technical Specifications */}
        <Text style={styles.sectionTitle}>Technical Specifications</Text>
        <View style={styles.grid2}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Rated Power (STC)</Text>
            <Text style={styles.value}>
              {p.rated_power_stc_w ? `${p.rated_power_stc_w} W` : "N/A"}
            </Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Efficiency</Text>
            <Text style={styles.value}>
              {p.module_efficiency_percent
                ? `${p.module_efficiency_percent}%`
                : "N/A"}
            </Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Voc / Isc</Text>
            <Text style={styles.value}>
              {p.voc_v ? `${p.voc_v} V` : "N/A"} /{" "}
              {p.isc_a ? `${p.isc_a} A` : "N/A"}
            </Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Mass</Text>
            <Text style={styles.value}>
              {p.module_mass_kg ? `${p.module_mass_kg} kg` : "N/A"}
            </Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Dimensions</Text>
            <Text style={styles.value}>
              {p.length_mm && p.width_mm
                ? `${p.length_mm} x ${p.width_mm}${p.depth_mm ? ` x ${p.depth_mm}` : ""} mm`
                : "N/A"}
            </Text>
            <Text style={{ ...styles.label, marginTop: 8 }}>Vmp / Imp</Text>
            <Text style={styles.value}>
              {p.vmp_v ? `${p.vmp_v} V` : "N/A"} /{" "}
              {p.imp_a ? `${p.imp_a} A` : "N/A"}
            </Text>
          </View>
        </View>

        {/* Carbon Footprint */}
        <Text style={styles.sectionTitle}>Carbon Footprint</Text>
        <View style={styles.grid2}>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Carbon Footprint (cradle-to-gate)</Text>
            <Text style={styles.kpiValue}>
              {p.carbon_footprint_kg_co2e
                ? `${p.carbon_footprint_kg_co2e} kg CO₂e`
                : "Not measured"}
            </Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={styles.label}>Methodology</Text>
            <Text style={styles.value}>
              {p.carbon_footprint_methodology ?? "ISO 14067"}
            </Text>
          </View>
        </View>

        {/* Compliance Certificates */}
        <Text style={styles.sectionTitle}>
          Compliance Certificates ({validCerts}/{data.certificates.length} valid)
        </Text>
        {data.certificates.length > 0 ? (
          <>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>Standard</Text>
              <Text style={styles.cellHeader}>Certificate #</Text>
              <Text style={styles.cellHeader}>Status</Text>
              <Text style={styles.cellHeader}>Expiry</Text>
            </View>
            {data.certificates.map((cert, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{cert.standard_name}</Text>
                <Text style={styles.cell}>
                  {cert.certificate_number ?? "—"}
                </Text>
                <Text style={styles.cell}>{cert.status}</Text>
                <Text style={styles.cell}>
                  {cert.expiry_date
                    ? new Date(cert.expiry_date).toLocaleDateString("en-GB")
                    : "—"}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.value}>No certificates on record</Text>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{brand.reportFooterText}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* Page 2: Materials + Circularity */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>
              Material Composition & Circularity
            </Text>
            <Text style={styles.headerSubtitle}>
              {p.model_id} — {p.pv_passport_id}
            </Text>
          </View>
          <Text style={styles.headerDate}>Generated {now}</Text>
        </View>

        {/* Material Composition */}
        <Text style={styles.sectionTitle}>
          Material Composition ({data.materials.length} materials,{" "}
          {totalMass > 0 ? `${(totalMass / 1000).toFixed(2)} kg` : "mass N/A"})
        </Text>
        {data.materials.length > 0 ? (
          <>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>Material</Text>
              <Text style={styles.cellHeader}>Component</Text>
              <Text style={styles.cellHeader}>Mass (g)</Text>
              <Text style={styles.cellHeader}>CRM</Text>
              <Text style={styles.cellHeader}>SoC</Text>
            </View>
            {data.materials.map((mat, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{mat.material_name}</Text>
                <Text style={styles.cell}>
                  {mat.component_type ?? "—"}
                </Text>
                <Text style={styles.cell}>
                  {mat.mass_g != null ? mat.mass_g.toFixed(1) : "—"}
                </Text>
                <Text style={styles.cell}>
                  {mat.is_critical_raw_material ? "Yes" : "No"}
                </Text>
                <Text style={styles.cell}>
                  {mat.is_substance_of_concern ? "Yes" : "No"}
                </Text>
              </View>
            ))}
          </>
        ) : (
          <Text style={styles.value}>No materials declared</Text>
        )}

        {/* Circularity */}
        <Text style={styles.sectionTitle}>Circularity & End-of-Life</Text>
        {data.circularity ? (
          <View style={styles.grid2}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Recyclability Rate</Text>
              <Text style={styles.kpiValue}>
                {data.circularity.recyclability_rate_percent != null
                  ? `${data.circularity.recyclability_rate_percent}%`
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Recycled Content</Text>
              <Text style={styles.kpiValue}>
                {data.circularity.recycled_content_percent != null
                  ? `${data.circularity.recycled_content_percent}%`
                  : "N/A"}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.value}>No circularity data available</Text>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>{brand.reportFooterText}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
