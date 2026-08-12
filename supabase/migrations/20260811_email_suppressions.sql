-- Marketing email opt-outs from /unsubscribe → POST /api/unsubscribe
-- Project: veteran-ai-outreach Supabase (shared with marketing site forms)

create table if not exists public.email_suppressions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'website_unsubscribe',
  created_at timestamptz not null default now(),
  constraint email_suppressions_email_unique unique (email)
);

create index if not exists email_suppressions_created_at_idx
  on public.email_suppressions (created_at desc);

comment on table public.email_suppressions is
  'Emails that must not receive marketing mail from Veteran AI Websites.';

-- Allow insert from anon (public unsubscribe form) and service role.
alter table public.email_suppressions enable row level security;

drop policy if exists "Anyone can insert suppressions" on public.email_suppressions;
create policy "Anyone can insert suppressions"
  on public.email_suppressions
  for insert
  to anon, authenticated
  with check (true);

-- No public read/update/delete — service role only for listing.
drop policy if exists "Service role full access suppressions" on public.email_suppressions;
-- service_role bypasses RLS by default in Supabase; no extra policy required for reads.
