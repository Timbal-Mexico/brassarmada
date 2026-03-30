create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'role') then
    create type public.role as enum ('admin', 'editor', 'viewer');
  end if;
  if not exists (select 1 from pg_type where typname = 'permission_resource') then
    create type public.permission_resource as enum ('news', 'store', 'artists', 'bands');
  end if;
  if not exists (select 1 from pg_type where typname = 'permission_action') then
    create type public.permission_action as enum ('read', 'create', 'update', 'delete', 'publish');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_profiles_updated_at'
  ) then
    create trigger set_profiles_updated_at
    before update on public.profiles
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  role public.role not null,
  resource public.permission_resource not null,
  action public.permission_action not null,
  created_at timestamptz not null default now(),
  unique (role, resource, action)
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  tags text[] not null default '{}'::text[],
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_news_updated_at'
  ) then
    create trigger set_news_updated_at
    before update on public.news
    for each row execute function public.set_updated_at();
  end if;
end $$;

create table if not exists public.store_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  band_id uuid references public.bands(id) on delete set null,
  image_url text,
  price text,
  shopify_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_store_items_updated_at'
  ) then
    create trigger set_store_items_updated_at
    before update on public.store_items
    for each row execute function public.set_updated_at();
  end if;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    'viewer'
  )
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
      and data_type = 'text'
  ) then
    alter table public.profiles
    alter column role drop default;

    alter table public.profiles
    alter column role type public.role
    using role::public.role;

    alter table public.profiles
    alter column role set default 'viewer'::public.role;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'role'
      and data_type = 'text'
  ) then
    alter table public.permissions
    alter column role type public.role
    using role::public.role;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'resource'
      and data_type = 'text'
  ) then
    alter table public.permissions
    alter column resource type public.permission_resource
    using resource::public.permission_resource;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'permissions'
      and column_name = 'action'
      and data_type = 'text'
  ) then
    alter table public.permissions
    alter column action type public.permission_action
    using action::public.permission_action;
  end if;
end $$;

create or replace function public.current_role()
returns public.role
language sql
stable
as $$
  select coalesce(
    (select (p.role::text)::public.role from public.profiles p where p.id = auth.uid()),
    'viewer'::public.role
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select public.current_role() = 'admin'::public.role;
$$;

create or replace function public.has_permission(r public.permission_resource, a public.permission_action)
returns boolean
language sql
stable
as $$
  select
    case
      when public.current_role() = 'admin'::public.role then true
      else exists (
        select 1 from public.permissions p
        where p.role = public.current_role()
          and p.resource = r
          and p.action = a
      )
    end;
$$;

insert into public.permissions (role, resource, action)
values
  ('viewer', 'news', 'read'),
  ('viewer', 'store', 'read'),
  ('viewer', 'artists', 'read'),
  ('viewer', 'bands', 'read'),

  ('editor', 'news', 'read'),
  ('editor', 'news', 'create'),
  ('editor', 'news', 'update'),
  ('editor', 'store', 'read'),
  ('editor', 'store', 'create'),
  ('editor', 'store', 'update'),
  ('editor', 'artists', 'read'),
  ('editor', 'artists', 'update'),
  ('editor', 'bands', 'read'),
  ('editor', 'bands', 'update')
on conflict do nothing;

alter table public.profiles enable row level security;
alter table public.permissions enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (auth.uid() = id or public.is_admin());

create policy "profiles_update_admin_only"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "profiles_insert_admin_only"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

create policy "permissions_select_authenticated"
on public.permissions
for select
to authenticated
using (true);

create policy "permissions_write_admin_only"
on public.permissions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='news') then
    alter table public.news enable row level security;
    create policy "news_read_if_permitted"
    on public.news
    for select
    to authenticated
    using (public.has_permission('news', 'read'));

    create policy "news_create_if_permitted"
    on public.news
    for insert
    to authenticated
    with check (public.has_permission('news', 'create'));

    create policy "news_update_if_permitted"
    on public.news
    for update
    to authenticated
    using (public.has_permission('news', 'update') or public.has_permission('news', 'publish'))
    with check (
      (status = 'published' and public.has_permission('news', 'publish'))
      or (status <> 'published' and public.has_permission('news', 'update'))
    );

    create policy "news_delete_admin_only"
    on public.news
    for delete
    to authenticated
    using (public.is_admin());
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='store_items') then
    alter table public.store_items enable row level security;
    create policy "store_read_if_permitted"
    on public.store_items
    for select
    to authenticated
    using (public.has_permission('store', 'read'));

    create policy "store_create_if_permitted"
    on public.store_items
    for insert
    to authenticated
    with check (public.has_permission('store', 'create'));

    create policy "store_update_if_permitted"
    on public.store_items
    for update
    to authenticated
    using (public.has_permission('store', 'update'))
    with check (public.has_permission('store', 'update'));

    create policy "store_delete_admin_only"
    on public.store_items
    for delete
    to authenticated
    using (public.is_admin());
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='artists') then
    create policy "artists_read_if_permitted"
    on public.artists
    for select
    to authenticated
    using (public.has_permission('artists', 'read'));

    create policy "artists_update_if_permitted"
    on public.artists
    for update
    to authenticated
    using (public.has_permission('artists', 'update'))
    with check (public.has_permission('artists', 'update'));
  end if;

  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='bands') then
    create policy "bands_read_if_permitted"
    on public.bands
    for select
    to authenticated
    using (public.has_permission('bands', 'read'));

    create policy "bands_update_if_permitted"
    on public.bands
    for update
    to authenticated
    using (public.has_permission('bands', 'update'))
    with check (public.has_permission('bands', 'update'));
  end if;
end $$;
