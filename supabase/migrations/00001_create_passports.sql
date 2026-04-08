create extension if not exists "pgcrypto";

create type passport_status as enum (
  'draft', 'under_review', 'approved', 'published', 'superseded', 'archived', 'decommissioned'
);

create type verification_status as enum (
  'verified', 'pending', 'unverifiable', 'outdated'
);

create type module_technology as enum (
  'crystalline_silicon_topcon', 'crystalline_silicon_perc', 'crystalline_silicon_hjt',
  'thin_film_cdte', 'thin_film_cigs', 'other'
);

create table passports (
  id uuid primary key default gen_random_uuid(),
  pv_passport_id text unique not null,
  public_id text unique not null,
  model_id text not null,
  serial_number text,
  batch_id text,
  gtin text,
  module_technology module_technology not null,
  status passport_status not null default 'draft',
  verification_status verification_status not null default 'pending',

  -- Manufacturer
  manufacturer_name text not null,
  manufacturer_operator_id text,
  manufacturer_address text,
  manufacturer_contact_url text,
  manufacturer_country text,

  -- Facility
  facility_id text,
  facility_name text,
  facility_location text,
  manufacturing_date date,

  -- Technical specifications (STC)
  rated_power_stc_w numeric(8,2),
  module_efficiency_percent numeric(5,2),
  voc_v numeric(6,2),
  isc_a numeric(6,2),
  vmp_v numeric(6,2),
  imp_a numeric(6,2),
  max_system_voltage_v integer,
  module_length_mm integer,
  module_width_mm integer,
  module_depth_mm integer,
  module_mass_kg numeric(6,2),
  cell_count integer,
  cell_type text,

  -- Warranty and reliability
  product_warranty_years integer,
  performance_warranty_years integer,
  performance_warranty_percent numeric(5,2),
  linear_degradation_percent_per_year numeric(4,2),
  expected_lifetime_years integer,

  -- Carbon
  carbon_footprint_kg_co2e numeric(10,2),
  carbon_footprint_methodology text,

  -- Metadata
  passport_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index idx_passports_public_id on passports(public_id);
create index idx_passports_status on passports(status);
