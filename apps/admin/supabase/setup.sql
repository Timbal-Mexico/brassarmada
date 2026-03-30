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
    if not exists (select 1 from pg_trigger where tgname = 'set_profiles_updated_at') then
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
    if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
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

    do $$
    begin
    if not exists (select 1 from pg_trigger where tgname = 'set_bands_updated_at') then
        create trigger set_bands_updated_at
        before update on public.bands
        for each row execute function public.set_updated_at();
    end if;
    end $$;

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

    do $$
    begin
    if not exists (select 1 from pg_trigger where tgname = 'set_artists_updated_at') then
        create trigger set_artists_updated_at
        before update on public.artists
        for each row execute function public.set_updated_at();
    end if;
    end $$;

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

    do $$
    begin
    if not exists (select 1 from pg_trigger where tgname = 'set_band_members_updated_at') then
        create trigger set_band_members_updated_at
        before update on public.band_members
        for each row execute function public.set_updated_at();
    end if;
    end $$;

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
    if not exists (select 1 from pg_trigger where tgname = 'set_news_updated_at') then
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
    if not exists (select 1 from pg_trigger where tgname = 'set_store_items_updated_at') then
        create trigger set_store_items_updated_at
        before update on public.store_items
        for each row execute function public.set_updated_at();
    end if;
    end $$;

    alter table public.profiles enable row level security;
    alter table public.permissions enable row level security;
    alter table public.bands enable row level security;
    alter table public.artists enable row level security;
    alter table public.band_admins enable row level security;
    alter table public.band_members enable row level security;
    alter table public.news enable row level security;
    alter table public.store_items enable row level security;

    drop policy if exists profiles_select_own_or_admin on public.profiles;
    drop policy if exists profiles_update_admin_only on public.profiles;
    drop policy if exists profiles_insert_admin_only on public.profiles;

    create policy profiles_select_own_or_admin
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = id or public.is_admin());

    create policy profiles_update_admin_only
    on public.profiles
    for update
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

    create policy profiles_insert_admin_only
    on public.profiles
    for insert
    to authenticated
    with check (public.is_admin());

    drop policy if exists permissions_select_authenticated on public.permissions;
    drop policy if exists permissions_write_admin_only on public.permissions;

    create policy permissions_select_authenticated
    on public.permissions
    for select
    to authenticated
    using (true);

    create policy permissions_write_admin_only
    on public.permissions
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

    drop policy if exists bands_select_public on public.bands;
    drop policy if exists bands_update_if_permitted on public.bands;
    drop policy if exists bands_insert_admin_only on public.bands;
    drop policy if exists bands_delete_admin_only on public.bands;

    create policy bands_select_public
    on public.bands
    for select
    to anon, authenticated
    using (true);

    create policy bands_update_if_permitted
    on public.bands
    for update
    to authenticated
    using (public.has_permission('bands', 'update'))
    with check (public.has_permission('bands', 'update'));

    create policy bands_insert_admin_only
    on public.bands
    for insert
    to authenticated
    with check (public.is_admin());

    create policy bands_delete_admin_only
    on public.bands
    for delete
    to authenticated
    using (public.is_admin());

    drop policy if exists artists_select_public on public.artists;
    drop policy if exists artists_insert_self on public.artists;
    drop policy if exists artists_update_self on public.artists;
    drop policy if exists artists_delete_self on public.artists;
    drop policy if exists artists_update_if_permitted on public.artists;

    create policy artists_select_public
    on public.artists
    for select
    to anon, authenticated
    using (true);

    create policy artists_insert_self
    on public.artists
    for insert
    to authenticated
    with check (auth.uid() = user_id);

    create policy artists_update_self
    on public.artists
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

    create policy artists_delete_self
    on public.artists
    for delete
    to authenticated
    using (auth.uid() = user_id);

    create policy artists_update_if_permitted
    on public.artists
    for update
    to authenticated
    using (public.has_permission('artists', 'update'))
    with check (public.has_permission('artists', 'update'));

    drop policy if exists band_admins_select_self on public.band_admins;
    drop policy if exists band_admins_write_self on public.band_admins;
    drop policy if exists band_admins_write_admin_only on public.band_admins;

    create policy band_admins_select_self
    on public.band_admins
    for select
    to authenticated
    using (auth.uid() = user_id or public.is_admin());

    create policy band_admins_write_self
    on public.band_admins
    for insert
    to authenticated
    with check (auth.uid() = user_id and public.is_admin());

    create policy band_admins_write_admin_only
    on public.band_admins
    for all
    to authenticated
    using (public.is_admin())
    with check (public.is_admin());

    drop policy if exists band_members_select_public on public.band_members;
    drop policy if exists band_members_insert_artist_or_admin on public.band_members;
    drop policy if exists band_members_update_admin_only on public.band_members;
    drop policy if exists band_members_delete_artist_or_admin on public.band_members;

    create policy band_members_select_public
    on public.band_members
    for select
    to anon, authenticated
    using (true);

    create policy band_members_insert_artist_or_admin
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
    or public.is_admin()
    );

    create policy band_members_update_admin_only
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
    or public.is_admin()
    )
    with check (
    exists (
        select 1
        from public.band_admins ba
        where ba.band_id = band_members.band_id
        and ba.user_id = auth.uid()
    )
    or public.is_admin()
    );

    create policy band_members_delete_artist_or_admin
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
    or public.is_admin()
    );

    drop policy if exists news_select_public_or_role on public.news;
    drop policy if exists news_create_if_permitted on public.news;
    drop policy if exists news_update_if_permitted on public.news;
    drop policy if exists news_delete_admin_only on public.news;

    create policy news_select_public_or_role
    on public.news
    for select
    to anon, authenticated
    using (
    status = 'published'
    or (auth.role() = 'authenticated' and public.has_permission('news', 'read'))
    );

    create policy news_create_if_permitted
    on public.news
    for insert
    to authenticated
    with check (public.has_permission('news', 'create'));

    create policy news_update_if_permitted
    on public.news
    for update
    to authenticated
    using (public.has_permission('news', 'update') or public.has_permission('news', 'publish'))
    with check (
    (status = 'published' and public.has_permission('news', 'publish'))
    or (status <> 'published' and public.has_permission('news', 'update'))
    );

    create policy news_delete_admin_only
    on public.news
    for delete
    to authenticated
    using (public.is_admin());

    drop policy if exists store_select_public_or_role on public.store_items;
    drop policy if exists store_create_if_permitted on public.store_items;
    drop policy if exists store_update_if_permitted on public.store_items;
    drop policy if exists store_delete_admin_only on public.store_items;

    create policy store_select_public_or_role
    on public.store_items
    for select
    to anon, authenticated
    using (
    active = true
    or (auth.role() = 'authenticated' and public.has_permission('store', 'read'))
    );

    create policy store_create_if_permitted
    on public.store_items
    for insert
    to authenticated
    with check (public.has_permission('store', 'create'));

    create policy store_update_if_permitted
    on public.store_items
    for update
    to authenticated
    using (public.has_permission('store', 'update'))
    with check (public.has_permission('store', 'update'));

    create policy store_delete_admin_only
    on public.store_items
    for delete
    to authenticated
    using (public.is_admin());

    insert into storage.buckets (id, name, public)
    values
    ('artists-public', 'artists-public', true),
    ('artists-private', 'artists-private', false)
    on conflict (id) do nothing;

    drop policy if exists artists_public_read on storage.objects;
    drop policy if exists artists_public_write_own_folder on storage.objects;
    drop policy if exists artists_public_update_own_folder on storage.objects;
    drop policy if exists artists_public_delete_own_folder on storage.objects;
    drop policy if exists artists_private_read_own_folder on storage.objects;
    drop policy if exists artists_private_write_own_folder on storage.objects;
    drop policy if exists artists_private_update_own_folder on storage.objects;
    drop policy if exists artists_private_delete_own_folder on storage.objects;

    create policy artists_public_read
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'artists-public');

    create policy artists_public_write_own_folder
    on storage.objects
    for insert
    to authenticated
    with check (
    bucket_id = 'artists-public'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

    create policy artists_public_update_own_folder
    on storage.objects
    for update
    to authenticated
    using (
    bucket_id = 'artists-public'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    )
    with check (
    bucket_id = 'artists-public'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

    create policy artists_public_delete_own_folder
    on storage.objects
    for delete
    to authenticated
    using (
    bucket_id = 'artists-public'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

    create policy artists_private_read_own_folder
    on storage.objects
    for select
    to authenticated
    using (
    bucket_id = 'artists-private'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

    create policy artists_private_write_own_folder
    on storage.objects
    for insert
    to authenticated
    with check (
    bucket_id = 'artists-private'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

    create policy artists_private_update_own_folder
    on storage.objects
    for update
    to authenticated
    using (
    bucket_id = 'artists-private'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    )
    with check (
    bucket_id = 'artists-private'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

    create policy artists_private_delete_own_folder
    on storage.objects
    for delete
    to authenticated
    using (
    bucket_id = 'artists-private'
    and owner = auth.uid()
    and name like auth.uid() || '/%'
    );

