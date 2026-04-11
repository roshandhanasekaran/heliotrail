-- ============================================================
-- Migration 00021: Seed supply chain for ALL 120 passports
--
-- Covers 4 manufacturers:
--   Waaree Energies Ltd.        (WRM-*)  — 20 passports
--   HelioTrail Demo Manufacturing (HT-*)  — 46 passports
--   SolarTech Europe GmbH       (ST-*)   — 26 passports
--   GreenWatt Energy S.A.       (GW-*)   — 28 passports
--
-- Per passport: 5 actors + 4 CoC events + 2 SoC entries
-- Total: 600 actors + 480 CoC events + 240 SoC = 1320 rows
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- 1. SUPPLY CHAIN ACTORS — WAAREE (WRM-*)
-- ════════════════════════════════════════════════════════════

-- Tier 1: Module Assembly — Waaree (uses passport's own facility)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Waaree Energies Ltd.', 'Module Assembly', 'EO-WRM-001', 'India',
  p.facility_name, p.facility_location,
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-15'::date, 1
FROM passports p WHERE p.model_id LIKE 'WRM-%';

-- Tier 2: Cell Manufacturing — Waaree Cell Division Chikhli
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Waaree Energies Ltd. — Cell Division', 'Cell Manufacturing', 'EO-WRM-001', 'India',
  'Waaree Cell Division, Chikhli', 'Chikhli, Gujarat, India',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-20'::date, 2
FROM passports p WHERE p.model_id LIKE 'WRM-%';

-- Tier 3: Wafer — LONGi Green Energy
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'LONGi Green Energy Technology Co., Ltd.', 'Wafer Manufacturing', 'EO-LONGI-001', 'Malaysia',
  'LONGi Kuching Wafer Plant', 'Kuching, Sarawak, Malaysia',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Slicing & Wafer Production', true, '2025-09-10'::date, 3
FROM passports p WHERE p.model_id LIKE 'WRM-%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'WRM-%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'WRM-%';


-- ════════════════════════════════════════════════════════════
-- 2. SUPPLY CHAIN ACTORS — HELIOTRAIL (HT-*)
-- ════════════════════════════════════════════════════════════

-- Tier 1: Module Assembly — HelioTrail (uses passport's own facility)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'HelioTrail Demo Manufacturing', 'Module Assembly', 'EO-HT-001', 'India',
  p.facility_name, p.facility_location,
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-10'::date, 1
FROM passports p WHERE p.model_id LIKE 'HT-%';

-- Tier 2: Cell Manufacturing — HelioTrail Cell Division Chennai
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'HelioTrail Demo Manufacturing — Cell Division', 'Cell Manufacturing', 'EO-HT-001', 'India',
  'HelioTrail Cell Division, Chennai', 'Chennai, Tamil Nadu, India',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-15'::date, 2
FROM passports p WHERE p.model_id LIKE 'HT-%';

-- Tier 3: Wafer — LONGi Green Energy
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'LONGi Green Energy Technology Co., Ltd.', 'Wafer Manufacturing', 'EO-LONGI-001', 'Malaysia',
  'LONGi Kuching Wafer Plant', 'Kuching, Sarawak, Malaysia',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Slicing & Wafer Production', true, '2025-09-10'::date, 3
FROM passports p WHERE p.model_id LIKE 'HT-%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'HT-%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'HT-%';


-- ════════════════════════════════════════════════════════════
-- 3. SUPPLY CHAIN ACTORS — SOLARTECH EUROPE (ST-*)
-- ════════════════════════════════════════════════════════════

-- Tier 1: Module Assembly — SolarTech (uses passport's own facility)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'SolarTech Europe GmbH', 'Module Assembly', 'EO-STE-001', 'Germany',
  p.facility_name, p.facility_location,
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-20'::date, 1
FROM passports p WHERE p.model_id LIKE 'ST-%';

-- Tier 2: Cell Manufacturing — SolarTech Cell Division Frankfurt
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'SolarTech Europe GmbH — Cell Division', 'Cell Manufacturing', 'EO-STE-001', 'Germany',
  'SolarTech Cell Division, Frankfurt', 'Frankfurt am Main, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-25'::date, 2
FROM passports p WHERE p.model_id LIKE 'ST-%';

-- Tier 3: Wafer — NorSun AS (European wafer)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'NorSun AS', 'Wafer Manufacturing', 'EO-NORSUN-001', 'Norway',
  'NorSun Årdal Wafer Plant', 'Årdal, Vestland, Norway',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Growth & Wafer Slicing (100% Hydropower)', true, '2025-09-15'::date, 3
FROM passports p WHERE p.model_id LIKE 'ST-%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'ST-%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'ST-%';


-- ════════════════════════════════════════════════════════════
-- 4. SUPPLY CHAIN ACTORS — GREENWATT ENERGY (GW-*)
-- ════════════════════════════════════════════════════════════

-- Tier 1: Module Assembly — GreenWatt (uses passport's own facility)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'GreenWatt Energy S.A.', 'Module Assembly', 'EO-GWE-001', 'Portugal',
  p.facility_name, p.facility_location,
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-25'::date, 1
FROM passports p WHERE p.model_id LIKE 'GW-%';

-- Tier 2: Cell Manufacturing — GreenWatt Cell Division Faro
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'GreenWatt Energy S.A. — Cell Division', 'Cell Manufacturing', 'EO-GWE-001', 'Portugal',
  'GreenWatt Cell Division, Faro', 'Faro, Algarve, Portugal',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-30'::date, 2
FROM passports p WHERE p.model_id LIKE 'GW-%';

-- Tier 3: Wafer — NorSun AS (European wafer)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'NorSun AS', 'Wafer Manufacturing', 'EO-NORSUN-001', 'Norway',
  'NorSun Årdal Wafer Plant', 'Årdal, Vestland, Norway',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Growth & Wafer Slicing (100% Hydropower)', true, '2025-09-15'::date, 3
FROM passports p WHERE p.model_id LIKE 'GW-%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'GW-%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'GW-%';


-- ════════════════════════════════════════════════════════════
-- 5. CHAIN OF CUSTODY — WAAREE (WRM-*)
-- ════════════════════════════════════════════════════════════

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'LONGi Green Energy Technology Co., Ltd.',
  'Burghausen, Germany → Kuching, Malaysia',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-longi-bol-' || p.public_id,
  encode(sha256(('wacker-longi-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'WRM-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'LONGi Green Energy Technology Co., Ltd.', 'Waaree Energies Ltd. — Cell Division',
  'Kuching, Malaysia → Chikhli, Gujarat, India',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/longi-waaree-wafer-' || p.public_id,
  encode(sha256(('longi-waaree-' || p.public_id)::bytea), 'hex'),
  'Wafer lot shipped; LONGi quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'WRM-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'Waaree Energies Ltd. — Cell Division', 'Waaree Energies Ltd.',
  'Chikhli, Gujarat → ' || p.facility_location,
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/waaree-cell-transfer-' || p.public_id,
  encode(sha256(('waaree-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'WRM-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'Waaree Energies Ltd.', NULL,
  p.facility_location,
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/waaree-assembly-' || p.public_id,
  encode(sha256(('waaree-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'WRM-%';


-- ════════════════════════════════════════════════════════════
-- 6. CHAIN OF CUSTODY — HELIOTRAIL (HT-*)
-- ════════════════════════════════════════════════════════════

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'LONGi Green Energy Technology Co., Ltd.',
  'Burghausen, Germany → Kuching, Malaysia',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-longi-bol-' || p.public_id,
  encode(sha256(('wacker-longi-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'HT-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'LONGi Green Energy Technology Co., Ltd.', 'HelioTrail Demo Manufacturing — Cell Division',
  'Kuching, Malaysia → Chennai, Tamil Nadu, India',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/longi-ht-wafer-' || p.public_id,
  encode(sha256(('longi-ht-' || p.public_id)::bytea), 'hex'),
  'Wafer lot shipped; LONGi quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'HT-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'HelioTrail Demo Manufacturing — Cell Division', 'HelioTrail Demo Manufacturing',
  'Chennai, India → ' || p.facility_location,
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/ht-cell-transfer-' || p.public_id,
  encode(sha256(('ht-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'HT-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'HelioTrail Demo Manufacturing', NULL,
  p.facility_location,
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/ht-assembly-' || p.public_id,
  encode(sha256(('ht-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'HT-%';


-- ════════════════════════════════════════════════════════════
-- 7. CHAIN OF CUSTODY — SOLARTECH EUROPE (ST-*)
-- ════════════════════════════════════════════════════════════

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'NorSun AS',
  'Burghausen, Germany → Årdal, Norway',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-norsun-bol-' || p.public_id,
  encode(sha256(('wacker-norsun-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'ST-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'NorSun AS', 'SolarTech Europe GmbH — Cell Division',
  'Årdal, Norway → Frankfurt am Main, Germany',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/norsun-ste-wafer-' || p.public_id,
  encode(sha256(('norsun-ste-' || p.public_id)::bytea), 'hex'),
  'Wafer lot shipped; NorSun quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'ST-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'SolarTech Europe GmbH — Cell Division', 'SolarTech Europe GmbH',
  'Frankfurt am Main, Germany',
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/ste-cell-transfer-' || p.public_id,
  encode(sha256(('ste-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'ST-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'SolarTech Europe GmbH', NULL,
  p.facility_location,
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/ste-assembly-' || p.public_id,
  encode(sha256(('ste-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'ST-%';


-- ════════════════════════════════════════════════════════════
-- 8. CHAIN OF CUSTODY — GREENWATT ENERGY (GW-*)
-- ════════════════════════════════════════════════════════════

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'NorSun AS',
  'Burghausen, Germany → Årdal, Norway',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-norsun-bol-' || p.public_id,
  encode(sha256(('wacker-norsun-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'GW-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'NorSun AS', 'GreenWatt Energy S.A. — Cell Division',
  'Årdal, Norway → Faro, Algarve, Portugal',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/norsun-gwe-wafer-' || p.public_id,
  encode(sha256(('norsun-gwe-' || p.public_id)::bytea), 'hex'),
  'Wafer lot shipped; NorSun quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'GW-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'GreenWatt Energy S.A. — Cell Division', 'GreenWatt Energy S.A.',
  'Faro, Algarve, Portugal',
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/gwe-cell-transfer-' || p.public_id,
  encode(sha256(('gwe-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'GW-%';

INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'GreenWatt Energy S.A.', NULL,
  p.facility_location,
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/gwe-assembly-' || p.public_id,
  encode(sha256(('gwe-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'GW-%';


-- ════════════════════════════════════════════════════════════
-- 9. SUBSTANCES OF CONCERN — ALL 120 PASSPORTS
-- ════════════════════════════════════════════════════════════

-- Lead (Pb) — present in solder joints of all crystalline silicon modules
INSERT INTO passport_substances_of_concern (passport_id, substance_name, cas_number, concentration_percent, location_in_module, regulatory_basis, exemption, notes)
SELECT p.id, 'Lead (Pb)', '7439-92-1', 0.0200, 'Solder joints (cell interconnects & junction box)',
  'EU RoHS Directive 2011/65/EU; REACH SVHC Candidate List',
  'RoHS Annex III Exemption 7(a) — lead in high-melting-temperature solders (>85% Pb)',
  'Below 0.1% threshold by weight of homogeneous material. Solder alloy Sn62Pb36Ag2 used in cell tabbing.'
FROM passports p;

-- Cadmium (Cd) — not present in crystalline silicon technology
INSERT INTO passport_substances_of_concern (passport_id, substance_name, cas_number, concentration_percent, location_in_module, regulatory_basis, exemption, notes)
SELECT p.id, 'Cadmium (Cd)', '7440-43-9', 0.0000, 'Not present — crystalline silicon technology',
  'EU RoHS Directive 2011/65/EU; REACH SVHC Candidate List',
  'RoHS exempt — substance not present in crystalline silicon modules',
  'Cadmium is associated with CdTe thin-film technology. This module uses crystalline silicon cells with zero cadmium content.'
FROM passports p;
