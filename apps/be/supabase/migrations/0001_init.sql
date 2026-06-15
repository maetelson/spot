-- ─────────────────────────────────────────────────────────────────────────
-- spot. Phase 1.0 schema — PRD §16 (data model), §19.3 (RLS)
-- Run in: Supabase Dashboard → SQL Editor → New query → Run
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.places (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users (id) on delete cascade,

  -- from Kakao keyword search
  name          text not null,
  address       text,
  lat           double precision,
  lng           double precision,
  kakao_place_url text,

  -- user choices
  category      text not null check (category in ('cafe','food','flower','clothing')),
  neighborhood  text not null,                 -- one of the 27 preset ids
  opening_hours jsonb,                          -- { mode, everyday, perDay }  (§13.4)
  rating        int  check (rating between 1 and 5),
  memo          text,

  -- cafe (§16.2)
  power_outlet    text check (power_outlet in ('none','few','plenty')),
  wifi            boolean,
  laptop_friendly boolean,

  -- food
  waiting         text check (waiting in ('none','some','heavy')),
  reservation_url text,
  food_type       text,

  -- flower
  walk_in_today   boolean,

  -- clothing
  style_tags      text[],
  price_range     text check (price_range in ('₩','₩₩','₩₩₩')),

  -- shared optional
  mood          text[],
  instagram_url text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists places_owner_idx on public.places (owner_id);
create index if not exists places_hood_idx  on public.places (neighborhood);
create index if not exists places_cat_idx   on public.places (category);

-- keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_places_updated on public.places;
create trigger trg_places_updated
  before update on public.places
  for each row execute function public.set_updated_at();

-- ── Row Level Security: each user only ever sees/edits their own rows ──
alter table public.places enable row level security;

drop policy if exists "places_select_own" on public.places;
create policy "places_select_own" on public.places
  for select using (auth.uid() = owner_id);

drop policy if exists "places_insert_own" on public.places;
create policy "places_insert_own" on public.places
  for insert with check (auth.uid() = owner_id);

drop policy if exists "places_update_own" on public.places;
create policy "places_update_own" on public.places
  for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

drop policy if exists "places_delete_own" on public.places;
create policy "places_delete_own" on public.places
  for delete using (auth.uid() = owner_id);
