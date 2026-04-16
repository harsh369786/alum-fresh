/**
 * Utility to redirect Supabase Storage URLs to local /images/ copies.
 * This eliminates Supabase egress entirely for all known images.
 */

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

  // If it's a Supabase storage URL, extract the filename and serve locally
  if (url.includes(".supabase.co/storage/")) {
    // Extract filename after the bucket name
    const bucketPath = `/object/public/${SUPABASE_BUCKET}/`;
    const renderPath = `/render/image/public/${SUPABASE_BUCKET}/`;
    let filename = "";

    if (url.includes(bucketPath)) {
      filename = url.split(bucketPath).pop() || "";
    } else if (url.includes(renderPath)) {
      filename = url.split(renderPath).pop() || "";
    }

    // Strip any query params
    filename = filename.split("?")[0];

    if (filename) {
      return `/images/${filename}`;
    }
  }

  // Non-Supabase URLs pass through unchanged
  return url;
}
