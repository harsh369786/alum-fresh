import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ProductScroll } from "@/components/product-scroll";
import { MarqueeStrip } from "@/components/marquee-strip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string; sort?: string }>;
}

const CATEGORY_META: Record<string, { title: string; description: string; emoji: string }> = {
  "roll-on": {
    title: "Roll-On Deodorants",
    description: "Pure alum crystal roll-on deodorants. Chemical-free, vegan, and dermatologist tested. Available in Rose, Natural, and Charcoal editions.",
    emoji: "🌿",
  },
  "bundles": {
    title: "Bundles & Gift Sets",
    description: "Try all Alum Fresh variants with our curated combo packs. Perfect for gifting or discovering your favourite edition.",
    emoji: "🎁",
  },
  "skincare": {
    title: "Natural Skincare",
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
    const supabase = createServerSupabaseClient();

    const { data: category } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    let query = supabase
      .from("products")
      .select("*, categories(*)")
      .eq("in_stock", true);

    if (category) {
      query = query.eq("category_id", category.id);
    }

    if (variant && variant !== "all") {
      query = query.eq("variant", variant);
    }

    if (sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("sort_order", { ascending: true });
    }

    const { data: products = [] } = await query;
    const meta = CATEGORY_META[slug];

    return (
      <>
        {/* Category Header */}
        <section className="pt-28 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-teal transition-colors text-sm mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-start gap-4">
              <div className="text-5xl">{meta?.emoji || "🌿"}</div>
              <div>
                <h1 className="font-syne font-black text-3xl sm:text-5xl text-text-primary mb-3">
                  {category?.name || meta?.title || "All Products"}
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-teal to-purple-light rounded-full mb-4" />
                <p className="text-text-muted max-w-xl">
                  {category?.description || meta?.description}
                </p>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-3 mt-8">
              {["all", "rose", "natural", "charcoal"].map((v) => (
                <Link
                  key={v}
                  href={`/category/${slug}?variant=${v}${sort ? `&sort=${sort}` : ""}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    (variant || "all") === v
                      ? "border-teal text-teal bg-teal/10"
                      : "border-white/15 text-text-muted hover:border-white/30 hover:text-text-primary"
                  }`}
                >
                  {v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
                </Link>
              ))}
              <div className="ml-auto flex gap-2">
                <Link
                  href={`/category/${slug}?${variant ? `variant=${variant}&` : ""}sort=price-asc`}
                  className={`px-3 py-2 rounded-full text-xs font-medium border transition-all ${sort === "price-asc" ? "border-teal text-teal bg-teal/10" : "border-white/15 text-text-muted hover:border-white/30"}`}
                >
                  Price ↑
                </Link>
                <Link
                  href={`/category/${slug}?${variant ? `variant=${variant}&` : ""}sort=price-desc`}
                  className={`px-3 py-2 rounded-full text-xs font-medium border transition-all ${sort === "price-desc" ? "border-teal text-teal bg-teal/10" : "border-white/15 text-text-muted hover:border-white/30"}`}
                >
                  Price ↓
                </Link>
              </div>
            </div>
          </div>
        </section>

        <MarqueeStrip />
        <ProductScroll products={products || []} title="All Products" />

        {/* Empty state */}
        {products?.length === 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="font-syne font-bold text-2xl text-text-primary mb-2">No products found</h2>
            <p className="text-text-muted mb-6">Try a different filter or check back soon for new arrivals.</p>
            <Button variant="teal" asChild>
              <Link href={`/category/${slug}`}>View All</Link>
            </Button>
          </div>
        )}
      </>
    );
  } catch {
    notFound();
  }
}
