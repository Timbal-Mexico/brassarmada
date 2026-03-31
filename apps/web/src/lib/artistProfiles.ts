import { useQuery } from "@tanstack/react-query";
import { from } from "@/lib/supabase";

export type ArtistProfile = {
  id: string;
  user_id: string | null;
  stage_name: string;
  slug: string;
  bio: string | null;
  genre: string | null;
  profile_image_url: string | null;
  phone: string | null;
  website: string | null;
  social_links: Record<string, unknown> | null;
  banner_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ArtistWork = {
  id: string;
  artist_id: string;
  title: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export const useArtists = (args: { q?: string; category?: string; page: number; pageSize: number }) => {
  const q = args.q?.trim() ?? "";
  const page = Math.max(1, args.page);
  const pageSize = Math.min(Math.max(args.pageSize, 1), 50);
  const fromIdx = (page - 1) * pageSize;
  const toIdx = fromIdx + pageSize - 1;

  return useQuery({
    queryKey: ["artists", { q, page, pageSize }],
    queryFn: async () => {
      const select = from("artists")
        .select(
          "id,user_id,stage_name,slug,bio,genre,phone,website,social_links,profile_image_url,banner_image_url,is_active,created_at,updated_at",
        )
        .order("stage_name")
        .range(fromIdx, toIdx);

      if (q) select.ilike("stage_name", `%${q}%`);

      const res = await (select as unknown as Promise<{ data: ArtistProfile[] | null; error: { message: string } | null }>);
      if (res.error) throw new Error(res.error.message);
      return (res.data as ArtistProfile[]) ?? [];
    },
    staleTime: 30_000,
  });
};

export const useArtistBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["artist", slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await from("artists")
        .select(
          "id,user_id,stage_name,slug,bio,genre,phone,website,social_links,profile_image_url,banner_image_url,is_active,created_at,updated_at",
        )
        .eq("slug", slug ?? "")
        .maybeSingle<ArtistProfile>();
      if (res.error) throw new Error(res.error.message);
      return res.data;
    },
    staleTime: 30_000,
  });
};

export const useArtistWorks = (artistId: string | undefined) => {
  return useQuery({
    queryKey: ["artist-works", artistId],
    enabled: !!artistId,
    queryFn: async () => {
      const query = from("artist_works")
        .select("id,artist_id,title,image_url,sort_order,created_at")
        .eq("artist_id", artistId ?? "")
        .order("sort_order");
      const res = await (query as unknown as Promise<{ data: ArtistWork[] | null; error: { message: string } | null }>);
      if (res.error) {
        if (res.error.message.includes("does not exist")) return [];
        throw new Error(res.error.message);
      }
      return (res.data as ArtistWork[]) ?? [];
    },
    staleTime: 30_000,
  });
};
