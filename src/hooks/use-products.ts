"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
        let query = (supabase as any)
          .from("products")
          .select("*, categories(*)")
          .eq("in_stock", true)
          .order("sort_order");

        if (categorySlug) {
          const { data: category } = await (supabase as any)
            .from("categories")
            .select("id")
            .eq("slug", categorySlug)
            .single();

          if (category) {
            query = query.eq("category_id", (category as any).id);
          }
        }

      const { data, error: fetchError } = await query;
      if (fetchError) setError(fetchError.message);
      else setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [categorySlug]);

  return { products, loading, error };
}
