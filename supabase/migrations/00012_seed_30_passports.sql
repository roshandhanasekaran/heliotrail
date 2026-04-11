-- ============================================================
-- Migration 00012: Seed 30 production-quality passports
-- 10 Waaree + 10 Adani Solar + 10 Vikram Solar
-- Replaces all existing demo/seed data
-- ============================================================

-- ============================================================
-- 1. Clean existing seed data (cascade-safe order)
-- ============================================================
DELETE FROM passport_submissions;
DELETE FROM passport_anchors;
DELETE FROM passport_circularity;
DELETE FROM passport_documents;
DELETE FROM passport_certificates;
DELETE FROM passport_materials;
DELETE FROM passports;


-- ============================================================
-- 2. INSERT 30 PASSPORTS
-- ============================================================

-- ============================================================
-- WAAREE ENERGIES LTD. (10 passports)
-- Model 1: WRM-700-TOPCON-BiN-03 (4 passports: 3 published + 1 approved)
-- Model 2: WRM-590-TOPCON-BiN-08 (3 passports: 2 published + 1 approved)
-- Model 3: WRM-580-TOPCON-BiN-08 (3 passports: 1 published + 1 under_review + 1 draft)
-- ============================================================

-- WRM-01: 700W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0001', 'wrm-700topcon-2026-001', 'WRM-700-TOPCON-BiN-03', 'WRM-2026-TOPCON-100001', 'B-2026-Q1-TOPCON', '08901234560001',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ, Diamond Park', 'Surat, Gujarat, India', '2026-01-05',
  700.00, 22.53, 54.80, 18.30, 46.10, 17.40,
  1500, 2384, 1303, 35, 39.00,
  132, 'G12 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  410.00, 'ISO 14067:2018',
  -0.300, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron HTAR semi-tempered glass', 0.80,
  1, '2026-01-20T00:00:00Z'
);

-- WRM-02: 700W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0002', 'wrm-700topcon-2026-002', 'WRM-700-TOPCON-BiN-03', 'WRM-2026-TOPCON-100002', 'B-2026-Q1-TOPCON', '08901234560002',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ, Diamond Park', 'Surat, Gujarat, India', '2026-01-12',
  700.00, 22.53, 54.80, 18.30, 46.10, 17.40,
  1500, 2384, 1303, 35, 39.00,
  132, 'G12 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  410.00, 'ISO 14067:2018',
  -0.300, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron HTAR semi-tempered glass', 0.80,
  1, '2026-01-28T00:00:00Z'
);

-- WRM-03: 700W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0003', 'wrm-700topcon-2026-003', 'WRM-700-TOPCON-BiN-03', 'WRM-2026-TOPCON-100003', 'B-2026-Q1-TOPCON', '08901234560003',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-02-03',
  700.00, 22.53, 54.80, 18.30, 46.10, 17.40,
  1500, 2384, 1303, 35, 39.00,
  132, 'G12 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  410.00, 'ISO 14067:2018',
  -0.300, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron HTAR semi-tempered glass', 0.80,
  1, '2026-02-18T00:00:00Z'
);

-- WRM-04: 700W TOPCon — Approved
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'WRM-PVP-2026-0004', 'wrm-700topcon-2026-004', 'WRM-700-TOPCON-BiN-03', 'WRM-2026-TOPCON-100004', 'B-2026-Q1-TOPCON', '08901234560004',
  'crystalline_silicon_topcon', 'approved', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-02-18',
  700.00, 22.53, 54.80, 18.30, 46.10, 17.40,
  1500, 2384, 1303, 35, 39.00,
  132, 'G12 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  410.00, 'ISO 14067:2018',
  -0.300, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron HTAR semi-tempered glass', 0.80,
  1
);

-- WRM-05: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0005', 'wrm-590topcon-2026-005', 'WRM-590-TOPCON-BiN-08', 'WRM-2026-TOPCON-100005', 'B-2026-Q1-TOPCON', '08901234560005',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ, Diamond Park', 'Surat, Gujarat, India', '2026-01-20',
  590.00, 22.84, 51.80, 14.60, 43.80, 13.47,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.046, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered glass', 0.80,
  1, '2026-02-05T00:00:00Z'
);

-- WRM-06: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0006', 'wrm-590topcon-2026-006', 'WRM-590-TOPCON-BiN-08', 'WRM-2026-TOPCON-100006', 'B-2026-Q1-TOPCON', '08901234560006',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-02-10',
  590.00, 22.84, 51.80, 14.60, 43.80, 13.47,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.046, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered glass', 0.80,
  1, '2026-02-25T00:00:00Z'
);

-- WRM-07: 590W TOPCon — Approved
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'WRM-PVP-2026-0007', 'wrm-590topcon-2026-007', 'WRM-590-TOPCON-BiN-08', 'WRM-2026-TOPCON-100007', 'B-2026-Q1-TOPCON', '08901234560007',
  'crystalline_silicon_topcon', 'approved', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ, Diamond Park', 'Surat, Gujarat, India', '2026-03-01',
  590.00, 22.84, 51.80, 14.60, 43.80, 13.47,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.046, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered glass', 0.80,
  1
);

-- WRM-08: 580W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'WRM-PVP-2026-0008', 'wrm-580topcon-2026-008', 'WRM-580-TOPCON-BiN-08', 'WRM-2026-TOPCON-100008', 'B-2026-Q1-TOPCON', '08901234560008',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat SEZ, Diamond Park', 'Surat, Gujarat, India', '2026-02-14',
  580.00, 22.45, 51.20, 14.50, 43.20, 13.43,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  390.00, 'ISO 14067:2018',
  -0.290, -0.240, 0.044, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered glass', 0.75,
  1, '2026-03-01T00:00:00Z'
);

-- WRM-09: 580W TOPCon — Under Review
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'WRM-PVP-2026-0009', 'wrm-580topcon-2026-009', 'WRM-580-TOPCON-BiN-08', 'WRM-2026-TOPCON-100009', 'B-2026-Q1-TOPCON', '08901234560009',
  'crystalline_silicon_topcon', 'under_review', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-03-05',
  580.00, 22.45, 51.20, 14.50, 43.20, 13.43,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  390.00, 'ISO 14067:2018',
  -0.290, -0.240, 0.044, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered glass', 0.75,
  1
);

-- WRM-10: 580W TOPCon — Draft
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'WRM-PVP-2026-0010', 'wrm-580topcon-2026-010', 'WRM-580-TOPCON-BiN-08', 'WRM-2026-TOPCON-100010', 'B-2026-Q1-TOPCON', '08901234560010',
  'crystalline_silicon_topcon', 'draft', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001', '602 Western Edge II, Borivali East, Mumbai, Maharashtra 400066, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHK-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-03-20',
  580.00, 22.45, 51.20, 14.50, 43.20, 13.43,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  390.00, 'ISO 14067:2018',
  -0.290, -0.240, 0.044, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered glass', 0.75,
  1
);


-- ============================================================
-- ADANI SOLAR / MUNDRA SOLAR PV LTD. (10 passports)
-- Model 1: ASM-590-TOPCON-BiN (4 passports: 3 published + 1 approved)
-- Model 2: ASM-580-TOPCON-BiN (3 passports: 2 published + 1 approved)
-- Model 3: ASM-545-PERC-Mono (3 passports: 1 published + 1 under_review + 1 draft)
-- ============================================================

-- ADS-01: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'ADS-PVP-2026-0001', 'ads-590topcon-2026-001', 'ASM-590-TOPCON-BiN', 'ADS-2026-TOPCON-200001', 'B-2026-Q1-TOPCON', '08901234570001',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-01-08',
  590.00, 22.80, 51.60, 14.55, 43.50, 13.56,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  395.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.80,
  1, '2026-01-22T00:00:00Z'
);

-- ADS-02: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'ADS-PVP-2026-0002', 'ads-590topcon-2026-002', 'ASM-590-TOPCON-BiN', 'ADS-2026-TOPCON-200002', 'B-2026-Q1-TOPCON', '08901234570002',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-01-18',
  590.00, 22.80, 51.60, 14.55, 43.50, 13.56,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  395.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.80,
  1, '2026-02-02T00:00:00Z'
);

-- ADS-03: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'ADS-PVP-2026-0003', 'ads-590topcon-2026-003', 'ASM-590-TOPCON-BiN', 'ADS-2026-TOPCON-200003', 'B-2026-Q1-TOPCON', '08901234570003',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-02-08',
  590.00, 22.80, 51.60, 14.55, 43.50, 13.56,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  395.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.80,
  1, '2026-02-22T00:00:00Z'
);

-- ADS-04: 590W TOPCon — Approved
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'ADS-PVP-2026-0004', 'ads-590topcon-2026-004', 'ASM-590-TOPCON-BiN', 'ADS-2026-TOPCON-200004', 'B-2026-Q1-TOPCON', '08901234570004',
  'crystalline_silicon_topcon', 'approved', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-02-25',
  590.00, 22.80, 51.60, 14.55, 43.50, 13.56,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  395.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.80,
  1
);

-- ADS-05: 580W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'ADS-PVP-2026-0005', 'ads-580topcon-2026-005', 'ASM-580-TOPCON-BiN', 'ADS-2026-TOPCON-200005', 'B-2026-Q1-TOPCON', '08901234570005',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-01-25',
  580.00, 22.40, 51.10, 14.45, 43.00, 13.49,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  400.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.044, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.78,
  1, '2026-02-10T00:00:00Z'
);

-- ADS-06: 580W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'ADS-PVP-2026-0006', 'ads-580topcon-2026-006', 'ASM-580-TOPCON-BiN', 'ADS-2026-TOPCON-200006', 'B-2026-Q1-TOPCON', '08901234570006',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-02-15',
  580.00, 22.40, 51.10, 14.45, 43.00, 13.49,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  400.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.044, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.78,
  1, '2026-03-01T00:00:00Z'
);

-- ADS-07: 580W TOPCon — Approved
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'ADS-PVP-2026-0007', 'ads-580topcon-2026-007', 'ASM-580-TOPCON-BiN', 'ADS-2026-TOPCON-200007', 'B-2026-Q1-TOPCON', '08901234570007',
  'crystalline_silicon_topcon', 'approved', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-03-10',
  580.00, 22.40, 51.10, 14.45, 43.00, 13.49,
  1500, 2278, 1134, 33, 32.00,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 30,
  400.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.044, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', 0.78,
  1
);

-- ADS-08: 545W PERC — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'ADS-PVP-2026-0008', 'ads-545perc-2026-008', 'ASM-545-PERC-Mono', 'ADS-2026-PERC-200008', 'B-2026-Q1-PERC', '08901234570008',
  'crystalline_silicon_perc', 'published', 'verified',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-01-15',
  545.00, 21.10, 49.50, 13.90, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.00,
  144, 'M10 P-type mono PERC',
  12, 25, 84.80,
  0.55, 30,
  430.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', NULL,
  1, '2026-01-30T00:00:00Z'
);

-- ADS-09: 545W PERC — Under Review
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'ADS-PVP-2026-0009', 'ads-545perc-2026-009', 'ASM-545-PERC-Mono', 'ADS-2026-PERC-200009', 'B-2026-Q1-PERC', '08901234570009',
  'crystalline_silicon_perc', 'under_review', 'pending',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-03-12',
  545.00, 21.10, 49.50, 13.90, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.00,
  144, 'M10 P-type mono PERC',
  12, 25, 84.80,
  0.55, 30,
  430.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', NULL,
  1
);

-- ADS-10: 545W PERC — Draft
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'ADS-PVP-2026-0010', 'ads-545perc-2026-010', 'ASM-545-PERC-Mono', 'ADS-2026-PERC-200010', 'B-2026-Q1-PERC', '08901234570010',
  'crystalline_silicon_perc', 'draft', 'pending',
  'Mundra Solar PV Ltd. (Adani Solar)', 'EO-ADS-001', 'Adani Corporate House, Shantigram, SG Highway, Ahmedabad, Gujarat 382421, India', 'https://www.adanisolar.com', 'India',
  'FAC-ADS-MND-001', 'Mundra GigaFactory', 'Kutch, Gujarat, India', '2026-03-25',
  545.00, 21.10, 49.50, 13.90, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.00,
  144, 'M10 P-type mono PERC',
  12, 25, 84.80,
  0.55, 30,
  430.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '3.2mm tempered glass', NULL,
  1
);


-- ============================================================
-- VIKRAM SOLAR LTD. (10 passports)
-- Model 1: VSMDH-595-TOPCON (4 passports: 3 published + 1 approved)
-- Model 2: VSMDH-590-TOPCON (3 passports: 2 published + 1 approved)
-- Model 3: VSMDH-580-TOPCON (3 passports: 1 published + 1 under_review + 1 draft)
-- ============================================================

-- VKS-01: 595W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'VKS-PVP-2026-0001', 'vks-595topcon-2026-001', 'VSMDH-595-TOPCON', 'VKS-2026-TOPCON-300001', 'B-2026-Q1-TOPCON', '08901234580001',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-FLT-001', 'Vikram Solar Falta SEZ', 'South 24 Parganas, West Bengal, India', '2026-01-10',
  595.00, 23.06, 51.50, 14.37, 43.40, 13.72,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  380.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.85,
  1, '2026-01-25T00:00:00Z'
);

-- VKS-02: 595W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'VKS-PVP-2026-0002', 'vks-595topcon-2026-002', 'VSMDH-595-TOPCON', 'VKS-2026-TOPCON-300002', 'B-2026-Q1-TOPCON', '08901234580002',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-FLT-001', 'Vikram Solar Falta SEZ', 'South 24 Parganas, West Bengal, India', '2026-01-22',
  595.00, 23.06, 51.50, 14.37, 43.40, 13.72,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  380.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.85,
  1, '2026-02-08T00:00:00Z'
);

-- VKS-03: 595W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'VKS-PVP-2026-0003', 'vks-595topcon-2026-003', 'VSMDH-595-TOPCON', 'VKS-2026-TOPCON-300003', 'B-2026-Q1-TOPCON', '08901234580003',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-OGD-002', 'Vikram Solar Oragadam Plant', 'Oragadam, Chennai, Tamil Nadu, India', '2026-02-12',
  595.00, 23.06, 51.50, 14.37, 43.40, 13.72,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  380.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.85,
  1, '2026-02-28T00:00:00Z'
);

-- VKS-04: 595W TOPCon — Approved
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'VKS-PVP-2026-0004', 'vks-595topcon-2026-004', 'VSMDH-595-TOPCON', 'VKS-2026-TOPCON-300004', 'B-2026-Q1-TOPCON', '08901234580004',
  'crystalline_silicon_topcon', 'approved', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-OGD-002', 'Vikram Solar Oragadam Plant', 'Oragadam, Chennai, Tamil Nadu, India', '2026-02-28',
  595.00, 23.06, 51.50, 14.37, 43.40, 13.72,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  380.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.85,
  1
);

-- VKS-05: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'VKS-PVP-2026-0005', 'vks-590topcon-2026-005', 'VSMDH-590-TOPCON', 'VKS-2026-TOPCON-300005', 'B-2026-Q1-TOPCON', '08901234580005',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-FLT-001', 'Vikram Solar Falta SEZ', 'South 24 Parganas, West Bengal, India', '2026-02-05',
  590.00, 22.87, 50.30, 14.32, 43.20, 13.67,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.82,
  1, '2026-02-20T00:00:00Z'
);

-- VKS-06: 590W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'VKS-PVP-2026-0006', 'vks-590topcon-2026-006', 'VSMDH-590-TOPCON', 'VKS-2026-TOPCON-300006', 'B-2026-Q1-TOPCON', '08901234580006',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-OGD-002', 'Vikram Solar Oragadam Plant', 'Oragadam, Chennai, Tamil Nadu, India', '2026-02-20',
  590.00, 22.87, 50.30, 14.32, 43.20, 13.67,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.82,
  1, '2026-03-05T00:00:00Z'
);

-- VKS-07: 590W TOPCon — Approved
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'VKS-PVP-2026-0007', 'vks-590topcon-2026-007', 'VSMDH-590-TOPCON', 'VKS-2026-TOPCON-300007', 'B-2026-Q1-TOPCON', '08901234580007',
  'crystalline_silicon_topcon', 'approved', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-FLT-001', 'Vikram Solar Falta SEZ', 'South 24 Parganas, West Bengal, India', '2026-03-08',
  590.00, 22.87, 50.30, 14.32, 43.20, 13.67,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018',
  -0.300, -0.260, 0.045, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.82,
  1
);

-- VKS-08: 580W TOPCon — Published
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) VALUES (
  'VKS-PVP-2026-0008', 'vks-580topcon-2026-008', 'VSMDH-580-TOPCON', 'VKS-2026-TOPCON-300008', 'B-2026-Q1-TOPCON', '08901234580008',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-FLT-001', 'Vikram Solar Falta SEZ', 'South 24 Parganas, West Bengal, India', '2026-02-18',
  580.00, 22.49, 50.70, 14.14, 42.80, 13.55,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  395.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.044, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.80,
  1, '2026-03-05T00:00:00Z'
);

-- VKS-09: 580W TOPCon — Under Review
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'VKS-PVP-2026-0009', 'vks-580topcon-2026-009', 'VSMDH-580-TOPCON', 'VKS-2026-TOPCON-300009', 'B-2026-Q1-TOPCON', '08901234580009',
  'crystalline_silicon_topcon', 'under_review', 'pending',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-OGD-002', 'Vikram Solar Oragadam Plant', 'Oragadam, Chennai, Tamil Nadu, India', '2026-03-15',
  580.00, 22.49, 50.70, 14.14, 42.80, 13.55,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  395.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.044, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.80,
  1
);

-- VKS-10: 580W TOPCon — Draft
INSERT INTO passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) VALUES (
  'VKS-PVP-2026-0010', 'vks-580topcon-2026-010', 'VSMDH-580-TOPCON', 'VKS-2026-TOPCON-300010', 'B-2026-Q1-TOPCON', '08901234580010',
  'crystalline_silicon_topcon', 'draft', 'pending',
  'Vikram Solar Limited', 'EO-VKS-001', 'Chinar Park, Rajarhat, Kolkata, West Bengal 700156, India', 'https://www.vikramsolar.com', 'India',
  'FAC-VKS-OGD-002', 'Vikram Solar Oragadam Plant', 'Oragadam, Chennai, Tamil Nadu, India', '2026-03-22',
  580.00, 22.49, 50.70, 14.14, 42.80, 13.55,
  1500, 2278, 1134, 30, 33.40,
  144, 'M10 N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  395.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.044, 45.0,
  'Class C', 'IP68', 'MC4 Compatible', 'Anodized aluminium alloy', '2.0mm ARC semi-tempered glass', 0.80,
  1
);


-- ============================================================
-- 3. PASSPORT MATERIALS (10 per passport = 300 rows)
-- ============================================================

-- Helper: mass breakdowns per model archetype
-- WRM-700: 39.0 kg = 39000g — dual glass (HTAR semi-tempered)
-- WRM-590: 32.5 kg = 32500g — single glass + backsheet
-- WRM-580: 32.5 kg = 32500g — single glass + backsheet
-- ADS-590: 32.0 kg = 32000g — single glass
-- ADS-580: 32.0 kg = 32000g — single glass
-- ADS-545: 28.0 kg = 28000g — PERC monofacial
-- VKS-595: 33.4 kg = 33400g — single glass
-- VKS-590: 33.4 kg = 33400g — single glass
-- VKS-580: 33.4 kg = 33400g — single glass

-- ============================================================
-- WAAREE MATERIALS
-- ============================================================

-- WRM-700 passports (01-04): 39000g total
-- Glass 42% = 16380g, Al 12% = 4680g, Si 6.5% = 2535g, EVA/POE 9% = 3510g, Cu 2% = 780g
-- Ag 0.15% = 58.5g, Solder 0.3% = 117g, Rear glass 3.5% = 1365g, JB 1.2% = 468g, Other 1.5% = 585g

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        16380.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               4680.00, 12.00, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2535.00,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification for solar-grade reuse', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3510.00,  9.00, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination at 350C required before recovery', 4),
  ('Copper ribbon',          'interconnects',         780.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     58.50,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                117.00,  0.30, '7440-31-5',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Rear glass',             'rear_cover',           1365.00,  3.50, '65997-17-3', false, false, NULL, NULL, 'Recyclable via glass cullet recovery', 8),
  ('Junction box (PPO)',     'junction_box',          468.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable component — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            585.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('wrm-700topcon-2026-001','wrm-700topcon-2026-002','wrm-700topcon-2026-003','wrm-700topcon-2026-004');

-- Also mark lead as substance_of_concern with CAS for lead specifically
UPDATE passport_materials SET cas_number = '7439-92-1'
WHERE material_name = 'Tin-lead solder' AND cas_number = '7440-31-5';

-- WRM-590 passports (05-07): 32500g total
-- Glass 42% = 13650g, Al 13% = 4225g, Si 6.5% = 2112.5g, EVA/POE 9.5% = 3087.5g, Cu 2% = 650g
-- Ag 0.15% = 48.75g, Solder 0.3% = 97.5g, Backsheet 4% = 1300g, JB 1.2% = 390g, Other 1.5% = 487.5g

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        13650.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               4225.00, 13.00, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2112.50,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3087.50,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         650.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     48.75,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 97.50,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1300.00,  4.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          390.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            487.50,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('wrm-590topcon-2026-005','wrm-590topcon-2026-006','wrm-590topcon-2026-007');

-- WRM-580 passports (08-10): 32500g total (same mass as 590)
INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        13650.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               4225.00, 13.00, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2112.50,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3087.50,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         650.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting', 5),
  ('Silver paste',           'cell_metallization',     48.75,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 97.50,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1300.00,  4.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          390.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            487.50,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('wrm-580topcon-2026-008','wrm-580topcon-2026-009','wrm-580topcon-2026-010');


-- ============================================================
-- ADANI MATERIALS
-- ============================================================

-- ADS TOPCon 590 (01-04): 32000g
-- Glass 42% = 13440g, Al 12.5% = 4000g, Si 6.5% = 2080g, EVA/POE 9.5% = 3040g, Cu 2% = 640g
-- Ag 0.15% = 48g, Solder 0.3% = 96g, Backsheet 4% = 1280g, JB 1.2% = 384g, Other 1.5% = 480g

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        13440.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               4000.00, 12.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2080.00,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3040.00,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         640.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     48.00,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 96.00,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1280.00,  4.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          384.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            480.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('ads-590topcon-2026-001','ads-590topcon-2026-002','ads-590topcon-2026-003','ads-590topcon-2026-004');

-- ADS TOPCon 580 (05-07): 32000g (same mass)
INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        13440.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               4000.00, 12.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2080.00,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3040.00,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         640.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting', 5),
  ('Silver paste',           'cell_metallization',     48.00,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 96.00,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1280.00,  4.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          384.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            480.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('ads-580topcon-2026-005','ads-580topcon-2026-006','ads-580topcon-2026-007');

-- ADS PERC 545 (08-10): 28000g — monofacial, higher glass ratio
-- Glass 45% = 12600g, Al 14% = 3920g, Si 6% = 1680g, EVA 8% = 2240g, Cu 2% = 560g
-- Ag 0.20% = 56g, Solder 0.3% = 84g, Backsheet 5% = 1400g, JB 1.2% = 336g, Other 1.5% = 420g

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        12600.00, 45.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3920.00, 14.00, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          1680.00,  6.00, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA encapsulant',        'encapsulant',          2240.00,  8.00, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         560.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting', 5),
  ('Silver paste',           'cell_metallization',     56.00,  0.20, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction — PERC uses more silver than TOPCon', 6),
  ('Tin-lead solder',        'solder',                 84.00,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1400.00,  5.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          336.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            420.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('ads-545perc-2026-008','ads-545perc-2026-009','ads-545perc-2026-010');


-- ============================================================
-- VIKRAM MATERIALS
-- ============================================================

-- VKS TOPCon 595 (01-04): 33400g
-- Glass 42% = 14028g, Al 11.5% = 3841g, Si 7% = 2338g, EVA/POE 10% = 3340g, Cu 2% = 668g
-- Ag 0.12% = 40.08g, Solder 0.3% = 100.2g, Backsheet 3.5% = 1169g, JB 1.2% = 400.8g, Other 1.5% = 501g

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        14028.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3841.00, 11.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2338.00,  7.00, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification for solar-grade reuse', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3340.00, 10.00, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination at 350C required', 4),
  ('Copper ribbon',          'interconnects',         668.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     40.08,  0.12, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                100.20,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1169.00,  3.50, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          400.80,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            501.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('vks-595topcon-2026-001','vks-595topcon-2026-002','vks-595topcon-2026-003','vks-595topcon-2026-004');

-- VKS TOPCon 590 (05-07): 33400g (same chassis)
INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        14028.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3841.00, 11.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2338.00,  7.00, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3340.00, 10.00, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         668.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting', 5),
  ('Silver paste',           'cell_metallization',     40.08,  0.12, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                100.20,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1169.00,  3.50, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          400.80,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            501.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('vks-590topcon-2026-005','vks-590topcon-2026-006','vks-590topcon-2026-007');

-- VKS TOPCon 580 (08-10): 33400g (same chassis)
INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        14028.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3841.00, 11.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2338.00,  7.00, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3340.00, 10.00, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination required', 4),
  ('Copper ribbon',          'interconnects',         668.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting', 5),
  ('Silver paste',           'cell_metallization',     40.08,  0.12, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                100.20,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1169.00,  3.50, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          400.80,  1.20, NULL,          false, false, NULL, NULL, 'Separable — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            501.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id IN ('vks-580topcon-2026-008','vks-580topcon-2026-009','vks-580topcon-2026-010');


-- ============================================================
-- 4. PASSPORT CERTIFICATES
-- ============================================================
-- Published passports: 8 certs, Approved: 7 certs, Under Review: 5, Draft: 4

-- ============================================================
-- WAAREE CERTIFICATES
-- ============================================================

-- WRM published passports (01, 02, 03, 05, 06, 08) — 8 certificates each
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-WRM-61215-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid'::certificate_status, 'Design qualification and type approval for crystalline silicon terrestrial PV modules'),
  ('IEC 61730:2023',               'CERT-WRM-61730-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-WRM-61701-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Salt mist corrosion testing — severity level 6'),
  ('IEC 62716:2013',               'CERT-WRM-62716-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Ammonia corrosion testing'),
  ('BIS IS 14286',                 'CERT-WRM-BIS-001',     'Bureau of Indian Standards', '2025-10-01', '2028-10-01', 'valid', 'Bureau of Indian Standards certification for PV modules'),
  ('UL 61730',                     'CERT-WRM-UL-001',      'UL LLC', '2025-11-01', '2030-11-01', 'valid', 'North American safety certification'),
  ('CE Declaration of Conformity', 'CERT-WRM-CE-001',      'Waaree Energies Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity'),
  ('Carbon Footprint Declaration', 'CERT-WRM-CFD-001',     'Sphera Solutions', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint per ISO 14067:2018 — cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id IN ('wrm-700topcon-2026-001','wrm-700topcon-2026-002','wrm-700topcon-2026-003','wrm-590topcon-2026-005','wrm-590topcon-2026-006','wrm-580topcon-2026-008');

-- WRM approved passports (04, 07) — 7 certificates (no Carbon Footprint Declaration yet)
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-WRM-61215-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-WRM-61730-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-WRM-61701-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Salt mist corrosion testing'),
  ('IEC 62716:2013',               'CERT-WRM-62716-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Ammonia corrosion testing'),
  ('BIS IS 14286',                 'CERT-WRM-BIS-001',     'Bureau of Indian Standards', '2025-10-01', '2028-10-01', 'valid', 'BIS certification'),
  ('UL 61730',                     'CERT-WRM-UL-001',      'UL LLC', '2025-11-01', '2030-11-01', 'valid', 'NA safety certification'),
  ('CE Declaration of Conformity', 'CERT-WRM-CE-001',      'Waaree Energies Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id IN ('wrm-700topcon-2026-004','wrm-590topcon-2026-007');

-- WRM under_review passport (09) — 5 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-WRM-61215-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-WRM-61730-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-WRM-61701-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'Salt mist corrosion testing'),
  ('BIS IS 14286',                 'CERT-WRM-BIS-001',     'Bureau of Indian Standards', '2025-10-01', '2028-10-01', 'valid', 'BIS certification'),
  ('CE Declaration of Conformity', 'CERT-WRM-CE-001',      'Waaree Energies Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id = 'wrm-580topcon-2026-009';

-- WRM draft passport (10) — 4 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-WRM-61215-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-WRM-61730-001',   'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid', 'PV module safety qualification'),
  ('BIS IS 14286',                 'CERT-WRM-BIS-001',     'Bureau of Indian Standards', '2025-10-01', '2028-10-01', 'valid', 'BIS certification'),
  ('CE Declaration of Conformity', 'CERT-WRM-CE-001',      'Waaree Energies Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id = 'wrm-580topcon-2026-010';


-- ============================================================
-- ADANI CERTIFICATES
-- ============================================================

-- ADS published passports (01, 02, 03, 05, 06, 08) — 8 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-ADS-61215-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid'::certificate_status, 'Design qualification and type approval for crystalline silicon PV modules'),
  ('IEC 61730:2023',               'CERT-ADS-61730-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-ADS-61701-001',   'Bureau Veritas', '2025-09-15', '2030-09-15', 'valid', 'Salt mist corrosion testing — severity level 6'),
  ('IEC 62716:2013',               'CERT-ADS-62716-001',   'Bureau Veritas', '2025-09-15', '2030-09-15', 'valid', 'Ammonia corrosion testing'),
  ('BIS IS 14286',                 'CERT-ADS-BIS-001',     'Bureau of Indian Standards', '2025-10-15', '2028-10-15', 'valid', 'Bureau of Indian Standards certification'),
  ('UL 61730',                     'CERT-ADS-UL-001',      'UL LLC', '2025-11-15', '2030-11-15', 'valid', 'North American safety certification'),
  ('CE Declaration of Conformity', 'CERT-ADS-CE-001',      'Mundra Solar PV Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity'),
  ('Carbon Footprint Declaration', 'CERT-ADS-CFD-001',     'SGS', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint per ISO 14067:2018 — cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id IN ('ads-590topcon-2026-001','ads-590topcon-2026-002','ads-590topcon-2026-003','ads-580topcon-2026-005','ads-580topcon-2026-006','ads-545perc-2026-008');

-- ADS approved passports (04, 07) — 7 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-ADS-61215-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-ADS-61730-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-ADS-61701-001',   'Bureau Veritas', '2025-09-15', '2030-09-15', 'valid', 'Salt mist corrosion testing'),
  ('IEC 62716:2013',               'CERT-ADS-62716-001',   'Bureau Veritas', '2025-09-15', '2030-09-15', 'valid', 'Ammonia corrosion testing'),
  ('BIS IS 14286',                 'CERT-ADS-BIS-001',     'Bureau of Indian Standards', '2025-10-15', '2028-10-15', 'valid', 'BIS certification'),
  ('UL 61730',                     'CERT-ADS-UL-001',      'UL LLC', '2025-11-15', '2030-11-15', 'valid', 'NA safety certification'),
  ('CE Declaration of Conformity', 'CERT-ADS-CE-001',      'Mundra Solar PV Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id IN ('ads-590topcon-2026-004','ads-580topcon-2026-007');

-- ADS under_review passport (09) — 5 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-ADS-61215-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-ADS-61730-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-ADS-61701-001',   'Bureau Veritas', '2025-09-15', '2030-09-15', 'valid', 'Salt mist corrosion testing'),
  ('BIS IS 14286',                 'CERT-ADS-BIS-001',     'Bureau of Indian Standards', '2025-10-15', '2028-10-15', 'valid', 'BIS certification'),
  ('CE Declaration of Conformity', 'CERT-ADS-CE-001',      'Mundra Solar PV Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id = 'ads-545perc-2026-009';

-- ADS draft passport (10) — 4 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-ADS-61215-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-ADS-61730-001',   'Bureau Veritas', '2025-08-01', '2030-08-01', 'valid', 'PV module safety qualification'),
  ('BIS IS 14286',                 'CERT-ADS-BIS-001',     'Bureau of Indian Standards', '2025-10-15', '2028-10-15', 'valid', 'BIS certification'),
  ('CE Declaration of Conformity', 'CERT-ADS-CE-001',      'Mundra Solar PV Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id = 'ads-545perc-2026-010';


-- ============================================================
-- VIKRAM CERTIFICATES
-- ============================================================

-- VKS published passports (01, 02, 03, 05, 06, 08) — 8 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-VKS-61215-001',   'UL', '2025-09-01', '2030-09-01', 'valid'::certificate_status, 'Design qualification and type approval for crystalline silicon PV modules'),
  ('IEC 61730:2023',               'CERT-VKS-61730-001',   'UL', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-VKS-61701-001',   'UL', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing — severity level 6'),
  ('IEC 62716:2013',               'CERT-VKS-62716-001',   'UL', '2025-10-01', '2030-10-01', 'valid', 'Ammonia corrosion testing'),
  ('BIS IS 14286',                 'CERT-VKS-BIS-001',     'Bureau of Indian Standards', '2025-11-01', '2028-11-01', 'valid', 'Bureau of Indian Standards certification'),
  ('UL 61730',                     'CERT-VKS-UL-001',      'UL LLC', '2025-11-15', '2030-11-15', 'valid', 'North American safety certification'),
  ('CE Declaration of Conformity', 'CERT-VKS-CE-001',      'Vikram Solar Limited', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity'),
  ('Carbon Footprint Declaration', 'CERT-VKS-CFD-001',     'DNV', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint per ISO 14067:2018 — cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id IN ('vks-595topcon-2026-001','vks-595topcon-2026-002','vks-595topcon-2026-003','vks-590topcon-2026-005','vks-590topcon-2026-006','vks-580topcon-2026-008');

-- VKS approved passports (04, 07) — 7 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-VKS-61215-001',   'UL', '2025-09-01', '2030-09-01', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-VKS-61730-001',   'UL', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-VKS-61701-001',   'UL', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing'),
  ('IEC 62716:2013',               'CERT-VKS-62716-001',   'UL', '2025-10-01', '2030-10-01', 'valid', 'Ammonia corrosion testing'),
  ('BIS IS 14286',                 'CERT-VKS-BIS-001',     'Bureau of Indian Standards', '2025-11-01', '2028-11-01', 'valid', 'BIS certification'),
  ('UL 61730',                     'CERT-VKS-UL-001',      'UL LLC', '2025-11-15', '2030-11-15', 'valid', 'NA safety certification'),
  ('CE Declaration of Conformity', 'CERT-VKS-CE-001',      'Vikram Solar Limited', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id IN ('vks-595topcon-2026-004','vks-590topcon-2026-007');

-- VKS under_review passport (09) — 5 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-VKS-61215-001',   'UL', '2025-09-01', '2030-09-01', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-VKS-61730-001',   'UL', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification'),
  ('IEC 61701:2020',               'CERT-VKS-61701-001',   'UL', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing'),
  ('BIS IS 14286',                 'CERT-VKS-BIS-001',     'Bureau of Indian Standards', '2025-11-01', '2028-11-01', 'valid', 'BIS certification'),
  ('CE Declaration of Conformity', 'CERT-VKS-CE-001',      'Vikram Solar Limited', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id = 'vks-580topcon-2026-009';

-- VKS draft passport (10) — 4 certificates
INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-VKS-61215-001',   'UL', '2025-09-01', '2030-09-01', 'valid'::certificate_status, 'Design qualification and type approval'),
  ('IEC 61730:2023',               'CERT-VKS-61730-001',   'UL', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification'),
  ('BIS IS 14286',                 'CERT-VKS-BIS-001',     'Bureau of Indian Standards', '2025-11-01', '2028-11-01', 'valid', 'BIS certification'),
  ('CE Declaration of Conformity', 'CERT-VKS-CE-001',      'Vikram Solar Limited', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id = 'vks-580topcon-2026-010';


-- ============================================================
-- 5. PASSPORT DOCUMENTS (6 per passport = 180 rows)
-- ============================================================

-- ============================================================
-- WAAREE DOCUMENTS
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',           'datasheet'::document_type,                'public'::document_access_level,  'https://waaree.com/docs/' || 'model' || '/datasheet.pdf',     2097152,  'application/pdf', 'a1c4e8f2b6d90e3a7c5f1b8d4e2a6f09c3b7d5e1f8a2c4d6e0b3f5a7c9d1e3f5', 'sha256', 'Waaree Energies Ltd.', '2026-01-01', 'Complete electrical and mechanical specifications at STC and NOCT'),
  ('EU Declaration of Conformity',  'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://waaree.com/docs/' || 'model' || '/eu-doc.pdf',        524288,   'application/pdf', 'b2d5f9a3c7e10f4b8d6a2c4e8f0b3d5a7c9e1f3a5b7d9e0c2f4a6b8d0e2f4a6b8', 'sha256', 'Waaree Energies Ltd.', '2026-01-01', 'EU Declaration of Conformity under applicable directives'),
  ('Installation and User Manual',  'user_manual'::document_type,             'public'::document_access_level,  'https://waaree.com/docs/' || 'model' || '/manual.pdf',        5242880,  'application/pdf', 'c3e6a0b4d8f21a5c9e7b3d5f1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0', 'sha256', 'Waaree Energies Ltd.', '2026-01-01', 'Complete installation, commissioning, and maintenance guide'),
  ('Safety Instructions',           'safety_instructions'::document_type,     'public'::document_access_level,  'https://waaree.com/docs/' || 'model' || '/safety.pdf',        1048576,  'application/pdf', 'd4f7b1c5e9a32b6d0f8c4e6a2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2', 'sha256', 'Waaree Energies Ltd.', '2026-01-01', 'Safety guidelines for handling, transport, and installation'),
  ('Environmental Product Declaration', 'epd'::document_type,                 'public'::document_access_level,  'https://waaree.com/docs/' || 'model' || '/epd.pdf',           3145728,  'application/pdf', 'e5a8c2d6f0b43c7e1a9d5f7b3c5e7a9d1f3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5', 'sha256', 'Sphera Solutions', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025'),
  ('End-of-Life Recycling Guide',   'recycling_guide'::document_type,         'recycler'::document_access_level,'https://waaree.com/docs/' || 'model' || '/recycling.pdf',     1572864,  'application/pdf', 'f6b9d3e7a1c54d8f2b0e6a8c4d6f0b2e4a6c8d0f2b4e6a8c0d2f4b6e8a0c2d4f6b8', 'sha256', 'Waaree Energies Ltd.', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.manufacturer_name = 'Waaree Energies Ltd.';

-- Fix URLs for Waaree with actual model IDs
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-700-TOPCON-BiN-03/datasheet.pdf'  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-700%') AND document_type = 'datasheet';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-700-TOPCON-BiN-03/eu-doc.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-700%') AND document_type = 'declaration_of_conformity';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-700-TOPCON-BiN-03/manual.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-700%') AND document_type = 'user_manual';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-700-TOPCON-BiN-03/safety.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-700%') AND document_type = 'safety_instructions';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-700-TOPCON-BiN-03/epd.pdf'        WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-700%') AND document_type = 'epd';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-700-TOPCON-BiN-03/recycling.pdf'  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-700%') AND document_type = 'recycling_guide';

UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-590-TOPCON-BiN-08/datasheet.pdf'  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-590%') AND document_type = 'datasheet';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-590-TOPCON-BiN-08/eu-doc.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-590%') AND document_type = 'declaration_of_conformity';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-590-TOPCON-BiN-08/manual.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-590%') AND document_type = 'user_manual';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-590-TOPCON-BiN-08/safety.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-590%') AND document_type = 'safety_instructions';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-590-TOPCON-BiN-08/epd.pdf'        WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-590%') AND document_type = 'epd';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-590-TOPCON-BiN-08/recycling.pdf'  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-590%') AND document_type = 'recycling_guide';

UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-580-TOPCON-BiN-08/datasheet.pdf'  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-580%') AND document_type = 'datasheet';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-580-TOPCON-BiN-08/eu-doc.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-580%') AND document_type = 'declaration_of_conformity';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-580-TOPCON-BiN-08/manual.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-580%') AND document_type = 'user_manual';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-580-TOPCON-BiN-08/safety.pdf'     WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-580%') AND document_type = 'safety_instructions';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-580-TOPCON-BiN-08/epd.pdf'        WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-580%') AND document_type = 'epd';
UPDATE passport_documents SET url = 'https://waaree.com/docs/WRM-580-TOPCON-BiN-08/recycling.pdf'  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'wrm-580%') AND document_type = 'recycling_guide';

-- Unique hashes per Waaree passport+doctype (update to make unique)
UPDATE passport_documents SET document_hash = 'a1c4e8f2b6d90e3a7c5f1b8d4e2a6f09c3b7d5e1f8a2c4d6e0b3f5a7c9d1e3f5' WHERE passport_id = (SELECT id FROM passports WHERE public_id = 'wrm-700topcon-2026-001') AND document_type = 'datasheet';
UPDATE passport_documents SET document_hash = 'a2c5e9f3b7d01e4a8c6f2b9d5e3a7f10c4b8d6e2f9a3c5d7e1b4f6a8c0d2e4f6' WHERE passport_id = (SELECT id FROM passports WHERE public_id = 'wrm-700topcon-2026-002') AND document_type = 'datasheet';
UPDATE passport_documents SET document_hash = 'a3c6e0f4b8d12e5a9c7f3b0d6e4a8f21c5b9d7e3f0a4c6d8e2b5f7a9c1d3e5f7' WHERE passport_id = (SELECT id FROM passports WHERE public_id = 'wrm-700topcon-2026-003') AND document_type = 'datasheet';
UPDATE passport_documents SET document_hash = 'a4c7e1f5b9d23e6a0c8f4b1d7e5a9f32c6b0d8e4f1a5c7d9e3b6f8a0c2d4e6f8' WHERE passport_id = (SELECT id FROM passports WHERE public_id = 'wrm-700topcon-2026-004') AND document_type = 'datasheet';


-- ============================================================
-- ADANI DOCUMENTS
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',           'datasheet'::document_type,                'public'::document_access_level,  'https://www.adanisolar.com/docs/placeholder/datasheet.pdf',  2097152,  'application/pdf', '10a4b8c2d6e0f4a8b2c6d0e4f8a2b6c0d4e8f2a6b0c4d8e2f6a0b4c8d2e6f0a4b8', 'sha256', 'Mundra Solar PV Ltd.', '2026-01-01', 'Complete electrical and mechanical specifications at STC and NOCT'),
  ('EU Declaration of Conformity',  'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://www.adanisolar.com/docs/placeholder/eu-doc.pdf',     524288,   'application/pdf', '21b5c9d3e7f1a5b9c3d7e1f5a9b3c7d1e5f9a3b7c1d5e9f3a7b1c5d9e3f7a1b5c9', 'sha256', 'Mundra Solar PV Ltd.', '2026-01-01', 'EU Declaration of Conformity under applicable directives'),
  ('Installation and User Manual',  'user_manual'::document_type,             'public'::document_access_level,  'https://www.adanisolar.com/docs/placeholder/manual.pdf',     5242880,  'application/pdf', '32c6d0e4f8a2b6c0d4e8f2a6b0c4d8e2f6a0b4c8d2e6f0a4b8c2d6e0f4a8b2c6d0', 'sha256', 'Mundra Solar PV Ltd.', '2026-01-01', 'Complete installation, commissioning, and maintenance guide'),
  ('Safety Instructions',           'safety_instructions'::document_type,     'public'::document_access_level,  'https://www.adanisolar.com/docs/placeholder/safety.pdf',     1048576,  'application/pdf', '43d7e1f5a9b3c7d1e5f9a3b7c1d5e9f3a7b1c5d9e3f7a1b5c9d3e7f1a5b9c3d7e1', 'sha256', 'Mundra Solar PV Ltd.', '2026-01-01', 'Safety guidelines for handling, transport, and installation'),
  ('Environmental Product Declaration', 'epd'::document_type,                 'public'::document_access_level,  'https://www.adanisolar.com/docs/placeholder/epd.pdf',        3145728,  'application/pdf', '54e8f2a6b0c4d8e2f6a0b4c8d2e6f0a4b8c2d6e0f4a8b2c6d0e4f8a2b6c0d4e8f2', 'sha256', 'SGS', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025'),
  ('End-of-Life Recycling Guide',   'recycling_guide'::document_type,         'recycler'::document_access_level,'https://www.adanisolar.com/docs/placeholder/recycling.pdf',  1572864,  'application/pdf', '65f9a3b7c1d5e9f3a7b1c5d9e3f7a1b5c9d3e7f1a5b9c3d7e1f5a9b3c7d1e5f9a3', 'sha256', 'Mundra Solar PV Ltd.', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.manufacturer_name = 'Mundra Solar PV Ltd. (Adani Solar)';

-- Fix Adani URLs
UPDATE passport_documents SET url = REPLACE(url, 'placeholder', 'ASM-590-TOPCON-BiN')  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'ads-590%');
UPDATE passport_documents SET url = REPLACE(url, 'placeholder', 'ASM-580-TOPCON-BiN')  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'ads-580%');
UPDATE passport_documents SET url = REPLACE(url, 'placeholder', 'ASM-545-PERC-Mono')   WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'ads-545%');


-- ============================================================
-- VIKRAM DOCUMENTS
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',           'datasheet'::document_type,                'public'::document_access_level,  'https://www.vikramsolar.com/docs/placeholder/datasheet.pdf',  2097152,  'application/pdf', '70a4b8c2d6e0f4a8b2c6d0e4f8a2b6c0d4e8f2a6b0c4d8e2f6a0b4c8d2e6f0a4c9', 'sha256', 'Vikram Solar Limited', '2026-01-01', 'Complete electrical and mechanical specifications at STC and NOCT'),
  ('EU Declaration of Conformity',  'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://www.vikramsolar.com/docs/placeholder/eu-doc.pdf',     524288,   'application/pdf', '81b5c9d3e7f1a5b9c3d7e1f5a9b3c7d1e5f9a3b7c1d5e9f3a7b1c5d9e3f7a1b5d0', 'sha256', 'Vikram Solar Limited', '2026-01-01', 'EU Declaration of Conformity under applicable directives'),
  ('Installation and User Manual',  'user_manual'::document_type,             'public'::document_access_level,  'https://www.vikramsolar.com/docs/placeholder/manual.pdf',     5242880,  'application/pdf', '92c6d0e4f8a2b6c0d4e8f2a6b0c4d8e2f6a0b4c8d2e6f0a4b8c2d6e0f4a8b2c7e1', 'sha256', 'Vikram Solar Limited', '2026-01-01', 'Complete installation, commissioning, and maintenance guide'),
  ('Safety Instructions',           'safety_instructions'::document_type,     'public'::document_access_level,  'https://www.vikramsolar.com/docs/placeholder/safety.pdf',     1048576,  'application/pdf', 'a3d7e1f5a9b3c7d1e5f9a3b7c1d5e9f3a7b1c5d9e3f7a1b5c9d3e7f1a5b9c3d8f2', 'sha256', 'Vikram Solar Limited', '2026-01-01', 'Safety guidelines for handling, transport, and installation'),
  ('Environmental Product Declaration', 'epd'::document_type,                 'public'::document_access_level,  'https://www.vikramsolar.com/docs/placeholder/epd.pdf',        3145728,  'application/pdf', 'b4e8f2a6b0c4d8e2f6a0b4c8d2e6f0a4b8c2d6e0f4a8b2c6d0e4f8a2b6c0d4e9a3', 'sha256', 'DNV', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025'),
  ('End-of-Life Recycling Guide',   'recycling_guide'::document_type,         'recycler'::document_access_level,'https://www.vikramsolar.com/docs/placeholder/recycling.pdf',  1572864,  'application/pdf', 'c5f9a3b7c1d5e9f3a7b1c5d9e3f7a1b5c9d3e7f1a5b9c3d7e1f5a9b3c7d1e5f0b4', 'sha256', 'Vikram Solar Limited', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.manufacturer_name = 'Vikram Solar Limited';

-- Fix Vikram URLs
UPDATE passport_documents SET url = REPLACE(url, 'placeholder', 'VSMDH-595-TOPCON')  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'vks-595%');
UPDATE passport_documents SET url = REPLACE(url, 'placeholder', 'VSMDH-590-TOPCON')  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'vks-590%');
UPDATE passport_documents SET url = REPLACE(url, 'placeholder', 'VSMDH-580-TOPCON')  WHERE passport_id IN (SELECT id FROM passports WHERE public_id LIKE 'vks-580%');


-- ============================================================
-- 6. PASSPORT CIRCULARITY (published + approved only = 24 rows)
-- Draft and under_review passports do NOT get circularity data
-- ============================================================

-- ============================================================
-- WAAREE CIRCULARITY (published: 01,02,03,05,06,08; approved: 04,07 = 8 rows)
-- ============================================================

INSERT INTO passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recycler_name, recycler_contact,
  recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
)
SELECT
  p.id, 92.00, 28.00, 0.00,
  true,
  'Contains lead traces in solder alloy (<0.1% by weight). Classified under EU WEEE Directive 2012/19/EU. Handle per local hazardous waste regulations during decommissioning.',
  35,
  E'1. Disconnect cables and remove junction box (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate glass panels via thermal delamination at 350\u00b0C (10 min)\n4. Remove EVA/POE encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present \u2014 handle per local hazardous material guidelines.',
  'EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022. Producer take-back programme available.',
  'Veolia PV Recycling', 'pvrecycling@veolia.com',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). Overall BOM recovery rate >92%.',
  'in_use'
FROM passports p
WHERE p.public_id IN (
  'wrm-700topcon-2026-001','wrm-700topcon-2026-002','wrm-700topcon-2026-003','wrm-700topcon-2026-004',
  'wrm-590topcon-2026-005','wrm-590topcon-2026-006','wrm-590topcon-2026-007',
  'wrm-580topcon-2026-008'
);


-- ============================================================
-- ADANI CIRCULARITY — TOPCon passports (01-07 = 7 rows, recycled 28%)
-- ============================================================

INSERT INTO passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recycler_name, recycler_contact,
  recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
)
SELECT
  p.id, 92.00, 28.00, 0.00,
  true,
  'Contains lead traces in solder alloy (<0.1% by weight). Classified under EU WEEE Directive 2012/19/EU. Handle per local hazardous waste regulations during decommissioning.',
  35,
  E'1. Disconnect cables and remove junction box (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate glass panels via thermal delamination at 350\u00b0C (10 min)\n4. Remove EVA/POE encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present \u2014 handle per local hazardous material guidelines.',
  'EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022. Producer take-back programme available.',
  'First Solar Recycling', 'recycling@firstsolar.com',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). Overall BOM recovery rate >92%.',
  'in_use'
FROM passports p
WHERE p.public_id IN (
  'ads-590topcon-2026-001','ads-590topcon-2026-002','ads-590topcon-2026-003','ads-590topcon-2026-004',
  'ads-580topcon-2026-005','ads-580topcon-2026-006','ads-580topcon-2026-007'
);

-- ADANI CIRCULARITY — PERC passport (08 only = 1 row, recycled 22%)
INSERT INTO passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recycler_name, recycler_contact,
  recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
)
SELECT
  p.id, 92.00, 22.00, 0.00,
  true,
  'Contains lead traces in solder alloy (<0.1% by weight). Classified under EU WEEE Directive 2012/19/EU. Handle per local hazardous waste regulations during decommissioning.',
  35,
  E'1. Disconnect cables and remove junction box (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate glass via thermal delamination at 350\u00b0C (10 min)\n4. Remove backsheet and EVA encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present \u2014 handle per local hazardous material guidelines.',
  'EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022. Producer take-back programme available.',
  'First Solar Recycling', 'recycling@firstsolar.com',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). PERC modules have slightly lower recycled content due to backsheet composition.',
  'in_use'
FROM passports p
WHERE p.public_id = 'ads-545perc-2026-008';


-- ============================================================
-- VIKRAM CIRCULARITY (published: 01,02,03,05,06,08; approved: 04,07 = 8 rows)
-- ============================================================

INSERT INTO passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recycler_name, recycler_contact,
  recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
)
SELECT
  p.id, 92.00, 28.00, 0.00,
  true,
  'Contains lead traces in solder alloy (<0.1% by weight). Classified under EU WEEE Directive 2012/19/EU. Handle per local hazardous waste regulations during decommissioning.',
  35,
  E'1. Disconnect cables and remove junction box (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate glass panels via thermal delamination at 350\u00b0C (10 min)\n4. Remove EVA/POE encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present \u2014 handle per local hazardous material guidelines.',
  'EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022. Producer take-back programme available.',
  'ROSI Solar', 'contact@rfrosi.com',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). Overall BOM recovery rate >92%.',
  'in_use'
FROM passports p
WHERE p.public_id IN (
  'vks-595topcon-2026-001','vks-595topcon-2026-002','vks-595topcon-2026-003','vks-595topcon-2026-004',
  'vks-590topcon-2026-005','vks-590topcon-2026-006','vks-590topcon-2026-007',
  'vks-580topcon-2026-008'
);


-- ============================================================
-- DONE: 30 passports, 300 materials, ~198 certificates,
-- 180 documents, 24 circularity records
-- ============================================================
