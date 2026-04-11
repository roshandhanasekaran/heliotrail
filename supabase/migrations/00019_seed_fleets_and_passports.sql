-- ============================================================
-- Migration 00019: Seed fleets and 100 passports
--
-- Replaces all prior passport seed data with a clean set of
-- 100 passports distributed across 7 fleet sites, from 3
-- manufacturers and 7 module templates.
--
-- Fleet distribution:
--   Munich Rooftop Array     — 15 modules
--   Chennai Solar Park       — 20 modules
--   Lisbon Green Logistics   — 14 modules
--   Dubai Innovation Campus  — 16 modules
--   Amsterdam Circular Hub   — 10 modules
--   Sao Paulo Industrial     — 14 modules
--   Surat Technology Park    —  8 modules
--   Uninstalled (warehouse)  —  3 modules
-- ============================================================

-- Clear all existing passport data (cascades to child tables)
TRUNCATE passports CASCADE;

DO $$
DECLARE
  _f1 uuid; _f2 uuid; _f3 uuid; _f4 uuid; _f5 uuid; _f6 uuid; _f7 uuid;
  _pid uuid;
  _i int;
  _template int;

  -- Template variables
  _model_id text; _tech text; _pub_prefix text;
  _mfr_name text; _mfr_code text; _mfr_operator text;
  _mfr_address text; _mfr_url text; _mfr_country text;
  _fac_id text; _fac_name text; _fac_location text; _fac_country text;

  -- Electrical specs
  _power numeric; _eff numeric; _voc numeric; _isc numeric;
  _vmp numeric; _imp numeric; _max_v int;
  _len int; _wid int; _dep int; _mass numeric;
  _cells int; _cell_type text;

  -- Performance & carbon
  _carbon numeric; _c_intensity numeric; _bif numeric;
  _tc_pmax numeric; _tc_voc numeric; _tc_isc numeric; _noct numeric;
  _degradation numeric; _warranty_yrs int; _perf_warranty_yrs int;
  _perf_warranty_pct numeric; _lifetime int;

  -- Circularity
  _recyclability numeric; _recycled_content numeric;
  _cert_issuer text; _recycler_name text; _recycler_contact text;

  -- Derived per-passport
  _fleet_id uuid; _status text; _verif text; _pub_at timestamptz;
  _pub_id text; _pvp_id text; _serial text; _mfg_date date; _batch_id text;
BEGIN

-- ═══════════════════════════════════════════════════════════
-- Insert 7 fleet sites
-- ═══════════════════════════════════════════════════════════

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Munich Rooftop Array', 'munich-rooftop', 'Munich', 'Germany', 48.135100, 11.582000, 'temperate', 'rooftop', '2024-06-15', 'SolarBau GmbH', 'Commercial rooftop installation across Munich logistics center')
RETURNING id INTO _f1;

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Chennai Solar Park', 'chennai-solar-park', 'Chennai', 'India', 13.082700, 80.270700, 'tropical', 'ground_mount', '2024-03-10', 'HelioTrail Demo Manufacturing', 'Large-scale ground-mount solar park adjacent to Chennai GigaFactory')
RETURNING id INTO _f2;

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Lisbon Green Logistics', 'lisbon-green-logistics', 'Lisbon', 'Portugal', 38.722300, -9.139300, 'mediterranean', 'rooftop', '2024-09-01', 'GreenWatt Energy S.A.', 'Rooftop array on Lisbon port logistics warehouses')
RETURNING id INTO _f3;

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Dubai Innovation Campus', 'dubai-innovation-campus', 'Dubai', 'UAE', 25.204800, 55.270800, 'arid', 'carport', '2024-11-20', 'Gulf Solar Investments LLC', 'Solar carport canopies across Dubai Innovation Campus parking')
RETURNING id INTO _f4;

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Amsterdam Circular Hub', 'amsterdam-circular-hub', 'Amsterdam', 'Netherlands', 52.367600, 4.904100, 'temperate', 'rooftop', '2025-01-10', 'Circular Energy BV', 'Demonstration rooftop array at Amsterdam circular economy campus')
RETURNING id INTO _f5;

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Sao Paulo Industrial', 'sao-paulo-industrial', 'Sao Paulo', 'Brazil', -23.550500, -46.633300, 'subtropical', 'ground_mount', '2025-03-01', 'Energia Verde Ltda.', 'Ground-mount array powering industrial park in Sao Paulo outskirts')
RETURNING id INTO _f6;

INSERT INTO fleets (name, slug, location_city, location_country, latitude, longitude, climate_zone, site_type, commissioned_at, owner_name, description)
VALUES ('Surat Technology Park', 'surat-technology-park', 'Surat', 'India', 21.170200, 72.831100, 'tropical', 'facade', '2025-05-15', 'HelioTrail Demo Manufacturing', 'Building-integrated facade installation at Surat tech campus')
RETURNING id INTO _f7;


-- ═══════════════════════════════════════════════════════════
-- Seed 100 passports across 7 module templates
-- ═══════════════════════════════════════════════════════════

FOR _i IN 1..100 LOOP

  -- ─── Determine template ───
  IF    _i <= 3  THEN _template := _i;
  ELSIF _i <= 20 THEN _template := 1;
  ELSIF _i <= 35 THEN _template := 2;
  ELSIF _i <= 46 THEN _template := 3;
  ELSIF _i <= 62 THEN _template := 4;
  ELSIF _i <= 72 THEN _template := 5;
  ELSIF _i <= 86 THEN _template := 6;
  ELSE                _template := 7;
  END IF;

  -- ─── Set template values ───
  CASE _template
    WHEN 1 THEN
      _model_id := 'HT-550N-72-BF'; _tech := 'crystalline_silicon_topcon'; _pub_prefix := 'topcon-550';
      _mfr_name := 'HelioTrail Demo Manufacturing'; _mfr_code := 'HTD'; _mfr_operator := 'EO-HT-001';
      _mfr_address := '123 Solar Avenue, Chennai, Tamil Nadu 600001, India';
      _mfr_url := 'https://heliotrail.com'; _mfr_country := 'India';
      _fac_id := 'FAC-IND-CHN-001'; _fac_name := 'Chennai GigaFactory';
      _fac_location := 'Chennai, India'; _fac_country := 'India';
      _power := 550; _eff := 21.80; _voc := 49.80; _isc := 13.95; _vmp := 41.70; _imp := 13.19;
      _max_v := 1500; _len := 2278; _wid := 1134; _dep := 30; _mass := 28.50;
      _cells := 72; _cell_type := 'N-type TOPCon bifacial';
      _carbon := 385; _c_intensity := 21.5; _bif := 0.75;
      _tc_pmax := -0.30; _tc_voc := -0.25; _tc_isc := 0.045; _noct := 45;
      _degradation := 0.40; _warranty_yrs := 12; _perf_warranty_yrs := 30;
      _perf_warranty_pct := 87.40; _lifetime := 35;
      _recyclability := 92.0; _recycled_content := 8.5;
      _cert_issuer := 'TUV Rheinland';
      _recycler_name := 'SolarCycle India'; _recycler_contact := 'recycle@solarcycle.in';

    WHEN 2 THEN
      _model_id := 'HT-450M-60-PERC'; _tech := 'crystalline_silicon_perc'; _pub_prefix := 'perc-450';
      _mfr_name := 'HelioTrail Demo Manufacturing'; _mfr_code := 'HTD'; _mfr_operator := 'EO-HT-001';
      _mfr_address := '123 Solar Avenue, Chennai, Tamil Nadu 600001, India';
      _mfr_url := 'https://heliotrail.com'; _mfr_country := 'India';
      _fac_id := 'FAC-IND-CHN-001'; _fac_name := 'Chennai GigaFactory';
      _fac_location := 'Chennai, India'; _fac_country := 'India';
      _power := 450; _eff := 20.10; _voc := 41.50; _isc := 13.75; _vmp := 34.20; _imp := 13.16;
      _max_v := 1500; _len := 2094; _wid := 1038; _dep := 35; _mass := 23.50;
      _cells := 60; _cell_type := 'P-type PERC mono';
      _carbon := 420; _c_intensity := 24.2; _bif := 0.00;
      _tc_pmax := -0.34; _tc_voc := -0.27; _tc_isc := 0.048; _noct := 45;
      _degradation := 0.55; _warranty_yrs := 10; _perf_warranty_yrs := 25;
      _perf_warranty_pct := 84.80; _lifetime := 30;
      _recyclability := 88.5; _recycled_content := 6.2;
      _cert_issuer := 'TUV Rheinland';
      _recycler_name := 'SolarCycle India'; _recycler_contact := 'recycle@solarcycle.in';

    WHEN 3 THEN
      _model_id := 'HT-420H-66-HJT'; _tech := 'crystalline_silicon_hjt'; _pub_prefix := 'hjt-420';
      _mfr_name := 'HelioTrail Demo Manufacturing'; _mfr_code := 'HTD'; _mfr_operator := 'EO-HT-001';
      _mfr_address := '456 Innovation Park, Surat, Gujarat 395007, India';
      _mfr_url := 'https://heliotrail.com'; _mfr_country := 'India';
      _fac_id := 'FAC-IND-SRT-002'; _fac_name := 'Surat Innovation Plant';
      _fac_location := 'Surat, India'; _fac_country := 'India';
      _power := 420; _eff := 22.50; _voc := 44.20; _isc := 12.10; _vmp := 37.50; _imp := 11.20;
      _max_v := 1500; _len := 1722; _wid := 1134; _dep := 30; _mass := 20.80;
      _cells := 66; _cell_type := 'N-type heterojunction bifacial';
      _carbon := 450; _c_intensity := 25.0; _bif := 0.85;
      _tc_pmax := -0.26; _tc_voc := -0.24; _tc_isc := 0.040; _noct := 43;
      _degradation := 0.25; _warranty_yrs := 15; _perf_warranty_yrs := 30;
      _perf_warranty_pct := 90.00; _lifetime := 40;
      _recyclability := 94.5; _recycled_content := 5.0;
      _cert_issuer := 'TUV Rheinland';
      _recycler_name := 'SolarCycle India'; _recycler_contact := 'recycle@solarcycle.in';

    WHEN 4 THEN
      _model_id := 'ST-580N-78-BF'; _tech := 'crystalline_silicon_topcon'; _pub_prefix := 'topcon-580';
      _mfr_name := 'SolarTech Europe GmbH'; _mfr_code := 'STE'; _mfr_operator := 'EO-STE-001';
      _mfr_address := 'Industriestrasse 42, 60388 Frankfurt am Main, Germany';
      _mfr_url := 'https://solartech-europe.com'; _mfr_country := 'Germany';
      _fac_id := 'FAC-DEU-FRA-001'; _fac_name := 'Frankfurt Megafab';
      _fac_location := 'Frankfurt, Germany'; _fac_country := 'Germany';
      _power := 580; _eff := 22.30; _voc := 51.20; _isc := 14.50; _vmp := 43.00; _imp := 13.49;
      _max_v := 1500; _len := 2384; _wid := 1134; _dep := 30; _mass := 30.00;
      _cells := 78; _cell_type := 'N-type TOPCon bifacial';
      _carbon := 370; _c_intensity := 20.5; _bif := 0.80;
      _tc_pmax := -0.28; _tc_voc := -0.24; _tc_isc := 0.044; _noct := 44;
      _degradation := 0.38; _warranty_yrs := 12; _perf_warranty_yrs := 30;
      _perf_warranty_pct := 87.40; _lifetime := 35;
      _recyclability := 91.0; _recycled_content := 12.0;
      _cert_issuer := 'TUV SUD';
      _recycler_name := 'Veolia PV Recycling'; _recycler_contact := 'pvrecycling@veolia.com';

    WHEN 5 THEN
      _model_id := 'ST-440T-CdTe'; _tech := 'thin_film_cdte'; _pub_prefix := 'cdte-440';
      _mfr_name := 'SolarTech Europe GmbH'; _mfr_code := 'STE'; _mfr_operator := 'EO-STE-001';
      _mfr_address := 'Industriestrasse 42, 60388 Frankfurt am Main, Germany';
      _mfr_url := 'https://solartech-europe.com'; _mfr_country := 'Germany';
      _fac_id := 'FAC-DEU-FRA-001'; _fac_name := 'Frankfurt Megafab';
      _fac_location := 'Frankfurt, Germany'; _fac_country := 'Germany';
      _power := 440; _eff := 19.50; _voc := 220.00; _isc := 2.50; _vmp := 180.00; _imp := 2.44;
      _max_v := 1500; _len := 2009; _wid := 1232; _dep := 7; _mass := 35.00;
      _cells := 264; _cell_type := 'CdTe thin film';
      _carbon := 250; _c_intensity := 14.8; _bif := 0.00;
      _tc_pmax := -0.32; _tc_voc := -0.28; _tc_isc := 0.040; _noct := 44;
      _degradation := 0.50; _warranty_yrs := 10; _perf_warranty_yrs := 25;
      _perf_warranty_pct := 82.00; _lifetime := 25;
      _recyclability := 90.0; _recycled_content := 4.0;
      _cert_issuer := 'TUV SUD';
      _recycler_name := 'Veolia PV Recycling'; _recycler_contact := 'pvrecycling@veolia.com';

    WHEN 6 THEN
      _model_id := 'GW-400M-54-PERC'; _tech := 'crystalline_silicon_perc'; _pub_prefix := 'perc-400';
      _mfr_name := 'GreenWatt Energy S.A.'; _mfr_code := 'GWE'; _mfr_operator := 'EO-GWE-001';
      _mfr_address := 'Zona Industrial de Faro, 8005-139 Faro, Portugal';
      _mfr_url := 'https://greenwatt-energy.pt'; _mfr_country := 'Portugal';
      _fac_id := 'FAC-PRT-FAR-001'; _fac_name := 'Faro Solar Works';
      _fac_location := 'Faro, Portugal'; _fac_country := 'Portugal';
      _power := 400; _eff := 19.80; _voc := 38.50; _isc := 13.20; _vmp := 32.00; _imp := 12.50;
      _max_v := 1500; _len := 1960; _wid := 1038; _dep := 35; _mass := 21.50;
      _cells := 54; _cell_type := 'P-type PERC mono';
      _carbon := 395; _c_intensity := 23.0; _bif := 0.00;
      _tc_pmax := -0.35; _tc_voc := -0.28; _tc_isc := 0.050; _noct := 46;
      _degradation := 0.60; _warranty_yrs := 10; _perf_warranty_yrs := 25;
      _perf_warranty_pct := 84.80; _lifetime := 30;
      _recyclability := 87.5; _recycled_content := 10.0;
      _cert_issuer := 'Bureau Veritas';
      _recycler_name := 'ROSI Solar'; _recycler_contact := 'contact@rfrosi.com';

    WHEN 7 THEN
      _model_id := 'GW-480H-72-HJT'; _tech := 'crystalline_silicon_hjt'; _pub_prefix := 'hjt-480';
      _mfr_name := 'GreenWatt Energy S.A.'; _mfr_code := 'GWE'; _mfr_operator := 'EO-GWE-001';
      _mfr_address := 'Zona Industrial de Faro, 8005-139 Faro, Portugal';
      _mfr_url := 'https://greenwatt-energy.pt'; _mfr_country := 'Portugal';
      _fac_id := 'FAC-PRT-FAR-001'; _fac_name := 'Faro Solar Works';
      _fac_location := 'Faro, Portugal'; _fac_country := 'Portugal';
      _power := 480; _eff := 23.00; _voc := 46.50; _isc := 13.20; _vmp := 39.80; _imp := 12.06;
      _max_v := 1500; _len := 2094; _wid := 1038; _dep := 30; _mass := 25.00;
      _cells := 72; _cell_type := 'N-type heterojunction bifacial';
      _carbon := 430; _c_intensity := 24.0; _bif := 0.90;
      _tc_pmax := -0.25; _tc_voc := -0.23; _tc_isc := 0.038; _noct := 42;
      _degradation := 0.22; _warranty_yrs := 15; _perf_warranty_yrs := 30;
      _perf_warranty_pct := 90.00; _lifetime := 40;
      _recyclability := 95.0; _recycled_content := 7.0;
      _cert_issuer := 'Bureau Veritas';
      _recycler_name := 'ROSI Solar'; _recycler_contact := 'contact@rfrosi.com';
  END CASE;

  -- ─── Fleet assignment ───
  IF    _i <= 2  THEN _fleet_id := _f2;    -- Chennai (original passports)
  ELSIF _i = 3   THEN _fleet_id := _f7;    -- Surat   (original passport)
  ELSIF _i <= 18 THEN _fleet_id := _f1;    -- Munich:    4-18  = 15
  ELSIF _i <= 36 THEN _fleet_id := _f2;    -- Chennai:  19-36  = 18 (+2 = 20)
  ELSIF _i <= 50 THEN _fleet_id := _f3;    -- Lisbon:   37-50  = 14
  ELSIF _i <= 66 THEN _fleet_id := _f4;    -- Dubai:    51-66  = 16
  ELSIF _i <= 76 THEN _fleet_id := _f5;    -- Amsterdam: 67-76 = 10
  ELSIF _i <= 90 THEN _fleet_id := _f6;    -- Sao Paulo: 77-90 = 14
  ELSIF _i <= 97 THEN _fleet_id := _f7;    -- Surat:    91-97  = 7 (+1 = 8)
  ELSE                _fleet_id := NULL;    -- Uninstalled: 98-100
  END IF;

  -- ─── Generate IDs ───
  _pvp_id := 'PVP-2026-' || lpad(_i::text, 4, '0');

  IF    _i = 1 THEN _pub_id := 'topcon-550-bf-2026-001';
  ELSIF _i = 2 THEN _pub_id := 'perc-450-mono-2026-002';
  ELSIF _i = 3 THEN _pub_id := 'hjt-420-2026-003';
  ELSE               _pub_id := _pub_prefix || '-2026-' || lpad(_i::text, 3, '0');
  END IF;

  IF _i <= 90 THEN
    _serial := _mfr_code || '-2026-' || lpad((100000 + _i)::text, 6, '0');
  ELSE
    _serial := NULL;
  END IF;

  _mfg_date := '2024-01-15'::date + (_i * 8);
  _batch_id := 'B-' || extract(year from _mfg_date)::int::text
    || '-Q' || (1 + (extract(month from _mfg_date)::int - 1) / 3)::text
    || '-' || split_part(_model_id, '-', 1);

  -- ─── Status distribution ───
  IF _i <= 85 THEN
    _status := 'published'; _verif := 'verified';
    _pub_at := (_mfg_date + interval '21 days')::timestamptz;
  ELSIF _i <= 90 THEN
    _status := 'published'; _verif := 'outdated';
    _pub_at := (_mfg_date + interval '21 days')::timestamptz;
  ELSIF _i <= 97 THEN
    _status := 'draft'; _verif := 'pending';
    _pub_at := NULL;
  ELSE
    _status := 'under_review'; _verif := 'pending';
    _pub_at := NULL;
  END IF;

  -- ─── Insert passport ───
  INSERT INTO passports (
    pv_passport_id, public_id, model_id, serial_number, batch_id, gtin,
    module_technology, status, verification_status,
    manufacturer_name, manufacturer_operator_id, manufacturer_address,
    manufacturer_contact_url, manufacturer_country,
    facility_id, facility_name, facility_location, manufacturing_date,
    rated_power_stc_w, module_efficiency_percent, voc_v, isc_a, vmp_v, imp_a,
    max_system_voltage_v, module_length_mm, module_width_mm, module_depth_mm,
    module_mass_kg, cell_count, cell_type,
    product_warranty_years, performance_warranty_years, performance_warranty_percent,
    linear_degradation_percent_per_year, expected_lifetime_years,
    carbon_footprint_kg_co2e, carbon_footprint_methodology,
    temperature_coefficient_pmax, temperature_coefficient_voc,
    temperature_coefficient_isc, noct_celsius,
    fire_rating, ip_rating, connector_type, frame_type, glass_type,
    bifaciality_factor,
    carbon_intensity_g_co2e_per_kwh, carbon_lca_boundary, carbon_verification_ref,
    facility_country, reach_status, rohs_status, data_carrier_type,
    fleet_id, passport_version, published_at
  ) VALUES (
    _pvp_id, _pub_id, _model_id, _serial, _batch_id,
    '0890123456' || lpad(_i::text, 4, '0'),
    _tech::module_technology, _status::passport_status, _verif::verification_status,
    _mfr_name, _mfr_operator, _mfr_address, _mfr_url, _mfr_country,
    _fac_id, _fac_name, _fac_location, _mfg_date,
    _power + ((_i % 3) - 1) * 0.5,
    round((_eff + ((_i % 5) - 2) * 0.05)::numeric, 2),
    round((_voc + ((_i % 4) - 1.5) * 0.3)::numeric, 2),
    round((_isc + ((_i % 3) - 1) * 0.05)::numeric, 2),
    round((_vmp + ((_i % 4) - 1.5) * 0.2)::numeric, 2),
    round((_imp + ((_i % 3) - 1) * 0.03)::numeric, 2),
    _max_v, _len, _wid, _dep,
    _mass + ((_i % 3) - 1) * 0.3,
    _cells, _cell_type,
    _warranty_yrs, _perf_warranty_yrs, _perf_warranty_pct,
    _degradation, _lifetime,
    _carbon + ((_i % 5) - 2) * 5,
    'ISO 14067:2018',
    _tc_pmax, _tc_voc, _tc_isc, _noct,
    'Class A', 'IP68',
    CASE WHEN _template = 5 THEN 'Integrated Junction Box' ELSE 'MC4 Compatible' END,
    CASE WHEN _template = 5 THEN 'Frameless Glass-Glass' ELSE 'Anodized Aluminium Alloy 35mm' END,
    CASE WHEN _template = 5       THEN '3.2mm Tempered Front + 3.2mm Tempered Back'
         WHEN _template IN (3, 7) THEN '3.2mm Tempered ARC (dual glass)'
         ELSE '3.2mm Low Iron Tempered ARC' END,
    _bif,
    round((_c_intensity + ((_i % 4) - 1.5) * 0.4)::numeric, 1),
    'cradle_to_gate',
    'EPD-' || _mfr_code || '-2026-' || lpad(_template::text, 2, '0'),
    _fac_country, 'compliant', 'compliant_with_exemption', 'qr_gs1_digital_link',
    _fleet_id, 1, _pub_at
  )
  RETURNING id INTO _pid;

  -- ─── Materials (4 core per passport) ───
  IF _template = 5 THEN
    INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, sort_order) VALUES
      (_pid, 'Tempered Solar Glass',    'Cover Glass',  round(_mass * 480)::int, 48.00, '65997-17-3', false, false, 0),
      (_pid, 'Aluminium Frame',         'Frame',        round(_mass * 100)::int, 10.00, '7429-90-5',  false, false, 1),
      (_pid, 'EVA Encapsulant',         'Encapsulant',  round(_mass * 80)::int,   8.00, '24937-78-8', false, false, 2),
      (_pid, 'Cadmium Telluride',       'Absorber',     round(_mass * 30)::int,   3.00, '1306-25-8',  true,  true,  3);
  ELSIF _template IN (3, 7) THEN
    INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, sort_order) VALUES
      (_pid, 'Tempered Solar Glass',    'Cover Glass',  round(_mass * 420)::int, 42.00, '65997-17-3', false, false, 0),
      (_pid, 'Aluminium Alloy 6063-T5', 'Frame',        round(_mass * 125)::int, 12.50, '7429-90-5',  false, false, 1),
      (_pid, 'POE Encapsulant',         'Encapsulant',  round(_mass * 95)::int,   9.50, '26221-73-8', false, false, 2),
      (_pid, 'Monocrystalline Silicon', 'Solar Cells',  round(_mass * 65)::int,   6.50, '7440-21-3',  true,  false, 3);
  ELSE
    INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, sort_order) VALUES
      (_pid, 'Tempered Solar Glass',    'Cover Glass',  round(_mass * 420)::int, 42.00, '65997-17-3', false, false, 0),
      (_pid, 'Aluminium Alloy 6063-T5', 'Frame',        round(_mass * 125)::int, 12.50, '7429-90-5',  false, false, 1),
      (_pid, 'EVA Encapsulant',         'Encapsulant',  round(_mass * 95)::int,   9.50, '24937-78-8', false, false, 2),
      (_pid, 'Monocrystalline Silicon', 'Solar Cells',  round(_mass * 65)::int,   6.50, '7440-21-3',  true,  false, 3);
  END IF;

  -- ─── Certificates (2 per passport) ───
  INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
    (_pid, 'IEC 61215:2021', 'IEC-61215-' || _pvp_id, _cert_issuer,
           _mfg_date - 60, _mfg_date + 1400, 'valid'::certificate_status,
           'Design qualification and type approval for terrestrial PV modules'),
    (_pid, 'IEC 61730:2023', 'IEC-61730-' || _pvp_id, _cert_issuer,
           _mfg_date - 55, _mfg_date + 1400, 'valid'::certificate_status,
           'PV module safety qualification - Class A');

  -- ─── Documents (2 per passport) ───
  INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
    (_pid,
     _mfr_name || ' ' || _model_id || ' Datasheet',
     'datasheet'::document_type, 'public'::document_access_level,
     'https://docs.' || lower(_mfr_code) || '.com/ds/' || _model_id || '.pdf',
     2100000, 'application/pdf', _mfr_name, _mfg_date,
     'Technical datasheet with electrical and mechanical specifications'),
    (_pid,
     'EU Declaration of Conformity',
     'declaration_of_conformity'::document_type, 'public'::document_access_level,
     'https://docs.' || lower(_mfr_code) || '.com/ce/' || _model_id || '-DoC.pdf',
     500000, 'application/pdf', _mfr_name, _mfg_date,
     'CE Declaration per Low Voltage Directive 2014/35/EU');

  -- ─── Circularity (1 per passport) ───
  INSERT INTO passport_circularity (
    passport_id, recyclability_rate_percent, recycled_content_percent,
    renewable_content_percent,
    is_hazardous, hazardous_substances_notes,
    dismantling_time_minutes, dismantling_instructions,
    collection_scheme, recycler_name, recycler_contact,
    recovery_aluminium, recovery_glass, recovery_silicon,
    recovery_copper, recovery_silver,
    recovery_notes, end_of_life_status
  ) VALUES (
    _pid, _recyclability, _recycled_content, 0.0,
    _template = 5,
    CASE WHEN _template = 5
         THEN 'Contains cadmium telluride - requires specialized recycling per WEEE Directive'
         ELSE 'No hazardous substances above SVHC threshold' END,
    25 + (_i % 6),
    '1) Remove junction box and cables 2) Separate frame mechanically 3) Thermal delamination at 300-350C 4) Glass-cell separation 5) Material recovery and sorting',
    'WEEE Directive 2012/19/EU',
    _recycler_name, _recycler_contact,
    true, true,
    _template != 5,
    true,
    _template != 5,
    CASE WHEN _template = 5
         THEN 'Glass recovery >95%, CdTe recovery via hydrometallurgical process, aluminium frame >99%'
         ELSE 'Aluminium frame >99%, glass >95%, silicon recovery for metallurgical grade, copper smelting' END,
    CASE WHEN _fleet_id IS NULL THEN 'in_storage' ELSE 'in_use' END
  );

END LOOP;

RAISE NOTICE 'Seeded 7 fleets and 100 passports with materials, certificates, documents, and circularity data';
END $$;
