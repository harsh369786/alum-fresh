export const BRAND_NAME = "The Aura Company";
export const TAGLINE = "Stay Fresh, Naturally.";
export const SUB_TAGLINE = "100% Alum. 0% Chemicals.";
export const LOGO_URL = "https://lyfugzdxfcqlrsmermjm.supabase.co/storage/v1/object/public/alumfresh-image/logo.jpeg";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alumfresh.in";

export const VARIANTS = [
  { label: "Natural Edition", value: "natural", color: "var(--sage)", emoji: "🌿" },
];

export const SIZES = [
  { label: "60g", value: "60g" },
];


export const FREE_SHIPPING_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 499
);
export const SHIPPING_CHARGE = Number(
  process.env.NEXT_PUBLIC_SHIPPING_CHARGE || 49
);

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "Our Story", href: "/about" },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "How to Use", href: "/#how-to-use" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/category/roll-on" },
    { label: "How to Use", href: "/#how-to-use" },
    { label: "Gift Sets", href: "/category/bundles" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "All Blogs", href: "/blogs" },
    { label: "Ingredients", href: "/#ingredients" },
  ],
  support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Tracking", href: "/cart" },
    { label: "Shipping Policy", href: "/contact" },
    { label: "Wholesale", href: "/contact" },
  ],
};

export const MARQUEE_ITEMS = [
  "✦ Chemical Free",
  "✦ Cruelty Free",
  "✦ Made in India",
  "✦ No Parabens",
  "✦ Long-Lasting",
];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const VARIANT_GLOW_COLORS: Record<string, string> = {
  natural: "var(--sage-light)",
};

export const CART_STORAGE_KEY = "alumfresh-cart";
