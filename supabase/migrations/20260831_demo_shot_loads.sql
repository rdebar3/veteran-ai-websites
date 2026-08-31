-- Public /shot/[slug] load tracking (server-side only; no IPs, no cookies).
-- Project: veteran-ai-outreach Supabase (shared with the marketing site).
-- Apply in Supabase SQL editor / migration runner. Do not apply from this repo's
-- Vercel deploy — the websites app has no migration runner.

create table if not exists public.demo_shot_loads (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  loaded_at timestamptz not null default now(),
  user_agent text
);

create index if not exists demo_shot_loads_slug_loaded_at_idx
  on public.demo_shot_loads (slug, loaded_at);

comment on table public.demo_shot_loads is
  'Server-side /shot/[slug] PNG loads. Inserted by the websites renderer via service role. No IPs, no cookies, no client JS.';

alter table public.demo_shot_loads enable row level security;

-- No anon/authenticated policies: inserts and reads are service_role only
-- (service_role bypasses RLS). A failed insert must never affect the image response.
