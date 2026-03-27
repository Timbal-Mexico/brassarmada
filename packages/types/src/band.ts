export interface Band {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  genre?: string;
  created_at: string;
  updated_at: string;
}

export interface BandFormData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  genre?: string;
}
