-- Create the 'blogs' table for The Aura Company

CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  content text NOT NULL,
  image_url text,
  rank integer DEFAULT 0,
  status text DEFAULT 'draft',
  category text,
  tags text[],
  seo_title text,
  seo_description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Ensure Row Level Security (RLS) is disabled for this table if you are authenticating natively through the application's api layer like we do for `orders` and `products`, 
-- or explicitly enable RLS and construct valid INSERT / SELECT policies.

-- Easiest Setup (Matching standard Next.js backend API proxy architecture):
ALTER TABLE public.blogs DISABLE ROW LEVEL SECURITY;
