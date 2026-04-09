-- ============================================================
-- RLS policies for authenticated users
-- ============================================================
-- Authenticated users can read ALL passports (any status)
create policy "Authenticated users can read all passports"
  on passports for select to authenticated
  using (true);

create policy "Authenticated users can read all materials"
  on passport_materials for select to authenticated
  using (true);

create policy "Authenticated users can read all certificates"
  on passport_certificates for select to authenticated
  using (true);

create policy "Authenticated users can read all documents"
  on passport_documents for select to authenticated
  using (true);

create policy "Authenticated users can read all circularity"
  on passport_circularity for select to authenticated
  using (true);

-- Authenticated users can insert/update passports
create policy "Authenticated users can insert passports"
  on passports for insert to authenticated
  with check (true);

create policy "Authenticated users can update passports"
  on passports for update to authenticated
  using (true);

-- Authenticated users can manage related data
create policy "Authenticated users can insert materials"
  on passport_materials for insert to authenticated
  with check (true);

create policy "Authenticated users can insert certificates"
  on passport_certificates for insert to authenticated
  with check (true);

create policy "Authenticated users can insert documents"
  on passport_documents for insert to authenticated
  with check (true);

create policy "Authenticated users can insert circularity"
  on passport_circularity for insert to authenticated
  with check (true);


-- ============================================================
-- WAAREE-BRANDED DEMO PASSPORTS (5 additional)
-- ============================================================

-- Passport 4: Waaree 700W TOPCon (Published)
insert into passports (
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
) values (
  'WRM-PVP-2026-0004', 'wrm-700-topcon-2026-004', 'WRM-700-TOPCON-BiN-03', 'WRM-2026-TOPCon-700-001', 'WRM-B-2026-Q1-TOPCon700', '08901234567890',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', 'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat Mega Factory', 'Surat, Gujarat, India', '2026-01-20',
  700.00, 22.53, 54.80, 18.30, 46.10, 17.40,
  1500, 2384, 1303, 33, 38.50,
  132, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  410.00, 'ISO 14067:2018 cradle-to-gate',
  -0.30, -0.25, 0.045, 43,
  'Class A', 'IP68', 'MC4 Compatible (4mm²)', 'Anodized aluminium alloy', '2mm Low Iron ARC semi-tempered (dual glass)', 0.80,
  1, '2026-02-15T00:00:00Z'
);

-- Passport 5: Waaree 580W TOPCon (Published)
insert into passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version, published_at
) values (
  'WRM-PVP-2026-0005', 'wrm-580-topcon-2026-005', 'WRM-580-TOPCON-BiN-08', 'WRM-2026-TOPCon-580-003', 'WRM-B-2026-Q1-TOPCon580',
  'crystalline_silicon_topcon', 'published', 'verified',
  'Waaree Energies Ltd.', 'EO-WRM-001', 'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat Mega Factory', 'Surat, Gujarat, India', '2026-02-05',
  580.00, 22.45, 51.20, 14.50, 43.20, 13.43,
  1500, 2278, 1134, 33, 32.50,
  144, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  -0.29, -0.24, 0.044, 43,
  'Class A', 'IP68', 'MC4 Compatible (4mm²)', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered', 0.75,
  1, '2026-03-01T00:00:00Z'
);

-- Passport 6: Waaree 590W TOPCon (Under Review)
insert into passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  fire_rating, ip_rating, connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) values (
  'WRM-PVP-2026-0006', 'wrm-590-topcon-2026-006', 'WRM-590-TOPCON-BiN-08', 'WRM-2026-TOPCon-590-001', 'WRM-B-2026-Q2-TOPCon590',
  'crystalline_silicon_topcon', 'under_review', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001', 'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHI-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-03-10',
  590.00, 22.84, 51.80, 14.60, 43.80, 13.47,
  1500, 2278, 1134, 33, 32.80,
  144, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  -0.29, -0.24, 0.044, 43,
  'Class A', 'IP68', 'MC4 Compatible (4mm²)', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered', 0.78,
  1
);

-- Passport 7: Waaree 685W TOPCon (Draft)
insert into passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) values (
  'WRM-PVP-2026-0007', 'wrm-685-topcon-2026-007', 'WRM-685-TOPCON-BiN-03', null, 'WRM-B-2026-Q2-TOPCon685',
  'crystalline_silicon_topcon', 'draft', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001', 'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India', 'https://waaree.com', 'India',
  'FAC-WRM-SRT-001', 'Waaree Surat Mega Factory', 'Surat, Gujarat, India', '2026-03-25',
  685.00, 22.05, 53.90, 18.10, 45.30, 17.20,
  1500, 2384, 1303, 33, 37.80,
  132, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  -0.30, -0.25, 0.045, 43,
  'MC4 Compatible (4mm²)', 'Anodized aluminium alloy', '2mm Low Iron ARC semi-tempered (dual glass)', 0.80,
  1
);

-- Passport 8: Waaree 600W TOPCon (Draft)
insert into passports (
  pv_passport_id, public_id, model_id, serial_number, batch_id,
  module_technology, status, verification_status,
  manufacturer_name, manufacturer_operator_id, manufacturer_address, manufacturer_contact_url, manufacturer_country,
  facility_id, facility_name, facility_location, manufacturing_date,
  rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
  max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm, module_mass_kg,
  cell_count, cell_type,
  product_warranty_years, performance_warranty_years, performance_warranty_percent,
  linear_degradation_percent_per_year, expected_lifetime_years,
  temperature_coefficient_pmax, temperature_coefficient_voc, temperature_coefficient_isc, noct_celsius,
  connector_type, frame_type, glass_type, bifaciality_factor,
  passport_version
) values (
  'WRM-PVP-2026-0008', 'wrm-600-topcon-2026-008', 'WRM-600-TOPCON-BiN-08', null, 'WRM-B-2026-Q2-TOPCon600',
  'crystalline_silicon_topcon', 'draft', 'pending',
  'Waaree Energies Ltd.', 'EO-WRM-001', 'Survey No. 55, Tumb Village, Umbergaon, Valsad, Gujarat 396150, India', 'https://waaree.com', 'India',
  'FAC-WRM-CHI-002', 'Waaree Chikhli Plant', 'Chikhli, Gujarat, India', '2026-04-01',
  600.00, 23.23, 52.10, 14.70, 43.90, 13.67,
  1500, 2278, 1134, 33, 33.20,
  144, 'M10 (182mm) N-Type Mono Bifacial TOPCon',
  12, 30, 87.40,
  0.40, 35,
  -0.29, -0.24, 0.044, 43,
  'MC4 Compatible (4mm²)', 'Anodized aluminium alloy', '2mm Low Iron ARC tempered', 0.78,
  1
);


-- ============================================================
-- MATERIALS for Waaree passports
-- ============================================================

-- WRM-700 Materials (realistic Waaree BOM)
insert into passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) values
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Glass', 'Front + rear cover', 21000, 64.62, null, false, false, 'Fully recyclable via glass cullet recovery', 1),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Aluminium', 'Frame', 4200, 12.92, '7429-90-5', false, false, 'Fully recyclable via aluminium smelting', 2),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Silicon', 'Solar cells', 2100, 6.46, '7440-21-3', true, false, 'Recoverable via chemical purification', 3),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'EVA/POE', 'Encapsulant', 2800, 8.62, null, false, false, 'Thermal delamination required', 4),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Copper', 'Ribbons + connectors', 650, 2.00, '7440-50-8', true, false, 'Recoverable via copper smelting', 5),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Silver', 'Cell metallization', 18, 0.06, '7440-22-4', true, false, 'High-value chemical extraction', 6),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Tin', 'Solder', 85, 0.26, '7440-31-5', false, false, 'Recoverable', 7),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Lead (traces)', 'Solder alloy', 12, 0.04, '7439-92-1', false, true, 'Controlled hazardous waste', 8),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Backsheet/Polymer', 'Rear protection', 1100, 3.38, null, false, false, 'Energy recovery', 9),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Other', 'Junction box, cables', 535, 1.65, null, false, false, 'Separable components', 10);

-- WRM-580 Materials
insert into passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, is_critical_raw_material, is_substance_of_concern, recyclability_hint, sort_order) values
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Glass', 'Front cover', 17500, 63.85, false, false, 'Fully recyclable', 1),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Aluminium', 'Frame', 3800, 13.85, false, false, 'Fully recyclable', 2),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Silicon', 'Solar cells', 1800, 6.56, true, false, 'Recoverable', 3),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'EVA', 'Encapsulant', 2300, 8.39, false, false, 'Thermal delamination', 4),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Copper', 'Ribbons + connectors', 580, 2.12, true, false, 'Recoverable', 5),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Silver', 'Cell metallization', 15, 0.05, true, false, 'High-value recovery', 6),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Backsheet', 'Rear protection', 950, 3.46, false, false, 'Energy recovery', 7),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Other', 'JB, cables, sealant', 475, 1.73, false, false, 'Separable', 8);


-- ============================================================
-- CERTIFICATES for Waaree passports
-- ============================================================

-- WRM-700 Certificates
insert into passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) values
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'IEC 61215:2021', 'CERT-WRM-61215-700-001', 'TUV SUD', '2025-09-01', '2030-09-01', 'valid', 'Design qualification and type approval for TOPCon N-Type modules'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'IEC 61730:2023', 'CERT-WRM-61730-700-001', 'TUV SUD', '2025-09-01', '2030-09-01', 'valid', 'PV module safety qualification — Class A fire rating'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'IEC 61701:2020', 'CERT-WRM-61701-700-001', 'TUV SUD', '2025-10-01', '2030-10-01', 'valid', 'Salt mist corrosion testing — severity level 6'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'IEC 62716:2013', 'CERT-WRM-62716-700-001', 'TUV SUD', '2025-10-01', '2030-10-01', 'valid', 'Ammonia corrosion testing'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'BIS IS 14286', 'CERT-WRM-BIS-700-001', 'BIS India', '2025-11-01', '2028-11-01', 'valid', 'Bureau of Indian Standards certification'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'UL 61730', 'CERT-WRM-UL-700-001', 'UL Solutions', '2025-12-01', '2030-12-01', 'valid', 'North American safety certification'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'CE Declaration', 'CERT-WRM-CE-700-001', 'Waaree Energies Ltd.', '2026-01-01', null, 'valid', 'CE Declaration of Conformity'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Carbon Footprint Declaration', 'CERT-WRM-CF-700-001', 'SGS', '2026-01-15', '2029-01-15', 'pending', 'Carbon footprint per ISO 14067 — under review');

-- WRM-580 Certificates
insert into passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) values
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'IEC 61215:2021', 'CERT-WRM-61215-580-001', 'TUV SUD', '2025-08-01', '2030-08-01', 'valid', 'Design qualification for TOPCon 580W'),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'IEC 61730:2023', 'CERT-WRM-61730-580-001', 'TUV SUD', '2025-08-01', '2030-08-01', 'valid', 'Safety qualification — Class A'),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'BIS IS 14286', 'CERT-WRM-BIS-580-001', 'BIS India', '2025-09-01', '2028-09-01', 'valid', 'BIS certification'),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'UL 61730', 'CERT-WRM-UL-580-001', 'UL Solutions', '2025-10-01', '2030-10-01', 'valid', 'NA safety cert');


-- ============================================================
-- DOCUMENTS for Waaree passports
-- ============================================================

-- WRM-700 Documents
insert into passport_documents (passport_id, name, document_type, access_level, issuer, issued_date, file_size_bytes, mime_type, document_hash, hash_algorithm, description) values
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'WRM-700-TOPCON-BiN-03 Datasheet', 'datasheet', 'public', 'Waaree Energies Ltd.', '2026-01-01', 2800000, 'application/pdf', 'sha256:a1b2c3d4e5f6...', 'SHA-256', 'Complete electrical and mechanical specifications'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Declaration of Conformity', 'declaration_of_conformity', 'public', 'Waaree Energies Ltd.', '2026-01-15', 920000, 'application/pdf', 'sha256:b2c3d4e5f6a1...', 'SHA-256', 'EU CE Declaration of Conformity'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'IEC 61215 Test Report', 'test_report', 'restricted', 'TUV SUD', '2025-09-01', 4500000, 'application/pdf', 'sha256:c3d4e5f6a1b2...', 'SHA-256', 'Full IEC 61215 type approval test report'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Installation Manual', 'installation_instructions', 'public', 'Waaree Energies Ltd.', '2026-01-01', 5800000, 'application/pdf', null, null, 'Complete installation and commissioning guide'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Safety Instructions', 'safety_instructions', 'public', 'Waaree Energies Ltd.', '2026-01-01', 1300000, 'application/pdf', null, null, 'Safety guidelines for handling, transport, and installation'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'EPD / Carbon Footprint Report', 'epd', 'restricted', 'SGS', '2026-01-15', 3400000, 'application/pdf', null, null, 'Environmental product declaration — cradle-to-gate'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Recycling Guide', 'recycling_guide', 'public', 'Waaree Energies Ltd.', '2026-01-01', 1100000, 'application/pdf', null, null, 'End-of-life dismantling and material recovery guide'),
  ((select id from passports where public_id = 'wrm-700-topcon-2026-004'), 'Quality Inspection Report', 'test_report', 'internal', 'Waaree QA Department', '2026-01-20', 2200000, 'application/pdf', 'sha256:d4e5f6a1b2c3...', 'SHA-256', 'Internal quality control inspection report');

-- WRM-580 Documents
insert into passport_documents (passport_id, name, document_type, access_level, issuer, issued_date, file_size_bytes, mime_type, description) values
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'WRM-580-TOPCON-BiN-08 Datasheet', 'datasheet', 'public', 'Waaree Energies Ltd.', '2026-02-01', 2500000, 'application/pdf', 'Complete specifications'),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Declaration of Conformity', 'declaration_of_conformity', 'public', 'Waaree Energies Ltd.', '2026-02-15', 880000, 'application/pdf', 'EU CE DoC'),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Installation Manual', 'installation_instructions', 'public', 'Waaree Energies Ltd.', '2026-02-01', 5200000, 'application/pdf', 'Installation guide'),
  ((select id from passports where public_id = 'wrm-580-topcon-2026-005'), 'Safety Instructions', 'safety_instructions', 'public', 'Waaree Energies Ltd.', '2026-02-01', 1200000, 'application/pdf', 'Safety guidelines');


-- ============================================================
-- CIRCULARITY for Waaree passports
-- ============================================================

insert into passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
) values
  (
    (select id from passports where public_id = 'wrm-700-topcon-2026-004'),
    92.00, 28.00, 0.00,
    true, 'Contains lead traces in solder alloy (<0.1% by weight). Below SVHC threshold but classified as hazardous for WEEE purposes.',
    35,
    E'1. Remove junction box and disconnect cables (3 min)\n2. Unbolt and remove aluminium frame (5 min)\n3. Separate dual glass panels via thermal delamination at 350°C (10 min)\n4. Remove EVA/POE encapsulant from cells (7 min)\n5. Recover silicon cells and copper ribbons (5 min)\n6. Sort recovered materials for downstream processing (5 min)\n\nWear appropriate PPE. Lead solder present — handle per local hazardous material guidelines.',
    'EU WEEE Directive 2012/19/EU / India EPR (Extended Producer Responsibility)',
    true, true, true, true, true,
    'Aluminium frame: direct smelting (99% recovery). Glass: cullet for flat glass or insulation (95% recovery). Silicon: chemical purification for solar reuse (85% recovery). Copper: smelting (98% recovery). Silver: chemical extraction (90% recovery).',
    'in_use'
  ),
  (
    (select id from passports where public_id = 'wrm-580-topcon-2026-005'),
    90.00, 24.00, 0.00,
    true, 'Contains lead traces in solder alloy (<0.1% by weight).',
    30,
    E'1. Remove junction box and cables (2 min)\n2. Remove aluminium frame (5 min)\n3. Thermal delamination (8 min)\n4. Backsheet removal (5 min)\n5. Cell and metal recovery (5 min)\n6. Material sorting (5 min)',
    'EU WEEE Directive 2012/19/EU / India EPR',
    true, true, true, true, true,
    'Standard TOPCon recovery process. Single-glass design requires backsheet removal step.',
    'in_use'
  );
