import { createClient } from "@/lib/supabase/server";
import type {
  Passport,
  PassportMaterial,
  PassportCertificate,
  PassportDocument,
  PassportCircularity,
  PassportSupplyChainActor,
  PassportChainOfCustody,
  PassportSubstanceOfConcern,
} from "@/types/passport";
import type { DPPPayload } from "@/types/dpp";

/**
 * Fetch all passport data from Supabase and assemble into the
 * ESPR-aligned DPP JSON structure.
 */
export async function assemblePassportDPP(
  passportId: string
): Promise<DPPPayload> {
  const supabase = await createClient();

  const [
    { data: passport },
    { data: materials },
    { data: certificates },
    { data: documents },
    { data: circularity },
    { data: supplyChainActors },
    { data: cocEvents },
    { data: substancesOfConcern },
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
      .from("passport_documents")
      .select("*")
      .eq("passport_id", passportId),
    supabase
      .from("passport_circularity")
      .select("*")
      .eq("passport_id", passportId)
      .single(),
    supabase
      .from("passport_supply_chain_actors")
      .select("*")
      .eq("passport_id", passportId)
      .order("tier_level"),
    supabase
      .from("passport_chain_of_custody")
      .select("*")
      .eq("passport_id", passportId)
      .order("event_timestamp"),
    supabase
      .from("passport_substances_of_concern")
      .select("*")
      .eq("passport_id", passportId),
  ]);

  if (!passport) throw new Error(`Passport ${passportId} not found`);

  const p = passport as Passport;
  const mats = (materials ?? []) as PassportMaterial[];
  const certs = (certificates ?? []) as PassportCertificate[];
  const docs = (documents ?? []) as PassportDocument[];
  const circ = circularity as PassportCircularity | null;
  const scActors = (supplyChainActors ?? []) as PassportSupplyChainActor[];
  const coc = (cocEvents ?? []) as PassportChainOfCustody[];
  const socs = (substancesOfConcern ?? []) as PassportSubstanceOfConcern[];

  return {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),

    identity: {
      pvPassportId: p.pv_passport_id,
      moduleIdentifier: p.model_id,
      serialNumber: p.serial_number,
      batchId: p.batch_id,
      modelId: p.model_id,
      gtin: p.gtin,
      passportVersion: p.passport_version,
      passportStatus: p.status,
    },

    manufacturer: {
      name: p.manufacturer_name,
      operatorIdentifier: p.manufacturer_operator_id,
      address: p.manufacturer_address,
      contactUrl: p.manufacturer_contact_url,
      country: p.manufacturer_country,
    },

    ...(p.importer_name
      ? {
          importer: {
            name: p.importer_name,
            operatorIdentifier: p.importer_operator_id ?? "",
            country: p.importer_country ?? "",
          },
        }
      : {}),

    manufacturingFacility: {
      facilityIdentifier: p.facility_id,
      name: p.facility_name,
      location: p.facility_location,
    },

    manufacturingDate: p.manufacturing_date,

    technicalData: {
      moduleTechnology: p.module_technology,
      ratedPowerSTC_W: p.rated_power_stc_w,
      moduleEfficiency_percent: p.module_efficiency_percent,
      voc_V: p.voc_v,
      isc_A: p.isc_a,
      vmp_V: p.vmp_v,
      imp_A: p.imp_a,
      maxSystemVoltage_V: p.max_system_voltage_v,
      moduleDimensions_mm: {
        length: p.module_length_mm,
        width: p.module_width_mm,
        depth: p.module_depth_mm,
      },
      moduleMass_kg: p.module_mass_kg,
      cellCount: p.cell_count,
      cellType: p.cell_type,
      temperatureCoefficients: {
        pmax: p.temperature_coefficient_pmax,
        voc: p.temperature_coefficient_voc,
        isc: p.temperature_coefficient_isc,
      },
      noct_celsius: p.noct_celsius,
      fireRating: p.fire_rating,
      ipRating: p.ip_rating,
      connectorType: p.connector_type,
      frameType: p.frame_type,
      glassType: p.glass_type,
      bifacialityFactor: p.bifaciality_factor,
    },

    compliance: {
      certificates: certs.map((c) => ({
        standardName: c.standard_name,
        certificateNumber: c.certificate_number,
        issuer: c.issuer,
        issuedDate: c.issued_date,
        expiryDate: c.expiry_date,
        status: c.status,
        documentUrl: c.document_url,
        documentHash: c.document_hash,
        hashAlgorithm: c.hash_algorithm,
        scopeNotes: c.scope_notes,
      })),
      documents: docs.map((d) => ({
        name: d.name,
        documentType: d.document_type,
        accessLevel: d.access_level,
        url: d.url,
        fileSizeBytes: d.file_size_bytes,
        mimeType: d.mime_type,
        documentHash: d.document_hash,
        hashAlgorithm: d.hash_algorithm,
        issuer: d.issuer,
        issuedDate: d.issued_date,
        description: d.description,
      })),
    },

    materialComposition: {
      moduleMaterials: mats.map((m) => ({
        materialName: m.material_name,
        componentType: m.component_type,
        mass_g: m.mass_g,
        massPercent: m.mass_percent,
        casNumber: m.cas_number,
        isCriticalRawMaterial: m.is_critical_raw_material,
        isSubstanceOfConcern: m.is_substance_of_concern,
        concentration_percent: m.concentration_percent,
        regulatoryBasis: m.regulatory_basis,
        recyclabilityHint: m.recyclability_hint,
        recycledContentPercent: m.recycled_content_percent,
        originCountry: m.origin_country,
        supplierId: m.supplier_id,
      })),
      substancesOfConcern: socs.length
        ? socs.map((s) => ({
            substanceName: s.substance_name,
            casNumber: s.cas_number ?? undefined,
            concentrationPercent: s.concentration_percent ?? undefined,
            locationInModule: s.location_in_module ?? undefined,
            regulatoryBasis: s.regulatory_basis ?? undefined,
            exemption: s.exemption ?? undefined,
            notes: s.notes ?? undefined,
          }))
        : undefined,
      reachStatus: p.reach_status ?? undefined,
      rohsStatus: p.rohs_status ?? undefined,
    },

    circularity: {
      recyclabilityRate_percent: circ?.recyclability_rate_percent ?? null,
      recycledContent_percent: circ?.recycled_content_percent ?? null,
      renewableContent_percent: circ?.renewable_content_percent ?? null,
      isHazardous: circ?.is_hazardous ?? false,
      hazardousSubstancesNotes: circ?.hazardous_substances_notes ?? null,
      dismantlingTime_minutes: circ?.dismantling_time_minutes ?? null,
      dismantlingInstructions: circ?.dismantling_instructions ?? null,
      collectionScheme: circ?.collection_scheme ?? null,
      recycler: {
        name: circ?.recycler_name ?? null,
        contact: circ?.recycler_contact ?? null,
      },
      recoveryOutcomes: {
        aluminium: circ?.recovery_aluminium ?? false,
        glass: circ?.recovery_glass ?? false,
        silicon: circ?.recovery_silicon ?? false,
        copper: circ?.recovery_copper ?? false,
        silver: circ?.recovery_silver ?? false,
        notes: circ?.recovery_notes ?? null,
      },
      endOfLifeStatus: circ?.end_of_life_status ?? "unknown",
    },

    carbon: {
      declaredValue_kgCO2e: p.carbon_footprint_kg_co2e,
      methodology: p.carbon_footprint_methodology,
      functionalUnit_gCO2eq_per_kWh: p.carbon_intensity_g_co2e_per_kwh,
      boundary: p.carbon_lca_boundary,
      verificationRef: p.carbon_verification_ref,
    },

    warranty: {
      productWarranty_years: p.product_warranty_years,
      performanceWarranty_years: p.performance_warranty_years,
      performanceWarranty_percent: p.performance_warranty_percent,
      linearDegradation_percent_per_year:
        p.linear_degradation_percent_per_year,
      expectedLifetime_years: p.expected_lifetime_years,
    },

    dataCarrierType: p.data_carrier_type ?? undefined,

    ...(scActors.length
      ? {
          supplyChain: {
            actors: scActors.map((a) => ({
              name: a.actor_name,
              role: a.actor_role,
              operatorId: a.operator_id ?? undefined,
              country: a.country ?? undefined,
              facilityName: a.facility_name ?? undefined,
              facilityLocation: a.facility_location ?? undefined,
              certifications: a.certifications ?? undefined,
              tierLevel: a.tier_level ?? undefined,
              stage: a.stage ?? undefined,
              uflpaCompliant: a.uflpa_compliant,
              auditDate: a.audit_date ?? undefined,
            })),
            chainOfCustodyEvents: coc.map((e) => ({
              eventType: e.event_type,
              fromActor: e.from_actor ?? undefined,
              toActor: e.to_actor ?? undefined,
              location: e.location ?? undefined,
              timestamp: e.event_timestamp ?? undefined,
              evidenceUrl: e.evidence_url ?? undefined,
              evidenceHash: e.evidence_hash ?? undefined,
              notes: e.notes ?? undefined,
            })),
          },
        }
      : {}),
  };
}
