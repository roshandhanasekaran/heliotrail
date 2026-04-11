-- ============================================================
-- Migration 00020: Seed 20 Waaree Energies-specific passports
--
-- Adds 20 passports spanning 5 real Waaree product series:
--   Elite TOPCon (BiN-08, BiN-03, BiN-17, BiN-02, BiN-21R) — 8
--   Arka PERC (WSMD)                                        — 5
--   Ahnay PERC Bifacial (Bi-55)                             — 3
--   Plexus HJT (BIH-11)                                    — 3
--   Aditya Polycrystalline (WS)                             — 1
--
-- All specs sourced from Waaree Energies Ltd. public datasheets.
-- This migration is ADDITIVE — no TRUNCATE.
-- ============================================================

DO $$
DECLARE
  _f_chennai uuid;
  _f_dubai uuid;
  _f_surat uuid;
  _f_munich uuid;
  _f_saopaulo uuid;
  _f_amsterdam uuid;
  _f_lisbon uuid;
  _pid uuid;
BEGIN

-- ═══════════════════════════════════════════════════════════
-- Look up fleet IDs by slug (seeded in migration 00019)
-- ═══════════════════════════════════════════════════════════
SELECT id INTO _f_chennai   FROM fleets WHERE slug = 'chennai-solar-park';
SELECT id INTO _f_dubai     FROM fleets WHERE slug = 'dubai-innovation-campus';
SELECT id INTO _f_surat     FROM fleets WHERE slug = 'surat-technology-park';
SELECT id INTO _f_munich    FROM fleets WHERE slug = 'munich-rooftop';
SELECT id INTO _f_saopaulo  FROM fleets WHERE slug = 'sao-paulo-industrial';
SELECT id INTO _f_amsterdam FROM fleets WHERE slug = 'amsterdam-circular-hub';
SELECT id INTO _f_lisbon    FROM fleets WHERE slug = 'lisbon-green-logistics';

IF _f_chennai IS NULL THEN
  RAISE EXCEPTION 'Fleets not found — run migration 00019 first';
END IF;


-- ═══════════════════════════════════════════════════════════
-- ELITE SERIES — N-Type TOPCon Bifacial (8 passports)
-- ═══════════════════════════════════════════════════════════

-- ── Passport 0009: WRM-590-TOPCON-BiN-08 (590W, 144-cell M10) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0009', 'wrm-590-topcon-2026-009', 'WRM-590-TOPCON-BiN-08',
  'WRM-2026-TOPCON-590-009', 'WRM-B-2026-Q1-BiN08-590', '08901234560009',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ GigaFactory', 'Surat, Gujarat, India', '2026-01-15', 'India',
  590.00, 22.84, 52.90, 14.05, 44.29, 13.32,
  1500, 2278, 1134, 35, 32.50,
  144, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  395.00, 'ISO 14067:2018',
  21.8, 'cradle_to_gate', 'EPD-WRM-2026-BiN08',
  -0.30, -0.26, 0.046, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_chennai, 1, '2026-02-05T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 20800, 64.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4200, 12.92, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 2800, 8.62, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2100, 6.46, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 650, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 16, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-590-009', 'TUV Rheinland', '2025-08-01', '2030-08-01', 'valid', 'Design qualification and type approval for TOPCon N-Type modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-590-009', 'TUV Rheinland', '2025-08-01', '2030-08-01', 'valid', 'PV module safety qualification — Class A fire rating'),
  (_pid, 'BIS IS 14286', 'CERT-WRM-BIS-590-009', 'BIS India', '2025-09-01', '2028-09-01', 'valid', 'Bureau of Indian Standards certification');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-590-TOPCON-BiN-08 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-590-TOPCON-BiN-08.pdf', 2400000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-15', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-590-TOPCON-BiN-08-DoC.pdf', 520000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-15', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 91.00, 26.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight). Below SVHC threshold but classified as hazardous for WEEE purposes.', 30,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination at 300-350C (8 min)\n4) Cell and metal recovery (10 min)\n5) Material sorting (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Aluminium frame >99%, glass >95%, silicon recovery for solar-grade reuse, copper smelting, silver extraction',
   'in_use');


-- ── Passport 0010: WRM-580-TOPCON-BiN-08 (580W, 144-cell M10) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0010', 'wrm-580-topcon-2026-010', 'WRM-580-TOPCON-BiN-08',
  'WRM-2026-TOPCON-580-010', 'WRM-B-2026-Q1-BiN08-580', '08901234560010',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Navsari, Gujarat, India', '2026-01-22', 'India',
  580.00, 22.45, 52.50, 13.93, 44.00, 13.18,
  1500, 2278, 1134, 35, 32.00,
  144, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  390.00, 'ISO 14067:2018',
  21.5, 'cradle_to_gate', 'EPD-WRM-2026-BiN08',
  -0.30, -0.26, 0.046, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_chennai, 1, '2026-02-12T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 20480, 64.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4130, 12.91, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 2750, 8.59, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2070, 6.47, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 640, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 15, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-580-010', 'TUV Rheinland', '2025-07-15', '2030-07-15', 'valid', 'Design qualification and type approval for TOPCon N-Type modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-580-010', 'TUV Rheinland', '2025-07-15', '2030-07-15', 'valid', 'PV module safety qualification — Class A fire rating'),
  (_pid, 'BIS IS 14286', 'CERT-WRM-BIS-580-010', 'BIS India', '2025-08-15', '2028-08-15', 'valid', 'Bureau of Indian Standards certification');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-580-TOPCON-BiN-08 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-580-TOPCON-BiN-08.pdf', 2350000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-22', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-580-TOPCON-BiN-08-DoC.pdf', 510000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-22', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 91.00, 25.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 28,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination at 300-350C (8 min)\n4) Cell and metal recovery (8 min)\n5) Material sorting (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Aluminium frame >99%, glass >95%, silicon recovery for solar-grade reuse, copper smelting, silver extraction',
   'in_use');


-- ── Passport 0011: WRM-700-TOPCON-BiN-03 (700W, 132-cell G12) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0011', 'wrm-700-topcon-2026-011', 'WRM-700-TOPCON-BiN-03',
  'WRM-2026-TOPCON-700-011', 'WRM-B-2026-Q1-BiN03-700', '08901234560011',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ GigaFactory', 'Surat, Gujarat, India', '2026-01-28', 'India',
  700.00, 22.53, 54.80, 18.30, 46.10, 17.40,
  1500, 2384, 1303, 33, 38.50,
  132, 'G12 (210mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  410.00, 'ISO 14067:2018',
  20.2, 'cradle_to_gate', 'EPD-WRM-2026-BiN03',
  -0.30, -0.25, 0.045, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron ARC semi-tempered (dual glass)', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_chennai, 1, '2026-02-18T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 21000, 54.55, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4800, 12.47, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3300, 8.57, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2500, 6.49, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 780, 2.03, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 20, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-700-011', 'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Design qualification for TOPCon G12 bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-700-011', 'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification — Class A fire rating'),
  (_pid, 'IEC 61701:2020', 'CERT-WRM-61701-700-011', 'TUV Rheinland', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing — severity level 6');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-700-TOPCON-BiN-03 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-700-TOPCON-BiN-03.pdf', 2800000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-28', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-700-TOPCON-BiN-03-DoC.pdf', 540000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-28', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 92.00, 28.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 35,
   E'1) Remove junction box and cables (3 min)\n2) Unbolt aluminium frame (5 min)\n3) Separate dual glass panels via thermal delamination at 350C (10 min)\n4) Remove encapsulant from cells (7 min)\n5) Recover silicon cells and copper ribbons (5 min)\n6) Sort materials (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Aluminium frame: direct smelting (99%). Glass: cullet for flat glass (95%). Silicon: chemical purification for solar reuse (85%). Copper: smelting (98%). Silver: chemical extraction (90%).',
   'in_use');


-- ── Passport 0012: WRM-685-TOPCON-BiN-03 (685W, 132-cell G12) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0012', 'wrm-685-topcon-2026-012', 'WRM-685-TOPCON-BiN-03',
  'WRM-2026-TOPCON-685-012', 'WRM-B-2026-Q1-BiN03-685', '08901234560012',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-TMB-003', 'Waaree Tumb Manufacturing Plant', 'Tumb, Umbergaon, Gujarat, India', '2026-02-03', 'India',
  685.00, 22.05, 53.90, 18.10, 45.30, 17.20,
  1500, 2384, 1303, 33, 37.80,
  132, 'G12 (210mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  405.00, 'ISO 14067:2018',
  20.8, 'cradle_to_gate', 'EPD-WRM-2026-BiN03',
  -0.30, -0.25, 0.045, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron ARC semi-tempered (dual glass)', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_dubai, 1, '2026-02-24T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 20600, 54.50, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4700, 12.43, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3250, 8.60, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2450, 6.48, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 760, 2.01, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 19, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-685-012', 'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Design qualification for TOPCon G12 bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-685-012', 'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification — Class A fire rating');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-685-TOPCON-BiN-03 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-685-TOPCON-BiN-03.pdf', 2700000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-03', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-685-TOPCON-BiN-03-DoC.pdf', 530000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-03', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 92.00, 27.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 34,
   E'1) Remove junction box and cables (3 min)\n2) Unbolt aluminium frame (5 min)\n3) Separate dual glass via thermal delamination at 350C (10 min)\n4) Remove encapsulant (7 min)\n5) Cell and metal recovery (5 min)\n6) Sort materials (4 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Standard TOPCon dual-glass recovery process. Aluminium >99%, glass >95%, silicon 85%, copper 98%, silver 90%.',
   'in_use');


-- ── Passport 0013: WRM-625-TOPCON-BiN-17 (625W, 156-cell M10) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0013', 'wrm-625-topcon-2026-013', 'WRM-625-TOPCON-BiN-17',
  'WRM-2026-TOPCON-625-013', 'WRM-B-2026-Q1-BiN17-625', '08901234560013',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-NDG-004', 'Waaree Nandigram Plant', 'Nandigram, Gujarat, India', '2026-02-10', 'India',
  625.00, 22.36, 53.40, 14.90, 44.60, 14.01,
  1500, 2465, 1134, 33, 35.00,
  156, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  400.00, 'ISO 14067:2018',
  21.2, 'cradle_to_gate', 'EPD-WRM-2026-BiN17',
  -0.30, -0.26, 0.046, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 33mm', '3.2mm Low Iron Tempered ARC', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_dubai, 1, '2026-03-03T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 22400, 64.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4500, 12.86, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3010, 8.60, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2275, 6.50, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 700, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 18, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-625-013', 'TUV Rheinland', '2025-10-01', '2030-10-01', 'valid', 'Design qualification for TOPCon 156-cell bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-625-013', 'TUV Rheinland', '2025-10-01', '2030-10-01', 'valid', 'PV module safety qualification — Class A fire rating'),
  (_pid, 'BIS IS 14286', 'CERT-WRM-BIS-625-013', 'BIS India', '2025-11-01', '2028-11-01', 'valid', 'Bureau of Indian Standards certification');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-625-TOPCON-BiN-17 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-625-TOPCON-BiN-17.pdf', 2500000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-10', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-625-TOPCON-BiN-17-DoC.pdf', 515000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-10', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 91.50, 25.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 30,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination at 300-350C (8 min)\n4) Cell and metal recovery (10 min)\n5) Material sorting (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Standard TOPCon single-glass recovery. Aluminium >99%, glass >95%, silicon 85%, copper 98%, silver 90%.',
   'in_use');


-- ── Passport 0014: WRM-645-TOPCON-BiN-17 (645W, 156-cell M10) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0014', 'wrm-645-topcon-2026-014', 'WRM-645-TOPCON-BiN-17',
  'WRM-2026-TOPCON-645-014', 'WRM-B-2026-Q1-BiN17-645', '08901234560014',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-NDG-004', 'Waaree Nandigram Plant', 'Nandigram, Gujarat, India', '2026-02-17', 'India',
  645.00, 22.70, 54.10, 15.10, 45.20, 14.27,
  1500, 2465, 1134, 33, 35.20,
  156, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  408.00, 'ISO 14067:2018',
  21.0, 'cradle_to_gate', 'EPD-WRM-2026-BiN17',
  -0.30, -0.26, 0.046, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 33mm', '3.2mm Low Iron Tempered ARC', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_dubai, 1, '2026-03-10T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 22530, 64.01, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4540, 12.90, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3030, 8.61, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2290, 6.51, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 705, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 18, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-645-014', 'TUV Rheinland', '2025-10-01', '2030-10-01', 'valid', 'Design qualification for TOPCon 156-cell bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-645-014', 'TUV Rheinland', '2025-10-01', '2030-10-01', 'valid', 'PV module safety qualification — Class A fire rating');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-645-TOPCON-BiN-17 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-645-TOPCON-BiN-17.pdf', 2550000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-17', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-645-TOPCON-BiN-17-DoC.pdf', 520000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-17', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 91.50, 25.50, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 31,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (9 min)\n4) Cell and metal recovery (10 min)\n5) Material sorting (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Standard TOPCon single-glass recovery process.',
   'in_use');


-- ── Passport 0015: WRM-635-TOPCON-BiN-02 (635W, 120-cell G12) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0015', 'wrm-635-topcon-2026-015', 'WRM-635-TOPCON-BiN-02',
  'WRM-2026-TOPCON-635-015', 'WRM-B-2026-Q1-BiN02-635', '08901234560015',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ GigaFactory', 'Surat, Gujarat, India', '2026-02-24', 'India',
  635.00, 22.42, 44.20, 18.25, 37.00, 17.16,
  1500, 2172, 1303, 35, 35.50,
  120, 'G12 (210mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  398.00, 'ISO 14067:2018',
  21.0, 'cradle_to_gate', 'EPD-WRM-2026-BiN02',
  -0.30, -0.25, 0.045, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_surat, 1, '2026-03-17T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 22720, 64.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4580, 12.90, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3050, 8.59, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2310, 6.51, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 710, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 18, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-635-015', 'TUV Rheinland', '2025-11-01', '2030-11-01', 'valid', 'Design qualification for TOPCon 120-cell G12 bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-635-015', 'TUV Rheinland', '2025-11-01', '2030-11-01', 'valid', 'PV module safety qualification — Class A fire rating'),
  (_pid, 'BIS IS 14286', 'CERT-WRM-BIS-635-015', 'BIS India', '2025-12-01', '2028-12-01', 'valid', 'Bureau of Indian Standards certification');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-635-TOPCON-BiN-02 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-635-TOPCON-BiN-02.pdf', 2600000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-24', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-635-TOPCON-BiN-02-DoC.pdf', 525000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-24', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 91.00, 24.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 29,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (8 min)\n4) Cell and metal recovery (9 min)\n5) Material sorting (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Standard TOPCon single-glass recovery process.',
   'in_use');


-- ── Passport 0016: WRM-620-TOPCON-BiN-21R (620W, 132-cell G12R) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0016', 'wrm-620-topcon-2026-016', 'WRM-620-TOPCON-BiN-21R',
  'WRM-2026-TOPCON-620-016', 'WRM-B-2026-Q1-BiN21R-620', '08901234560016',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SMK-005', 'Waaree Samakhiali Mega Plant', 'Samakhiali, Kutch, Gujarat, India', '2026-03-05', 'India',
  620.00, 22.80, 53.50, 14.80, 44.80, 13.84,
  1500, 2384, 1134, 33, 33.00,
  132, 'G12R (210R) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  388.00, 'ISO 14067:2018',
  20.8, 'cradle_to_gate', 'EPD-WRM-2026-BiN21R',
  -0.30, -0.25, 0.045, 43,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 33mm', '3.2mm Low Iron Tempered ARC', 0.80,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_surat, 1, '2026-03-26T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 21120, 64.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4260, 12.91, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 2840, 8.61, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type)', 'Solar cells', 2145, 6.50, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 660, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 17, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-620-016', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'Design qualification for TOPCon G12R Elite R bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-620-016', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'PV module safety qualification — Class A fire rating');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-620-TOPCON-BiN-21R Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-620-TOPCON-BiN-21R.pdf', 2650000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-05', 'Technical datasheet with electrical and mechanical specifications'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-620-TOPCON-BiN-21R-DoC.pdf', 518000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-05', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 91.50, 26.00, 0.00, true, 'Contains lead traces in solder alloy (<0.1% by weight).', 29,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (8 min)\n4) Cell and metal recovery (9 min)\n5) Material sorting (5 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Latest G12R TOPCon recovery process. Enhanced silver recovery.',
   'in_use');


-- ═══════════════════════════════════════════════════════════
-- ARKA SERIES — Mono PERC (5 passports)
-- ═══════════════════════════════════════════════════════════

-- ── Passport 0017: WRM-540-PERC-WSMD (540W, 144-cell) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0017', 'wrm-540-perc-2026-017', 'WRM-540-PERC-WSMD',
  'WRM-2026-PERC-540-017', 'WRM-B-2026-Q1-WSMD-540', '08901234560017',
  'crystalline_silicon_perc', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Navsari, Gujarat, India', '2026-01-20', 'India',
  540.00, 20.98, 49.61, 13.83, 40.67, 12.95,
  1500, 2278, 1134, 35, 28.50,
  144, 'M10 (182mm) P-Type Mono PERC',
  10, 25, 84.80,
  0.55, 30,
  420.00, 'ISO 14067:2018',
  24.2, 'cradle_to_gate', 'EPD-WRM-2026-WSMD',
  -0.34, -0.27, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_surat, 1, '2026-02-10T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 18530, 65.02, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3710, 13.02, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2420, 8.49, '24937-78-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1710, 6.00, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Backsheet (PVF/PET/PVF)', 'Rear protection', 1000, 3.51, null, false, false, 'Energy recovery via incineration', 4),
  (_pid, 'Copper Ribbon', 'Interconnects', 510, 1.79, '7440-50-8', true, false, 'Recoverable via copper smelting', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-540-017', 'TUV Rheinland', '2025-06-01', '2030-06-01', 'valid', 'Design qualification for PERC mono modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-540-017', 'TUV Rheinland', '2025-06-01', '2030-06-01', 'valid', 'PV module safety qualification — Class A fire rating');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-540-PERC-WSMD Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-540-PERC-WSMD.pdf', 2200000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-20', 'Technical datasheet — Arka Series PERC module'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-540-PERC-WSMD-DoC.pdf', 490000, 'application/pdf', 'Waaree Energies Ltd.', '2026-01-20', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 88.50, 6.00, 0.00, false, 'No hazardous substances above SVHC threshold.', 26,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (8 min)\n4) Backsheet removal (4 min)\n5) Cell and metal recovery (5 min)\n6) Material sorting (2 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, false,
   'PERC single-glass design. Backsheet requires separate removal step. Lower silver content than TOPCon.',
   'in_use');


-- ── Passport 0018: WRM-545-PERC-WSMD (545W, 144-cell) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0018', 'wrm-545-perc-2026-018', 'WRM-545-PERC-WSMD',
  'WRM-2026-PERC-545-018', 'WRM-B-2026-Q1-WSMD-545', '08901234560018',
  'crystalline_silicon_perc', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-TMB-003', 'Waaree Tumb Manufacturing Plant', 'Tumb, Umbergaon, Gujarat, India', '2026-02-01', 'India',
  545.00, 21.10, 49.80, 13.90, 40.85, 13.02,
  1500, 2278, 1134, 35, 28.70,
  144, 'M10 (182mm) P-Type Mono PERC',
  10, 25, 84.80,
  0.55, 30,
  418.00, 'ISO 14067:2018',
  23.9, 'cradle_to_gate', 'EPD-WRM-2026-WSMD',
  -0.34, -0.27, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_munich, 1, '2026-02-22T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 18660, 65.02, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3730, 13.00, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2440, 8.50, '24937-78-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1720, 5.99, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Backsheet (PVF/PET/PVF)', 'Rear protection', 1005, 3.50, null, false, false, 'Energy recovery via incineration', 4),
  (_pid, 'Copper Ribbon', 'Interconnects', 515, 1.79, '7440-50-8', true, false, 'Recoverable via copper smelting', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-545-018', 'TUV Rheinland', '2025-06-01', '2030-06-01', 'valid', 'Design qualification for PERC mono modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-545-018', 'TUV Rheinland', '2025-06-01', '2030-06-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-545-PERC-WSMD Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-545-PERC-WSMD.pdf', 2250000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-01', 'Technical datasheet — Arka Series PERC module'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-545-PERC-WSMD-DoC.pdf', 495000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-01', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 88.50, 6.20, 0.00, false, 'No hazardous substances above SVHC threshold.', 26,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (8 min)\n4) Backsheet removal (4 min)\n5) Cell and metal recovery (5 min)\n6) Material sorting (2 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, false,
   'PERC single-glass design with backsheet.',
   'in_use');


-- ── Passport 0019: WRM-590-PERC-WSMD-120 (590W, 120-cell) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0019', 'wrm-590-perc-2026-019', 'WRM-590-PERC-WSMD-120',
  'WRM-2026-PERC-590-019', 'WRM-B-2026-Q1-WSMD120-590', '08901234560019',
  'crystalline_silicon_perc', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Navsari, Gujarat, India', '2026-02-15', 'India',
  590.00, 20.35, 42.80, 17.50, 35.90, 16.43,
  1500, 2190, 1302, 35, 31.00,
  120, 'M10 (182mm) P-Type Mono PERC',
  10, 25, 84.80,
  0.55, 30,
  435.00, 'ISO 14067:2018',
  24.5, 'cradle_to_gate', 'EPD-WRM-2026-WSMD120',
  -0.34, -0.27, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_munich, 1, '2026-03-08T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 20150, 65.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4030, 13.00, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2640, 8.52, '24937-78-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1860, 6.00, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Backsheet (PVF/PET/PVF)', 'Rear protection', 1085, 3.50, null, false, false, 'Energy recovery via incineration', 4),
  (_pid, 'Copper Ribbon', 'Interconnects', 558, 1.80, '7440-50-8', true, false, 'Recoverable via copper smelting', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-590P-019', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'Design qualification for PERC 120-cell modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-590P-019', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-590-PERC-WSMD-120 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-590-PERC-WSMD-120.pdf', 2300000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-15', 'Technical datasheet — Arka Series 120-cell PERC module'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-590-PERC-WSMD-120-DoC.pdf', 505000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-15', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 88.00, 6.50, 0.00, false, 'No hazardous substances above SVHC threshold.', 27,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (8 min)\n4) Backsheet removal (5 min)\n5) Cell and metal recovery (5 min)\n6) Material sorting (2 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, false,
   'PERC single-glass design. 120-cell format.',
   'in_use');


-- ── Passport 0020: WRM-400-PERC-WSMD-RES (400W, 108-cell residential) ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0020', 'wrm-400-perc-2026-020', 'WRM-400-PERC-WSMD-RES',
  'WRM-2026-PERC-400-020', 'WRM-B-2026-Q1-WSMD-RES-400', '08901234560020',
  'crystalline_silicon_perc', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ GigaFactory', 'Surat, Gujarat, India', '2026-02-20', 'India',
  400.00, 20.50, 37.40, 13.60, 31.00, 12.90,
  1500, 1722, 1134, 30, 21.50,
  108, 'M10 (182mm) P-Type Mono PERC Half-cut',
  10, 25, 84.80,
  0.55, 30,
  340.00, 'ISO 14067:2018',
  22.8, 'cradle_to_gate', 'EPD-WRM-2026-WSMD-RES',
  -0.34, -0.27, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 30mm', '3.2mm Low Iron Tempered ARC', 0.00,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_saopaulo, 1, '2026-03-13T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 13980, 65.02, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 2800, 13.02, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 1830, 8.51, '24937-78-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1290, 6.00, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Backsheet (PVF/PET/PVF)', 'Rear protection', 755, 3.51, null, false, false, 'Energy recovery via incineration', 4),
  (_pid, 'Copper Ribbon', 'Interconnects', 387, 1.80, '7440-50-8', true, false, 'Recoverable via copper smelting', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-400-020', 'TUV Rheinland', '2025-05-01', '2030-05-01', 'valid', 'Design qualification for PERC residential modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-400-020', 'TUV Rheinland', '2025-05-01', '2030-05-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-400-PERC-WSMD-RES Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-400-PERC-WSMD-RES.pdf', 2100000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-20', 'Technical datasheet — Arka Series residential PERC module'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-400-PERC-WSMD-RES-DoC.pdf', 480000, 'application/pdf', 'Waaree Energies Ltd.', '2026-02-20', 'CE Declaration per Low Voltage Directive 2014/35/EU');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 88.00, 5.80, 0.00, false, 'No hazardous substances above SVHC threshold.', 22,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (4 min)\n3) Thermal delamination (7 min)\n4) Backsheet removal (3 min)\n5) Cell and metal recovery (4 min)\n6) Material sorting (2 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, false,
   'Compact residential module. Faster dismantling due to smaller size.',
   'in_use');


-- ── Passport 0021: WRM-550-PERC-WSMD (550W, 144-cell) — published/outdated ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0021', 'wrm-550-perc-2026-021', 'WRM-550-PERC-WSMD',
  'WRM-2026-PERC-550-021', 'WRM-B-2026-Q1-WSMD-550', '08901234560021',
  'crystalline_silicon_perc', 'published', 'outdated',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-NDG-004', 'Waaree Nandigram Plant', 'Nandigram, Gujarat, India', '2026-03-01', 'India',
  550.00, 21.30, 50.10, 13.95, 41.00, 13.10,
  1500, 2278, 1134, 35, 29.00,
  144, 'M10 (182mm) P-Type Mono PERC',
  10, 25, 84.80,
  0.55, 30,
  425.00, 'ISO 14067:2018',
  24.0, 'cradle_to_gate', 'EPD-WRM-2026-WSMD',
  -0.34, -0.27, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_saopaulo, 1, '2026-03-22T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 18850, 65.00, '65997-17-3', false, false, 'Fully recyclable', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3770, 13.00, '7429-90-5', false, false, 'Fully recyclable', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2465, 8.50, '24937-78-8', false, false, 'Thermal delamination', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1740, 6.00, '7440-21-3', true, false, 'Recoverable', 3),
  (_pid, 'Backsheet (PVF/PET/PVF)', 'Rear protection', 1015, 3.50, null, false, false, 'Energy recovery', 4),
  (_pid, 'Copper Ribbon', 'Interconnects', 522, 1.80, '7440-50-8', true, false, 'Recoverable', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-550-021', 'TUV Rheinland', '2025-06-01', '2030-06-01', 'valid', 'Design qualification for PERC mono modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-550-021', 'TUV Rheinland', '2025-06-01', '2030-06-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-550-PERC-WSMD Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-550-PERC-WSMD.pdf', 2280000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-01', 'Arka Series 550W PERC datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-550-PERC-WSMD-DoC.pdf', 500000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-01', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 88.50, 6.00, 0.00, false, 'No hazardous substances above SVHC threshold.', 27,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Thermal delamination (8 min)\n4) Backsheet removal (5 min)\n5) Cell and metal recovery (5 min)\n6) Material sorting (2 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, false,
   'PERC single-glass design with backsheet.',
   'in_use');


-- ═══════════════════════════════════════════════════════════
-- AHNAY SERIES — Mono PERC Bifacial (3 passports)
-- ═══════════════════════════════════════════════════════════

-- ── Passport 0022: WRM-535-PERC-Bi55 (535W, 144-cell bifacial) — published/outdated ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0022', 'wrm-535-percbi-2026-022', 'WRM-535-PERC-Bi55',
  'WRM-2026-PERC-Bi-535-022', 'WRM-B-2026-Q1-Bi55-535', '08901234560022',
  'crystalline_silicon_perc', 'published', 'outdated',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-TMB-003', 'Waaree Tumb Manufacturing Plant', 'Tumb, Umbergaon, Gujarat, India', '2026-03-05', 'India',
  535.00, 20.70, 49.30, 13.80, 40.30, 12.85,
  1500, 2278, 1134, 35, 30.50,
  144, 'M10 (182mm) P-Type Mono PERC Bifacial',
  10, 25, 84.80,
  0.55, 30,
  415.00, 'ISO 14067:2018',
  24.0, 'cradle_to_gate', 'EPD-WRM-2026-Bi55',
  -0.35, -0.28, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '2mm Tempered ARC (dual glass)', 0.70,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_saopaulo, 1, '2026-03-26T00:00:00Z'
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 18300, 60.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3660, 12.00, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2745, 9.00, '24937-78-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1890, 6.20, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 610, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 15, 0.05, '7440-22-4', true, false, 'High-value chemical extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-535Bi-022', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'Design qualification for PERC bifacial dual-glass modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-535Bi-022', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'PV module safety qualification — Class A'),
  (_pid, 'IEC 61701:2020', 'CERT-WRM-61701-535Bi-022', 'TUV Rheinland', '2025-08-01', '2030-08-01', 'valid', 'Salt mist corrosion testing — bifacial dual-glass construction');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-535-PERC-Bi55 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-535-PERC-Bi55.pdf', 2350000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-05', 'Ahnay Series PERC bifacial datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-535-PERC-Bi55-DoC.pdf', 510000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-05', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 90.00, 8.00, 0.00, false, 'No hazardous substances above SVHC threshold.', 32,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Separate dual glass via thermal delamination at 350C (10 min)\n4) Remove encapsulant (7 min)\n5) Cell and metal recovery (5 min)\n6) Sort materials (3 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Dual-glass bifacial design. Higher glass recovery volume. No backsheet waste.',
   'in_use');


-- ── Passport 0023: WRM-545-PERC-Bi55 (545W, 144-cell bifacial) — under_review ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version
) VALUES (
  'WRM-PVP-2026-0023', 'wrm-545-percbi-2026-023', 'WRM-545-PERC-Bi55',
  'WRM-2026-PERC-Bi-545-023', 'WRM-B-2026-Q2-Bi55-545', '08901234560023',
  'crystalline_silicon_perc', 'under_review', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SMK-005', 'Waaree Samakhiali Mega Plant', 'Samakhiali, Kutch, Gujarat, India', '2026-03-20', 'India',
  545.00, 21.10, 49.80, 13.92, 40.80, 13.00,
  1500, 2278, 1134, 35, 30.80,
  144, 'M10 (182mm) P-Type Mono PERC Bifacial',
  10, 25, 84.80,
  0.55, 30,
  418.00, 'ISO 14067:2018',
  23.8, 'cradle_to_gate', 'EPD-WRM-2026-Bi55',
  -0.35, -0.28, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '2mm Tempered ARC (dual glass)', 0.70,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_amsterdam, 1
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 18480, 60.00, '65997-17-3', false, false, 'Fully recyclable', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3700, 12.01, '7429-90-5', false, false, 'Fully recyclable', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2770, 8.99, '24937-78-8', false, false, 'Thermal delamination', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1910, 6.20, '7440-21-3', true, false, 'Recoverable', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 616, 2.00, '7440-50-8', true, false, 'Recoverable', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 15, 0.05, '7440-22-4', true, false, 'High-value recovery', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-545Bi-023', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'Design qualification for PERC bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-545Bi-023', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-545-PERC-Bi55 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-545-PERC-Bi55.pdf', 2380000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-20', 'Ahnay Series 545W PERC bifacial datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-545-PERC-Bi55-DoC.pdf', 505000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-20', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 90.00, 8.50, 0.00, false, 'No hazardous substances above SVHC threshold.', 33,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Separate dual glass at 350C (10 min)\n4) Remove encapsulant (8 min)\n5) Cell and metal recovery (5 min)\n6) Sort materials (3 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Dual-glass bifacial PERC. Higher glass recovery volume.',
   'in_use');


-- ── Passport 0024: WRM-520-PERC-Bi55 (520W, 144-cell bifacial) — under_review ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version
) VALUES (
  'WRM-PVP-2026-0024', 'wrm-520-percbi-2026-024', 'WRM-520-PERC-Bi55',
  'WRM-2026-PERC-Bi-520-024', 'WRM-B-2026-Q2-Bi55-520', '08901234560024',
  'crystalline_silicon_perc', 'under_review', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Navsari, Gujarat, India', '2026-03-28', 'India',
  520.00, 20.15, 48.70, 13.60, 39.80, 12.62,
  1500, 2278, 1134, 35, 30.20,
  144, 'M10 (182mm) P-Type Mono PERC Bifacial',
  10, 25, 84.80,
  0.55, 30,
  410.00, 'ISO 14067:2018',
  24.5, 'cradle_to_gate', 'EPD-WRM-2026-Bi55',
  -0.35, -0.28, 0.048, 45,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '2mm Tempered ARC (dual glass)', 0.70,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_amsterdam, 1
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 18120, 60.00, '65997-17-3', false, false, 'Fully recyclable', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3620, 11.99, '7429-90-5', false, false, 'Fully recyclable', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 2720, 9.01, '24937-78-8', false, false, 'Thermal delamination', 2),
  (_pid, 'Monocrystalline Silicon (P-Type)', 'Solar cells', 1870, 6.19, '7440-21-3', true, false, 'Recoverable', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 604, 2.00, '7440-50-8', true, false, 'Recoverable', 4),
  (_pid, 'Silver Paste', 'Cell metallization', 15, 0.05, '7440-22-4', true, false, 'High-value recovery', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-520Bi-024', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'Design qualification for PERC bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-520Bi-024', 'TUV Rheinland', '2025-07-01', '2030-07-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-520-PERC-Bi55 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-520-PERC-Bi55.pdf', 2320000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-28', 'Ahnay Series 520W PERC bifacial datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-520-PERC-Bi55-DoC.pdf', 498000, 'application/pdf', 'Waaree Energies Ltd.', '2026-03-28', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 89.50, 7.50, 0.00, false, 'No hazardous substances above SVHC threshold.', 32,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (5 min)\n3) Separate dual glass at 350C (10 min)\n4) Remove encapsulant (7 min)\n5) Cell and metal recovery (5 min)\n6) Sort materials (3 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, true,
   'Dual-glass bifacial PERC design.',
   'in_use');


-- ═══════════════════════════════════════════════════════════
-- PLEXUS SERIES — N-Type HJT Bifacial (3 passports)
-- ═══════════════════════════════════════════════════════════

-- ── Passport 0025: WRM-720-HJT-BIH-11 (720W, 144-cell HJT) — under_review ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version
) VALUES (
  'WRM-PVP-2026-0025', 'wrm-720-hjt-2026-025', 'WRM-720-HJT-BIH-11',
  'WRM-2026-HJT-720-025', 'WRM-B-2026-Q2-BIH11-720', '08901234560025',
  'crystalline_silicon_hjt', 'under_review', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SMK-005', 'Waaree Samakhiali Mega Plant', 'Samakhiali, Kutch, Gujarat, India', '2026-04-01', 'India',
  720.00, 23.20, 55.40, 18.60, 46.90, 17.50,
  1500, 2384, 1303, 33, 37.00,
  144, 'G12 (210mm) N-Type Heterojunction Bifacial',
  15, 30, 90.00,
  0.25, 40,
  450.00, 'ISO 14067:2018',
  19.5, 'cradle_to_gate', 'EPD-WRM-2026-BIH11',
  -0.26, -0.24, 0.040, 42,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 33mm', '3.2mm Tempered ARC (dual glass)', 0.90,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_lisbon, 1
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 21460, 58.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4440, 12.00, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3520, 9.51, '26221-73-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Monocrystalline Silicon (N-Type) + ITO', 'Solar cells (heterojunction)', 2590, 7.00, '7440-21-3', true, false, 'Recoverable — HJT cells have ITO layer requiring specialized process', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 815, 2.20, '7440-50-8', true, false, 'Recoverable via copper smelting', 4),
  (_pid, 'Silver Paste (low-temp)', 'Cell metallization', 22, 0.06, '7440-22-4', true, false, 'High-value chemical extraction — higher silver content in HJT', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-720H-025', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'Design qualification for HJT bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-720H-025', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'PV module safety qualification — Class A'),
  (_pid, 'UL 61730', 'CERT-WRM-UL-720H-025', 'UL Solutions', '2026-01-01', '2031-01-01', 'valid', 'North American safety certification — Plexus HJT series');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-720-HJT-BIH-11 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-720-HJT-BIH-11.pdf', 2900000, 'application/pdf', 'Waaree Energies Ltd.', '2026-04-01', 'Plexus Series HJT bifacial datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-720-HJT-BIH-11-DoC.pdf', 545000, 'application/pdf', 'Waaree Energies Ltd.', '2026-04-01', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 94.50, 5.00, 0.00, false, 'No hazardous substances above SVHC threshold. ITO layer contains indium (non-toxic but critical raw material).', 36,
   E'1) Remove junction box and cables (3 min)\n2) Unbolt aluminium frame (5 min)\n3) Separate dual glass via thermal delamination at 300C (lower temp for HJT) (10 min)\n4) Remove POE encapsulant (8 min)\n5) HJT cell recovery — ITO layer separation (6 min)\n6) Sort materials (4 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'ROSI Solar', 'contact@rfrosi.com',
   true, true, true, true, true,
   'HJT dual-glass design. Lower delamination temperature preserves cell integrity. ITO (indium tin oxide) recovery requires specialized hydrometallurgical process. Higher silver content than TOPCon.',
   'in_use');


-- ── Passport 0026: WRM-710-HJT-BIH-11 (710W, 144-cell HJT) — draft ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version
) VALUES (
  'WRM-PVP-2026-0026', 'wrm-710-hjt-2026-026', 'WRM-710-HJT-BIH-11',
  null, 'WRM-B-2026-Q2-BIH11-710', '08901234560026',
  'crystalline_silicon_hjt', 'draft', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ GigaFactory', 'Surat, Gujarat, India', '2026-04-10', 'India',
  710.00, 22.90, 55.00, 18.45, 46.50, 17.30,
  1500, 2384, 1303, 33, 36.80,
  144, 'G12 (210mm) N-Type Heterojunction Bifacial',
  15, 30, 90.00,
  0.25, 40,
  445.00, 'ISO 14067:2018',
  19.8, 'cradle_to_gate', 'EPD-WRM-2026-BIH11',
  -0.26, -0.24, 0.040, 42,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 33mm', '3.2mm Tempered ARC (dual glass)', 0.90,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  _f_lisbon, 1
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 21340, 58.00, '65997-17-3', false, false, 'Fully recyclable', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4420, 12.01, '7429-90-5', false, false, 'Fully recyclable', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3500, 9.51, '26221-73-8', false, false, 'Thermal delamination', 2),
  (_pid, 'Monocrystalline Silicon (N-Type) + ITO', 'Solar cells (heterojunction)', 2580, 7.01, '7440-21-3', true, false, 'Recoverable — HJT specialized process', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 810, 2.20, '7440-50-8', true, false, 'Recoverable', 4),
  (_pid, 'Silver Paste (low-temp)', 'Cell metallization', 21, 0.06, '7440-22-4', true, false, 'High-value extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-710H-026', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'Design qualification for HJT bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-710H-026', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'PV module safety qualification — Class A');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-710-HJT-BIH-11 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-710-HJT-BIH-11.pdf', 2850000, 'application/pdf', 'Waaree Energies Ltd.', '2026-04-10', 'Plexus Series 710W HJT bifacial datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-710-HJT-BIH-11-DoC.pdf', 535000, 'application/pdf', 'Waaree Energies Ltd.', '2026-04-10', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 94.50, 5.00, 0.00, false, 'ITO layer contains indium (critical raw material, non-toxic).', 36,
   E'1) Remove junction box and cables (3 min)\n2) Unbolt aluminium frame (5 min)\n3) Dual glass delamination at 300C (10 min)\n4) POE removal (8 min)\n5) HJT cell + ITO recovery (6 min)\n6) Material sorting (4 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'ROSI Solar', 'contact@rfrosi.com',
   true, true, true, true, true,
   'HJT dual-glass recovery. Lower delamination temp for HJT.',
   'in_use');


-- ── Passport 0027: WRM-730-HJT-BIH-11 (730W, 144-cell HJT) — draft, uninstalled ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version
) VALUES (
  'WRM-PVP-2026-0027', 'wrm-730-hjt-2026-027', 'WRM-730-HJT-BIH-11',
  null, 'WRM-B-2026-Q2-BIH11-730', '08901234560027',
  'crystalline_silicon_hjt', 'draft', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-SMK-005', 'Waaree Samakhiali Mega Plant', 'Samakhiali, Kutch, Gujarat, India', '2026-04-15', 'India',
  730.00, 23.50, 55.80, 18.75, 47.20, 17.65,
  1500, 2384, 1303, 33, 37.20,
  144, 'G12 (210mm) N-Type Heterojunction Bifacial',
  15, 30, 90.00,
  0.25, 40,
  455.00, 'ISO 14067:2018',
  19.2, 'cradle_to_gate', 'EPD-WRM-2026-BIH11',
  -0.26, -0.24, 0.040, 42,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 33mm', '3.2mm Tempered ARC (dual glass)', 0.90,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  null, 1
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front + rear cover (dual glass)', 21580, 58.01, '65997-17-3', false, false, 'Fully recyclable', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 4460, 11.99, '7429-90-5', false, false, 'Fully recyclable', 1),
  (_pid, 'POE Encapsulant', 'Encapsulant', 3535, 9.50, '26221-73-8', false, false, 'Thermal delamination', 2),
  (_pid, 'Monocrystalline Silicon (N-Type) + ITO', 'Solar cells (heterojunction)', 2600, 6.99, '7440-21-3', true, false, 'Recoverable — HJT specialized process', 3),
  (_pid, 'Copper Ribbon', 'Interconnects', 820, 2.20, '7440-50-8', true, false, 'Recoverable', 4),
  (_pid, 'Silver Paste (low-temp)', 'Cell metallization', 22, 0.06, '7440-22-4', true, false, 'High-value extraction', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-730H-027', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'Design qualification for HJT bifacial modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-730H-027', 'TUV Rheinland', '2025-12-01', '2030-12-01', 'valid', 'PV module safety qualification — Class A'),
  (_pid, 'UL 61730', 'CERT-WRM-UL-730H-027', 'UL Solutions', '2026-01-01', '2031-01-01', 'valid', 'North American safety certification — Plexus HJT series');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-730-HJT-BIH-11 Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-730-HJT-BIH-11.pdf', 2950000, 'application/pdf', 'Waaree Energies Ltd.', '2026-04-15', 'Plexus Series 730W HJT bifacial — highest power bin'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-730-HJT-BIH-11-DoC.pdf', 548000, 'application/pdf', 'Waaree Energies Ltd.', '2026-04-15', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 94.50, 5.20, 0.00, false, 'ITO layer contains indium (critical raw material, non-toxic).', 37,
   E'1) Remove junction box and cables (3 min)\n2) Unbolt aluminium frame (5 min)\n3) Dual glass delamination at 300C (10 min)\n4) POE removal (9 min)\n5) HJT cell + ITO recovery (6 min)\n6) Material sorting (4 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'ROSI Solar', 'contact@rfrosi.com',
   true, true, true, true, true,
   'HJT dual-glass recovery. Highest silver content per module in Waaree lineup.',
   'in_storage');


-- ═══════════════════════════════════════════════════════════
-- ADITYA SERIES — Polycrystalline Legacy (1 passport)
-- ═══════════════════════════════════════════════════════════

-- ── Passport 0028: WRM-330-POLY-WS (330W, 72-cell poly) — draft, uninstalled ──
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date, facility_country,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  reach_status, rohs_status, data_carrier_type,
  fleet_id, passport_version
) VALUES (
  'WRM-PVP-2026-0028', 'wrm-330-poly-2026-028', 'WRM-330-POLY-WS',
  null, 'WRM-B-2025-Q4-WS-330', '08901234560028',
  'other', 'draft', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001',
  'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India',
  'https://waaree.com', 'India',
  'FAC-WRM-TMB-003', 'Waaree Tumb Manufacturing Plant', 'Tumb, Umbergaon, Gujarat, India', '2025-11-10', 'India',
  330.00, 17.01, 46.70, 9.25, 37.95, 8.70,
  1000, 1960, 992, 35, 22.50,
  72, 'Polycrystalline Silicon (Multi-Si)',
  10, 25, 80.00,
  0.70, 25,
  480.00, 'ISO 14067:2018',
  28.5, 'cradle_to_gate', 'EPD-WRM-2025-WS',
  -0.40, -0.30, 0.050, 47,
  'Class C', 'IP65', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Tempered Solar Glass', 0.00,
  'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
  null, 1
) RETURNING id INTO _pid;

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) VALUES
  (_pid, 'Tempered Solar Glass', 'Front cover', 15300, 68.00, '65997-17-3', false, false, 'Fully recyclable via glass cullet recovery', 0),
  (_pid, 'Aluminium Alloy 6063-T5', 'Frame', 3150, 14.00, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 1),
  (_pid, 'EVA Encapsulant', 'Encapsulant', 1800, 8.00, '24937-78-8', false, false, 'Thermal delamination required', 2),
  (_pid, 'Polycrystalline Silicon', 'Solar cells', 1240, 5.51, '7440-21-3', true, false, 'Recoverable for metallurgical-grade silicon', 3),
  (_pid, 'Backsheet (PVF/PET/PVF)', 'Rear protection', 675, 3.00, null, false, false, 'Energy recovery via incineration', 4),
  (_pid, 'Copper Ribbon', 'Interconnects', 340, 1.51, '7440-50-8', true, false, 'Recoverable via copper smelting', 5);

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
  (_pid, 'IEC 61215:2021', 'CERT-WRM-61215-330P-028', 'TUV Rheinland', '2024-06-01', '2029-06-01', 'valid', 'Design qualification for polycrystalline modules'),
  (_pid, 'IEC 61730:2023', 'CERT-WRM-61730-330P-028', 'TUV Rheinland', '2024-06-01', '2029-06-01', 'valid', 'PV module safety qualification — Class C fire rating');

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
  (_pid, 'WRM-330-POLY-WS Datasheet', 'datasheet', 'public', 'https://docs.waaree.com/ds/WRM-330-POLY-WS.pdf', 1800000, 'application/pdf', 'Waaree Energies Ltd.', '2025-11-10', 'Aditya Series legacy polycrystalline datasheet'),
  (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'https://docs.waaree.com/ce/WRM-330-POLY-WS-DoC.pdf', 460000, 'application/pdf', 'Waaree Energies Ltd.', '2025-11-10', 'CE Declaration of Conformity');

INSERT INTO passport_circularity (passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent, is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions, collection_scheme, recycler_name, recycler_contact, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver, recovery_notes, end_of_life_status) VALUES
  (_pid, 85.00, 4.00, 0.00, false, 'No hazardous substances above SVHC threshold.', 22,
   E'1) Remove junction box and cables (2 min)\n2) Remove aluminium frame (4 min)\n3) Thermal delamination (7 min)\n4) Backsheet removal (3 min)\n5) Cell and metal recovery (4 min)\n6) Material sorting (2 min)',
   'EU WEEE Directive 2012/19/EU / India EPR', 'Veolia PV Recycling', 'pvrecycling@veolia.com',
   true, true, true, true, false,
   'Legacy polycrystalline module. Lower silicon purity allows only metallurgical-grade recovery. Lower silver content.',
   'in_storage');


RAISE NOTICE 'Seeded 20 Waaree Energies passports (8 TOPCon Elite + 5 PERC Arka + 3 PERC Bifacial Ahnay + 3 HJT Plexus + 1 Poly Aditya) with materials, certificates, documents, and circularity data';
END $$;
