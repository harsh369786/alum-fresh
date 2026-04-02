export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  short_desc: string | null;
  price: number;
  original_price: number | null;
  category_id: string | null;
  variant: "rose" | "natural" | "charcoal" | null;
  size: "50ml" | "100ml" | "60g" | null;
  image_url: string | null;
  gallery: string[] | null;
  badge: string | null;
  badge_color: "magenta" | "teal" | "purple" | null;
  in_stock: boolean;
  ingredients: string[];
  benefits: string[];
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  categories?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string | null;
  bg_gradient: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface OrderAddress {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  variant: string | null;
  size: string | null;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  user_email: string;
  user_name: string;
  user_phone: string | null;
  address: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discount_code: string | null;
  shipping: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  variant: string | null;
  size: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  badge?: string | null;
}
