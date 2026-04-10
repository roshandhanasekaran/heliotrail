"use server";

import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

/* ── Payload types (mirror the wizard FormData) ── */

interface BomItem {
  materialName: string;
  componentType: string;
  massGrams: number;
  massPercent: number;
  casNumber: string;
  isCriticalRaw: boolean;
  isSubstanceOfConcern: boolean;
}

interface Certificate {
  standard: string;
  certificateNumber: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string;
  status: string;
  documentUrl: string;
  scopeNotes: string;
}

interface DocEntry {
  name: string;
  documentType: string;
  accessLevel: string;
  url: string;
  issuer: string;
  issuedDate: string;
}

interface SupplyChainActor {
  actorName: string;
  actorRole: string;
  country: string;
  facilityName: string;
  tierLevel: string;
  uflpaCompliant: boolean;
}

export interface CreatePassportPayload {
  // Identity
  modelId: string;
  serialNumber: string;
  batchId: string;
  gtin: string;
  manufacturer: string;
  facility: string;
  facilityName: string;
  facilityCountry: string;
  manufacturingDate: string;
  technology: string;
  // Manufacturer details
  manufacturerOperatorId: string;
  manufacturerCountry: string;
  manufacturerAddress: string;
  manufacturerContactUrl: string;
  // Importer
  importerName: string;
  importerOperatorId: string;
  importerCountry: string;
  // Specs
  ratedPower: string;
  efficiency: string;
  voc: string;
  isc: string;
  vmp: string;
  imp: string;
  maxSystemVoltage: string;
  length: string;
  width: string;
  depth: string;
  mass: string;
  cellCount: string;
  cellType: string;
  tempCoeffPmax: string;
  tempCoeffVoc: string;
  tempCoeffIsc: string;
  noct: string;
  fireRating: string;
  ipRating: string;
  connectorType: string;
  frameType: string;
  glassType: string;
  bifacialityFactor: string;
  warrantyYears: string;
  performanceWarranty: string;
  degradationRate: string;
  expectedLifetime: string;
  // Carbon & Environmental
  carbonFootprint: string;
  carbonIntensity: string;
  carbonLcaBoundary: string;
  carbonMethodology: string;
  carbonVerificationRef: string;
  reachStatus: string;
  rohsStatus: string;
  // Circularity
  recyclabilityRate: string;
  recycledContent: string;
  renewableContent: string;
  isHazardous: boolean;
  hazardousNotes: string;
  dismantlingTime: string;
  dismantlingInstructions: string;
  collectionScheme: string;
  recyclerName: string;
  recyclerContact: string;
  recoveryAluminium: boolean;
  recoveryGlass: boolean;
  recoverySilicon: boolean;
  recoveryCopper: boolean;
  recoverySilver: boolean;
  recoveryNotes: string;
  eolStatus: string;
  // Arrays
  bom: BomItem[];
  certificates: Certificate[];
  documents: DocEntry[];
  supplyChainActors: SupplyChainActor[];
}

type Result =
  | { success: true; passportId: string; pvPassportId: string }
  | { success: false; error: string };

/* ── Helpers ── */

function strOrNull(v: string): string | null {
  return v.trim() || null;
}

function floatOrNull(v: string): number | null {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function intOrNull(v: string): number | null {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function generatePvPassportId(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PVP-${year}-${rand}`;
}

/* ── Server Action ── */

export async function createPassport(
  payload: CreatePassportPayload,
): Promise<Result> {
  // Basic validation
  if (!payload.modelId) return { success: false, error: "Module model is required." };
  if (!payload.manufacturer) return { success: false, error: "Manufacturer is required." };
  if (!payload.technology) return { success: false, error: "Technology is required." };
  if (!payload.ratedPower) return { success: false, error: "Rated power is required." };

  const supabase = await createClient();

  const pvPassportId = generatePvPassportId();
  const publicId = crypto.randomUUID();

  // 1. Insert the main passport record
  const { data: passport, error: passportError } = await supabase
    .from("passports")
    .insert({
      pv_passport_id: pvPassportId,
      public_id: publicId,
      model_id: payload.modelId,
      serial_number: strOrNull(payload.serialNumber),
      batch_id: strOrNull(payload.batchId),
      gtin: strOrNull(payload.gtin),
      module_technology: payload.technology,
      status: "draft",
      verification_status: "pending",
      passport_version: 1,
      // Manufacturer
      manufacturer_name: payload.manufacturer,
      manufacturer_operator_id: strOrNull(payload.manufacturerOperatorId),
      manufacturer_address: strOrNull(payload.manufacturerAddress),
      manufacturer_contact_url: strOrNull(payload.manufacturerContactUrl),
      manufacturer_country: strOrNull(payload.manufacturerCountry),
      // Facility
      facility_id: strOrNull(payload.facility),
      facility_name: strOrNull(payload.facilityName),
      facility_country: strOrNull(payload.facilityCountry),
      manufacturing_date: strOrNull(payload.manufacturingDate),
      // Specs
      rated_power_stc_w: floatOrNull(payload.ratedPower),
      module_efficiency_percent: floatOrNull(payload.efficiency),
      voc_v: floatOrNull(payload.voc),
      isc_a: floatOrNull(payload.isc),
      vmp_v: floatOrNull(payload.vmp),
      imp_a: floatOrNull(payload.imp),
      max_system_voltage_v: intOrNull(payload.maxSystemVoltage),
      module_length_mm: intOrNull(payload.length),
      module_width_mm: intOrNull(payload.width),
      module_depth_mm: intOrNull(payload.depth),
      module_mass_kg: floatOrNull(payload.mass),
      cell_count: intOrNull(payload.cellCount),
      cell_type: strOrNull(payload.cellType),
      temperature_coefficient_pmax: floatOrNull(payload.tempCoeffPmax),
      temperature_coefficient_voc: floatOrNull(payload.tempCoeffVoc),
      temperature_coefficient_isc: floatOrNull(payload.tempCoeffIsc),
      noct_celsius: floatOrNull(payload.noct),
      fire_rating: strOrNull(payload.fireRating),
      ip_rating: strOrNull(payload.ipRating),
      connector_type: strOrNull(payload.connectorType),
      frame_type: strOrNull(payload.frameType),
      glass_type: strOrNull(payload.glassType),
      bifaciality_factor: floatOrNull(payload.bifacialityFactor),
      // Warranty
      product_warranty_years: intOrNull(payload.warrantyYears),
      performance_warranty_percent: floatOrNull(payload.performanceWarranty),
      linear_degradation_percent_per_year: floatOrNull(payload.degradationRate),
      expected_lifetime_years: intOrNull(payload.expectedLifetime),
      // Carbon
      carbon_footprint_kg_co2e: floatOrNull(payload.carbonFootprint),
      carbon_footprint_methodology: strOrNull(payload.carbonMethodology),
      carbon_intensity_g_co2e_per_kwh: floatOrNull(payload.carbonIntensity),
      carbon_lca_boundary: strOrNull(payload.carbonLcaBoundary),
      carbon_verification_ref: strOrNull(payload.carbonVerificationRef),
      // Importer
      importer_name: strOrNull(payload.importerName),
      importer_operator_id: strOrNull(payload.importerOperatorId),
      importer_country: strOrNull(payload.importerCountry),
      // Compliance
      reach_status: strOrNull(payload.reachStatus),
      rohs_status: strOrNull(payload.rohsStatus),
    })
    .select("id")
    .single();

  if (passportError) {
    return { success: false, error: passportError.message };
  }

  const passportId = passport.id;

  // 2. Insert all child records in parallel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childInserts: PromiseLike<{ error: any }>[] = [];

  // Materials (BOM)
  if (payload.bom.length > 0) {
    childInserts.push(
      supabase.from("passport_materials").insert(
        payload.bom.map((item, i) => ({
          passport_id: passportId,
          material_name: item.materialName,
          component_type: strOrNull(item.componentType),
          mass_g: item.massGrams,
          mass_percent: item.massPercent,
          cas_number: strOrNull(item.casNumber),
          is_critical_raw_material: item.isCriticalRaw,
          is_substance_of_concern: item.isSubstanceOfConcern,
          sort_order: i,
        })),
      ),
    );
  }

  // Certificates
  if (payload.certificates.length > 0) {
    childInserts.push(
      supabase.from("passport_certificates").insert(
        payload.certificates.map((cert) => ({
          passport_id: passportId,
          standard_name: cert.standard,
          certificate_number: strOrNull(cert.certificateNumber),
          issuer: cert.issuer,
          issued_date: strOrNull(cert.issuedDate),
          expiry_date: strOrNull(cert.expiryDate),
          status: cert.status || "valid",
          document_url: strOrNull(cert.documentUrl),
          scope_notes: strOrNull(cert.scopeNotes),
        })),
      ),
    );
  }

  // Documents
  if (payload.documents.length > 0) {
    childInserts.push(
      supabase.from("passport_documents").insert(
        payload.documents.map((doc) => ({
          passport_id: passportId,
          name: doc.name,
          document_type: doc.documentType,
          access_level: doc.accessLevel || "public",
          url: strOrNull(doc.url),
          issuer: strOrNull(doc.issuer),
          issued_date: strOrNull(doc.issuedDate),
        })),
      ),
    );
  }

  // Circularity (1:1)
  childInserts.push(
    supabase.from("passport_circularity").insert({
      passport_id: passportId,
      recyclability_rate_percent: floatOrNull(payload.recyclabilityRate),
      recycled_content_percent: floatOrNull(payload.recycledContent),
      renewable_content_percent: floatOrNull(payload.renewableContent),
      is_hazardous: payload.isHazardous,
      hazardous_substances_notes: strOrNull(payload.hazardousNotes),
      dismantling_time_minutes: intOrNull(payload.dismantlingTime),
      dismantling_instructions: strOrNull(payload.dismantlingInstructions),
      collection_scheme: strOrNull(payload.collectionScheme),
      recycler_name: strOrNull(payload.recyclerName),
      recycler_contact: strOrNull(payload.recyclerContact),
      recovery_aluminium: payload.recoveryAluminium,
      recovery_glass: payload.recoveryGlass,
      recovery_silicon: payload.recoverySilicon,
      recovery_copper: payload.recoveryCopper,
      recovery_silver: payload.recoverySilver,
      recovery_notes: strOrNull(payload.recoveryNotes),
      end_of_life_status: payload.eolStatus || "in_use",
    }),
  );

  // Supply Chain Actors
  if (payload.supplyChainActors.length > 0) {
    childInserts.push(
      supabase.from("passport_supply_chain_actors").insert(
        payload.supplyChainActors.map((actor, i) => ({
          passport_id: passportId,
          actor_name: actor.actorName,
          actor_role: actor.actorRole,
          country: strOrNull(actor.country),
          facility_name: strOrNull(actor.facilityName),
          tier_level: intOrNull(actor.tierLevel),
          uflpa_compliant: actor.uflpaCompliant,
          sort_order: i,
        })),
      ),
    );
  }

  const results = await Promise.all(childInserts);
  const failedInsert = results.find((r) => r.error);

  if (failedInsert?.error) {
    // Clean up: delete the parent passport (CASCADE removes any children)
    await supabase.from("passports").delete().eq("id", passportId);
    return { success: false, error: failedInsert.error.message };
  }

  return { success: true, passportId, pvPassportId };
}
