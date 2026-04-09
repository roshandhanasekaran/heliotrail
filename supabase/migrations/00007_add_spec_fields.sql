-- ============================================================
-- Add detailed specification fields to passports table
-- Temperature coefficients, physical characteristics, ratings
-- ============================================================

alter table passports add column if not exists temperature_coefficient_pmax numeric(6,3);
alter table passports add column if not exists temperature_coefficient_voc numeric(6,3);
alter table passports add column if not exists temperature_coefficient_isc numeric(6,3);
alter table passports add column if not exists noct_celsius numeric(4,1);
alter table passports add column if not exists fire_rating text;
alter table passports add column if not exists ip_rating text;
alter table passports add column if not exists connector_type text;
alter table passports add column if not exists frame_type text;
alter table passports add column if not exists glass_type text;
alter table passports add column if not exists bifaciality_factor numeric(4,2);

-- ============================================================
-- Populate spec fields for TOPCon 550W (bifacial N-type)
-- ============================================================
update passports set
  temperature_coefficient_pmax = -0.30,
  temperature_coefficient_voc = -0.26,
  temperature_coefficient_isc = 0.045,
  noct_celsius = 43.0,
  fire_rating = 'Class A',
  ip_rating = 'IP68',
  connector_type = 'MC4 Compatible',
  frame_type = 'Anodized aluminium alloy, 35mm',
  glass_type = 'AR-coated tempered glass, 3.2mm',
  bifaciality_factor = 0.80
where public_id = 'topcon-550-bf-2026-001';

-- ============================================================
-- Populate spec fields for PERC 450W (mono P-type)
-- ============================================================
update passports set
  temperature_coefficient_pmax = -0.35,
  temperature_coefficient_voc = -0.28,
  temperature_coefficient_isc = 0.048,
  noct_celsius = 45.0,
  fire_rating = 'Class A',
  ip_rating = 'IP67',
  connector_type = 'MC4 Compatible',
  frame_type = 'Anodized aluminium alloy, 40mm',
  glass_type = 'AR-coated tempered glass, 3.2mm',
  bifaciality_factor = null
where public_id = 'perc-450-mono-2026-002';

-- ============================================================
-- Populate spec fields for HJT 420W (bifacial heterojunction)
-- ============================================================
update passports set
  temperature_coefficient_pmax = -0.26,
  temperature_coefficient_voc = -0.24,
  temperature_coefficient_isc = 0.040,
  noct_celsius = 43.5,
  fire_rating = 'Class A',
  ip_rating = 'IP68',
  connector_type = 'MC4 Compatible',
  frame_type = 'Anodized aluminium alloy, 30mm',
  glass_type = 'AR-coated tempered glass, dual 2.0mm',
  bifaciality_factor = 0.85
where public_id = 'hjt-420-2026-003';
