-- ============================================================
-- Backfill 30 passports with realistic carbon, compliance,
-- and material traceability data
-- ============================================================

-- Backfill passports: carbon footprint, methodology, compliance status
UPDATE passports SET
  carbon_footprint_kg_co2e = CASE
    WHEN model_id LIKE 'WRM-700%' THEN 850
    WHEN model_id LIKE 'WRM-590%' THEN 810
    WHEN model_id LIKE 'WRM-580%' THEN 800
    WHEN model_id LIKE 'ASM-590%' THEN 815
    WHEN model_id LIKE 'ASM-580%' THEN 805
    WHEN model_id LIKE 'ASM-545%' THEN 750
    WHEN model_id LIKE 'VSMDH-595%' THEN 820
    WHEN model_id LIKE 'VSMDH-590%' THEN 812
    WHEN model_id LIKE 'VSMDH-580%' THEN 802
    ELSE 800
  END,
  carbon_footprint_methodology = 'JRC_harmonized_2025',
  carbon_intensity_g_co2e_per_kwh = CASE
    WHEN model_id LIKE 'ASM-545%' THEN 24.0
    ELSE 22.5
  END,
  carbon_lca_boundary = 'cradle_to_gate',
  carbon_verification_ref = CASE
    WHEN model_id LIKE 'WRM%' THEN 'EPD-WRM-2025-001'
    WHEN model_id LIKE 'ASM%' THEN 'EPD-ADS-2025-001'
    WHEN model_id LIKE 'VSMDH%' THEN 'EPD-VKS-2025-001'
    ELSE NULL
  END,
  facility_country = 'IN',
  reach_status = 'compliant',
  rohs_status = 'compliant_with_exemption',
  data_carrier_type = 'qr_gs1_digital_link'
WHERE carbon_footprint_kg_co2e IS NULL OR facility_country IS NULL;

-- Backfill passport_materials: recycled content, origin, supplier
UPDATE passport_materials SET
  recycled_content_percent = CASE
    WHEN material_name ILIKE '%aluminium%' THEN 40.0
    WHEN material_name ILIKE '%copper%' THEN 30.0
    WHEN material_name ILIKE '%glass%' THEN 15.0
    ELSE 0.0
  END,
  origin_country = CASE
    WHEN material_name ILIKE '%glass%' THEN 'IN'
    WHEN material_name ILIKE '%aluminium%' THEN 'IN'
    WHEN material_name ILIKE '%silicon%' THEN 'CN'
    WHEN material_name ILIKE '%EVA%' THEN 'CN'
    WHEN material_name ILIKE '%copper%' THEN 'IN'
    WHEN material_name ILIKE '%silver%' THEN 'CN'
    WHEN material_name ILIKE '%tin%' THEN 'CN'
    WHEN material_name ILIKE '%lead%' THEN 'CN'
    WHEN material_name ILIKE '%backsheet%' OR material_name ILIKE '%fluoropolymer%' THEN 'JP'
    ELSE NULL
  END,
  supplier_id = CASE
    WHEN material_name ILIKE '%glass%' THEN 'SUP-GL-001'
    WHEN material_name ILIKE '%aluminium%' THEN 'SUP-AL-001'
    WHEN material_name ILIKE '%silicon%' THEN 'SUP-SI-001'
    WHEN material_name ILIKE '%EVA%' THEN 'SUP-EV-001'
    WHEN material_name ILIKE '%copper%' THEN 'SUP-CU-001'
    WHEN material_name ILIKE '%silver%' THEN 'SUP-AG-001'
    WHEN material_name ILIKE '%tin%' THEN 'SUP-SN-001'
    WHEN material_name ILIKE '%lead%' THEN 'SUP-PB-001'
    WHEN material_name ILIKE '%backsheet%' OR material_name ILIKE '%fluoropolymer%' THEN 'SUP-BS-001'
    WHEN material_name ILIKE '%junction%' THEN 'SUP-JB-001'
    ELSE NULL
  END
WHERE recycled_content_percent IS NULL;
