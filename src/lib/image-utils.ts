/**
 * Utility to redirect known static Supabase URLs to local /images/ copies to save egress.
 */

// Only intercept these 22 exactly known legacy files.
const STATIC_IMAGE_MAP: Set<string> = new Set([
  "1774611862532-product.png",
  "1774863566593-1000126033.png",
  "1774863901671-1000126041.png",
  "1774875225923-1000127853.jpg",
  "1774876596337-1000127895.jpg",
  "1775582862442-1000131556.jpg",
  "1775582871662-1000128469.png",
  "1775582875138-1000126033.png",
  "1775582911564-1000131556.jpg",
  "1775582927455-1000127895.jpg",
  "1775584188444-1000131556.jpg",
  "1775584217616-1000128469.png",
  "1775584221887-1000127895.jpg",
  "1775584225664-1000126033.png",
  "1775584229118-1000126041.png",
  "logo.jpeg",
  "product.png",
  "product_2.png",
  "step1.jpeg",
  "step2.jpeg",
  "step3.jpeg",
  "step4.jpeg"
]);

const SUPABASE_BUCKET = "alumfresh-image";

export function getOptimizedImageUrl(
  url: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "origin";
  } = {}
): string {
  if (!url) return "";

  // Check if it's a Supabase storage URL
  if (url.includes(".supabase.co/storage/")) {
    const bucketPath = `/object/public/${SUPABASE_BUCKET}/`;
    const renderPath = `/render/image/public/${SUPABASE_BUCKET}/`;
    let filename = "";

    if (url.includes(bucketPath)) {
      filename = url.split(bucketPath).pop() || "";
    } else if (url.includes(renderPath)) {
      filename = url.split(renderPath).pop() || "";
    }

    filename = filename.split("?")[0];

    // ONLY redirect if the exact file exists in our local hardcoded mapping
    // Otherwise, this allows NEW admin uploads to work flawlessly using true Supabase URL
    if (filename && STATIC_IMAGE_MAP.has(filename)) {
      return `/images/${filename}`;
    }
    
    // For free tier support, we must strip /render/image API paths so real Supabase URLs 
    // fall back to their standard non-paid object URLs.
    if (url.includes(renderPath)) {
      let rawUrl = url.replace(renderPath, bucketPath);
      rawUrl = rawUrl.split("?")[0];
      return rawUrl;
    }
  }

  // Pass through exact custom strings or new URLs untouched
  return url;
}
