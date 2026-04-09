import { createClient } from "@/lib/supabase/server";
import type {
  Passport,
  PassportMaterial,
  PassportCertificate,
  PassportCircularity,
} from "@/types/passport";

/**
 * Assemble passport data into the flat CIRPASS-2 JSON schema format
 * matching schemas/pv-passport-v1.json.
 *
 * This format uses top-level fields (pvPassportId, moduleTechnology, etc.)
 * rather than the nested ESPR-aligned structure.
 */
export async function assemblePassportCirpass2(passportId: string) {
  const supabase = await createClient();

  const [
    { data: passport },
    { data: materials },
    { data: certificates },
    { data: circularity },
  ] = await Promise.all([
    supabase.from("passports").select("*").eq("id", passportId).single(),
    supabase
      .from("passport_materials")
      .select("*")
      .eq("passport_id", passportId)
      .order("sort_order"),
    supabase
      .from("passport_certificates")
      .select("*")
      .eq("passport_id", passportId),
    supabase
      .from("passport_circularity")
      .select("*")
      .eq("passport_id", passportId)
      .single(),
  ]);

  if (!passport) throw new Error(`Passport ${passportId} not found`);

  const p = passport as Passport;
  const mats = (materials ?? []) as PassportMaterial[];
  const certs = (certificates ?? []) as PassportCertificate[];
  const circ = circularity as PassportCircularity | null;

  // Map module_technology enum to CIRPASS-2 enum
  const techMap: Record<string, string> = {
    crystalline_silicon_topcon: "topcon",
    crystalline_silicon_perc: "perc",
    crystalline_silicon_hjt: "hjt",
    thin_film_cdte: "cdte",
    thin_film_cigs: "cigs",
  };

  return {
    pvPassportId: p.pv_passport_id,
    moduleIdentifier: p.model_id,
    serialNumber: p.serial_number ?? undefined,
    batchId: p.batch_id ?? undefined,
    modelId: p.model_id,
    gtin: p.gtin ?? undefined,
    dataCarrierType: (p.data_carrier_type ?? "qr_gs1_digital_link") as string,
    passportVersion: `v${p.passport_version}`,
    passportStatus: p.status,

    manufacturer: {
      name: p.manufacturer_name,
      operatorIdentifier: p.manufacturer_operator_id ?? "UNKNOWN",
      address: p.manufacturer_address
        ? {
            country: p.manufacturer_country ?? "XX",
            street: p.manufacturer_address,
          }
        : undefined,
      contactUrl: p.manufacturer_contact_url ?? undefined,
    },

    ...(p.importer_name
      ? {
          importer: {
            name: p.importer_name,
            operatorIdentifier: p.importer_operator_id ?? "UNKNOWN",
            country: p.importer_country ?? "XX",
          },
        }
      : {}),

    ...(p.authorized_rep_name
      ? {
          authorizedRepresentative: {
            name: p.authorized_rep_name,
            operatorIdentifier: p.authorized_rep_operator_id ?? "UNKNOWN",
          },
        }
      : {}),

    manufacturingFacility: {
      facilityIdentifier: p.facility_id ?? "UNKNOWN",
      name: p.facility_name ?? "Unknown",
      location: {
        country: p.facility_country ?? (p.manufacturer_country === "India" ? "IN" : (p.manufacturer_country ?? "XX")),
        city: p.facility_location?.split(",")[0]?.trim() ?? undefined,
      },
    },

    manufacturingDate: p.manufacturing_date
      ? new Date(p.manufacturing_date).toISOString()
      : undefined,

    moduleTechnology: techMap[p.module_technology] ?? p.module_technology,
    ratedPowerSTC_W: p.rated_power_stc_w ?? undefined,
    moduleEfficiency_percent: p.module_efficiency_percent ?? undefined,
    voc_V: p.voc_v ?? undefined,
    isc_A: p.isc_a ?? undefined,
    vmp_V: p.vmp_v ?? undefined,
    imp_A: p.imp_a ?? undefined,
    maxSystemVoltage_V: p.max_system_voltage_v ?? undefined,

    moduleDimensions_mm: {
      length: p.module_length_mm ?? undefined,
      width: p.module_width_mm ?? undefined,
      depth: p.module_depth_mm ?? undefined,
    },

    moduleMass_kg: p.module_mass_kg ?? undefined,
    tempCoeff_Pmax: p.temperature_coefficient_pmax ?? undefined,
    tempCoeff_Voc: p.temperature_coefficient_voc ?? undefined,
    tempCoeff_Isc: p.temperature_coefficient_isc ?? undefined,
    noct_C: p.noct_celsius ?? undefined,

    compliance: {
      certificates: certs.map((c) => ({
        standard: c.standard_name,
        issuer: c.issuer,
        validUntil: c.expiry_date ?? undefined,
      })),
    },

    carbonFootprint: p.carbon_footprint_kg_co2e
      ? {
          declaredValue_kgCO2e: p.carbon_footprint_kg_co2e,
          functionalUnit_gCO2eq_per_kWh:
            p.carbon_intensity_g_co2e_per_kwh ?? undefined,
          boundary: (p.carbon_lca_boundary ?? "cradle_to_gate") as string,
          methodology: p.carbon_footprint_methodology ?? undefined,
          verificationRef: p.carbon_verification_ref ?? undefined,
        }
      : undefined,

    materialComposition: {
      moduleMaterials: mats.map((m) => ({
        materialName: m.material_name,
        componentType: m.component_type ?? "other",
        mass_g: m.mass_g ?? undefined,
        massPercent: m.mass_percent ?? undefined,
        isCriticalRawMaterial: m.is_critical_raw_material,
        recyclabilityHint: m.recyclability_hint ?? undefined,
        recycledContentPercent: m.recycled_content_percent ?? undefined,
        originCountry: m.origin_country ?? undefined,
        supplierId: m.supplier_id ?? undefined,
      })),
      reachStatus: p.reach_status ?? undefined,
      rohsStatus: p.rohs_status ?? undefined,
    },

    warranty: {
      productWarranty_years: p.product_warranty_years ?? undefined,
      performanceWarranty: p.performance_warranty_years
        ? `${p.performance_warranty_years} years at ${p.performance_warranty_percent}% rated power`
        : undefined,
      linearDegradation_percent_per_year:
        p.linear_degradation_percent_per_year ?? undefined,
      expectedLifetime_years: p.expected_lifetime_years ?? undefined,
    },

    endOfLife: {
      status: circ?.end_of_life_status ?? "in_use",
      collectionScheme: circ?.collection_scheme ?? undefined,
      recyclerPartner: circ?.recycler_name ?? undefined,
    },
  };
}
