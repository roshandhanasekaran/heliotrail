-- ============================================================
-- Migration 00016: Seed supply chain, CoC, and SoC for 30 passports
-- 5 actors + 4 CoC events + 2 SoC entries per passport = 330 rows
-- ============================================================

-- ============================================================
-- 1. SUPPLY CHAIN ACTORS — WAAREE (model_id LIKE 'WRM%')
-- ============================================================

-- Tier 1: Module Assembly — Waaree factory (uses each passport's own facility)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Waaree Energies Ltd.', 'Module Assembly', 'EO-WRM-001', 'India',
  p.facility_name, p.facility_location,
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-15'::date, 1
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Tier 2: Cell Manufacturing — Waaree Cell Division Chikhli
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Waaree Energies Ltd. — Cell Division', 'Cell Manufacturing', 'EO-WRM-001', 'India',
  'Waaree Cell Division, Chikhli', 'Chikhli, Gujarat, India',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-20'::date, 2
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Tier 3: Wafer — LONGi Green Energy
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'LONGi Green Energy Technology Co., Ltd.', 'Wafer Manufacturing', 'EO-LONGI-001', 'Malaysia',
  'LONGi Kuching Wafer Plant', 'Kuching, Sarawak, Malaysia',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Slicing & Wafer Production', true, '2025-09-10'::date, 3
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'WRM%';


-- ============================================================
-- 2. SUPPLY CHAIN ACTORS — ADANI SOLAR (model_id LIKE 'ASM%')
-- ============================================================

-- Tier 1: Module Assembly — Adani Mundra GigaFactory
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Mundra Solar PV Ltd. (Adani Solar)', 'Module Assembly', 'EO-ADS-001', 'India',
  'Mundra GigaFactory', 'Kutch, Gujarat, India',
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-20'::date, 1
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Tier 2: Cell Manufacturing — Adani Solar Cell Division Mundra
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Adani Solar Cell Division', 'Cell Manufacturing', 'EO-ADS-001', 'India',
  'Adani Solar Cell Division, Mundra GigaFactory', 'Kutch, Gujarat, India',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-25'::date, 2
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Tier 3: Wafer — LONGi Green Energy
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'LONGi Green Energy Technology Co., Ltd.', 'Wafer Manufacturing', 'EO-LONGI-001', 'Malaysia',
  'LONGi Kuching Wafer Plant', 'Kuching, Sarawak, Malaysia',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Slicing & Wafer Production', true, '2025-09-10'::date, 3
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'ASM%';


-- ============================================================
-- 3. SUPPLY CHAIN ACTORS — VIKRAM SOLAR (model_id LIKE 'VSMDH%')
-- ============================================================

-- Tier 1: Module Assembly — Vikram factory (uses each passport's own facility)
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Vikram Solar Limited', 'Module Assembly', 'EO-VKS-001', 'India',
  p.facility_name, p.facility_location,
  ARRAY['ISO 9001:2015','ISO 14001:2015','ISO 45001:2018','IEC 61215','IEC 61730'],
  1, 'Module Assembly & Lamination', true, '2025-11-10'::date, 1
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Tier 2: Cell Manufacturing — Vikram Cell Division
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Vikram Solar Limited — Cell Division', 'Cell Manufacturing', 'EO-VKS-001', 'India',
  'Vikram Solar Cell Division, Falta SEZ', 'South 24 Parganas, West Bengal, India',
  ARRAY['ISO 9001:2015','ISO 14001:2015'],
  2, 'Cell Processing & Metallization', true, '2025-10-15'::date, 2
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Tier 3: Wafer — LONGi Green Energy
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'LONGi Green Energy Technology Co., Ltd.', 'Wafer Manufacturing', 'EO-LONGI-001', 'Malaysia',
  'LONGi Kuching Wafer Plant', 'Kuching, Sarawak, Malaysia',
  ARRAY['ISO 9001:2015','ISO 14001:2015','SA8000'],
  3, 'Ingot Slicing & Wafer Production', true, '2025-09-10'::date, 3
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Tier 4: Polysilicon — Wacker Chemie AG
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Wacker Chemie AG', 'Polysilicon Production', 'EO-WACKER-001', 'Germany',
  'Wacker Burghausen Polysilicon Plant', 'Burghausen, Bavaria, Germany',
  ARRAY['ISO 9001:2015','ISO 14001:2015','IATF 16949','EcoVadis Platinum'],
  4, 'Siemens Process Polysilicon Refining', true, '2025-08-05'::date, 4
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Tier 5: Quartz Mining — Unimin/Covia
INSERT INTO passport_supply_chain_actors (passport_id, actor_name, actor_role, operator_id, country, facility_name, facility_location, certifications, tier_level, stage, uflpa_compliant, audit_date, sort_order)
SELECT p.id, 'Unimin Corporation (Covia Holdings)', 'Quartz Mining', 'EO-COVIA-001', 'United States',
  'Spruce Pine Quartz Mine', 'Spruce Pine, North Carolina, USA',
  ARRAY['ISO 14001:2015','MSHA Compliant'],
  5, 'High-Purity Quartz Extraction', true, '2025-07-01'::date, 5
FROM passports p WHERE p.model_id LIKE 'VSMDH%';


-- ============================================================
-- 4. CHAIN OF CUSTODY EVENTS — WAAREE
-- ============================================================

-- Event 1: Polysilicon shipment from Wacker to LONGi
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'LONGi Green Energy Technology Co., Ltd.',
  'Burghausen, Germany → Kuching, Malaysia',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-longi-bol-' || p.public_id,
  encode(sha256(('wacker-longi-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Event 2: Wafer shipment from LONGi to Waaree Cell Division
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'LONGi Green Energy Technology Co., Ltd.', 'Waaree Energies Ltd. — Cell Division',
  'Kuching, Malaysia → Chikhli, Gujarat, India',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/longi-waaree-wafer-' || p.public_id,
  encode(sha256(('longi-waaree-' || p.public_id)::bytea), 'hex'),
  'M12 wafer lot shipped; LONGi quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Event 3: Cell transfer to module assembly
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'Waaree Energies Ltd. — Cell Division', 'Waaree Energies Ltd.',
  'Chikhli, Gujarat → ' || p.facility_location,
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/waaree-cell-transfer-' || p.public_id,
  encode(sha256(('waaree-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'WRM%';

-- Event 4: Module assembly completed
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'Waaree Energies Ltd.', NULL,
  p.facility_location,
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/waaree-assembly-' || p.public_id,
  encode(sha256(('waaree-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'WRM%';


-- ============================================================
-- 5. CHAIN OF CUSTODY EVENTS — ADANI SOLAR
-- ============================================================

-- Event 1: Polysilicon shipment from Wacker to LONGi
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'LONGi Green Energy Technology Co., Ltd.',
  'Burghausen, Germany → Kuching, Malaysia',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-longi-bol-' || p.public_id,
  encode(sha256(('wacker-longi-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Event 2: Wafer shipment from LONGi to Adani Cell Division
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'LONGi Green Energy Technology Co., Ltd.', 'Adani Solar Cell Division',
  'Kuching, Malaysia → Kutch, Gujarat, India',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/longi-adani-wafer-' || p.public_id,
  encode(sha256(('longi-adani-' || p.public_id)::bytea), 'hex'),
  'M12 wafer lot shipped; LONGi quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Event 3: Cell transfer to module assembly
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'Adani Solar Cell Division', 'Mundra Solar PV Ltd. (Adani Solar)',
  'Mundra GigaFactory, Kutch, Gujarat, India',
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/adani-cell-transfer-' || p.public_id,
  encode(sha256(('adani-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'ASM%';

-- Event 4: Module assembly completed
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'Mundra Solar PV Ltd. (Adani Solar)', NULL,
  'Kutch, Gujarat, India',
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/adani-assembly-' || p.public_id,
  encode(sha256(('adani-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'ASM%';


-- ============================================================
-- 6. CHAIN OF CUSTODY EVENTS — VIKRAM SOLAR
-- ============================================================

-- Event 1: Polysilicon shipment from Wacker to LONGi
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Shipment', 'Wacker Chemie AG', 'LONGi Green Energy Technology Co., Ltd.',
  'Burghausen, Germany → Kuching, Malaysia',
  (p.manufacturing_date - interval '90 days')::timestamptz,
  'https://heliotrail.com/evidence/wacker-longi-bol-' || p.public_id,
  encode(sha256(('wacker-longi-' || p.public_id)::bytea), 'hex'),
  'Electronic polysilicon Bill of Lading; Wacker Lot Certificate attached'
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Event 2: Wafer shipment from LONGi to Vikram Cell Division
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Processing', 'LONGi Green Energy Technology Co., Ltd.', 'Vikram Solar Limited — Cell Division',
  'Kuching, Malaysia → South 24 Parganas, West Bengal, India',
  (p.manufacturing_date - interval '60 days')::timestamptz,
  'https://heliotrail.com/evidence/longi-vikram-wafer-' || p.public_id,
  encode(sha256(('longi-vikram-' || p.public_id)::bytea), 'hex'),
  'M12 wafer lot shipped; LONGi quality inspection report included'
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Event 3: Cell transfer to module assembly
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Transfer', 'Vikram Solar Limited — Cell Division', 'Vikram Solar Limited',
  'Falta SEZ, West Bengal → ' || p.facility_location,
  (p.manufacturing_date - interval '14 days')::timestamptz,
  'https://heliotrail.com/evidence/vikram-cell-transfer-' || p.public_id,
  encode(sha256(('vikram-cell-' || p.public_id)::bytea), 'hex'),
  'Internal cell-to-module transfer; EL inspection passed'
FROM passports p WHERE p.model_id LIKE 'VSMDH%';

-- Event 4: Module assembly completed
INSERT INTO passport_chain_of_custody (passport_id, event_type, from_actor, to_actor, location, event_timestamp, evidence_url, evidence_hash, notes)
SELECT p.id, 'Assembly Complete', 'Vikram Solar Limited', NULL,
  p.facility_location,
  p.manufacturing_date::timestamptz,
  'https://heliotrail.com/evidence/vikram-assembly-' || p.public_id,
  encode(sha256(('vikram-assembly-' || p.public_id)::bytea), 'hex'),
  'Module assembly completed; flash test and EL final inspection passed'
FROM passports p WHERE p.model_id LIKE 'VSMDH%';


-- ============================================================
-- 7. SUBSTANCES OF CONCERN — ALL 30 PASSPORTS
-- ============================================================

-- Lead (Pb) — present in solder joints
INSERT INTO passport_substances_of_concern (passport_id, substance_name, cas_number, concentration_percent, location_in_module, regulatory_basis, exemption, notes)
SELECT p.id, 'Lead (Pb)', '7439-92-1', 0.0200, 'Solder joints (cell interconnects & junction box)',
  'EU RoHS Directive 2011/65/EU; REACH SVHC Candidate List',
  'RoHS Annex III Exemption 7(a) — lead in high-melting-temperature solders (>85% Pb)',
  'Below 0.1% threshold by weight of homogeneous material. Solder alloy Sn62Pb36Ag2 used in cell tabbing.'
FROM passports p;

-- Cadmium (Cd) — not present in N-Type TOPCon / PERC mono
INSERT INTO passport_substances_of_concern (passport_id, substance_name, cas_number, concentration_percent, location_in_module, regulatory_basis, exemption, notes)
SELECT p.id, 'Cadmium (Cd)', '7440-43-9', 0.0000, 'Not present — N-Type TOPCon / PERC monocrystalline technology',
  'EU RoHS Directive 2011/65/EU; REACH SVHC Candidate List',
  'RoHS exempt — substance not present in crystalline silicon modules',
  'Cadmium is associated with CdTe thin-film technology. This module uses crystalline silicon cells with zero cadmium content.'
FROM passports p;
