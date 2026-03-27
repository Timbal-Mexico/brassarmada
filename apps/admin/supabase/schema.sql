create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  genre text,
  description text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_bands_updated_at
before update on public.bands
for each row execute function public.set_updated_at();

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  name text not null,
  slug text not null unique,
  bio text,
  genre text,
  debut_year int,
  active boolean not null default true,
  phone text,
  email text,
  social_links jsonb not null default '{}'::jsonb,
  profile_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_artists_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

create table if not exists public.band_admins (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references public.bands(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default now(),
  unique (band_id, user_id)
);

create table if not exists public.band_members (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references public.bands(id) on delete cascade,
  artist_id uuid not null references public.artists(id) on delete cascade,
  role text,
  status text not null default 'pending' check (status in ('pending', 'active', 'removed')),
  requested_by text not null default 'artist' check (requested_by in ('artist', 'band')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (band_id, artist_id)
);

create trigger set_band_members_updated_at
before update on public.band_members
for each row execute function public.set_updated_at();

alter table public.bands enable row level security;
alter table public.artists enable row level security;
alter table public.band_admins enable row level security;
alter table public.band_members enable row level security;

create policy "bands_select_public"
on public.bands
for select
to anon, authenticated
using (true);

create policy "bands_write_admins_only"
on public.bands
for all
to authenticated
using (
  exists (
    select 1 from public.band_admins ba
    where ba.band_id = bands.id
      and ba.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.band_admins ba
    where ba.band_id = bands.id
      and ba.user_id = auth.uid()
  )
);

create policy "artists_select_public"
on public.artists
for select
to anon, authenticated
using (true);

create policy "artists_insert_self"
on public.artists
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "artists_update_self"
on public.artists
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "artists_delete_self"
on public.artists
for delete
to authenticated
using (auth.uid() = user_id);

create policy "band_admins_select_self"
on public.band_admins
for select
to authenticated
using (auth.uid() = user_id);

create policy "band_admins_write_self"
on public.band_admins
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "band_members_select_public"
on public.band_members
for select
to anon, authenticated
using (true);

create policy "band_members_insert_artist_or_admin"
on public.band_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.artists a
    where a.id = band_members.artist_id
      and a.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.band_admins ba
    where ba.band_id = band_members.band_id
      and ba.user_id = auth.uid()
  )
);

create policy "band_members_update_admin_only"
on public.band_members
for update
to authenticated
using (
  exists (
    select 1
    from public.band_admins ba
    where ba.band_id = band_members.band_id
      and ba.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.band_admins ba
    where ba.band_id = band_members.band_id
      and ba.user_id = auth.uid()
  )
);

create policy "band_members_delete_artist_or_admin"
on public.band_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.artists a
    where a.id = band_members.artist_id
      and a.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.band_admins ba
    where ba.band_id = band_members.band_id
      and ba.user_id = auth.uid()
  )
);

