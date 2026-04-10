-- ============================================================
-- Migration 00013: Seed 20 full passports + backfill existing 30
-- Part 1: Update existing 30 passports with missing columns
-- Part 2: Insert 20 new passports (Tata, Renewsys, Goldi, Microtek)
--         with materials, certificates, documents, circularity,
--         and supply chain actors
-- ============================================================


-- ============================================================
-- PART 1A: Update existing 30 passports — missing columns
-- ============================================================

-- Waaree Energies
UPDATE passports SET
  carbon_intensity_g_co2e_per_kwh = 22.5,
  carbon_lca_boundary = 'cradle_to_gate',
  carbon_verification_ref = 'EPD-WRM-2025-001',
  facility_country = 'India',
  reach_status = 'compliant',
  rohs_status = 'compliant_with_exemption',
  data_carrier_type = 'QR'
WHERE manufacturer_name = 'Waaree Energies Ltd.';

-- Adani Solar
UPDATE passports SET
  carbon_intensity_g_co2e_per_kwh = 24.0,
  carbon_lca_boundary = 'cradle_to_gate',
  carbon_verification_ref = 'EPD-ADS-2025-001',
  facility_country = 'India',
  reach_status = 'compliant',
  rohs_status = 'compliant_with_exemption',
  data_carrier_type = 'QR'
WHERE manufacturer_name LIKE '%Adani%';

-- Vikram Solar
UPDATE passports SET
  carbon_intensity_g_co2e_per_kwh = 23.2,
  carbon_lca_boundary = 'cradle_to_gate',
  carbon_verification_ref = 'EPD-VKS-2025-001',
  facility_country = 'India',
  reach_status = 'compliant',
  rohs_status = 'compliant_with_exemption',
  data_carrier_type = 'QR'
WHERE manufacturer_name LIKE '%Vikram%';


-- ============================================================
-- PART 1B: Supply chain actors for ALL existing 30 passports
-- ============================================================

-- Tier 4: Polysilicon — Tongwei (all passports)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  'Tongwei Co., Ltd.', 'Polysilicon Supplier', 'China', 'Leshan Polysilicon Plant', 'Leshan, Sichuan, China', 4, 'raw_material', true, 1
FROM passports p
WHERE p.public_id LIKE 'wrm-%' OR p.public_id LIKE 'ads-%' OR p.public_id LIKE 'vks-%';

-- Tier 3: Wafer — LONGi (all passports)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  'LONGi Green Energy', 'Wafer Manufacturer', 'China', 'Xian Wafer Plant', 'Xian, Shaanxi, China', 3, 'component', true, 2
FROM passports p
WHERE p.public_id LIKE 'wrm-%' OR p.public_id LIKE 'ads-%' OR p.public_id LIKE 'vks-%';

-- Tier 1: Cell & Module Manufacturer — varies by manufacturer
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  CASE
    WHEN p.manufacturer_name = 'Waaree Energies Ltd.' THEN 'Waaree Energies Ltd.'
    WHEN p.manufacturer_name LIKE '%Adani%' THEN 'Mundra Solar PV Ltd.'
    WHEN p.manufacturer_name LIKE '%Vikram%' THEN 'Vikram Solar Limited'
  END,
  'Cell & Module Manufacturer', 'India',
  CASE
    WHEN p.manufacturer_name = 'Waaree Energies Ltd.' THEN 'Surat SEZ GigaFactory'
    WHEN p.manufacturer_name LIKE '%Adani%' THEN 'Mundra Solar Manufacturing'
    WHEN p.manufacturer_name LIKE '%Vikram%' THEN 'Falta SEZ Plant'
  END,
  CASE
    WHEN p.manufacturer_name = 'Waaree Energies Ltd.' THEN 'Surat, Gujarat, India'
    WHEN p.manufacturer_name LIKE '%Adani%' THEN 'Mundra, Gujarat, India'
    WHEN p.manufacturer_name LIKE '%Vikram%' THEN 'Falta, West Bengal, India'
  END,
  1, 'manufacturing', true, 3
FROM passports p
WHERE p.public_id LIKE 'wrm-%' OR p.public_id LIKE 'ads-%' OR p.public_id LIKE 'vks-%';

-- Tier 1: Logistics — Kuehne+Nagel (all passports)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  'Kuehne+Nagel International AG', 'Logistics Provider', 'Germany', 'Hamburg Distribution Hub', 'Hamburg, Germany', 1, 'logistics', true, 4
FROM passports p
WHERE p.public_id LIKE 'wrm-%' OR p.public_id LIKE 'ads-%' OR p.public_id LIKE 'vks-%';


-- ============================================================
-- PART 2: INSERT 20 NEW PASSPORTS
-- ============================================================


-- ============================================================
-- TATA POWER SOLAR (5 passports)
-- TPS-HJT-660: 660W HJT, 3 published+verified, 1 approved+pending, 1 under_review+pending
-- ============================================================

-- TPS-01: 660W HJT — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'TPS-PVP-2026-0001', 'tps-hjt660-2026-001', 'TPS-HJT-660', 'TPS-2026-HJT-200001', 'B-2026-Q1-HJT', '08901234580001',
  'crystalline_silicon_hjt', 'published', 'verified',
  'Tata Power Solar Systems Ltd.', 'OP-TPS-IN-2024', 'Plot 1, Bangalore-Hyderabad Highway, Electronics City Phase 1, Bengaluru 560100', 'https://www.tatapowersolar.com', 'India',
  'FAC-TPS-BLR-001', 'Tata Power Solar Bengaluru Plant', 'Bengaluru, Karnataka, India', '2026-02-05',
  660.00, 22.10, 51.80, 16.95, 43.50, 15.17,
  1500, 2278, 1134, 30, 32.50,
  132, 'M10 N-type HJT bifacial',
  15, 30, 88.00,
  0.35, 35,
  380.00, 'ISO 14067:2018',
  -0.260, -0.240, 0.040, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.85,
  20.50, 'cradle_to_gate', 'EPD-TPS-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-05T00:00:00Z'
);

-- TPS-02: 660W HJT — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'TPS-PVP-2026-0002', 'tps-hjt660-2026-002', 'TPS-HJT-660', 'TPS-2026-HJT-200002', 'B-2026-Q1-HJT', '08901234580002',
  'crystalline_silicon_hjt', 'published', 'verified',
  'Tata Power Solar Systems Ltd.', 'OP-TPS-IN-2024', 'Plot 1, Bangalore-Hyderabad Highway, Electronics City Phase 1, Bengaluru 560100', 'https://www.tatapowersolar.com', 'India',
  'FAC-TPS-BLR-001', 'Tata Power Solar Bengaluru Plant', 'Bengaluru, Karnataka, India', '2026-02-12',
  660.00, 22.10, 51.80, 16.95, 43.50, 15.17,
  1500, 2278, 1134, 30, 32.50,
  132, 'M10 N-type HJT bifacial',
  15, 30, 88.00,
  0.35, 35,
  380.00, 'ISO 14067:2018',
  -0.260, -0.240, 0.040, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.85,
  20.50, 'cradle_to_gate', 'EPD-TPS-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-10T00:00:00Z'
);

-- TPS-03: 660W HJT — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'TPS-PVP-2026-0003', 'tps-hjt660-2026-003', 'TPS-HJT-660', 'TPS-2026-HJT-200003', 'B-2026-Q1-HJT', '08901234580003',
  'crystalline_silicon_hjt', 'published', 'verified',
  'Tata Power Solar Systems Ltd.', 'OP-TPS-IN-2024', 'Plot 1, Bangalore-Hyderabad Highway, Electronics City Phase 1, Bengaluru 560100', 'https://www.tatapowersolar.com', 'India',
  'FAC-TPS-BLR-001', 'Tata Power Solar Bengaluru Plant', 'Bengaluru, Karnataka, India', '2026-02-20',
  660.00, 22.10, 51.80, 16.95, 43.50, 15.17,
  1500, 2278, 1134, 30, 32.50,
  132, 'M10 N-type HJT bifacial',
  15, 30, 88.00,
  0.35, 35,
  380.00, 'ISO 14067:2018',
  -0.260, -0.240, 0.040, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.85,
  20.50, 'cradle_to_gate', 'EPD-TPS-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-15T00:00:00Z'
);

-- TPS-04: 660W HJT — Approved
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'TPS-PVP-2026-0004', 'tps-hjt660-2026-004', 'TPS-HJT-660', 'TPS-2026-HJT-200004', 'B-2026-Q1-HJT', '08901234580004',
  'crystalline_silicon_hjt', 'approved', 'pending',
  'Tata Power Solar Systems Ltd.', 'OP-TPS-IN-2024', 'Plot 1, Bangalore-Hyderabad Highway, Electronics City Phase 1, Bengaluru 560100', 'https://www.tatapowersolar.com', 'India',
  'FAC-TPS-BLR-001', 'Tata Power Solar Bengaluru Plant', 'Bengaluru, Karnataka, India', '2026-03-01',
  660.00, 22.10, 51.80, 16.95, 43.50, 15.17,
  1500, 2278, 1134, 30, 32.50,
  132, 'M10 N-type HJT bifacial',
  15, 30, 88.00,
  0.35, 35,
  380.00, 'ISO 14067:2018',
  -0.260, -0.240, 0.040, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.85,
  20.50, 'cradle_to_gate', 'EPD-TPS-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);

-- TPS-05: 660W HJT — Under Review
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'TPS-PVP-2026-0005', 'tps-hjt660-2026-005', 'TPS-HJT-660', 'TPS-2026-HJT-200005', 'B-2026-Q1-HJT', '08901234580005',
  'crystalline_silicon_hjt', 'under_review', 'pending',
  'Tata Power Solar Systems Ltd.', 'OP-TPS-IN-2024', 'Plot 1, Bangalore-Hyderabad Highway, Electronics City Phase 1, Bengaluru 560100', 'https://www.tatapowersolar.com', 'India',
  'FAC-TPS-BLR-001', 'Tata Power Solar Bengaluru Plant', 'Bengaluru, Karnataka, India', '2026-03-10',
  660.00, 22.10, 51.80, 16.95, 43.50, 15.17,
  1500, 2278, 1134, 30, 32.50,
  132, 'M10 N-type HJT bifacial',
  15, 30, 88.00,
  0.35, 35,
  380.00, 'ISO 14067:2018',
  -0.260, -0.240, 0.040, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.85,
  20.50, 'cradle_to_gate', 'EPD-TPS-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);


-- ============================================================
-- RENEWSYS INDIA (5 passports)
-- RNW-545-PERC-Mono: 545W PERC, 3 published+verified, 1 approved+pending, 1 under_review+pending
-- ============================================================

-- RNW-01: 545W PERC — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'RNW-PVP-2026-0001', 'rnw-545perc-2026-001', 'RNW-545-PERC-Mono', 'RNW-2026-PERC-300001', 'B-2026-Q1-PERC', '08901234590001',
  'crystalline_silicon_perc', 'published', 'verified',
  'Renewsys India Pvt. Ltd.', 'OP-RNW-IN-2024', 'Survey No. 55, Hyderabad-Bangalore Highway, Patancheru, Telangana 502319', 'https://www.renewsys.com', 'India',
  'FAC-RNW-PAT-001', 'Renewsys Patancheru Manufacturing', 'Patancheru, Telangana, India', '2026-02-03',
  545.00, 21.10, 49.60, 13.95, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.50,
  144, 'M10 P-type PERC half-cut mono',
  12, 25, 84.80,
  0.55, 30,
  480.00, 'ISO 14067:2018',
  -0.340, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  26.00, 'cradle_to_gate', 'EPD-RNW-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-01T00:00:00Z'
);

-- RNW-02: 545W PERC — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'RNW-PVP-2026-0002', 'rnw-545perc-2026-002', 'RNW-545-PERC-Mono', 'RNW-2026-PERC-300002', 'B-2026-Q1-PERC', '08901234590002',
  'crystalline_silicon_perc', 'published', 'verified',
  'Renewsys India Pvt. Ltd.', 'OP-RNW-IN-2024', 'Survey No. 55, Hyderabad-Bangalore Highway, Patancheru, Telangana 502319', 'https://www.renewsys.com', 'India',
  'FAC-RNW-PAT-001', 'Renewsys Patancheru Manufacturing', 'Patancheru, Telangana, India', '2026-02-10',
  545.00, 21.10, 49.60, 13.95, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.50,
  144, 'M10 P-type PERC half-cut mono',
  12, 25, 84.80,
  0.55, 30,
  480.00, 'ISO 14067:2018',
  -0.340, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  26.00, 'cradle_to_gate', 'EPD-RNW-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-08T00:00:00Z'
);

-- RNW-03: 545W PERC — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'RNW-PVP-2026-0003', 'rnw-545perc-2026-003', 'RNW-545-PERC-Mono', 'RNW-2026-PERC-300003', 'B-2026-Q1-PERC', '08901234590003',
  'crystalline_silicon_perc', 'published', 'verified',
  'Renewsys India Pvt. Ltd.', 'OP-RNW-IN-2024', 'Survey No. 55, Hyderabad-Bangalore Highway, Patancheru, Telangana 502319', 'https://www.renewsys.com', 'India',
  'FAC-RNW-PAT-001', 'Renewsys Patancheru Manufacturing', 'Patancheru, Telangana, India', '2026-02-18',
  545.00, 21.10, 49.60, 13.95, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.50,
  144, 'M10 P-type PERC half-cut mono',
  12, 25, 84.80,
  0.55, 30,
  480.00, 'ISO 14067:2018',
  -0.340, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  26.00, 'cradle_to_gate', 'EPD-RNW-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-12T00:00:00Z'
);

-- RNW-04: 545W PERC — Approved
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'RNW-PVP-2026-0004', 'rnw-545perc-2026-004', 'RNW-545-PERC-Mono', 'RNW-2026-PERC-300004', 'B-2026-Q1-PERC', '08901234590004',
  'crystalline_silicon_perc', 'approved', 'pending',
  'Renewsys India Pvt. Ltd.', 'OP-RNW-IN-2024', 'Survey No. 55, Hyderabad-Bangalore Highway, Patancheru, Telangana 502319', 'https://www.renewsys.com', 'India',
  'FAC-RNW-PAT-001', 'Renewsys Patancheru Manufacturing', 'Patancheru, Telangana, India', '2026-02-25',
  545.00, 21.10, 49.60, 13.95, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.50,
  144, 'M10 P-type PERC half-cut mono',
  12, 25, 84.80,
  0.55, 30,
  480.00, 'ISO 14067:2018',
  -0.340, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  26.00, 'cradle_to_gate', 'EPD-RNW-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);

-- RNW-05: 545W PERC — Under Review
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'RNW-PVP-2026-0005', 'rnw-545perc-2026-005', 'RNW-545-PERC-Mono', 'RNW-2026-PERC-300005', 'B-2026-Q1-PERC', '08901234590005',
  'crystalline_silicon_perc', 'under_review', 'pending',
  'Renewsys India Pvt. Ltd.', 'OP-RNW-IN-2024', 'Survey No. 55, Hyderabad-Bangalore Highway, Patancheru, Telangana 502319', 'https://www.renewsys.com', 'India',
  'FAC-RNW-PAT-001', 'Renewsys Patancheru Manufacturing', 'Patancheru, Telangana, India', '2026-03-05',
  545.00, 21.10, 49.60, 13.95, 41.50, 13.13,
  1500, 2278, 1134, 35, 28.50,
  144, 'M10 P-type PERC half-cut mono',
  12, 25, 84.80,
  0.55, 30,
  480.00, 'ISO 14067:2018',
  -0.340, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  26.00, 'cradle_to_gate', 'EPD-RNW-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);


-- ============================================================
-- GOLDI SOLAR (5 passports)
-- GLD-590-TOPCON: 590W TOPCon, 3 published+verified, 1 approved+pending, 1 under_review+pending
-- ============================================================

-- GLD-01: 590W TOPCon — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'GLD-PVP-2026-0001', 'gld-590topcon-2026-001', 'GLD-590-TOPCON', 'GLD-2026-TOPCON-400001', 'B-2026-Q1-TOPCON', '08901234600001',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Goldi Solar Pvt. Ltd.', 'OP-GLD-IN-2024', 'Sanand-II Industrial Area, Ahmedabad, Gujarat 382110', 'https://www.goldisolar.com', 'India',
  'FAC-GLD-SND-001', 'Goldi Solar Sanand GigaFactory', 'Sanand, Gujarat, India', '2026-02-08',
  590.00, 22.30, 46.50, 17.10, 39.20, 15.05,
  1500, 2172, 1303, 35, 33.00,
  120, 'G12 N-type TOPCon bifacial',
  12, 30, 87.00,
  0.40, 35,
  420.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  22.80, 'cradle_to_gate', 'EPD-GLD-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-02T00:00:00Z'
);

-- GLD-02: 590W TOPCon — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'GLD-PVP-2026-0002', 'gld-590topcon-2026-002', 'GLD-590-TOPCON', 'GLD-2026-TOPCON-400002', 'B-2026-Q1-TOPCON', '08901234600002',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Goldi Solar Pvt. Ltd.', 'OP-GLD-IN-2024', 'Sanand-II Industrial Area, Ahmedabad, Gujarat 382110', 'https://www.goldisolar.com', 'India',
  'FAC-GLD-SND-001', 'Goldi Solar Sanand GigaFactory', 'Sanand, Gujarat, India', '2026-02-15',
  590.00, 22.30, 46.50, 17.10, 39.20, 15.05,
  1500, 2172, 1303, 35, 33.00,
  120, 'G12 N-type TOPCon bifacial',
  12, 30, 87.00,
  0.40, 35,
  420.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  22.80, 'cradle_to_gate', 'EPD-GLD-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-09T00:00:00Z'
);

-- GLD-03: 590W TOPCon — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'GLD-PVP-2026-0003', 'gld-590topcon-2026-003', 'GLD-590-TOPCON', 'GLD-2026-TOPCON-400003', 'B-2026-Q1-TOPCON', '08901234600003',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Goldi Solar Pvt. Ltd.', 'OP-GLD-IN-2024', 'Sanand-II Industrial Area, Ahmedabad, Gujarat 382110', 'https://www.goldisolar.com', 'India',
  'FAC-GLD-SND-001', 'Goldi Solar Sanand GigaFactory', 'Sanand, Gujarat, India', '2026-02-22',
  590.00, 22.30, 46.50, 17.10, 39.20, 15.05,
  1500, 2172, 1303, 35, 33.00,
  120, 'G12 N-type TOPCon bifacial',
  12, 30, 87.00,
  0.40, 35,
  420.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  22.80, 'cradle_to_gate', 'EPD-GLD-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-18T00:00:00Z'
);

-- GLD-04: 590W TOPCon — Approved
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'GLD-PVP-2026-0004', 'gld-590topcon-2026-004', 'GLD-590-TOPCON', 'GLD-2026-TOPCON-400004', 'B-2026-Q1-TOPCON', '08901234600004',
  'crystalline_silicon_topcon', 'approved', 'pending',
  'Goldi Solar Pvt. Ltd.', 'OP-GLD-IN-2024', 'Sanand-II Industrial Area, Ahmedabad, Gujarat 382110', 'https://www.goldisolar.com', 'India',
  'FAC-GLD-SND-001', 'Goldi Solar Sanand GigaFactory', 'Sanand, Gujarat, India', '2026-03-01',
  590.00, 22.30, 46.50, 17.10, 39.20, 15.05,
  1500, 2172, 1303, 35, 33.00,
  120, 'G12 N-type TOPCon bifacial',
  12, 30, 87.00,
  0.40, 35,
  420.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  22.80, 'cradle_to_gate', 'EPD-GLD-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);

-- GLD-05: 590W TOPCon — Under Review
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'GLD-PVP-2026-0005', 'gld-590topcon-2026-005', 'GLD-590-TOPCON', 'GLD-2026-TOPCON-400005', 'B-2026-Q1-TOPCON', '08901234600005',
  'crystalline_silicon_topcon', 'under_review', 'pending',
  'Goldi Solar Pvt. Ltd.', 'OP-GLD-IN-2024', 'Sanand-II Industrial Area, Ahmedabad, Gujarat 382110', 'https://www.goldisolar.com', 'India',
  'FAC-GLD-SND-001', 'Goldi Solar Sanand GigaFactory', 'Sanand, Gujarat, India', '2026-03-08',
  590.00, 22.30, 46.50, 17.10, 39.20, 15.05,
  1500, 2172, 1303, 35, 33.00,
  120, 'G12 N-type TOPCon bifacial',
  12, 30, 87.00,
  0.40, 35,
  420.00, 'ISO 14067:2018',
  -0.290, -0.250, 0.045, 43.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.80,
  22.80, 'cradle_to_gate', 'EPD-GLD-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);


-- ============================================================
-- MICROTEK SOLAR (5 passports)
-- MKT-440-PERC-Mono: 440W PERC, 3 published+verified, 1 approved+pending, 1 under_review+pending
-- ============================================================

-- MKT-01: 440W PERC — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'MKT-PVP-2026-0001', 'mkt-440perc-2026-001', 'MKT-440-PERC-Mono', 'MKT-2026-PERC-500001', 'B-2026-Q1-PERC', '08901234610001',
  'crystalline_silicon_perc', 'published', 'verified',
  'Microtek International Pvt. Ltd.', 'OP-MKT-IN-2024', 'D-47, Sector 63, Noida, Uttar Pradesh 201301', 'https://www.microteksolar.com', 'India',
  'FAC-MKT-NOI-001', 'Microtek Solar Noida Plant', 'Noida, Uttar Pradesh, India', '2026-02-04',
  440.00, 20.40, 43.50, 13.20, 36.80, 11.96,
  1500, 1722, 1134, 35, 22.00,
  108, 'M10 P-type PERC half-cut mono',
  10, 25, 84.00,
  0.55, 30,
  390.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  27.50, 'cradle_to_gate', 'EPD-MKT-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-03T00:00:00Z'
);

-- MKT-02: 440W PERC — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'MKT-PVP-2026-0002', 'mkt-440perc-2026-002', 'MKT-440-PERC-Mono', 'MKT-2026-PERC-500002', 'B-2026-Q1-PERC', '08901234610002',
  'crystalline_silicon_perc', 'published', 'verified',
  'Microtek International Pvt. Ltd.', 'OP-MKT-IN-2024', 'D-47, Sector 63, Noida, Uttar Pradesh 201301', 'https://www.microteksolar.com', 'India',
  'FAC-MKT-NOI-001', 'Microtek Solar Noida Plant', 'Noida, Uttar Pradesh, India', '2026-02-11',
  440.00, 20.40, 43.50, 13.20, 36.80, 11.96,
  1500, 1722, 1134, 35, 22.00,
  108, 'M10 P-type PERC half-cut mono',
  10, 25, 84.00,
  0.55, 30,
  390.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  27.50, 'cradle_to_gate', 'EPD-MKT-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-07T00:00:00Z'
);

-- MKT-03: 440W PERC — Published
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version, published_at
) VALUES (
  'MKT-PVP-2026-0003', 'mkt-440perc-2026-003', 'MKT-440-PERC-Mono', 'MKT-2026-PERC-500003', 'B-2026-Q1-PERC', '08901234610003',
  'crystalline_silicon_perc', 'published', 'verified',
  'Microtek International Pvt. Ltd.', 'OP-MKT-IN-2024', 'D-47, Sector 63, Noida, Uttar Pradesh 201301', 'https://www.microteksolar.com', 'India',
  'FAC-MKT-NOI-001', 'Microtek Solar Noida Plant', 'Noida, Uttar Pradesh, India', '2026-02-19',
  440.00, 20.40, 43.50, 13.20, 36.80, 11.96,
  1500, 1722, 1134, 35, 22.00,
  108, 'M10 P-type PERC half-cut mono',
  10, 25, 84.00,
  0.55, 30,
  390.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  27.50, 'cradle_to_gate', 'EPD-MKT-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1, '2026-03-14T00:00:00Z'
);

-- MKT-04: 440W PERC — Approved
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'MKT-PVP-2026-0004', 'mkt-440perc-2026-004', 'MKT-440-PERC-Mono', 'MKT-2026-PERC-500004', 'B-2026-Q1-PERC', '08901234610004',
  'crystalline_silicon_perc', 'approved', 'pending',
  'Microtek International Pvt. Ltd.', 'OP-MKT-IN-2024', 'D-47, Sector 63, Noida, Uttar Pradesh 201301', 'https://www.microteksolar.com', 'India',
  'FAC-MKT-NOI-001', 'Microtek Solar Noida Plant', 'Noida, Uttar Pradesh, India', '2026-02-28',
  440.00, 20.40, 43.50, 13.20, 36.80, 11.96,
  1500, 1722, 1134, 35, 22.00,
  108, 'M10 P-type PERC half-cut mono',
  10, 25, 84.00,
  0.55, 30,
  390.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  27.50, 'cradle_to_gate', 'EPD-MKT-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);

-- MKT-05: 440W PERC — Under Review
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
  carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
  facility_country, reach_status, rohs_status, data_carrier_type,
  passport_version
) VALUES (
  'MKT-PVP-2026-0005', 'mkt-440perc-2026-005', 'MKT-440-PERC-Mono', 'MKT-2026-PERC-500005', 'B-2026-Q1-PERC', '08901234610005',
  'crystalline_silicon_perc', 'under_review', 'pending',
  'Microtek International Pvt. Ltd.', 'OP-MKT-IN-2024', 'D-47, Sector 63, Noida, Uttar Pradesh 201301', 'https://www.microteksolar.com', 'India',
  'FAC-MKT-NOI-001', 'Microtek Solar Noida Plant', 'Noida, Uttar Pradesh, India', '2026-03-10',
  440.00, 20.40, 43.50, 13.20, 36.80, 11.96,
  1500, 1722, 1134, 35, 22.00,
  108, 'M10 P-type PERC half-cut mono',
  10, 25, 84.00,
  0.55, 30,
  390.00, 'ISO 14067:2018',
  -0.350, -0.280, 0.048, 45.0,
  'Class A', 'IP68', 'MC4 Compatible', 'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', 0.00,
  27.50, 'cradle_to_gate', 'EPD-MKT-2026-001',
  'India', 'compliant', 'compliant_with_exemption', 'QR',
  1
);


-- ============================================================
-- 3. MATERIALS FOR 20 NEW PASSPORTS
-- ============================================================

-- ============================================================
-- TATA POWER SOLAR MATERIALS (all 5 passports): 32500g total
-- Glass 42% = 13650g, Al 12% = 3900g, Si 6.5% = 2112.5g, EVA/POE 9.5% = 3087.5g
-- Cu 2% = 650g, Ag 0.15% = 48.75g, Solder 0.3% = 97.5g, Rear glass 3.5% = 1137.5g
-- JB 1.2% = 390g, Other 1.5% = 487.5g
-- ============================================================

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        13650.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3900.00, 12.00, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2112.50,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification for solar-grade reuse', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3087.50,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination at 350C required before recovery', 4),
  ('Copper ribbon',          'interconnects',         650.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     48.75,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 97.50,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Rear glass',             'rear_cover',           1137.50,  3.50, '65997-17-3', false, false, NULL, NULL, 'Recyclable via glass cullet recovery', 8),
  ('Junction box (PPO)',     'junction_box',          390.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable component — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            487.50,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id LIKE 'tps-hjt660-2026-%';


-- ============================================================
-- RENEWSYS MATERIALS (all 5 passports): 28500g total
-- Glass 42% = 11970g, Al 12.5% = 3562.5g, Si 6.5% = 1852.5g, EVA 9.5% = 2707.5g
-- Cu 2% = 570g, Ag 0.15% = 42.75g, Solder 0.3% = 85.5g, Backsheet 4% = 1140g
-- JB 1.2% = 342g, Other 1.5% = 427.5g
-- ============================================================

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        11970.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3562.50, 12.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          1852.50,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification for solar-grade reuse', 3),
  ('EVA encapsulant',        'encapsulant',          2707.50,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination at 350C required before recovery', 4),
  ('Copper ribbon',          'interconnects',         570.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     42.75,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 85.50,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',        1140.00,  4.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          342.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable component — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            427.50,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id LIKE 'rnw-545perc-2026-%';


-- ============================================================
-- GOLDI SOLAR MATERIALS (all 5 passports): 33000g total
-- Glass 42% = 13860g, Al 12% = 3960g, Si 6.5% = 2145g, EVA/POE 9.5% = 3135g
-- Cu 2% = 660g, Ag 0.15% = 49.5g, Solder 0.3% = 99g, Rear glass 3.5% = 1155g
-- JB 1.2% = 396g, Other 1.5% = 495g
-- ============================================================

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',        13860.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               3960.00, 12.00, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          2145.00,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification for solar-grade reuse', 3),
  ('EVA/POE encapsulant',    'encapsulant',          3135.00,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination at 350C required before recovery', 4),
  ('Copper ribbon',          'interconnects',         660.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     49.50,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 99.00,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Rear glass',             'rear_cover',           1155.00,  3.50, '65997-17-3', false, false, NULL, NULL, 'Recyclable via glass cullet recovery', 8),
  ('Junction box (PPO)',     'junction_box',          396.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable component — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            495.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id LIKE 'gld-590topcon-2026-%';


-- ============================================================
-- MICROTEK SOLAR MATERIALS (all 5 passports): 22000g total
-- Glass 42% = 9240g, Al 12.5% = 2750g, Si 6.5% = 1430g, EVA 9.5% = 2090g
-- Cu 2% = 440g, Ag 0.15% = 33g, Solder 0.3% = 66g, Backsheet 4% = 880g
-- JB 1.2% = 264g, Other 1.5% = 330g
-- ============================================================

INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
SELECT p.id, m.*
FROM passports p
CROSS JOIN (VALUES
  ('Tempered glass',         'front_cover',         9240.00, 42.00, '65997-17-3', false, false, NULL::numeric, NULL::text, 'Fully recyclable via glass cullet recovery', 1),
  ('Aluminium alloy',        'frame',               2750.00, 12.50, '7429-90-5',  false, false, NULL, NULL, 'Fully recyclable via aluminium smelting', 2),
  ('Monocrystalline Silicon', 'solar_cell',          1430.00,  6.50, '7440-21-3',  false, false, NULL, NULL, 'Recoverable via chemical purification for solar-grade reuse', 3),
  ('EVA encapsulant',        'encapsulant',          2090.00,  9.50, '24937-78-8', false, false, NULL, NULL, 'Thermal delamination at 350C required before recovery', 4),
  ('Copper ribbon',          'interconnects',         440.00,  2.00, '7440-50-8',  false, false, NULL, NULL, 'Recoverable via copper smelting (98% yield)', 5),
  ('Silver paste',           'cell_metallization',     33.00,  0.15, '7440-22-4',  true,  false, NULL, NULL, 'High-value chemical extraction', 6),
  ('Tin-lead solder',        'solder',                 66.00,  0.30, '7439-92-1',  false, true,  0.10, 'RoHS Annex II exemption 7(a)', 'Controlled hazardous waste — lead content', 7),
  ('Backsheet (fluoropolymer)', 'rear_cover',         880.00,  4.00, NULL,          false, false, NULL, NULL, 'Energy recovery or specialized recycling', 8),
  ('Junction box (PPO)',     'junction_box',          264.00,  1.20, NULL,          false, false, NULL, NULL, 'Separable component — recyclable plastics and metals', 9),
  ('Other (adhesives, sealants)', 'other',            330.00,  1.50, NULL,          false, false, NULL, NULL, 'Non-recoverable — thermal treatment', 10)
) AS m(material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, concentration_percent, regulatory_basis, recyclability_hint, sort_order)
WHERE p.public_id LIKE 'mkt-440perc-2026-%';


-- ============================================================
-- 4. CERTIFICATES FOR 20 NEW PASSPORTS
-- ============================================================

-- ============================================================
-- TATA POWER SOLAR CERTIFICATES (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-TPS-61215-001',   'TUV SUD', '2025-09-01', '2030-09-01', 'valid'::certificate_status, 'Design qualification and type approval for HJT heterojunction PV modules per IEC 61215:2021'),
  ('IEC 61730:2023',               'CERT-TPS-61730-001',   'TUV SUD', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification — Class A fire rating, 1500V system voltage'),
  ('IEC 61701:2020',               'CERT-TPS-61701-001',   'TUV SUD', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing — severity level 6 for coastal installations'),
  ('CE Declaration of Conformity', 'CERT-TPS-CE-001',      'Tata Power Solar Systems Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('BIS IS 14286',                 'CERT-TPS-BIS-001',     'Bureau of Indian Standards', '2025-10-15', '2028-10-15', 'valid', 'Bureau of Indian Standards mandatory certification for PV modules sold in India'),
  ('ISO 14067:2018',               'CERT-TPS-CFD-001',     'TUV SUD', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint of products — quantification per ISO 14067:2018 cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id LIKE 'tps-hjt660-2026-%';


-- ============================================================
-- RENEWSYS CERTIFICATES (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-RNW-61215-001',   'Bureau Veritas', '2025-08-15', '2030-08-15', 'valid'::certificate_status, 'Design qualification and type approval for PERC monocrystalline PV modules per IEC 61215:2021'),
  ('IEC 61730:2023',               'CERT-RNW-61730-001',   'Bureau Veritas', '2025-08-15', '2030-08-15', 'valid', 'PV module safety qualification — Class A fire rating, 1500V system voltage'),
  ('IEC 61701:2020',               'CERT-RNW-61701-001',   'Bureau Veritas', '2025-09-15', '2030-09-15', 'valid', 'Salt mist corrosion testing — severity level 6 for coastal installations'),
  ('CE Declaration of Conformity', 'CERT-RNW-CE-001',      'Renewsys India Pvt. Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('BIS IS 14286',                 'CERT-RNW-BIS-001',     'Bureau of Indian Standards', '2025-10-01', '2028-10-01', 'valid', 'Bureau of Indian Standards mandatory certification for PV modules sold in India'),
  ('ISO 14067:2018',               'CERT-RNW-CFD-001',     'Bureau Veritas', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint of products — quantification per ISO 14067:2018 cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id LIKE 'rnw-545perc-2026-%';


-- ============================================================
-- GOLDI SOLAR CERTIFICATES (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-GLD-61215-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid'::certificate_status, 'Design qualification and type approval for TOPCon bifacial PV modules per IEC 61215:2021'),
  ('IEC 61730:2023',               'CERT-GLD-61730-001',   'TUV Rheinland', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification — Class A fire rating, 1500V system voltage'),
  ('IEC 61701:2020',               'CERT-GLD-61701-001',   'TUV Rheinland', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing — severity level 6 for coastal and marine environments'),
  ('CE Declaration of Conformity', 'CERT-GLD-CE-001',      'Goldi Solar Pvt. Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('BIS IS 14286',                 'CERT-GLD-BIS-001',     'Bureau of Indian Standards', '2025-10-15', '2028-10-15', 'valid', 'Bureau of Indian Standards mandatory certification for PV modules sold in India'),
  ('ISO 14067:2018',               'CERT-GLD-CFD-001',     'TUV Rheinland', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint of products — quantification per ISO 14067:2018 cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id LIKE 'gld-590topcon-2026-%';


-- ============================================================
-- MICROTEK SOLAR CERTIFICATES (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
SELECT p.id, c.*
FROM passports p
CROSS JOIN (VALUES
  ('IEC 61215:2021',               'CERT-MKT-61215-001',   'Intertek', '2025-08-01', '2030-08-01', 'valid'::certificate_status, 'Design qualification and type approval for PERC monocrystalline residential PV modules per IEC 61215:2021'),
  ('IEC 61730:2023',               'CERT-MKT-61730-001',   'Intertek', '2025-08-01', '2030-08-01', 'valid', 'PV module safety qualification — Class A fire rating, 1500V system voltage'),
  ('IEC 61701:2020',               'CERT-MKT-61701-001',   'Intertek', '2025-09-01', '2030-09-01', 'valid', 'Salt mist corrosion testing — severity level 6 for rooftop installations'),
  ('CE Declaration of Conformity', 'CERT-MKT-CE-001',      'Microtek International Pvt. Ltd.', '2025-12-01', NULL, 'valid', 'Self-declared EU CE conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('BIS IS 14286',                 'CERT-MKT-BIS-001',     'Bureau of Indian Standards', '2025-10-01', '2028-10-01', 'valid', 'Bureau of Indian Standards mandatory certification for PV modules sold in India'),
  ('ISO 14067:2018',               'CERT-MKT-CFD-001',     'Intertek', '2025-12-15', '2028-12-15', 'valid', 'Carbon footprint of products — quantification per ISO 14067:2018 cradle-to-gate')
) AS c(standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes)
WHERE p.public_id LIKE 'mkt-440perc-2026-%';


-- ============================================================
-- 5. DOCUMENTS FOR 20 NEW PASSPORTS
-- ============================================================

-- ============================================================
-- TATA POWER SOLAR DOCUMENTS (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',              'datasheet'::document_type,                'public'::document_access_level,  'https://www.tatapowersolar.com/docs/TPS-HJT-660/datasheet.pdf',     2097152,  'application/pdf', 'aa01b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', 'sha256', 'Tata Power Solar Systems Ltd.', '2026-01-15', 'Complete electrical and mechanical specifications at STC and NOCT for TPS-HJT-660'),
  ('EU Declaration of Conformity',     'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://www.tatapowersolar.com/docs/TPS-HJT-660/eu-doc.pdf',        524288,   'application/pdf', 'bb12c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', 'sha256', 'Tata Power Solar Systems Ltd.', '2026-01-15', 'EU Declaration of Conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('Installation and User Manual',     'user_manual'::document_type,             'public'::document_access_level,  'https://www.tatapowersolar.com/docs/TPS-HJT-660/manual.pdf',        5242880,  'application/pdf', 'cc23d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', 'sha256', 'Tata Power Solar Systems Ltd.', '2026-01-15', 'Complete installation, commissioning, and maintenance guide for HJT modules'),
  ('Safety Instructions',              'safety_instructions'::document_type,     'public'::document_access_level,  'https://www.tatapowersolar.com/docs/TPS-HJT-660/safety.pdf',        1048576,  'application/pdf', 'dd34e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', 'sha256', 'Tata Power Solar Systems Ltd.', '2026-01-15', 'Safety guidelines for handling, transport, and installation of HJT modules'),
  ('Environmental Product Declaration', 'epd'::document_type,                    'public'::document_access_level,  'https://www.tatapowersolar.com/docs/TPS-HJT-660/epd.pdf',           3145728,  'application/pdf', 'ee45f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', 'sha256', 'TUV SUD', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025 and EN 15804'),
  ('End-of-Life Recycling Guide',      'recycling_guide'::document_type,         'recycler'::document_access_level,'https://www.tatapowersolar.com/docs/TPS-HJT-660/recycling.pdf',     1572864,  'application/pdf', 'ff56a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', 'sha256', 'Tata Power Solar Systems Ltd.', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.public_id LIKE 'tps-hjt660-2026-%';


-- ============================================================
-- RENEWSYS DOCUMENTS (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',              'datasheet'::document_type,                'public'::document_access_level,  'https://www.renewsys.com/docs/RNW-545-PERC-Mono/datasheet.pdf',     2097152,  'application/pdf', 'a101b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a102', 'sha256', 'Renewsys India Pvt. Ltd.', '2026-01-10', 'Complete electrical and mechanical specifications at STC and NOCT for RNW-545-PERC-Mono'),
  ('EU Declaration of Conformity',     'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://www.renewsys.com/docs/RNW-545-PERC-Mono/eu-doc.pdf',        524288,   'application/pdf', 'b212c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b213', 'sha256', 'Renewsys India Pvt. Ltd.', '2026-01-10', 'EU Declaration of Conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('Installation and User Manual',     'user_manual'::document_type,             'public'::document_access_level,  'https://www.renewsys.com/docs/RNW-545-PERC-Mono/manual.pdf',        5242880,  'application/pdf', 'c323d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c324', 'sha256', 'Renewsys India Pvt. Ltd.', '2026-01-10', 'Complete installation, commissioning, and maintenance guide for PERC modules'),
  ('Safety Instructions',              'safety_instructions'::document_type,     'public'::document_access_level,  'https://www.renewsys.com/docs/RNW-545-PERC-Mono/safety.pdf',        1048576,  'application/pdf', 'd434e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d435', 'sha256', 'Renewsys India Pvt. Ltd.', '2026-01-10', 'Safety guidelines for handling, transport, and installation of PERC modules'),
  ('Environmental Product Declaration', 'epd'::document_type,                    'public'::document_access_level,  'https://www.renewsys.com/docs/RNW-545-PERC-Mono/epd.pdf',           3145728,  'application/pdf', 'e545f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e546', 'sha256', 'Bureau Veritas', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025 and EN 15804'),
  ('End-of-Life Recycling Guide',      'recycling_guide'::document_type,         'recycler'::document_access_level,'https://www.renewsys.com/docs/RNW-545-PERC-Mono/recycling.pdf',     1572864,  'application/pdf', 'f656a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f657', 'sha256', 'Renewsys India Pvt. Ltd.', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.public_id LIKE 'rnw-545perc-2026-%';


-- ============================================================
-- GOLDI SOLAR DOCUMENTS (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',              'datasheet'::document_type,                'public'::document_access_level,  'https://www.goldisolar.com/docs/GLD-590-TOPCON/datasheet.pdf',       2097152,  'application/pdf', 'a701b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a702', 'sha256', 'Goldi Solar Pvt. Ltd.', '2026-01-12', 'Complete electrical and mechanical specifications at STC and NOCT for GLD-590-TOPCON'),
  ('EU Declaration of Conformity',     'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://www.goldisolar.com/docs/GLD-590-TOPCON/eu-doc.pdf',          524288,   'application/pdf', 'b812c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b813', 'sha256', 'Goldi Solar Pvt. Ltd.', '2026-01-12', 'EU Declaration of Conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('Installation and User Manual',     'user_manual'::document_type,             'public'::document_access_level,  'https://www.goldisolar.com/docs/GLD-590-TOPCON/manual.pdf',          5242880,  'application/pdf', 'c923d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c924', 'sha256', 'Goldi Solar Pvt. Ltd.', '2026-01-12', 'Complete installation, commissioning, and maintenance guide for TOPCon bifacial modules'),
  ('Safety Instructions',              'safety_instructions'::document_type,     'public'::document_access_level,  'https://www.goldisolar.com/docs/GLD-590-TOPCON/safety.pdf',          1048576,  'application/pdf', 'da34e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3da35', 'sha256', 'Goldi Solar Pvt. Ltd.', '2026-01-12', 'Safety guidelines for handling, transport, and installation of TOPCon modules'),
  ('Environmental Product Declaration', 'epd'::document_type,                    'public'::document_access_level,  'https://www.goldisolar.com/docs/GLD-590-TOPCON/epd.pdf',             3145728,  'application/pdf', 'eb45f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4eb46', 'sha256', 'TUV Rheinland', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025 and EN 15804'),
  ('End-of-Life Recycling Guide',      'recycling_guide'::document_type,         'recycler'::document_access_level,'https://www.goldisolar.com/docs/GLD-590-TOPCON/recycling.pdf',       1572864,  'application/pdf', 'fc56a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5fc57', 'sha256', 'Goldi Solar Pvt. Ltd.', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.public_id LIKE 'gld-590topcon-2026-%';


-- ============================================================
-- MICROTEK SOLAR DOCUMENTS (all 5 passports, 6 per passport)
-- ============================================================

INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
SELECT p.id, d.*
FROM passports p
CROSS JOIN (VALUES
  ('Technical Datasheet',              'datasheet'::document_type,                'public'::document_access_level,  'https://www.microteksolar.com/docs/MKT-440-PERC-Mono/datasheet.pdf',     2097152,  'application/pdf', 'ad01b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0ad02', 'sha256', 'Microtek International Pvt. Ltd.', '2026-01-08', 'Complete electrical and mechanical specifications at STC and NOCT for MKT-440-PERC-Mono'),
  ('EU Declaration of Conformity',     'declaration_of_conformity'::document_type,'public'::document_access_level,  'https://www.microteksolar.com/docs/MKT-440-PERC-Mono/eu-doc.pdf',        524288,   'application/pdf', 'be12c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1be13', 'sha256', 'Microtek International Pvt. Ltd.', '2026-01-08', 'EU Declaration of Conformity under LVD 2014/35/EU and EMC 2014/30/EU'),
  ('Installation and User Manual',     'user_manual'::document_type,             'public'::document_access_level,  'https://www.microteksolar.com/docs/MKT-440-PERC-Mono/manual.pdf',        5242880,  'application/pdf', 'cf23d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2cf24', 'sha256', 'Microtek International Pvt. Ltd.', '2026-01-08', 'Complete installation, commissioning, and maintenance guide for residential PERC modules'),
  ('Safety Instructions',              'safety_instructions'::document_type,     'public'::document_access_level,  'https://www.microteksolar.com/docs/MKT-440-PERC-Mono/safety.pdf',        1048576,  'application/pdf', 'd034e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d035', 'sha256', 'Microtek International Pvt. Ltd.', '2026-01-08', 'Safety guidelines for handling, transport, and installation of residential modules'),
  ('Environmental Product Declaration', 'epd'::document_type,                    'public'::document_access_level,  'https://www.microteksolar.com/docs/MKT-440-PERC-Mono/epd.pdf',           3145728,  'application/pdf', 'e145f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e146', 'sha256', 'Intertek', '2025-12-01', 'Environmental product declaration — cradle-to-gate per ISO 14025 and EN 15804'),
  ('End-of-Life Recycling Guide',      'recycling_guide'::document_type,         'recycler'::document_access_level,'https://www.microteksolar.com/docs/MKT-440-PERC-Mono/recycling.pdf',     1572864,  'application/pdf', 'f256a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f257', 'sha256', 'Microtek International Pvt. Ltd.', '2025-12-01', 'End-of-life dismantling and material recovery guide for recyclers')
) AS d(name, document_type, access_level, url, file_size_bytes, mime_type, document_hash, hash_algorithm, issuer, issued_date, description)
WHERE p.public_id LIKE 'mkt-440perc-2026-%';


-- ============================================================
-- 6. CIRCULARITY FOR 20 NEW PASSPORTS
-- ============================================================

-- ============================================================
-- TATA POWER SOLAR CIRCULARITY (HJT — recycled 28%, recyclability 92%)
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
  'ROSI Solar', 'india@rfrosi.com',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). HJT modules have higher recycled content due to dual-glass design.',
  'in_use'
FROM passports p
WHERE p.public_id LIKE 'tps-hjt660-2026-%';


-- ============================================================
-- RENEWSYS CIRCULARITY (PERC — recycled 22%, recyclability 90%)
-- ============================================================

INSERT INTO passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recycler_name, recycler_contact,
  recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
)
SELECT
  p.id, 90.00, 22.00, 0.00,
  true,
  'Contains lead traces in solder alloy (<0.1% by weight). Classified under EU WEEE Directive 2012/19/EU. Handle per local hazardous waste regulations during decommissioning.',
  35,
  E'1. Disconnect cables and remove junction box (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate glass via thermal delamination at 350\u00b0C (10 min)\n4. Remove backsheet and EVA encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present \u2014 handle per local hazardous material guidelines.',
  'EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022. Producer take-back programme available.',
  'Veolia PV Recycling', 'pvrecycling@veolia.com',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). PERC modules have slightly lower recyclability due to backsheet composition.',
  'in_use'
FROM passports p
WHERE p.public_id LIKE 'rnw-545perc-2026-%';


-- ============================================================
-- GOLDI SOLAR CIRCULARITY (TOPCon — recycled 28%, recyclability 92%)
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
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). TOPCon bifacial dual-glass design enables high recyclability.',
  'in_use'
FROM passports p
WHERE p.public_id LIKE 'gld-590topcon-2026-%';


-- ============================================================
-- MICROTEK SOLAR CIRCULARITY (PERC — recycled 22%, recyclability 90%)
-- ============================================================

INSERT INTO passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recycler_name, recycler_contact,
  recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
)
SELECT
  p.id, 90.00, 22.00, 0.00,
  true,
  'Contains lead traces in solder alloy (<0.1% by weight). Classified under EU WEEE Directive 2012/19/EU. Handle per local hazardous waste regulations during decommissioning.',
  35,
  E'1. Disconnect cables and remove junction box (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate glass via thermal delamination at 350\u00b0C (10 min)\n4. Remove backsheet and EVA encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present \u2014 handle per local hazardous material guidelines.',
  'EU WEEE Directive 2012/19/EU / India E-Waste Management Rules 2022. Producer take-back programme available.',
  'SolarCycle India', 'recycle@solarcycle.in',
  true, true, true, true, true,
  'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery). Residential PERC modules — compact form factor simplifies dismantling.',
  'in_use'
FROM passports p
WHERE p.public_id LIKE 'mkt-440perc-2026-%';


-- ============================================================
-- 7. SUPPLY CHAIN ACTORS FOR 20 NEW PASSPORTS
-- ============================================================

-- Tier 4: Polysilicon — Tongwei (all 20 new passports)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  'Tongwei Co., Ltd.', 'Polysilicon Supplier', 'China', 'Leshan Polysilicon Plant', 'Leshan, Sichuan, China', 4, 'raw_material', true, 1
FROM passports p
WHERE p.public_id LIKE 'tps-%' OR p.public_id LIKE 'rnw-%' OR p.public_id LIKE 'gld-%' OR p.public_id LIKE 'mkt-%';

-- Tier 3: Wafer — LONGi (all 20 new passports)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  'LONGi Green Energy', 'Wafer Manufacturer', 'China', 'Xian Wafer Plant', 'Xian, Shaanxi, China', 3, 'component', true, 2
FROM passports p
WHERE p.public_id LIKE 'tps-%' OR p.public_id LIKE 'rnw-%' OR p.public_id LIKE 'gld-%' OR p.public_id LIKE 'mkt-%';

-- Tier 1: Cell & Module Manufacturer — varies by manufacturer
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  CASE
    WHEN p.public_id LIKE 'tps-%' THEN 'Tata Power Solar Systems Ltd.'
    WHEN p.public_id LIKE 'rnw-%' THEN 'Renewsys India Pvt. Ltd.'
    WHEN p.public_id LIKE 'gld-%' THEN 'Goldi Solar Pvt. Ltd.'
    WHEN p.public_id LIKE 'mkt-%' THEN 'Microtek International Pvt. Ltd.'
  END,
  'Cell & Module Manufacturer', 'India',
  CASE
    WHEN p.public_id LIKE 'tps-%' THEN 'Tata Power Solar Bengaluru Plant'
    WHEN p.public_id LIKE 'rnw-%' THEN 'Renewsys Patancheru Manufacturing'
    WHEN p.public_id LIKE 'gld-%' THEN 'Goldi Solar Sanand GigaFactory'
    WHEN p.public_id LIKE 'mkt-%' THEN 'Microtek Solar Noida Plant'
  END,
  CASE
    WHEN p.public_id LIKE 'tps-%' THEN 'Bengaluru, Karnataka, India'
    WHEN p.public_id LIKE 'rnw-%' THEN 'Patancheru, Telangana, India'
    WHEN p.public_id LIKE 'gld-%' THEN 'Sanand, Gujarat, India'
    WHEN p.public_id LIKE 'mkt-%' THEN 'Noida, Uttar Pradesh, India'
  END,
  1, 'manufacturing', true, 3
FROM passports p
WHERE p.public_id LIKE 'tps-%' OR p.public_id LIKE 'rnw-%' OR p.public_id LIKE 'gld-%' OR p.public_id LIKE 'mkt-%';

-- Tier 1: Logistics — Kuehne+Nagel (all 20 new passports)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order)
SELECT p.id,
  'Kuehne+Nagel International AG', 'Logistics Provider', 'Germany', 'Hamburg Distribution Hub', 'Hamburg, Germany', 1, 'logistics', true, 4
FROM passports p
WHERE p.public_id LIKE 'tps-%' OR p.public_id LIKE 'rnw-%' OR p.public_id LIKE 'gld-%' OR p.public_id LIKE 'mkt-%';


-- ============================================================
-- DONE: 20 new passports + backfill of 30 existing
-- New: 20 passports, 200 materials, 120 certificates,
--      120 documents, 20 circularity, 80 supply chain actors
-- Backfill: 30 passport updates, 120 supply chain actors
-- ============================================================
