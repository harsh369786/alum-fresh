import React from "react";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ProductScroll } from "@/components/product-scroll";
import Link from "next/link";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Search | The Aura Company",
  description: "Search Alum Fresh products — natural alum deodorants, bundles, and skincare.",
};

import { getProducts, hasSupabase } from "@/lib/data-service";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  let products: any[] = [];

  if (q && q.trim()) {
    const query = q.trim().toLowerCase();

    if (hasSupabase) {
      try {
        const supabase = createServerSupabaseClient();
        const { data } = await supabase
          .from("products")
          .select("*, categories(*)")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,short_desc.ilike.%${query}%,variant.ilike.%${query}%`)
          .eq("in_stock", true)
          .order("sort_order")
          .limit(12);
        products = data || [];
      } catch {}
    } else {
      // Demo mode: filter mock products
      const allProducts = await getProducts();
      products = allProducts.filter(p => !!p.in_stock).filter(p =>
        (p.name?.toLowerCase().includes(query)) ||
        (p.description?.toLowerCase().includes(query)) ||
        (p.variant?.toLowerCase().includes(query)) ||
        (p.category_id?.toLowerCase().includes(query)) ||
        ((p.badge || "").toLowerCase().includes(query))
      );
    }
  }

  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-20 bg-cream/30">
      <section className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-warm hover:text-charcoal transition-all text-[0.7rem] uppercase tracking-widest mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="animate-fade-up">
          <span className="eyebrow block">Search</span>
          <h1 className="font-serif italic text-[clamp(2rem,6vw,3.2rem)] text-charcoal leading-tight mb-8">
            {q ? (
              <>Find &ldquo;<em className="text-sage-dark">{q}</em>&rdquo;</>
            ) : (
              <>Discover our <em className="text-sage-dark">natural collection.</em></>
            )}
          </h1>

          {/* Search form */}
          <form method="GET" action="/search" className="relative max-w-2xl mb-10 group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-warm opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input
              name="q"
              defaultValue={q}
              autoFocus={!q}
              placeholder="Search rose, charcoal, natural, bundle..."
              className="w-full h-14 md:h-16 pl-14 pr-36 rounded-full border border-parchment bg-white text-charcoal text-[0.9rem] md:text-[1rem] placeholder:text-warm/40 outline-none focus:border-sage-dark focus:ring-4 focus:ring-sage-light/20 shadow-sm transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 px-6 md:px-8 rounded-full bg-charcoal text-white text-[0.65rem] font-black uppercase tracking-widest hover:bg-sage-dark transition-all"
            >
              Search
            </button>
          </form>

          {q && (
            <p className="text-[0.8rem] text-warm mb-10 opacity-80">
              <span className="font-semibold text-charcoal">{products.length}</span> {products.length === 1 ? "result" : "results"} found for &quot;{q}&quot;
              {!hasSupabase && <span className="ml-2 opacity-50 italic">(demo mode)</span>}
            </p>
          )}
        </div>
      </section>

      {products.length > 0 ? (
        <ProductScroll products={products} title={`${products.length} Discoveries`} />
      ) : q ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-32 text-center animate-fade-up">
          <div className="text-7xl mb-6 select-none">🌿</div>
          <h2 className="font-serif italic text-2xl md:text-3xl text-charcoal mb-4">No match found in nature.</h2>
          <p className="text-[0.9rem] text-warm mb-10 max-w-xs mx-auto leading-relaxed">
            Try exploring by edition like &ldquo;Rose&rdquo;, &ldquo;Charcoal&rdquo; or simply &ldquo;Natural&rdquo;.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["rose", "charcoal", "natural", "bundle"].map(s => (
              <Link key={s} href={`/search?q=${s}`} className="px-5 py-2 bg-white border border-parchment rounded-full text-[0.8rem] text-warm hover:text-charcoal hover:border-charcoal/20 transition-all capitalize">
                {s}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-16">
          <div className="bg-white border border-parchment rounded-[2rem] p-8 md:p-12 text-center mb-10">
            <span className="eyebrow block mb-4">Popular Searches</span>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {["Rose Edition", "Charcoal", "Natural 50ml", "Bundle", "Gift Set", "100ml"].map(s => (
                <Link key={s} href={`/search?q=${encodeURIComponent(s)}`}
                  className="px-5 py-2 bg-cream border border-parchment rounded-full text-[0.8rem] text-warm hover:text-charcoal hover:border-charcoal/20 transition-all">
                  {s}
                </Link>
              ))}
            </div>
          </div>
          <ProductScroll products={await getProducts() as any} title="Full Collection" />
        </div>
      )}
    </main>
  );
}
