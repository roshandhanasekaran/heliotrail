export type PassportStatus =
  | "draft"
  | "under_review"
  | "approved"
  | "published"
  | "superseded"
  | "archived"
  | "decommissioned";

export type VerificationStatus =
  | "verified"
  | "pending"
  | "unverifiable"
  | "outdated";

export type ModuleTechnology =
  | "crystalline_silicon_topcon"
  | "crystalline_silicon_perc"
  | "crystalline_silicon_hjt"
  | "thin_film_cdte"
  | "thin_film_cigs"
  | "other";

export type CertificateStatus = "valid" | "expired" | "revoked" | "pending";

export type DocumentType =
  | "declaration_of_conformity"
  | "test_report"
  | "user_manual"
  | "installation_instructions"
  | "safety_instructions"
  | "datasheet"
  | "epd"
  | "due_diligence_report"
  | "recycling_guide"
  | "other";

export type DocumentAccessLevel =
  | "public"
  | "restricted"
  | "recycler"
  | "authority"
  | "internal";

export interface Passport {
  id: string;
  pv_passport_id: string;
  public_id: string;
  model_id: string;
  serial_number: string | null;
  batch_id: string | null;
  gtin: string | null;
  module_technology: ModuleTechnology;
  status: PassportStatus;
  verification_status: VerificationStatus;

  manufacturer_name: string;
  manufacturer_operator_id: string | null;
  manufacturer_address: string | null;
  manufacturer_contact_url: string | null;
  manufacturer_country: string | null;

  facility_id: string | null;
  facility_name: string | null;
  facility_location: string | null;
  manufacturing_date: string | null;

  rated_power_stc_w: number | null;
  module_efficiency_percent: number | null;
  voc_v: number | null;
  isc_a: number | null;
  vmp_v: number | null;
  imp_a: number | null;
  max_system_voltage_v: number | null;
  module_length_mm: number | null;
  module_width_mm: number | null;
  module_depth_mm: number | null;
  module_mass_kg: number | null;
  cell_count: number | null;
  cell_type: string | null;

  product_warranty_years: number | null;
  performance_warranty_years: number | null;
  performance_warranty_percent: number | null;
  linear_degradation_percent_per_year: number | null;
  expected_lifetime_years: number | null;

  carbon_footprint_kg_co2e: number | null;
  carbon_footprint_methodology: string | null;

  temperature_coefficient_pmax: number | null;
  temperature_coefficient_voc: number | null;
  temperature_coefficient_isc: number | null;
  noct_celsius: number | null;
  fire_rating: string | null;
  ip_rating: string | null;
  connector_type: string | null;
  frame_type: string | null;
  glass_type: string | null;
  bifaciality_factor: number | null;

  passport_version: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PassportMaterial {
  id: string;
  passport_id: string;
  material_name: string;
  component_type: string | null;
  mass_g: number | null;
  mass_percent: number | null;
  cas_number: string | null;
  is_critical_raw_material: boolean;
  is_substance_of_concern: boolean;
  concentration_percent: number | null;
  regulatory_basis: string | null;
  recyclability_hint: string | null;
  sort_order: number;
  created_at: string;
}

export interface PassportCertificate {
  id: string;
  passport_id: string;
  standard_name: string;
  certificate_number: string | null;
  issuer: string;
  issued_date: string | null;
  expiry_date: string | null;
  status: CertificateStatus;
  document_url: string | null;
  document_hash: string | null;
  hash_algorithm: string | null;
  scope_notes: string | null;
  created_at: string;
}

export interface PassportDocument {
  id: string;
  passport_id: string;
  name: string;
  document_type: DocumentType;
  access_level: DocumentAccessLevel;
  url: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  document_hash: string | null;
  hash_algorithm: string | null;
  issuer: string | null;
  issued_date: string | null;
  description: string | null;
  created_at: string;
}

export interface PassportCircularity {
  id: string;
  passport_id: string;
  recyclability_rate_percent: number | null;
  recycled_content_percent: number | null;
  renewable_content_percent: number | null;
  is_hazardous: boolean;
  hazardous_substances_notes: string | null;
  dismantling_time_minutes: number | null;
  dismantling_instructions: string | null;
  collection_scheme: string | null;
  recycler_name: string | null;
  recycler_contact: string | null;
  recovery_aluminium: boolean;
  recovery_glass: boolean;
  recovery_silicon: boolean;
  recovery_copper: boolean;
  recovery_silver: boolean;
  recovery_notes: string | null;
  end_of_life_status: string;
  created_at: string;
  updated_at: string;
}
