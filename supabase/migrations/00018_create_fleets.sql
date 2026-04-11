-- ============================================================
-- Migration 00018: Create fleets table and add fleet FK to passports
-- Adds the concept of installation sites where PV modules operate.
-- ============================================================

create type site_type as enum (
  'rooftop', 'ground_mount', 'carport', 'floating', 'facade', 'agrivoltaic'
);

create table fleets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  location_city text not null,
  location_country text not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  climate_zone text not null,
  site_type site_type not null,
  commissioned_at date,
  owner_name text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_fleets_slug on fleets(slug);

-- Add fleet reference to passports (nullable — modules can be uninstalled/in-transit)
alter table passports add column fleet_id uuid references fleets(id);
create index idx_passports_fleet_id on passports(fleet_id);

-- RLS
alter table fleets enable row level security;
create policy "Public can read fleets" on fleets for select using (true);
