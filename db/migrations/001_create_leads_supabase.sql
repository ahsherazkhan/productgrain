-- Run in the Supabase SQL editor or through your migration runner.
-- Browser roles deliberately receive no SELECT, INSERT, UPDATE, or DELETE policy.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text,
  company text,
  country text not null,
  market text not null check (market in ('us', 'uk', 'international')),
  role text not null,
  industry text not null,
  project_type text not null,
  package_interest text check (package_interest in ('blueprint-prototype', 'focused-mvp', 'custom-product')),
  problem_description text not null check (char_length(problem_description) <= 2000),
  current_workaround text not null check (char_length(current_workaround) <= 1200),
  intended_users text not null check (char_length(intended_users) <= 800),
  user_discussions text not null,
  user_access text not null,
  problem_impact text not null,
  product_stage text not null,
  budget_range text not null,
  timeline text not null,
  decision_authority text not null,
  score smallint not null check (score between 0 and 100),
  score_breakdown_json jsonb not null default '{}'::jsonb,
  qualification_status text not null check (qualification_status in ('qualified', 'review', 'nurture')),
  lead_status text not null default 'new',
  landing_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  fbclid text,
  first_touch_json jsonb not null default '{}'::jsonb,
  last_touch_json jsonb not null default '{}'::jsonb,
  contact_consent boolean not null check (contact_consent = true),
  marketing_consent boolean not null default false,
  advertising_consent boolean not null default false,
  advertising_consent_updated_at timestamptz,
  consent_policy_version text,
  retention_until timestamptz not null
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_qualification_status_idx on public.leads (qualification_status);
create index if not exists leads_retention_until_idx on public.leads (retention_until);

create or replace function public.set_lead_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_lead_updated_at() from public, anon, authenticated;
grant execute on function public.set_lead_updated_at() to service_role;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_lead_updated_at();

alter table public.leads enable row level security;
alter table public.leads force row level security;

revoke all on table public.leads from public, anon, authenticated;
grant all on table public.leads to service_role;

comment on table public.leads is
  'Private product enquiries. Delete rows after retention_until according to the configured retention process.';
