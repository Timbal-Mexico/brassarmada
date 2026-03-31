-- ============================================
-- Brass Armada - Setup SQL
-- ============================================

-- 1. Extensiones
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Enum de roles (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'artista', 'cliente');
  END IF;
END $$;

-- 3. Función updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- 4. Tabla users (si no existe)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_users_updated_at') THEN
    CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Trigger auto-crear users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, COALESCE(new.email, ''), 'cliente'::public.user_role)
  ON CONFLICT (id) DO UPDATE SET email = excluded.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
  END IF;
END $$;

-- 5. Tabla artists (si no existe)
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  stage_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  bio TEXT,
  genre TEXT,
  phone TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  profile_image_url TEXT,
  banner_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_artists_updated_at') THEN
    CREATE TRIGGER set_artists_updated_at
    BEFORE UPDATE ON public.artists
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5.1 Tabla artist_albums (si no existe)
CREATE TABLE IF NOT EXISTS public.artist_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  release_date DATE,
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(artist_id, slug)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_artist_albums_updated_at') THEN
    CREATE TRIGGER set_artist_albums_updated_at
    BEFORE UPDATE ON public.artist_albums
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5.2 Tabla artist_tracks (si no existe)
CREATE TABLE IF NOT EXISTS public.artist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES public.artist_albums(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  duration_seconds INT,
  audio_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(artist_id, slug)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_artist_tracks_updated_at') THEN
    CREATE TRIGGER set_artist_tracks_updated_at
    BEFORE UPDATE ON public.artist_tracks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5.3 Tabla artist_videos (si no existe)
CREATE TABLE IF NOT EXISTS public.artist_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  platform TEXT NOT NULL DEFAULT 'youtube' CHECK (platform IN ('youtube', 'vimeo', 'custom')),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_artist_videos_updated_at') THEN
    CREATE TRIGGER set_artist_videos_updated_at
    BEFORE UPDATE ON public.artist_videos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5.4 Tabla artist_play_events (si no existe)
CREATE TABLE IF NOT EXISTS public.artist_play_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('track', 'video')),
  content_id UUID,
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  country TEXT,
  platform TEXT
);

-- 5.5 Tabla artist_revenue_events (si no existe)
CREATE TABLE IF NOT EXISTS public.artist_revenue_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('streaming', 'tickets', 'merch', 'other')),
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note TEXT
);

-- 6. Tabla bands (si no existe)
CREATE TABLE IF NOT EXISTS public.bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  genre TEXT,
  description TEXT,
  image_url TEXT,
  banner_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_bands_updated_at') THEN
    CREATE TRIGGER set_bands_updated_at
    BEFORE UPDATE ON public.bands
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 7. Tabla band_members (si no existe)
CREATE TABLE IF NOT EXISTS public.band_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID NOT NULL REFERENCES public.bands(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  role_in_band TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('active', 'inactive', 'pending')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(band_id, artist_id)
);

-- 8. Tabla admins (si no existe)
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  department TEXT DEFAULT 'general',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_admins_updated_at') THEN
    CREATE TRIGGER set_admins_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 9. Tabla events (si no existe)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  venue TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  image_url TEXT,
  ticket_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT events_owner CHECK (
    (band_id IS NOT NULL AND artist_id IS NULL) OR
    (band_id IS NULL AND artist_id IS NOT NULL)
  )
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_events_updated_at') THEN
    CREATE TRIGGER set_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 10. Tabla blogs (si no existe)
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type TEXT NOT NULL CHECK (owner_type IN ('band', 'artist')),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(owner_type, owner_id)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_blogs_updated_at') THEN
    CREATE TRIGGER set_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 11. Tabla blog_posts (si no existe)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_blog_posts_updated_at') THEN
    CREATE TRIGGER set_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 12. Tabla store_items (si no existe)
CREATE TABLE IF NOT EXISTS public.store_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE SET NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price TEXT,
  currency TEXT DEFAULT 'MXN',
  shopify_product_id TEXT,
  shopify_url TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  stock INT DEFAULT -1,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT store_owner CHECK (
    (band_id IS NOT NULL AND artist_id IS NULL) OR
    (band_id IS NULL AND artist_id IS NOT NULL)
  )
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_store_items_updated_at') THEN
    CREATE TRIGGER set_store_items_updated_at
    BEFORE UPDATE ON public.store_items
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- ============================================
-- HABILITAR RLS
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_play_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_revenue_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FUNCIONES HELPERS
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT COALESCE(
    (SELECT u.role FROM public.users u WHERE u.id = auth.uid()),
    'cliente'::public.user_role
  );
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'super_admin'::public.user_role;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('admin', 'super_admin');
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION public.is_artista()
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'artista'::public.user_role;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION public.current_artist_id()
RETURNS UUID AS $$
  SELECT a.id
  FROM public.artists a
  WHERE a.user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- POLICIES RLS
-- ============================================

-- USERS
DROP POLICY IF EXISTS "users_select_all" ON public.users;
DROP POLICY IF EXISTS "users_update_own" ON public.users;
DROP POLICY IF EXISTS "users_update_by_super_admin" ON public.users;
DROP POLICY IF EXISTS "users_insert_super_admin" ON public.users;
DROP POLICY IF EXISTS "users_delete_super_admin" ON public.users;

CREATE POLICY "users_select_all" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_by_super_admin" ON public.users FOR UPDATE TO authenticated
USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
CREATE POLICY "users_insert_super_admin" ON public.users FOR INSERT TO authenticated
WITH CHECK (public.is_super_admin());
CREATE POLICY "users_delete_super_admin" ON public.users FOR DELETE TO authenticated
USING (public.is_super_admin());

-- ARTISTS
DROP POLICY IF EXISTS "artists_select_all" ON public.artists;
DROP POLICY IF EXISTS "artists_select_public" ON public.artists;
DROP POLICY IF EXISTS "artists_insert_own" ON public.artists;
DROP POLICY IF EXISTS "artists_update_own" ON public.artists;
DROP POLICY IF EXISTS "artists_delete_super_admin" ON public.artists;

CREATE POLICY "artists_select_public" ON public.artists FOR SELECT TO anon
USING (is_active = TRUE);

CREATE POLICY "artists_select_all" ON public.artists FOR SELECT TO authenticated USING (true);
CREATE POLICY "artists_insert_own" ON public.artists FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "artists_update_own" ON public.artists FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "artists_delete_super_admin" ON public.artists FOR DELETE TO authenticated
USING (public.is_super_admin());

-- ADMINS
DROP POLICY IF EXISTS "admins_select_staff" ON public.admins;
DROP POLICY IF EXISTS "admins_insert_super_admin" ON public.admins;
DROP POLICY IF EXISTS "admins_update_super_admin" ON public.admins;

CREATE POLICY "admins_select_staff" ON public.admins FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.is_super_admin());
CREATE POLICY "admins_insert_super_admin" ON public.admins FOR INSERT TO authenticated
WITH CHECK (public.is_super_admin());
CREATE POLICY "admins_update_super_admin" ON public.admins FOR UPDATE TO authenticated
USING (public.is_super_admin());

-- BANDS
DROP POLICY IF EXISTS "bands_select_all" ON public.bands;
DROP POLICY IF EXISTS "bands_insert_admin" ON public.bands;
DROP POLICY IF EXISTS "bands_update_admin" ON public.bands;
DROP POLICY IF EXISTS "bands_delete_super_admin" ON public.bands;

CREATE POLICY "bands_select_all" ON public.bands FOR SELECT TO authenticated USING (true);
CREATE POLICY "bands_insert_admin" ON public.bands FOR INSERT TO authenticated
WITH CHECK (public.is_admin());
CREATE POLICY "bands_update_admin" ON public.bands FOR UPDATE TO authenticated
USING (public.is_admin());
CREATE POLICY "bands_delete_super_admin" ON public.bands FOR DELETE TO authenticated
USING (public.is_super_admin());

-- BAND_MEMBERS
DROP POLICY IF EXISTS "band_members_select_all" ON public.band_members;
DROP POLICY IF EXISTS "band_members_insert_admin" ON public.band_members;
DROP POLICY IF EXISTS "band_members_update_admin" ON public.band_members;
DROP POLICY IF EXISTS "band_members_delete_admin" ON public.band_members;
DROP POLICY IF EXISTS "band_members_insert_self" ON public.band_members;
DROP POLICY IF EXISTS "band_members_delete_self" ON public.band_members;

CREATE POLICY "band_members_select_all" ON public.band_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "band_members_insert_admin" ON public.band_members FOR INSERT TO authenticated
WITH CHECK (public.is_admin());
CREATE POLICY "band_members_update_admin" ON public.band_members FOR UPDATE TO authenticated
USING (public.is_admin());
CREATE POLICY "band_members_delete_admin" ON public.band_members FOR DELETE TO authenticated
USING (public.is_admin());

CREATE POLICY "band_members_insert_self" ON public.band_members FOR INSERT TO authenticated
WITH CHECK (
  public.is_artista()
  AND artist_id = public.current_artist_id()
  AND status = 'pending'
);

CREATE POLICY "band_members_delete_self" ON public.band_members FOR DELETE TO authenticated
USING (
  public.is_artista()
  AND artist_id = public.current_artist_id()
);

-- EVENTS
DROP POLICY IF EXISTS "events_select_all" ON public.events;
DROP POLICY IF EXISTS "events_insert_artista" ON public.events;
DROP POLICY IF EXISTS "events_update_artista_or_admin" ON public.events;
DROP POLICY IF EXISTS "events_delete_admin" ON public.events;

CREATE POLICY "events_select_all" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "events_insert_artista" ON public.events FOR INSERT TO authenticated
WITH CHECK (public.is_artista() OR public.is_admin());
CREATE POLICY "events_update_artista_or_admin" ON public.events FOR UPDATE TO authenticated
USING (
  (public.is_artista() AND created_by = auth.uid()) OR
  public.is_admin()
);
CREATE POLICY "events_delete_admin" ON public.events FOR DELETE TO authenticated
USING (public.is_super_admin());

-- BLOGS
DROP POLICY IF EXISTS "blogs_select_all" ON public.blogs;
DROP POLICY IF EXISTS "blogs_insert_admin" ON public.blogs;
DROP POLICY IF EXISTS "blogs_update_admin" ON public.blogs;
DROP POLICY IF EXISTS "blogs_delete_admin" ON public.blogs;

CREATE POLICY "blogs_select_all" ON public.blogs FOR SELECT TO authenticated USING (true);
CREATE POLICY "blogs_insert_admin" ON public.blogs FOR INSERT TO authenticated
WITH CHECK (public.is_admin());
CREATE POLICY "blogs_update_admin" ON public.blogs FOR UPDATE TO authenticated
USING (public.is_admin());
CREATE POLICY "blogs_delete_admin" ON public.blogs FOR DELETE TO authenticated
USING (public.is_admin());

-- BLOG_POSTS
DROP POLICY IF EXISTS "blog_posts_select_all" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_insert_admin" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_update_admin" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_delete_admin" ON public.blog_posts;

CREATE POLICY "blog_posts_select_all" ON public.blog_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "blog_posts_insert_admin" ON public.blog_posts FOR INSERT TO authenticated
WITH CHECK (public.is_admin());
CREATE POLICY "blog_posts_update_admin" ON public.blog_posts FOR UPDATE TO authenticated
USING (public.is_admin());
CREATE POLICY "blog_posts_delete_admin" ON public.blog_posts FOR DELETE TO authenticated
USING (public.is_admin());

-- STORE
DROP POLICY IF EXISTS "store_select_all" ON public.store_items;
DROP POLICY IF EXISTS "store_insert_admin" ON public.store_items;
DROP POLICY IF EXISTS "store_update_admin" ON public.store_items;
DROP POLICY IF EXISTS "store_delete_admin" ON public.store_items;

CREATE POLICY "store_select_all" ON public.store_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "store_insert_admin" ON public.store_items FOR INSERT TO authenticated
WITH CHECK (public.is_admin());
CREATE POLICY "store_update_admin" ON public.store_items FOR UPDATE TO authenticated
USING (public.is_admin());
CREATE POLICY "store_delete_admin" ON public.store_items FOR DELETE TO authenticated
USING (public.is_admin());

-- ARTIST_CONTENT
DROP POLICY IF EXISTS "artist_albums_select_public" ON public.artist_albums;
DROP POLICY IF EXISTS "artist_albums_select_owner" ON public.artist_albums;
DROP POLICY IF EXISTS "artist_albums_write_owner" ON public.artist_albums;

CREATE POLICY "artist_albums_select_public" ON public.artist_albums FOR SELECT TO anon
USING (
  is_published = TRUE
  AND EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.is_active = TRUE)
);

CREATE POLICY "artist_albums_select_owner" ON public.artist_albums FOR SELECT TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id());

CREATE POLICY "artist_albums_write_owner" ON public.artist_albums FOR ALL TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id())
WITH CHECK (public.is_admin() OR artist_id = public.current_artist_id());

DROP POLICY IF EXISTS "artist_tracks_select_public" ON public.artist_tracks;
DROP POLICY IF EXISTS "artist_tracks_select_owner" ON public.artist_tracks;
DROP POLICY IF EXISTS "artist_tracks_write_owner" ON public.artist_tracks;

CREATE POLICY "artist_tracks_select_public" ON public.artist_tracks FOR SELECT TO anon
USING (
  is_published = TRUE
  AND EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.is_active = TRUE)
);

CREATE POLICY "artist_tracks_select_owner" ON public.artist_tracks FOR SELECT TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id());

CREATE POLICY "artist_tracks_write_owner" ON public.artist_tracks FOR ALL TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id())
WITH CHECK (public.is_admin() OR artist_id = public.current_artist_id());

DROP POLICY IF EXISTS "artist_videos_select_public" ON public.artist_videos;
DROP POLICY IF EXISTS "artist_videos_select_owner" ON public.artist_videos;
DROP POLICY IF EXISTS "artist_videos_write_owner" ON public.artist_videos;

CREATE POLICY "artist_videos_select_public" ON public.artist_videos FOR SELECT TO anon
USING (
  is_published = TRUE
  AND EXISTS (SELECT 1 FROM public.artists a WHERE a.id = artist_id AND a.is_active = TRUE)
);

CREATE POLICY "artist_videos_select_owner" ON public.artist_videos FOR SELECT TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id());

CREATE POLICY "artist_videos_write_owner" ON public.artist_videos FOR ALL TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id())
WITH CHECK (public.is_admin() OR artist_id = public.current_artist_id());

DROP POLICY IF EXISTS "artist_play_events_select_owner" ON public.artist_play_events;
DROP POLICY IF EXISTS "artist_play_events_insert_owner" ON public.artist_play_events;

CREATE POLICY "artist_play_events_select_owner" ON public.artist_play_events FOR SELECT TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id());

CREATE POLICY "artist_play_events_insert_owner" ON public.artist_play_events FOR INSERT TO authenticated
WITH CHECK (public.is_admin() OR artist_id = public.current_artist_id());

DROP POLICY IF EXISTS "artist_revenue_events_select_owner" ON public.artist_revenue_events;
DROP POLICY IF EXISTS "artist_revenue_events_write_owner" ON public.artist_revenue_events;

CREATE POLICY "artist_revenue_events_select_owner" ON public.artist_revenue_events FOR SELECT TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id());

CREATE POLICY "artist_revenue_events_write_owner" ON public.artist_revenue_events FOR ALL TO authenticated
USING (public.is_admin() OR artist_id = public.current_artist_id())
WITH CHECK (public.is_admin() OR artist_id = public.current_artist_id());

-- ============================================
-- STORAGE (buckets)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('artists-public', 'artists-public', true),
  ('artists-private', 'artists-private', false),
  ('bands-public', 'bands-public', true),
  ('bands-private', 'bands-private', false),
  ('blog-images', 'blog-images', true),
  ('event-images', 'event-images', true),
  ('store-images', 'store-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "artists_public_read" ON storage.objects;
DROP POLICY IF EXISTS "artists_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "bands_public_read" ON storage.objects;
DROP POLICY IF EXISTS "bands_public_upload" ON storage.objects;

CREATE POLICY "artists_public_read" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'artists-public');

CREATE POLICY "artists_public_upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'artists-public' AND owner = auth.uid());

CREATE POLICY "bands_public_read" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'bands-public');

CREATE POLICY "bands_public_upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'bands-public' AND owner = auth.uid());

-- ============================================
-- CREAR SUPER ADMIN
-- ============================================
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, 
  raw_user_meta_data, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'aloza.timbal@gmail.com',
  crypt('B4zinga!', gen_salt('bf')),
  NOW(),
  '{"full_name": "Ariel Loza"}'::jsonb,
  NOW(),
  NOW()
);

UPDATE public.users 
SET role = 'super_admin'::public.user_role, full_name = 'Ariel Loza'
WHERE email = 'aloza.timbal@gmail.com';

SELECT 'Setup completo' as status;
