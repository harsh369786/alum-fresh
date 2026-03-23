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

export async function getProducts(): Promise<Product[]> {
  if (hasSupabase) {
    try {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from("products").select("*").order("sort_order");
      return data || [];
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local.");
    }
  }

  // Fallback / Demo Mode
  try {
    const fileData = await fs.readFile(dataFilePath, "utf8");
    return JSON.parse(fileData);
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
