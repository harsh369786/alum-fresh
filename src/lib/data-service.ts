import fs from "fs/promises";
import path from "path";
import { Product } from "./types";
import { createServerSupabaseClient } from "./supabase";

const dataFilePath = path.join(process.cwd(), "src", "data", "products.json");

export const hasSupabase = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
);

export async function getProducts(limit?: number): Promise<Product[]> {
  const selectedFields = [
    "id",
    "name",
    "slug",
    "sku",
    "description",
    "short_desc",
    "price",
    "original_price",
    "category_id",
    "variant",
    "size",
    "image_url",
    "gallery",
    "badge",
    "badge_color",
    "in_stock",
    "is_featured",
    "sort_order",
    "created_at",
  ].join(", ");

  if (hasSupabase) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase.from("products").select(selectedFields).eq("variant", "natural").order("sort_order");
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data } = await query;
      return (data as unknown as Product[]) || [];
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local.");
    }
  }

  // Fallback / Demo Mode
  try {
    const fileData = await fs.readFile(dataFilePath, "utf8");
    const json = JSON.parse(fileData);
    let matched = json.filter((p: Product) => p.variant === "natural");
    if (limit) {
      matched = matched.slice(0, limit);
    }
    return matched;
  } catch (err) {
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  // We only save to JSON in demo mode. If Supabase is active, clients use the DB.
  if (!hasSupabase) {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), "utf8");
  }
}
