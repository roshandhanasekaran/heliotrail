-- ============================================================
-- Enrich materials with CAS numbers, CRM flags, SoC data
-- Based on EU Critical Raw Materials Act 2024 and REACH regulation
-- ============================================================

-- TOPCon 550W materials
update passport_materials set cas_number = '65997-17-3'
  where passport_id = (select id from passports where public_id = 'topcon-550-bf-2026-001')
  and material_name = 'Tempered glass';

update passport_materials set cas_number = '7429-90-5'
  where passport_id = (select id from passports where public_id = 'topcon-550-bf-2026-001')
  and material_name = 'Aluminium alloy';

update passport_materials set cas_number = '24937-78-8'
  where passport_id = (select id from passports where public_id = 'topcon-550-bf-2026-001')
  and material_name = 'EVA encapsulant';

update passport_materials set cas_number = '7440-21-3'
  where passport_id = (select id from passports where public_id = 'topcon-550-bf-2026-001')
  and material_name = 'Silicon wafers';

update passport_materials set cas_number = '7440-50-8'
  where passport_id = (select id from passports where public_id = 'topcon-550-bf-2026-001')
  and material_name = 'Copper interconnects';

update passport_materials set cas_number = '7440-22-4', is_critical_raw_material = true
  where passport_id = (select id from passports where public_id = 'topcon-550-bf-2026-001')
  and material_name = 'Silver paste';

-- PERC 450W materials
update passport_materials set cas_number = '65997-17-3'
  where passport_id = (select id from passports where public_id = 'perc-450-mono-2026-002')
  and material_name = 'Tempered glass';

update passport_materials set cas_number = '7429-90-5'
  where passport_id = (select id from passports where public_id = 'perc-450-mono-2026-002')
  and material_name = 'Aluminium alloy';

update passport_materials set cas_number = '24937-78-8'
  where passport_id = (select id from passports where public_id = 'perc-450-mono-2026-002')
  and material_name = 'EVA encapsulant';

update passport_materials set cas_number = '7440-21-3'
  where passport_id = (select id from passports where public_id = 'perc-450-mono-2026-002')
  and material_name = 'Silicon wafers';

update passport_materials set cas_number = '7440-50-8'
  where passport_id = (select id from passports where public_id = 'perc-450-mono-2026-002')
  and material_name = 'Copper interconnects';

update passport_materials set cas_number = '7440-22-4', is_critical_raw_material = true
  where passport_id = (select id from passports where public_id = 'perc-450-mono-2026-002')
  and material_name = 'Silver paste';

-- Add lead solder material to PERC (the only passport with lead solder per circularity notes)
insert into passport_materials (
  passport_id, material_name, component_type, mass_g, mass_percent,
  cas_number, is_critical_raw_material, is_substance_of_concern,
  concentration_percent, regulatory_basis,
  recyclability_hint, sort_order
) values (
  (select id from passports where public_id = 'perc-450-mono-2026-002'),
  'Lead solder', 'wiring', 4.50, 0.02,
  '7439-92-1', false, true,
  0.019, 'REACH SVHC — Regulation (EC) 1907/2006, Annex XIV',
  'Hazardous substance, requires controlled recovery. Below SVHC threshold per module mass.',
  8
);

-- HJT 420W materials
update passport_materials set cas_number = '65997-17-3'
  where passport_id = (select id from passports where public_id = 'hjt-420-2026-003')
  and material_name = 'Tempered glass (dual)';

update passport_materials set cas_number = '7429-90-5'
  where passport_id = (select id from passports where public_id = 'hjt-420-2026-003')
  and material_name = 'Aluminium alloy';

update passport_materials set cas_number = '7440-21-3'
  where passport_id = (select id from passports where public_id = 'hjt-420-2026-003')
  and material_name = 'Silicon wafers (HJT)';

update passport_materials set cas_number = '7440-50-8'
  where passport_id = (select id from passports where public_id = 'hjt-420-2026-003')
  and material_name = 'Copper interconnects';

update passport_materials set cas_number = '7440-22-4', is_critical_raw_material = true
  where passport_id = (select id from passports where public_id = 'hjt-420-2026-003')
  and material_name = 'Silver paste';

update passport_materials set cas_number = '50926-11-9'
  where passport_id = (select id from passports where public_id = 'hjt-420-2026-003')
  and material_name = 'Indium tin oxide';

-- Mark all Silver paste across all passports as CRM (EU Critical Raw Materials Act 2024)
update passport_materials
  set is_critical_raw_material = true
  where material_name = 'Silver paste';
