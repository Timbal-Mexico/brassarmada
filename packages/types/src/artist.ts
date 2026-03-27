export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
  band_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ArtistFormData {
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
  band_id?: string;
}
