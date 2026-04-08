create type document_access_level as enum ('public', 'restricted', 'recycler', 'authority', 'internal');

create type document_type as enum (
  'declaration_of_conformity', 'test_report', 'user_manual',
  'installation_instructions', 'safety_instructions', 'datasheet',
  'epd', 'due_diligence_report', 'recycling_guide', 'other'
);

create table passport_documents (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null references passports(id) on delete cascade,
  name text not null,
  document_type document_type not null,
  access_level document_access_level not null default 'public',
  url text,
  file_size_bytes integer,
  mime_type text,
  document_hash text,
  hash_algorithm text default 'sha256',
  issuer text,
  issued_date date,
  description text,
  created_at timestamptz not null default now()
);

create index idx_documents_passport on passport_documents(passport_id);
create index idx_documents_access on passport_documents(access_level);
