-- Enable RLS on all tables
alter table passports enable row level security;
alter table passport_materials enable row level security;
alter table passport_certificates enable row level security;
alter table passport_documents enable row level security;
alter table passport_circularity enable row level security;

-- Public read policies (published passports only)
create policy "Public can read published passports"
  on passports for select
  using (status = 'published');

create policy "Public can read materials of published passports"
  on passport_materials for select
  using (passport_id in (select id from passports where status = 'published'));

create policy "Public can read certificates of published passports"
  on passport_certificates for select
  using (passport_id in (select id from passports where status = 'published'));

create policy "Public can read public documents of published passports"
  on passport_documents for select
  using (
    access_level = 'public'
    and passport_id in (select id from passports where status = 'published')
  );

create policy "Public can read circularity of published passports"
  on passport_circularity for select
  using (passport_id in (select id from passports where status = 'published'));


-- ============================================================
-- SEED DATA
-- ============================================================

-- Passport 1: TOPCon Bifacial 550W
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
  passport_version, published_at
) values (
  'PVP-2026-0001', 'topcon-550-bf-2026-001', 'HT-550N-72-BF', 'HTD-2026-TPC-001234', 'B-2026-Q1-TOPCon', '04012345678901',
  'crystalline_silicon_topcon', 'published', 'verified',
  'HelioTrail Demo Manufacturing', 'EO-HT-001', '123 Solar Avenue, Chennai, Tamil Nadu 600001, India', 'https://heliotrail.com', 'India',
  'FAC-IND-CHN-001', 'Chennai GigaFactory', 'Chennai, India', '2026-01-15',
  550.00, 21.80, 49.80, 13.95, 41.70, 13.19,
  1500, 2278, 1134, 30, 28.50,
  72, 'N-type TOPCon bifacial',
  12, 30, 87.40,
  0.40, 35,
  385.00, 'ISO 14067:2018 cradle-to-gate',
  1, '2026-02-01T00:00:00Z'
);

-- Passport 2: PERC Mono 450W
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
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  passport_version, published_at
) values (
  'PVP-2026-0002', 'perc-450-mono-2026-002', 'HT-450M-60-PERC', 'HTD-2026-PRC-005678', 'B-2026-Q1-PERC',
  'crystalline_silicon_perc', 'published', 'verified',
  'HelioTrail Demo Manufacturing', 'EO-HT-001', '123 Solar Avenue, Chennai, Tamil Nadu 600001, India', 'https://heliotrail.com', 'India',
  'FAC-IND-CHN-001', 'Chennai GigaFactory', 'Chennai, India', '2026-02-10',
  450.00, 20.10, 41.50, 13.75, 34.20, 13.16,
  1500, 2094, 1038, 35, 23.50,
  60, 'P-type PERC mono',
  10, 25, 84.80,
  0.55, 30,
  420.00, 'ISO 14067:2018 cradle-to-gate',
  1, '2026-03-01T00:00:00Z'
);

-- Passport 3: HJT 420W
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
  carbon_footprint_kg_co2e, carbon_footprint_methodology,
  passport_version, published_at
) values (
  'PVP-2026-0003', 'hjt-420-2026-003', 'HT-420H-66-HJT', 'HTD-2026-HJT-009012', 'B-2026-Q1-HJT',
  'crystalline_silicon_hjt', 'published', 'verified',
  'HelioTrail Demo Manufacturing', 'EO-HT-001', '456 Innovation Park, Surat, Gujarat 395007, India', 'https://heliotrail.com', 'India',
  'FAC-IND-SRT-002', 'Surat Innovation Plant', 'Surat, India', '2026-03-05',
  420.00, 22.50, 44.20, 12.10, 37.50, 11.20,
  1500, 1722, 1134, 30, 20.80,
  66, 'N-type heterojunction bifacial',
  15, 30, 90.00,
  0.25, 40,
  450.00, 'ISO 14067:2018 cradle-to-gate',
  1, '2026-03-20T00:00:00Z'
);

-- ============================================================
-- Materials for Passport 1 (TOPCon 550W)
-- ============================================================
insert into passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, recyclability_hint, sort_order) values
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Tempered glass', 'glass', 12000.00, 42.11, 'Fully recyclable via glass cullet recovery', 1),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Aluminium alloy', 'frame', 3200.00, 11.23, 'Fully recyclable via aluminium smelting', 2),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'EVA encapsulant', 'encapsulant', 1100.00, 3.86, 'Thermal delamination required before recovery', 3),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Silicon wafers', 'cell', 480.00, 1.68, 'Recoverable via chemical etching process', 4),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Copper interconnects', 'wiring', 350.00, 1.23, 'Recoverable via copper smelting', 5),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Silver paste', 'cell', 8.00, 0.03, 'High-value recovery via chemical extraction', 6),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Backsheet polymer', 'backsheet', 650.00, 2.28, 'Energy recovery or specialized recycling', 7),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Junction box (PP)', 'junction_box', 280.00, 0.98, 'Separable, recyclable plastics and metals', 8),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Sealant and adhesive', 'other', 150.00, 0.53, 'Non-recoverable, thermal treatment', 9);

-- Materials for Passport 2 (PERC 450W)
insert into passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, recyclability_hint, sort_order) values
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Tempered glass', 'glass', 10500.00, 44.68, 'Fully recyclable via glass cullet recovery', 1),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Aluminium alloy', 'frame', 2800.00, 11.91, 'Fully recyclable via aluminium smelting', 2),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'EVA encapsulant', 'encapsulant', 900.00, 3.83, 'Thermal delamination required', 3),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Silicon wafers', 'cell', 400.00, 1.70, 'Recoverable via chemical etching', 4),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Copper interconnects', 'wiring', 300.00, 1.28, 'Recoverable via copper smelting', 5),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Silver paste', 'cell', 12.00, 0.05, 'High-value recovery', 6),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Backsheet polymer', 'backsheet', 550.00, 2.34, 'Energy recovery', 7);

-- Materials for Passport 3 (HJT 420W)
insert into passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, recyclability_hint, sort_order) values
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Tempered glass (dual)', 'glass', 9200.00, 44.23, 'Fully recyclable, dual-glass design simplifies separation', 1),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Aluminium alloy', 'frame', 2400.00, 11.54, 'Fully recyclable', 2),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'POE encapsulant', 'encapsulant', 850.00, 4.09, 'POE preferred over EVA for easier delamination', 3),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Silicon wafers (HJT)', 'cell', 380.00, 1.83, 'Recoverable, requires ITO layer removal', 4),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Copper interconnects', 'wiring', 280.00, 1.35, 'Recoverable', 5),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Silver paste', 'cell', 5.00, 0.02, 'Lower silver usage than PERC', 6),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Indium tin oxide', 'cell', 0.80, 0.004, 'Critical raw material, specialized recovery', 7);

-- Mark ITO as critical raw material
update passport_materials
  set is_critical_raw_material = true
  where material_name = 'Indium tin oxide';

-- ============================================================
-- Certificates
-- ============================================================
-- TOPCon 550W certificates
insert into passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) values
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'IEC 61215:2021', 'CERT-61215-HT550-001', 'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid', 'Design qualification and type approval for crystalline silicon terrestrial PV modules'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'IEC 61730:2023', 'CERT-61730-HT550-001', 'TUV Rheinland', '2025-08-15', '2030-08-15', 'valid', 'PV module safety qualification — Class A fire rating'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'IEC 62804:2014', 'CERT-62804-HT550-001', 'PI Berlin', '2025-09-01', '2030-09-01', 'valid', 'PID resistance test — passed at 96h/85C/85%RH/1500V'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'UL 61730', 'UL-61730-HT550-001', 'UL Solutions', '2025-10-01', '2030-10-01', 'valid', 'North American safety certification');

-- PERC 450W certificates
insert into passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) values
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'IEC 61215:2021', 'CERT-61215-HT450-001', 'TUV SUD', '2025-06-01', '2030-06-01', 'valid', 'Design qualification for PERC mono modules'),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'IEC 61730:2023', 'CERT-61730-HT450-001', 'TUV SUD', '2025-06-01', '2030-06-01', 'valid', 'PV module safety qualification — Class A'),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'IEC TS 62941:2016', 'CERT-62941-HT450-001', 'TUV SUD', '2025-07-15', '2030-07-15', 'valid', 'Quality system for PV module manufacturing');

-- HJT 420W certificates
insert into passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) values
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'IEC 61215:2021', 'CERT-61215-HT420-001', 'Bureau Veritas', '2025-11-01', '2030-11-01', 'valid', 'Design qualification for HJT bifacial modules'),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'IEC 61730:2023', 'CERT-61730-HT420-001', 'Bureau Veritas', '2025-11-01', '2030-11-01', 'valid', 'PV module safety — Class A fire rating'),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'IEC 62804:2014', 'CERT-62804-HT420-001', 'PI Berlin', '2025-12-01', '2030-12-01', 'valid', 'PID resistance — exceptional pass at 192h extended test');

-- ============================================================
-- Documents (public access level)
-- ============================================================
-- TOPCon 550W documents
insert into passport_documents (passport_id, name, document_type, access_level, issuer, issued_date, file_size_bytes, mime_type, description) values
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'HT-550N-72-BF Technical Datasheet', 'datasheet', 'public', 'HelioTrail Demo Manufacturing', '2025-12-01', 2450000, 'application/pdf', 'Complete electrical and mechanical specifications at STC and NOCT conditions'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'HelioTrail Demo Manufacturing', '2026-01-10', 850000, 'application/pdf', 'Declaration of conformity under EU Machinery Directive and Low Voltage Directive'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Installation and User Manual', 'user_manual', 'public', 'HelioTrail Demo Manufacturing', '2025-11-15', 5200000, 'application/pdf', 'Complete installation, commissioning, and maintenance guide'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Safety Instructions', 'safety_instructions', 'public', 'HelioTrail Demo Manufacturing', '2025-11-15', 1200000, 'application/pdf', 'Safety guidelines for handling, transport, installation, and disposal'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'Environmental Product Declaration', 'epd', 'public', 'Institut Bauen und Umwelt', '2025-10-20', 3100000, 'application/pdf', 'Cradle-to-gate EPD per ISO 14025 and EN 15804'),
  ((select id from passports where public_id = 'topcon-550-bf-2026-001'), 'End-of-Life Recycling Guide', 'recycling_guide', 'public', 'HelioTrail Demo Manufacturing', '2025-12-15', 980000, 'application/pdf', 'Dismantling sequence, material recovery guidance, and hazard information');

-- PERC 450W documents
insert into passport_documents (passport_id, name, document_type, access_level, issuer, issued_date, file_size_bytes, mime_type, description) values
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'HT-450M-60-PERC Technical Datasheet', 'datasheet', 'public', 'HelioTrail Demo Manufacturing', '2025-12-01', 2100000, 'application/pdf', 'Electrical and mechanical specifications'),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'HelioTrail Demo Manufacturing', '2026-02-01', 820000, 'application/pdf', 'EU DoC for PERC module range'),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Installation Manual', 'installation_instructions', 'public', 'HelioTrail Demo Manufacturing', '2025-11-20', 4800000, 'application/pdf', 'Installation and commissioning guide'),
  ((select id from passports where public_id = 'perc-450-mono-2026-002'), 'Safety Instructions', 'safety_instructions', 'public', 'HelioTrail Demo Manufacturing', '2025-11-20', 1100000, 'application/pdf', 'Safety guidelines');

-- HJT 420W documents
insert into passport_documents (passport_id, name, document_type, access_level, issuer, issued_date, file_size_bytes, mime_type, description) values
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'HT-420H-66-HJT Technical Datasheet', 'datasheet', 'public', 'HelioTrail Demo Manufacturing', '2026-01-15', 2600000, 'application/pdf', 'Complete HJT bifacial module specifications'),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'EU Declaration of Conformity', 'declaration_of_conformity', 'public', 'HelioTrail Demo Manufacturing', '2026-03-10', 870000, 'application/pdf', 'EU DoC for HJT module range'),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Installation and User Manual', 'user_manual', 'public', 'HelioTrail Demo Manufacturing', '2026-01-10', 5500000, 'application/pdf', 'Complete installation guide with HJT-specific handling notes'),
  ((select id from passports where public_id = 'hjt-420-2026-003'), 'Environmental Product Declaration', 'epd', 'public', 'Institut Bauen und Umwelt', '2026-02-01', 3300000, 'application/pdf', 'Cradle-to-gate EPD — higher embodied energy offset by superior performance');

-- ============================================================
-- Circularity data
-- ============================================================
insert into passport_circularity (
  passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
  is_hazardous, hazardous_substances_notes, dismantling_time_minutes, dismantling_instructions,
  collection_scheme, recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
  recovery_notes, end_of_life_status
) values
  (
    (select id from passports where public_id = 'topcon-550-bf-2026-001'),
    92.00, 8.50, 0.00,
    false, 'No hazardous substances above SVHC threshold. Lead-free solder used throughout.',
    25,
    E'1. Remove junction box and cables (2 min)\n2. Remove aluminium frame — unclip or unbolt corners (5 min)\n3. Separate backsheet via thermal delamination at 350°C (8 min)\n4. Separate glass from cell string (5 min)\n5. Recover silicon cells and copper interconnects (5 min)\n\nNote: Wear appropriate PPE. Handle glass carefully to avoid breakage contamination.',
    'WEEE Directive 2012/19/EU — PV modules classified as electronic waste. Return to manufacturer take-back program or approved WEEE collection facility.',
    true, true, true, true, true,
    'Aluminium frame: direct smelting. Glass: cullet for glass industry. Silicon: chemical purification for reuse. Copper: copper smelting. Silver: chemical extraction. EVA/backsheet: energy recovery.',
    'in_use'
  ),
  (
    (select id from passports where public_id = 'perc-450-mono-2026-002'),
    88.50, 6.20, 0.00,
    false, 'Contains lead solder in cell interconnects (below SVHC threshold). RoHS compliant.',
    30,
    E'1. Remove junction box and cables (2 min)\n2. Remove aluminium frame (5 min)\n3. Thermal delamination to separate layers (10 min)\n4. Glass recovery (5 min)\n5. Cell and metal recovery (8 min)\n\nNote: Lead solder present — handle per local hazardous material guidelines.',
    'WEEE Directive 2012/19/EU',
    true, true, true, true, true,
    'Standard PERC recovery process. Lead solder requires controlled smelting. Higher silver content than TOPCon.',
    'in_use'
  ),
  (
    (select id from passports where public_id = 'hjt-420-2026-003'),
    94.50, 5.00, 0.00,
    false, 'Contains indium tin oxide (ITO) — non-hazardous but classified as critical raw material. Lead-free process.',
    20,
    E'1. Remove junction box and cables (2 min)\n2. Remove aluminium frame (4 min)\n3. Dual-glass design allows mechanical separation (6 min)\n4. POE encapsulant removal (4 min)\n5. Cell recovery with ITO reclamation (4 min)\n\nNote: Dual-glass frameless variants may differ — check specific model instructions.',
    'WEEE Directive 2012/19/EU — return to manufacturer HJT-specific recycling program',
    true, true, true, true, true,
    'Dual-glass design enables highest recyclability. POE easier to delaminate than EVA. ITO recovery via acid leaching. Lower silver content reduces hazardous waste.',
    'in_use'
  );
