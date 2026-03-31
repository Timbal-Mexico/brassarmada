import { supabase } from "@brassarmada/supabase";

export type ArtistSelf = {
  id: string;
  user_id: string | null;
  stage_name: string;
  slug: string;
  bio: string | null;
  genre: string | null;
  phone: string | null;
  website: string | null;
  social_links: Record<string, unknown> | null;
  profile_image_url: string | null;
  banner_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtistAlbum = {
  id: string;
  artist_id: string;
  title: string;
  slug: string;
  release_date: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtistTrack = {
  id: string;
  artist_id: string;
  album_id: string | null;
  title: string;
  slug: string;
  duration_seconds: number | null;
  audio_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtistVideo = {
  id: string;
  artist_id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  platform: "youtube" | "vimeo" | "custom";
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtistPlayEvent = {
  id: string;
  artist_id: string;
  content_type: "track" | "video";
  content_id: string | null;
  played_at: string;
  country: string | null;
  platform: string | null;
};

export type ArtistRevenueEvent = {
  id: string;
  artist_id: string;
  source: "streaming" | "tickets" | "merch" | "other";
  amount_cents: number;
  currency: string;
  occurred_at: string;
  note: string | null;
};

const toError = (message: string) => new Error(message);

export const fetchMyArtist = async (userId: string) => {
  const res = await supabase
    .from("artists")
    .select(
      "id,user_id,stage_name,slug,bio,genre,phone,website,social_links,profile_image_url,banner_image_url,is_active,created_at,updated_at",
    )
    .eq("user_id", userId)
    .maybeSingle<ArtistSelf>();
  if (res.error) throw toError(res.error.message);
  return res.data;
};

export const listAlbums = async (artistId: string) => {
  const query = supabase
    .from("artist_albums")
    .select("id,artist_id,title,slug,release_date,cover_image_url,is_published,created_at,updated_at")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });
  const res = await (query as unknown as Promise<{ data: ArtistAlbum[] | null; error: { message: string } | null }>);
  if (res.error) throw toError(res.error.message);
  return res.data ?? [];
};

export const upsertAlbum = async (
  artistId: string,
  input: {
    id?: string;
    title: string;
    slug: string;
    release_date: string | null;
    cover_image_url: string | null;
    is_published: boolean;
  },
) => {
  const payload = {
    artist_id: artistId,
    title: input.title,
    slug: input.slug,
    release_date: input.release_date,
    cover_image_url: input.cover_image_url,
    is_published: input.is_published,
  };
  if (input.id?.trim()) {
    const res = await supabase.from("artist_albums").update(payload).eq("id", input.id);
    if (res.error) throw toError(res.error.message);
    return;
  }
  const res = await supabase.from("artist_albums").insert(payload);
  if (res.error) throw toError(res.error.message);
};

export const deleteAlbum = async (id: string) => {
  const res = await supabase.from("artist_albums").delete().eq("id", id);
  if (res.error) throw toError(res.error.message);
};

export const listTracks = async (artistId: string) => {
  const query = supabase
    .from("artist_tracks")
    .select("id,artist_id,album_id,title,slug,duration_seconds,audio_url,is_published,created_at,updated_at")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });
  const res = await (query as unknown as Promise<{ data: ArtistTrack[] | null; error: { message: string } | null }>);
  if (res.error) throw toError(res.error.message);
  return res.data ?? [];
};

export const upsertTrack = async (
  artistId: string,
  input: {
    id?: string;
    album_id: string | null;
    title: string;
    slug: string;
    duration_seconds: number | null;
    audio_url: string | null;
    is_published: boolean;
  },
) => {
  const payload = {
    artist_id: artistId,
    album_id: input.album_id,
    title: input.title,
    slug: input.slug,
    duration_seconds: input.duration_seconds,
    audio_url: input.audio_url,
    is_published: input.is_published,
  };
  if (input.id?.trim()) {
    const res = await supabase.from("artist_tracks").update(payload).eq("id", input.id);
    if (res.error) throw toError(res.error.message);
    return;
  }
  const res = await supabase.from("artist_tracks").insert(payload);
  if (res.error) throw toError(res.error.message);
};

export const deleteTrack = async (id: string) => {
  const res = await supabase.from("artist_tracks").delete().eq("id", id);
  if (res.error) throw toError(res.error.message);
};

export const listVideos = async (artistId: string) => {
  const query = supabase
    .from("artist_videos")
    .select("id,artist_id,title,video_url,thumbnail_url,platform,is_published,created_at,updated_at")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });
  const res = await (query as unknown as Promise<{ data: ArtistVideo[] | null; error: { message: string } | null }>);
  if (res.error) throw toError(res.error.message);
  return res.data ?? [];
};

export const upsertVideo = async (
  artistId: string,
  input: {
    id?: string;
    title: string;
    video_url: string;
    thumbnail_url: string | null;
    platform: "youtube" | "vimeo" | "custom";
    is_published: boolean;
  },
) => {
  const payload = {
    artist_id: artistId,
    title: input.title,
    video_url: input.video_url,
    thumbnail_url: input.thumbnail_url,
    platform: input.platform,
    is_published: input.is_published,
  };
  if (input.id?.trim()) {
    const res = await supabase.from("artist_videos").update(payload).eq("id", input.id);
    if (res.error) throw toError(res.error.message);
    return;
  }
  const res = await supabase.from("artist_videos").insert(payload);
  if (res.error) throw toError(res.error.message);
};

export const deleteVideo = async (id: string) => {
  const res = await supabase.from("artist_videos").delete().eq("id", id);
  if (res.error) throw toError(res.error.message);
};

export const listPlayEvents = async (artistId: string, sinceISO: string) => {
  const query = supabase
    .from("artist_play_events")
    .select("id,artist_id,content_type,content_id,played_at,country,platform")
    .eq("artist_id", artistId)
    .order("played_at", { ascending: false });
  const res = await (query as unknown as Promise<{ data: ArtistPlayEvent[] | null; error: { message: string } | null }>);
  if (res.error) throw toError(res.error.message);
  const filtered = (res.data ?? []).filter((e) => e.played_at >= sinceISO);
  return filtered;
};

export const listRevenueEvents = async (artistId: string, sinceISO: string) => {
  const query = supabase
    .from("artist_revenue_events")
    .select("id,artist_id,source,amount_cents,currency,occurred_at,note")
    .eq("artist_id", artistId)
    .order("occurred_at", { ascending: false });
  const res = await (query as unknown as Promise<{ data: ArtistRevenueEvent[] | null; error: { message: string } | null }>);
  if (res.error) throw toError(res.error.message);
  const filtered = (res.data ?? []).filter((e) => e.occurred_at >= sinceISO);
  return filtered;
};

export const createRevenueEvent = async (artistId: string, input: Omit<ArtistRevenueEvent, "id" | "artist_id" | "occurred_at"> & { occurred_at?: string }) => {
  const payload = {
    artist_id: artistId,
    source: input.source,
    amount_cents: input.amount_cents,
    currency: input.currency,
    occurred_at: input.occurred_at ?? new Date().toISOString(),
    note: input.note ?? null,
  };
  const res = await supabase.from("artist_revenue_events").insert(payload);
  if (res.error) throw toError(res.error.message);
};
