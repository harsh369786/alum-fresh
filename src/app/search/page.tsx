import React from "react";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ProductScroll } from "@/components/product-scroll";
import Link from "next/link";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Search | Alum Fresh",
  description: "Search Alum Fresh products — natural alum deodorants, bundles, and skincare.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let products: any[] = [];

  if (q) {
    try {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase
        .from("products")
        .select("*, categories(*)")
        .or(`name.ilike.%${q}%,description.ilike.%${q}%,short_desc.ilike.%${q}%,variant.ilike.%${q}%`)
        .eq("in_stock", true)
        .order("sort_order")
        .limit(12);
      products = data || [];
    } catch {}
  }

  return (
    <>
      <section className="pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-syne font-black text-3xl sm:text-4xl text-text-primary mb-6">
            {q ? (
              <>Search Results for &ldquo;<span className="gradient-text">{q}</span>&rdquo;</>
            ) : (
              <>Search <span className="gradient-text">Products</span></>
            )}
          </h1>

          {/* Search form */}
          <form method="GET" className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search deodorants, variants..."
              className="w-full h-12 pl-12 pr-4 rounded-full border border-white/10 bg-white/5 text-text-primary placeholder:text-text-muted focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/50 transition-colors"
            />
          </form>

          {q && <p className="text-text-muted mb-2">{products.length} result{products.length !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;</p>}
        </div>
      </section>

      <ProductScroll products={products} title="Search Results" />

      {q && products.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-syne font-bold text-2xl text-text-primary mb-2">No results found</h2>
          <p className="text-text-muted mb-6">Try &ldquo;rose&rdquo;, &ldquo;natural&rdquo;, &ldquo;charcoal&rdquo;, or &ldquo;bundle&rdquo;</p>
          <Link href="/category/roll-on" className="text-teal hover:underline">Browse All Products →</Link>
        </div>
      )}
    </>
  );
}
