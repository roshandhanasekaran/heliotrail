create table passport_materials (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null references passports(id) on delete cascade,
  material_name text not null,
  component_type text,
  mass_g numeric(10,2),
  mass_percent numeric(5,2),
  cas_number text,
  is_critical_raw_material boolean default false,
  is_substance_of_concern boolean default false,
  concentration_percent numeric(8,4),
  regulatory_basis text,
  recyclability_hint text,
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

create index idx_materials_passport on passport_materials(passport_id);
