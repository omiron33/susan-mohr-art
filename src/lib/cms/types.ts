export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  hero_image?: string | null;
  sort?: number | null;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  medium?: string | null;
  price?: number | null;
  isSold?: boolean;
  image?: string | null;
  category?: Category | null;
  created_at?: string | Date | null;
}

export interface Print {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  price?: number | null;
  size?: string | null;
  in_stock?: number | null;
}

export interface SiteContent {
  id: string;
  key: string;
  value: unknown;
}

export interface Order {
  id: string;
  stripe_session_id: string;
  email: string;
  line_items: unknown;
  total: number;
  status: string;
  created_at?: string | Date;
}

export interface DirectusSchema {
  categories: Category[];
  artworks: Artwork[];
  prints: Print[];
  site_content: SiteContent[];
  orders: Order[];
}

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
