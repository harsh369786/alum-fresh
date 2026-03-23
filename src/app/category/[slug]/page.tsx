import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/data-service";
import { ProductScroll } from "@/components/product-scroll";
import { MarqueeStrip } from "@/components/marquee-strip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string; sort?: string }>;
}

const CATEGORY_META: Record<string, { title: string; subtitle: string; description: string; emoji: string }> = {
  "roll-on": {
    title: "Roll-On Deodorants",
    subtitle: "Stay Fresh, Naturally",
    description: "Pure alum crystal roll-on deodorants. Chemical-free, vegan, and dermatologist tested. Available in Rose, Natural, and Charcoal editions.",
    emoji: "🌿",
  },
  "bundles": {
    title: "Bundles & Gift Sets",
    subtitle: "The Perfect Reveal",
    description: "Try all Alum Fresh variants with our curated combo packs. Perfect for gifting or discovering your favourite edition.",
    emoji: "🎁",
  },
  "skincare": {
    title: "Natural Skincare",
    subtitle: "Coming Soon",
    description: "Expanding our range of clean, chemical-free skincare. Coming soon to Alum Fresh.",
    emoji: "✨",
  },
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug];
  return {
    title: meta ? `${meta.title} | Alum Fresh` : "Shop | Alum Fresh",
    description: meta?.description || "Shop Alum Fresh natural deodorants.",
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { variant, sort } = await searchParams;

  try {
    const allProducts = await getProducts();
    let queryResult = allProducts.filter(p => p.in_stock);

    // Apply Variant Filter
    if (variant && variant !== "all") {
      queryResult = queryResult.filter(p => p.variant === variant);
    }

    // Apply Sorting
    if (sort === "price-asc") {
      queryResult.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      queryResult.sort((a, b) => b.price - a.price);
    } else {
      queryResult.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    const products = queryResult;
    const meta = CATEGORY_META[slug];

    return (
      <main className="bg-cream/30 min-h-screen pt-24">
        {/* Category Header */}
        <section className="pt-16 pb-12 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-warm hover:text-charcoal transition-all text-[0.7rem] uppercase tracking-widest mb-10 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-up">
              <div className="flex-1">
                <span className="eyebrow">{meta?.subtitle || "Our Collection"}</span>
                <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-light text-charcoal leading-tight">
                  {meta?.title || "All Products"} <em className="text-sage-dark">{meta?.emoji || "🌿"}</em>
                </h1>
                <p className="text-[0.95rem] text-warm max-w-xl mt-4 leading-relaxed line-clamp-2 md:line-clamp-none">
                  {meta?.description}
                </p>
              </div>

              {/* Advanced Sort / Filter UI */}
              <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 pt-8 md:pt-0 border-parchment">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-parchment shadow-sm">
                  <Filter className="w-3.5 h-3.5 text-sage-dark" />
                  <span className="text-[0.7rem] font-medium uppercase tracking-wider text-charcoal">Filter by Edition</span>
                </div>
              </div>
            </div>

            {/* Filter Pill bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-parchment animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex flex-wrap gap-2.5">
                {["all", "rose", "natural", "charcoal"].map((v) => (
                  <Link
                    key={v}
                    href={`/category/${slug}?variant=${v}${sort ? `&sort=${sort}` : ""}`}
                    className={`px-6 py-2.5 rounded-full text-[0.72rem] font-medium tracking-[0.06em] uppercase border transition-all duration-300 ${
                      (variant || "all") === v
                        ? "bg-charcoal text-white border-charcoal shadow-md"
                        : "bg-white text-warm border-parchment hover:border-sage-light hover:text-charcoal"
                    }`}
                  >
                    {v === "all" ? "All Editions" : `${v.charAt(0).toUpperCase() + v.slice(1)} Edition`}
                  </Link>
                ))}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/category/${slug}?${variant ? `variant=${variant}&` : ""}sort=price-asc`}
                  className={`px-4 py-2 rounded-full text-[0.68rem] font-medium uppercase border transition-all ${sort === "price-asc" ? "bg-parchment text-charcoal border-charcoal" : "bg-white/50 text-warm border-parchment hover:border-sage-light"}`}
                >
                  Price: Lo → Hi
                </Link>
                <Link
                  href={`/category/${slug}?${variant ? `variant=${variant}&` : ""}sort=price-desc`}
                  className={`px-4 py-2 rounded-full text-[0.68rem] font-medium uppercase border transition-all ${sort === "price-desc" ? "bg-parchment text-charcoal border-charcoal" : "bg-white/50 text-warm border-parchment hover:border-sage-light"}`}
                >
                  Price: Hi → Lo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <MarqueeStrip />
        
        <div className="bg-white">
          <ProductScroll products={products || []} title={`${products.length} Items Found`} />
        </div>

        {/* Empty state fallback UI */}
        {products?.length === 0 && (
          <div className="max-w-7xl mx-auto px-6 py-32 text-center animate-fade-up">
            <div className="text-7xl mb-6">🌿</div>
            <h2 className="font-serif italic text-3xl text-charcoal mb-4">Finding the perfect match...</h2>
            <p className="text-warm mb-10 max-w-sm mx-auto">No products found matching your current filters. Nature is still growing our next batch.</p>
            <Button className="bg-charcoal text-white hover:bg-charcoal/90 rounded-full px-10 py-6" asChild>
              <Link href={`/category/${slug}`}>Clear All Filters &nbsp;→</Link>
            </Button>
          </div>
        )}
      </main>
    );
  } catch {
    notFound();
  }
}
