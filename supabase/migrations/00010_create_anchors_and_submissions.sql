-- ============================================================
-- Passport anchors — integrity hash records
-- ============================================================
create table passport_anchors (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null references passports(id) on delete cascade,
  passport_version integer not null,
  payload_hash text not null,
  hash_algorithm text not null default 'sha256',
  anchored_at timestamptz not null default now(),
  anchor_type text not null default 'local'
    check (anchor_type in ('local', 'blockchain')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index idx_passport_anchors_passport on passport_anchors(passport_id);

-- ============================================================
-- Passport submissions — CIRPASS 2 portal submission records
-- ============================================================
create table passport_submissions (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null references passports(id) on delete cascade,
  anchor_id uuid not null references passport_anchors(id) on delete cascade,
  target_registry text not null default 'cirpass2',
  submission_status text not null default 'pending'
    check (submission_status in ('pending', 'accepted', 'rejected', 'error')),
  submitted_at timestamptz not null default now(),
  response_id text,
  response_payload jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index idx_passport_submissions_passport on passport_submissions(passport_id);
create index idx_passport_submissions_anchor on passport_submissions(anchor_id);

-- ============================================================
-- RLS: public can read anchors/submissions for published passports
-- ============================================================
alter table passport_anchors enable row level security;
alter table passport_submissions enable row level security;

create policy "Public can read anchors for published passports"
  on passport_anchors for select to anon
  using (
    exists (
      select 1 from passports
      where passports.id = passport_anchors.passport_id
        and passports.status = 'published'
    )
  );

create policy "Public can read submissions for published passports"
  on passport_submissions for select to anon
  using (
    exists (
      select 1 from passports
      where passports.id = passport_submissions.passport_id
        and passports.status = 'published'
    )
  );

-- Authenticated users have full read access
create policy "Authenticated users can read all anchors"
  on passport_anchors for select to authenticated
  using (true);

create policy "Authenticated users can read all submissions"
  on passport_submissions for select to authenticated
  using (true);

-- Service role / authenticated can insert (API routes use service role or anon with insert)
create policy "Allow insert anchors"
  on passport_anchors for insert
  with check (true);

create policy "Allow insert submissions"
  on passport_submissions for insert
  with check (true);

create policy "Allow update submissions"
  on passport_submissions for update
  using (true)
  with check (true);
