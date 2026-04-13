-- ============================================================
-- ALUM FRESH — Supabase Database Setup
-- Run these in the Supabase SQL editor
-- ============================================================

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  description   text,
  image_url     text,
  sort_order    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  slug          text UNIQUE NOT NULL,
  sku           text UNIQUE,
  description   text,
  short_desc    text,
  price         numeric NOT NULL,
  original_price numeric,
  category_id   uuid REFERENCES categories(id),
  variant       text CHECK (variant IN ('rose', 'natural', 'charcoal')),
  size          text CHECK (size IN ('50ml', '100ml')),
  image_url     text,
  badge         text,
  badge_color   text CHECK (badge_color IN ('magenta', 'teal', 'purple')),
  in_stock      boolean DEFAULT true,
  ingredients   text[],
  benefits      text[],
  is_featured   boolean DEFAULT false,
  sort_order    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- BANNERS
CREATE TABLE IF NOT EXISTS banners (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text,
  subtitle      text,
  cta_text      text,
  cta_link      text,
  image_url     text,
  bg_gradient   text,
  is_active     boolean DEFAULT true,
  sort_order    integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number  text UNIQUE,              -- YYMMDDSRNO format e.g. 2604110001
  user_email    text NOT NULL,
  user_name     text NOT NULL,
  user_phone    text,
  address       jsonb,
  items         jsonb,
  subtotal      numeric NOT NULL,
  discount      numeric DEFAULT 0,
  discount_code text,
  shipping      numeric DEFAULT 0,
  total         numeric NOT NULL,
  status        text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  notes         text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Migration: add order_number column if upgrading an existing DB
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number text UNIQUE;

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text,
  phone         text,
  role          text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at    timestamptz DEFAULT now()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read banners" ON banners FOR SELECT USING (true);

-- Orders: insert for all, select own + admin
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Read own orders" ON orders FOR SELECT USING (user_email = current_user);

-- Admin full access (service role bypasses RLS)
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all banners" ON banners FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: own row
CREATE POLICY "Own profile read" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Own profile update" ON profiles FOR UPDATE USING (id = auth.uid());

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run in Supabase dashboard → Storage → New Bucket:
-- Name: alumfresh-images
-- Public: YES
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- ============================================================
-- SEED DATA
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Roll-On Deodorants', 'roll-on', 'Natural alum crystal roll-on deodorants. Chemical-free, vegan, and dermatologist tested. Available in Rose, Natural, and Charcoal editions.', 0),
  ('Bundles & Gift Sets', 'bundles', 'Try all Alum Fresh variants with our curated combo packs. Perfect for gifting or discovering your favourite edition.', 1),
  ('Natural Skincare', 'skincare', 'Coming soon. Expanding our range of natural, chemical-free skincare products.', 2)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, sku, price, original_price, variant, size, badge, badge_color, in_stock, is_featured, sort_order, short_desc, ingredients, benefits, category_id)
SELECT 
  'Alum Fresh Rose Edition',
  'alum-fresh-rose',
  'AF-ROSE',
  349,
  499,
  'rose',
  '50ml',
  'Best Seller',
  'magenta',
  true,
  true,
  0,
  'Natural rose water and alum crystal for delicate, feminine freshness.',
  ARRAY['Potassium Alum', 'Rose Water', 'Aloe Vera', 'Vitamin E'],
  ARRAY['24-hour odor protection', 'Gentle rose fragrance', 'Skin-brightening benefits', 'Zero parabens or chemicals'],
  id FROM categories WHERE slug = 'roll-on'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, sku, price, original_price, variant, size, badge, badge_color, in_stock, is_featured, sort_order, short_desc, ingredients, benefits, category_id)
SELECT 
  'Alum Fresh Natural Edition',
  'alum-fresh-natural',
  'AF-NAT',
  299,
  null,
  'natural',
  '50ml',
  null,
  null,
  true,
  true,
  1,
  'Pure alum crystal with aloe vera for clean, fragrance-free freshness.',
  ARRAY['Potassium Alum', 'Aloe Vera', 'Turmeric Extract', 'Purified Water'],
  ARRAY['24-hour protection', 'Fragrance-free formula', 'Ideal for sensitive skin', 'Dermatologist tested'],
  id FROM categories WHERE slug = 'roll-on'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, sku, price, original_price, variant, size, badge, badge_color, in_stock, is_featured, sort_order, short_desc, ingredients, benefits, category_id)
SELECT 
  'Alum Fresh Charcoal Edition',
  'alum-fresh-charcoal',
  'AF-CHAR',
  399,
  549,
  'charcoal',
  '50ml',
  'New',
  'purple',
  true,
  true,
  2,
  'Activated charcoal meets pure alum for deep-cleansing freshness.',
  ARRAY['Potassium Alum', 'Activated Charcoal', 'Tea Tree Extract', 'Aloe Vera'],
  ARRAY['Deep odor neutralization', 'Detoxifying charcoal', 'Antibacterial protection', 'Sport-tested formula'],
  id FROM categories WHERE slug = 'roll-on'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, sku, price, original_price, variant, size, badge, badge_color, in_stock, is_featured, sort_order, short_desc, ingredients, benefits, category_id)
SELECT 
  'Alum Fresh Trial Pack 3x',
  'alum-fresh-trial-pack',
  'AF-TRIAL',
  899,
  1247,
  null,
  null,
  'Best Value',
  'teal',
  true,
  true,
  3,
  'Try all three — Rose, Natural, and Charcoal — at the best price.',
  ARRAY['Potassium Alum', 'Rose Water', 'Activated Charcoal', 'Aloe Vera', 'Turmeric'],
  ARRAY['All 3 variants included', 'Save ₹348 vs individual', 'Perfect for gifting', 'Free shipping included'],
  id FROM categories WHERE slug = 'bundles'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, sku, price, original_price, variant, size, badge, badge_color, in_stock, is_featured, sort_order, short_desc, ingredients, benefits, category_id)
SELECT 
  'Alum Fresh Rose 100ml',
  'alum-fresh-rose-100ml',
  'AF-ROSE-L',
  599,
  799,
  'rose',
  '100ml',
  null,
  null,
  true,
  false,
  4,
  'Our bestselling Rose Edition in a larger 100ml size for extended freshness.',
  ARRAY['Potassium Alum', 'Rose Water', 'Aloe Vera', 'Vitamin E'],
  ARRAY['2x longer lasting', 'Same powerful formula', 'Value for daily users', 'Travel-friendly size'],
  id FROM categories WHERE slug = 'roll-on'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, sku, price, original_price, variant, size, badge, badge_color, in_stock, is_featured, sort_order, short_desc, ingredients, benefits, category_id)
SELECT 
  'Alum Fresh Natural 100ml',
  'alum-fresh-natural-100ml',
  'AF-NAT-L',
  499,
  649,
  'natural',
  '100ml',
  null,
  null,
  true,
  false,
  5,
  'Pure natural formula in a larger size — ideal for sensitive skin daily use.',
  ARRAY['Potassium Alum', 'Aloe Vera', 'Turmeric Extract', 'Purified Water'],
  ARRAY['Fragrance-free formula', '2x longer lasting', '100% natural ingredients', 'Derma certified'],
  id FROM categories WHERE slug = 'roll-on'
ON CONFLICT (slug) DO NOTHING;

-- Banners
INSERT INTO banners (title, subtitle, cta_text, cta_link, bg_gradient, is_active, sort_order) VALUES
  ('Stay Fresh, Naturally.', '100% Alum. 0% Chemicals. Pure freshness that lasts all day.', 'Shop Now', '/category/roll-on', 'linear-gradient(135deg, #08070F 0%, #0E0B1A 100%)', true, 0),
  ('Rose Edition.', 'Infused with rose water for a delicate, feminine freshness.', 'Shop Rose', '/category/roll-on', 'linear-gradient(135deg, #1a0820 0%, #08070F 100%)', true, 1),
  ('Charcoal Edition.', 'Activated charcoal meets pure alum. The ultimate detox deodorant.', 'Explore', '/category/roll-on', 'linear-gradient(135deg, #0D0B18 0%, #08070F 100%)', true, 2)
ON CONFLICT DO NOTHING;
