-- Demo page view tracking (server-side only; no IPs, no cookies).
-- Project: veteran-ai-outreach Supabase (shared with the marketing site).
-- Apply in Supabase SQL editor / migration runner. Do not apply from this repo's
-- Vercel deploy — the websites app has no migration runner.

create table if not exists public.demo_views (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  viewed_at timestamptz not null default now(),
  is_preview boolean not null,
  user_agent text
);

create index if not exists demo_views_slug_viewed_at_idx
  on public.demo_views (slug, viewed_at);

comment on table public.demo_views is
  'Server-side /d/[slug] views. Inserted by the websites renderer via service role. No IPs, no cookies, no client JS.';

alter table public.demo_views enable row level security;

-- No anon/authenticated policies: inserts and reads are service_role only
-- (service_role bypasses RLS). A failed insert must never affect page render.
