create type certificate_status as enum ('valid', 'expired', 'revoked', 'pending');

create table passport_certificates (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null references passports(id) on delete cascade,
  standard_name text not null,
  certificate_number text,
  issuer text not null,
  issued_date date,
  expiry_date date,
  status certificate_status not null default 'valid',
  document_url text,
  document_hash text,
  hash_algorithm text default 'sha256',
  scope_notes text,
  created_at timestamptz not null default now()
);

create index idx_certificates_passport on passport_certificates(passport_id);
