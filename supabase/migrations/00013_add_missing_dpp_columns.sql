-- ============================================================
-- Add missing DPP columns to passports and passport_materials
-- Covers: data carrier, importer, authorized rep, extended
-- carbon fields, facility country, REACH/RoHS compliance
-- ============================================================

-- Passports table: data carrier, importer, authorized rep, extended carbon, compliance
ALTER TABLE passports ADD COLUMN IF NOT EXISTS data_carrier_type text DEFAULT 'qr_gs1_digital_link';
ALTER TABLE passports ADD COLUMN IF NOT EXISTS importer_name text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS importer_operator_id text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS importer_country text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS authorized_rep_name text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS authorized_rep_operator_id text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS carbon_intensity_g_co2e_per_kwh numeric(8,2);
ALTER TABLE passports ADD COLUMN IF NOT EXISTS carbon_lca_boundary text DEFAULT 'cradle_to_gate';
ALTER TABLE passports ADD COLUMN IF NOT EXISTS carbon_verification_ref text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS facility_country text;
ALTER TABLE passports ADD COLUMN IF NOT EXISTS reach_status text DEFAULT 'compliant';
ALTER TABLE passports ADD COLUMN IF NOT EXISTS rohs_status text DEFAULT 'compliant_with_exemption';

-- Passport materials: per-material traceability columns
ALTER TABLE passport_materials ADD COLUMN IF NOT EXISTS recycled_content_percent numeric(5,2);
ALTER TABLE passport_materials ADD COLUMN IF NOT EXISTS origin_country text;
ALTER TABLE passport_materials ADD COLUMN IF NOT EXISTS supplier_id text;
