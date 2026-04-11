-- Fix WRM-580-TOPCON-BiN-08: missing carbon footprint data for a published passport
UPDATE passports
SET
  carbon_footprint_kg_co2e = 390,
  carbon_footprint_methodology = 'ISO 14067:2018 cradle-to-gate'
WHERE public_id = 'wrm-580-topcon-2026-005'
  AND carbon_footprint_kg_co2e IS NULL;
