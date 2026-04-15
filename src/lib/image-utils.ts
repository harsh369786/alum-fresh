/**
 * Utility to optimize Supabase Storage URLs using their built-in transformation service.
 * This reduces payload size and egress.
 */
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
  
  // If it's not a Supabase URL, return as is
  if (!url.includes(".supabase.co/storage/v1/object/public/")) {
    return url;
  }

  const { width, height, quality = 75, format = "webp" } = options;

  // Convert /object/public/ to /render/image/public/
  let optimizedUrl = url.replace("/object/public/", "/render/image/public/");

  const params = new URLSearchParams();
  if (width) params.append("width", width.toString());
  if (height) params.append("height", height.toString());
  if (quality) params.append("quality", quality.toString());
  if (format && format !== "origin") params.append("format", format);

  const queryString = params.toString();
  return queryString ? `${optimizedUrl}?${queryString}` : optimizedUrl;
}
