-- ============================================================
-- Migration 00015: Supply chain, chain of custody, and SoC tables
-- Enables 5-tier traceability, custody events, and REACH/RoHS
-- substance tracking for EU ESPR Digital Product Passports
-- ============================================================

-- Supply Chain Actors (5-tier traceability)
CREATE TABLE IF NOT EXISTS passport_supply_chain_actors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_id uuid NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
  actor_name text NOT NULL,
  actor_role text NOT NULL,
  operator_id text,
  country text,
  facility_name text,
  facility_location text,
  certifications text[],
  tier_level integer,
  stage text,
  uflpa_compliant boolean DEFAULT true,
  audit_date date,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_supply_chain_passport ON passport_supply_chain_actors(passport_id);

-- Chain of Custody Events
CREATE TABLE IF NOT EXISTS passport_chain_of_custody (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_id uuid NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_actor text,
  to_actor text,
  location text,
  event_timestamp timestamptz,
  evidence_url text,
  evidence_hash text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coc_passport ON passport_chain_of_custody(passport_id);

-- Substances of Concern (dedicated)
CREATE TABLE IF NOT EXISTS passport_substances_of_concern (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passport_id uuid NOT NULL REFERENCES passports(id) ON DELETE CASCADE,
  substance_name text NOT NULL,
  cas_number text,
  concentration_percent numeric(8,4),
  location_in_module text,
  regulatory_basis text,
  exemption text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soc_passport ON passport_substances_of_concern(passport_id);

-- RLS policies
ALTER TABLE passport_supply_chain_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_chain_of_custody ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_substances_of_concern ENABLE ROW LEVEL SECURITY;

-- Public read for published passports only
CREATE POLICY "Public read supply chain for published" ON passport_supply_chain_actors
  FOR SELECT USING (passport_id IN (SELECT id FROM passports WHERE status = 'published'));

CREATE POLICY "Public read CoC for published" ON passport_chain_of_custody
  FOR SELECT USING (passport_id IN (SELECT id FROM passports WHERE status = 'published'));

CREATE POLICY "Public read SoC for published" ON passport_substances_of_concern
  FOR SELECT USING (passport_id IN (SELECT id FROM passports WHERE status = 'published'));

-- Authenticated full read
CREATE POLICY "Auth read supply chain" ON passport_supply_chain_actors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth read CoC" ON passport_chain_of_custody
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth read SoC" ON passport_substances_of_concern
  FOR SELECT TO authenticated USING (true);

-- Authenticated insert/update
CREATE POLICY "Auth insert supply chain" ON passport_supply_chain_actors
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth insert CoC" ON passport_chain_of_custody
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth insert SoC" ON passport_substances_of_concern
  FOR INSERT TO authenticated WITH CHECK (true);
