-- ============================================================
-- Migration 00017: Seed 50 additional passports (batch)
-- Adds passports for 5 manufacturers (10 each)
-- with full child data: materials, certificates, documents,
-- circularity, and supply chain actors.
-- ============================================================

DO $$
DECLARE
  _pid uuid;
  _i int;
  _batch int;
  _mfr_code text;
  _mfr_name text;
  _mfr_operator text;
  _mfr_address text;
  _mfr_url text;
  _mfr_country text;
  _fac_id text;
  _fac_name text;
  _fac_location text;
  _model_id text;
  _tech text;
  _power numeric;
  _eff numeric;
  _voc numeric;
  _isc numeric;
  _vmp numeric;
  _imp numeric;
  _max_v int;
  _len int;
  _wid int;
  _dep int;
  _mass numeric;
  _cells int;
  _cell_type text;
  _tc_pmax numeric;
  _tc_voc numeric;
  _tc_isc numeric;
  _noct numeric;
  _bif numeric;
  _carbon numeric;
  _c_intensity numeric;
  _status text;
  _verif text;
  _pub_at timestamptz;
  _pub_id text;
  _pvp_id text;
  _serial text;
  _mfg_date date;
  _counter int := 0;
  _recyclability numeric;
  _recycled_content numeric;
  _warranty_yrs int;
  _perf_warranty numeric;
  _degradation numeric;
  _lifetime int;
  _cert_issuer text;
  _recycler_name text;
  _recycler_contact text;
  _epd_ref text;
BEGIN

-- ============================================================
-- Loop over 5 manufacturer batches × 10 passports each
-- ============================================================
FOR _batch IN 1..5 LOOP

  -- Set manufacturer-specific constants
  CASE _batch
    WHEN 1 THEN  -- Premier Energies (new manufacturer)
      _mfr_code := 'PRM';
      _mfr_name := 'Premier Energies Ltd.';
      _mfr_operator := 'OP-PRM-IN-2024';
      _mfr_address := 'Survey No. 254, Hyderabad-Warangal Highway, Ghatkesar, Hyderabad 501301';
      _mfr_url := 'https://www.premierenergies.com';
      _fac_id := 'FAC-PRM-HYD-001';
      _fac_name := 'Premier Energies Hyderabad GigaFactory';
      _fac_location := 'Hyderabad, Telangana, India';
      _model_id := 'PRM-610-TOPCON';
      _tech := 'crystalline_silicon_topcon';
      _power := 610; _eff := 22.35; _voc := 52.10; _isc := 15.60; _vmp := 43.80; _imp := 13.93;
      _max_v := 1500; _len := 2278; _wid := 1134; _dep := 30; _mass := 31.5;
      _cells := 132; _cell_type := 'M10 N-type TOPCon bifacial';
      _tc_pmax := -0.29; _tc_voc := -0.25; _tc_isc := 0.045; _noct := 45; _bif := 0.80;
      _carbon := 420; _c_intensity := 23.1;
      _recyclability := 92.0; _recycled_content := 24.0;
      _warranty_yrs := 12; _perf_warranty := 87.4; _degradation := 0.40; _lifetime := 30;
      _cert_issuer := 'TUV SUD';
      _recycler_name := 'Attero Recycling';
      _recycler_contact := 'pvrecycling@attero.in';
      _epd_ref := 'EPD-PRM-2026-001';

    WHEN 2 THEN  -- Emmvee Solar
      _mfr_code := 'EMV';
      _mfr_name := 'Emmvee Photovoltaic Power Pvt. Ltd.';
      _mfr_operator := 'OP-EMV-IN-2024';
      _mfr_address := 'No. 39/2, Dabaspet, Nelamangala Taluk, Bengaluru 562111';
      _mfr_url := 'https://www.emmveesolar.com';
      _fac_id := 'FAC-EMV-BLR-001';
      _fac_name := 'Emmvee Solar Bengaluru Plant';
      _fac_location := 'Bengaluru, Karnataka, India';
      _model_id := 'EMV-545-PERC';
      _tech := 'crystalline_silicon_perc';
      _power := 545; _eff := 21.10; _voc := 49.60; _isc := 14.20; _vmp := 41.50; _imp := 13.13;
      _max_v := 1500; _len := 2256; _wid := 1133; _dep := 35; _mass := 28.0;
      _cells := 144; _cell_type := 'M10 P-type PERC mono';
      _tc_pmax := -0.34; _tc_voc := -0.27; _tc_isc := 0.048; _noct := 45; _bif := 0.00;
      _carbon := 455; _c_intensity := 26.2;
      _recyclability := 90.5; _recycled_content := 22.0;
      _warranty_yrs := 12; _perf_warranty := 84.8; _degradation := 0.50; _lifetime := 25;
      _cert_issuer := 'Bureau Veritas';
      _recycler_name := 'SolarCycle India';
      _recycler_contact := 'recycle@solarcycle.in';
      _epd_ref := 'EPD-EMV-2026-001';

    WHEN 3 THEN  -- Waaree (additional passports)
      _mfr_code := 'WR2';
      _mfr_name := 'Waaree Energies Ltd.';
      _mfr_operator := 'OP-WRM-IN-2024';
      _mfr_address := '602 Western Edge II, Borivali East, Mumbai 400066';
      _mfr_url := 'https://www.waaree.com';
      _fac_id := 'FAC-WRM-CHK-002';
      _fac_name := 'Waaree Chikhli Plant';
      _fac_location := 'Chikhli, Gujarat, India';
      _model_id := 'WRM-580-TOPCON-BiN-08';
      _tech := 'crystalline_silicon_topcon';
      _power := 580; _eff := 22.05; _voc := 51.50; _isc := 14.95; _vmp := 43.20; _imp := 13.43;
      _max_v := 1500; _len := 2278; _wid := 1134; _dep := 30; _mass := 29.8;
      _cells := 132; _cell_type := 'G12 N-type TOPCon bifacial';
      _tc_pmax := -0.30; _tc_voc := -0.25; _tc_isc := 0.045; _noct := 45; _bif := 0.80;
      _carbon := 400; _c_intensity := 22.5;
      _recyclability := 92.5; _recycled_content := 25.0;
      _warranty_yrs := 15; _perf_warranty := 87.4; _degradation := 0.40; _lifetime := 30;
      _cert_issuer := 'TUV Rheinland';
      _recycler_name := 'Veolia PV Recycling';
      _recycler_contact := 'pvrecycling@veolia.com';
      _epd_ref := 'EPD-WRM-2026-002';

    WHEN 4 THEN  -- Adani Solar (additional passports)
      _mfr_code := 'AD2';
      _mfr_name := 'Mundra Solar PV Ltd. (Adani Solar)';
      _mfr_operator := 'OP-ADS-IN-2024';
      _mfr_address := 'Adani Corporate House, Shantigram, Ahmedabad 382421';
      _mfr_url := 'https://www.adanisolar.com';
      _fac_id := 'FAC-ADS-MND-001';
      _fac_name := 'Adani Mundra GigaFactory';
      _fac_location := 'Mundra, Kutch, Gujarat, India';
      _model_id := 'ASM-590-TOPCON-BiN';
      _tech := 'crystalline_silicon_topcon';
      _power := 590; _eff := 22.40; _voc := 52.30; _isc := 15.00; _vmp := 43.90; _imp := 13.44;
      _max_v := 1500; _len := 2278; _wid := 1134; _dep := 30; _mass := 30.2;
      _cells := 132; _cell_type := 'M10 N-type TOPCon bifacial';
      _tc_pmax := -0.29; _tc_voc := -0.25; _tc_isc := 0.045; _noct := 44; _bif := 0.82;
      _carbon := 410; _c_intensity := 23.8;
      _recyclability := 91.5; _recycled_content := 23.0;
      _warranty_yrs := 12; _perf_warranty := 87.0; _degradation := 0.42; _lifetime := 30;
      _cert_issuer := 'Bureau Veritas';
      _recycler_name := 'First Solar Recycling';
      _recycler_contact := 'recycling@firstsolar.com';
      _epd_ref := 'EPD-ADS-2026-002';

    WHEN 5 THEN  -- Vikram Solar (additional passports)
      _mfr_code := 'VK2';
      _mfr_name := 'Vikram Solar Limited';
      _mfr_operator := 'OP-VKS-IN-2024';
      _mfr_address := 'Chinar Park, Rajarhat, Kolkata, WB 700156';
      _mfr_url := 'https://www.vikramsolar.com';
      _fac_id := 'FAC-VKS-OGD-002';
      _fac_name := 'Vikram Solar Oragadam Plant';
      _fac_location := 'Oragadam, Chennai, India';
      _model_id := 'VSMDH-595-TOPCON';
      _tech := 'crystalline_silicon_topcon';
      _power := 595; _eff := 22.50; _voc := 52.50; _isc := 15.10; _vmp := 44.00; _imp := 13.52;
      _max_v := 1500; _len := 2278; _wid := 1134; _dep := 30; _mass := 30.5;
      _cells := 132; _cell_type := 'M10 N-type TOPCon bifacial';
      _tc_pmax := -0.28; _tc_voc := -0.25; _tc_isc := 0.044; _noct := 44; _bif := 0.83;
      _carbon := 395; _c_intensity := 22.8;
      _recyclability := 92.0; _recycled_content := 26.0;
      _warranty_yrs := 12; _perf_warranty := 87.5; _degradation := 0.40; _lifetime := 30;
      _cert_issuer := 'UL LLC';
      _recycler_name := 'ROSI Solar';
      _recycler_contact := 'contact@rfrosi.com';
      _epd_ref := 'EPD-VKS-2026-002';
  END CASE;

  _mfr_country := 'India';

  -- 10 passports per manufacturer
  FOR _i IN 1..10 LOOP
    _counter := _counter + 1;

    -- Generate IDs
    _pvp_id := _mfr_code || '-PVP-2026-' || lpad(_counter::text, 4, '0');
    _pub_id := lower(_mfr_code) || '-' || lower(replace(_model_id, '-', '')) || '-2026-' || lpad(_i::text, 3, '0');

    -- Serial number (null for drafts)
    IF _i <= 8 THEN
      _serial := _mfr_code || '-2026-' || lpad((500000 + _counter)::text, 6, '0');
    ELSE
      _serial := NULL;
    END IF;

    -- Manufacturing date spread across Q1-Q2 2026
    _mfg_date := '2026-01-10'::date + ((_counter * 3) % 120);

    -- Status distribution: 5 published, 2 approved, 2 under_review, 1 draft
    CASE
      WHEN _i <= 5 THEN _status := 'published'; _verif := 'verified';
        _pub_at := (_mfg_date + interval '21 days')::timestamptz;
      WHEN _i <= 7 THEN _status := 'approved'; _verif := 'pending'; _pub_at := NULL;
      WHEN _i <= 9 THEN _status := 'under_review'; _verif := 'pending'; _pub_at := NULL;
      ELSE _status := 'draft'; _verif := 'pending'; _pub_at := NULL;
    END CASE;

    -- Slight variation per passport (±1-2% on power/efficiency, ±0.5V on voltages)
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
      _pvp_id, _pub_id, _model_id, _serial,
      'B-2026-Q' || (1 + (_i - 1) / 5) || '-' || split_part(_model_id, '-', 1),
      '0890123456' || lpad(_counter::text, 4, '0'),
      _tech::module_technology, _status::passport_status, _verif::verification_status,
      _mfr_name, _mfr_operator, _mfr_address, _mfr_url, _mfr_country,
      _fac_id, _fac_name, _fac_location, _mfg_date,
      _power + ((_i % 3) - 1) * 0.5,
      round((_eff + ((_i % 5) - 2) * 0.05)::numeric, 2),
      round((_voc + ((_i % 4) - 1.5) * 0.3)::numeric, 2),
      round((_isc + ((_i % 3) - 1) * 0.05)::numeric, 2),
      round((_vmp + ((_i % 4) - 1.5) * 0.2)::numeric, 2),
      round((_imp + ((_i % 3) - 1) * 0.03)::numeric, 2),
      _max_v, _len, _wid, _dep, _mass + ((_i % 3) - 1) * 0.3,
      _cells, _cell_type,
      _warranty_yrs, 30, _perf_warranty,
      _degradation, _lifetime,
      _carbon + ((_i % 5) - 2) * 5,
      'ISO 14067:2018',
      _tc_pmax, _tc_voc, _tc_isc, _noct,
      'Class A', 'IP68', 'MC4 Compatible',
      'Anodized Aluminium Alloy 35mm', '3.2mm Low Iron Tempered ARC', _bif,
      round((_c_intensity + ((_i % 4) - 1.5) * 0.4)::numeric, 1),
      'cradle_to_gate', _epd_ref,
      'India', 'compliant', 'compliant_with_exemption', 'QR',
      1, _pub_at
    )
    RETURNING id INTO _pid;

    -- ── Materials (BOM) — 10 items ──
    INSERT INTO passport_materials (passport_id, material_name, component_type, mass_g, mass_percent, cas_number, is_critical_raw_material, is_substance_of_concern, sort_order) VALUES
      (_pid, 'Tempered Solar Glass',         'Cover Glass',       round(_mass * 420)::int,   42.00, '65997-17-3', false, false, 0),
      (_pid, 'Aluminium Alloy 6063-T5',      'Frame',             round(_mass * 125)::int,   12.50, '7429-90-5',  false, false, 1),
      (_pid, 'EVA (Ethylene-Vinyl Acetate)',  'Encapsulant',       round(_mass * 95)::int,     9.50, '24937-78-8', false, false, 2),
      (_pid, 'Monocrystalline Silicon',       'Solar Cells',       round(_mass * 65)::int,     6.50, '7440-21-3',  true,  false, 3),
      (_pid, 'Fluoropolymer Backsheet',       'Backsheet',         round(_mass * 40)::int,     4.00, '9002-84-0',  false, false, 4),
      (_pid, 'Copper Ribbon',                 'Interconnects',     round(_mass * 20)::int,     2.00, '7440-50-8',  true,  false, 5),
      (_pid, 'Junction Box Assembly',         'Junction Box',      round(_mass * 12)::int,     1.20, '',           false, false, 6),
      (_pid, 'Adhesives & Sealants',          'Miscellaneous',     round(_mass * 15)::int,     1.50, '',           false, false, 7),
      (_pid, 'Silver Paste',                  'Cell Metallization', round(_mass * 1.5)::int,   0.15, '7440-22-4',  true,  false, 8),
      (_pid, 'Tin-Lead Solder',               'Solder',            round(_mass * 3)::int,      0.30, '7439-92-1',  false, true,  9);

    -- ── Certificates — 6 per passport ──
    INSERT INTO passport_certificates (passport_id, standard_name, certificate_number, issuer, issued_date, expiry_date, status, scope_notes) VALUES
      (_pid, 'IEC 61215:2021', 'IEC-61215-' || _pvp_id, _cert_issuer, _mfg_date - 60, _mfg_date + 1400, 'valid'::certificate_status, 'Design qualification and type approval for terrestrial PV modules'),
      (_pid, 'IEC 61730:2023', 'IEC-61730-' || _pvp_id, _cert_issuer, _mfg_date - 55, _mfg_date + 1400, 'valid'::certificate_status, 'PV module safety qualification — Class A (general access)'),
      (_pid, 'IEC 61701:2020', 'IEC-61701-' || _pvp_id, _cert_issuer, _mfg_date - 50, _mfg_date + 1400, 'valid'::certificate_status, 'Salt mist corrosion testing — Severity 6'),
      (_pid, 'CE Declaration',  'CE-DoC-' || _mfr_code || '-2025', _mfr_name, _mfg_date - 45, _mfg_date + 1825, 'valid'::certificate_status, 'EU Declaration of Conformity — Low Voltage Directive 2014/35/EU'),
      (_pid, 'BIS IS 14286',    'BIS-R-' || (30000 + _counter)::text, 'Bureau of Indian Standards', _mfg_date - 180, _mfg_date + 900, 'valid'::certificate_status, 'Indian standard for crystalline silicon PV modules'),
      (_pid, 'ISO 14067:2018',  'CFP-' || _mfr_code || '-2026-' || lpad(_i::text, 3, '0'), _cert_issuer, _mfg_date - 30, _mfg_date + 1095, 'valid'::certificate_status, 'Carbon footprint of products — Quantification');

    -- ── Documents — 6 per passport ──
    INSERT INTO passport_documents (passport_id, name, document_type, access_level, url, file_size_bytes, mime_type, issuer, issued_date, description) VALUES
      (_pid, _mfr_name || ' ' || _model_id || ' Datasheet', 'datasheet'::document_type, 'public'::document_access_level, 'https://docs.' || lower(_mfr_code) || '.com/ds/' || _model_id || '.pdf', 2100000, 'application/pdf', _mfr_name, _mfg_date, 'Technical datasheet with electrical and mechanical specifications'),
      (_pid, 'EU Declaration of Conformity', 'declaration_of_conformity'::document_type, 'public'::document_access_level, 'https://docs.' || lower(_mfr_code) || '.com/ce/' || _model_id || '-DoC.pdf', 500000, 'application/pdf', _mfr_name, _mfg_date, 'CE Declaration per Low Voltage Directive 2014/35/EU'),
      (_pid, 'Installation & User Manual', 'user_manual'::document_type, 'public'::document_access_level, 'https://docs.' || lower(_mfr_code) || '.com/manual/' || _model_id || '-manual.pdf', 5200000, 'application/pdf', _mfr_name, _mfg_date, 'Installation, operation, and maintenance guide'),
      (_pid, 'Safety Instructions', 'safety_instructions'::document_type, 'public'::document_access_level, 'https://docs.' || lower(_mfr_code) || '.com/safety/' || _model_id || '-safety.pdf', 1000000, 'application/pdf', _mfr_name, _mfg_date, 'Safety warnings and handling precautions'),
      (_pid, 'Environmental Product Declaration', 'epd'::document_type, 'public'::document_access_level, 'https://docs.' || lower(_mfr_code) || '.com/epd/' || _model_id || '-epd.pdf', 3100000, 'application/pdf', _cert_issuer, _mfg_date, 'Life-cycle environmental impact assessment per ISO 14025'),
      (_pid, 'End-of-Life Recycling Guide', 'recycling_guide'::document_type, 'recycler'::document_access_level, 'https://docs.' || lower(_mfr_code) || '.com/eol/' || _model_id || '-recycling.pdf', 1500000, 'application/pdf', _recycler_name, _mfg_date, 'Dismantling and material recovery procedures for recyclers');

    -- ── Circularity — 1 per passport ──
    INSERT INTO passport_circularity (
      passport_id, recyclability_rate_percent, recycled_content_percent, renewable_content_percent,
      is_hazardous, hazardous_substances_notes,
      dismantling_time_minutes, dismantling_instructions,
      collection_scheme, recycler_name, recycler_contact,
      recovery_aluminium, recovery_glass, recovery_silicon, recovery_copper, recovery_silver,
      recovery_notes, end_of_life_status
    ) VALUES (
      _pid, _recyclability, _recycled_content, 0.0,
      true, 'Contains trace lead in solder (Sn-Pb) — below 0.1% w/w threshold per RoHS exemption 7(a)',
      30 + (_i % 6), '1) Remove junction box and cables 2) Separate aluminium frame mechanically 3) Heat to 300°C to delaminate EVA/POE 4) Separate glass and cells 5) Acid etch to recover silver and copper 6) Crush silicon for reuse in metallurgical applications',
      'WEEE Directive (EU) / E-Waste Management Rules 2022 (India)',
      _recycler_name, _recycler_contact,
      true, true, true, true, true,
      'Aluminium frame recovery >99%, glass recovery >95%, silicon recovery for metallurgical grade',
      'in_use'
    );

    -- ── Supply Chain Actors — 4 per passport ──
    INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, country, facility_name, facility_location, tier_level, stage, uflpa_compliant, sort_order) VALUES
      (_pid, 'Tongwei Co., Ltd.',               'Polysilicon Supplier',        'China',   'Leshan Polysilicon Plant',      'Leshan, Sichuan, China',   4, 'raw_material',   true, 1),
      (_pid, 'LONGi Green Energy',               'Wafer Manufacturer',          'China',   'Xian Wafer Plant',              'Xian, Shaanxi, China',     3, 'component',      true, 2),
      (_pid, _mfr_name,                          'Cell & Module Manufacturer',  'India',   _fac_name,                       _fac_location,              1, 'manufacturing',  true, 3),
      (_pid, 'Kuehne+Nagel International AG',    'Logistics Provider',          'Germany', 'Hamburg Distribution Hub',       'Hamburg, Germany',         1, 'logistics',      true, 4);

  END LOOP; -- _i (10 passports per manufacturer)
END LOOP; -- _batch (5 manufacturers)

RAISE NOTICE 'Seeded % passports with full child data', _counter;
END $$;
