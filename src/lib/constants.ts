export const BRAND_NAME = "Alum Fresh";
export const TAGLINE = "Stay Fresh, Naturally.";
export const SUB_TAGLINE = "100% Alum. 0% Chemicals.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alumfresh.in";

export const VARIANTS = [
  { label: "Rose Edition", value: "rose", color: "var(--rose)", emoji: "🌸" },
  { label: "Natural Edition", value: "natural", color: "var(--sage)", emoji: "🌿" },
  { label: "Charcoal Edition", value: "charcoal", color: "#d8d8d8", emoji: "🫙" },
];

export const SIZES = [
  { label: "50ml", value: "50ml" },
  { label: "100ml", value: "100ml" },
];


export const FREE_SHIPPING_THRESHOLD = Number(
  process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || 499
);
export const SHIPPING_CHARGE = Number(
  process.env.NEXT_PUBLIC_SHIPPING_CHARGE || 49
);

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/#products" },
  { label: "Ingredients", href: "/#ingredients" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  shop: [
    { label: "All Products", href: "/category/roll-on" },
    { label: "Rose Edition", href: "/category/roll-on?v=rose" },
    { label: "Natural Edition", href: "/category/roll-on?v=natural" },
    { label: "Charcoal Edition", href: "/category/roll-on?v=charcoal" },
    { label: "Gift Sets", href: "/category/bundles" },
  ],
  company: [
    { label: "Our Story", href: "/about" },
    { label: "Ingredients", href: "/#ingredients" },
    { label: "Sustainability", href: "/about#eco" },
    { label: "Scientific Ritual", href: "/about" },
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
  "✦ Dermatologist Tested",
  "✦ Cruelty Free",
  "✦ Made in India",
  "✦ Eco Friendly",
  "✦ No Parabens",
  "✦ Vegan Formula",
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
  rose: "var(--rose-light)",
  natural: "var(--sage-light)",
  charcoal: "#efefef",
};

export const CART_STORAGE_KEY = "alumfresh-cart";
