export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author_id?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author_id?: string;
  published?: boolean;
}
