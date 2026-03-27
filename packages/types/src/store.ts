export interface StoreItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreItemFormData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  in_stock?: boolean;
}
