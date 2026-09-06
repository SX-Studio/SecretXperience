-- Site Time Tracker: optional shared database schema for Supabase.
-- Run this once in the Supabase SQL editor (Project > SQL Editor > New query > Run).
-- Without it, the app stores everything on each phone only.

create table if not exists public.sites (
  name        text primary key,
  created_at  timestamptz not null default now()
);

create table if not exists public.entries (
  id          uuid primary key,
  phone       text not null,               -- employee ID: their mobile number (no names stored)
  site        text not null,               -- work site chosen from the list, or typed by the employee
  plate       text not null default '',    -- license plate of the vehicle that day (optional)
  start_at    timestamptz not null,
  end_at      timestamptz,                 -- null while the employee is still clocked in
  break_min   integer not null default 0,  -- break deducted automatically (minutes)
  hours       numeric(6,2),                -- counted hours = (end - start) - break
  notes       text not null default '',    -- daily notes (optional)
  manual      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists entries_phone_start_idx on public.entries (phone, start_at desc);
create index if not exists entries_start_idx on public.entries (start_at desc);

create table if not exists public.settings (
  key    text primary key,   -- admin_pin (SHA-256 hash), break_min, break_after_h
  value  text
);

insert into public.sites (name) values ('Main yard') on conflict do nothing;

-- The app talks to the database with the public "anon" key, so every phone with the
-- app installed may read and write these tables. Keep the anon key inside the company.
alter table public.sites    enable row level security;
alter table public.entries  enable row level security;
alter table public.settings enable row level security;

drop policy if exists "app access" on public.sites;
drop policy if exists "app access" on public.entries;
drop policy if exists "app access" on public.settings;
create policy "app access" on public.sites    for all to anon using (true) with check (true);
create policy "app access" on public.entries  for all to anon using (true) with check (true);
create policy "app access" on public.settings for all to anon using (true) with check (true);
