import React from "react";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase";
import { Hero } from "@/components/hero";
import { MarqueeStrip } from "@/components/marquee-strip";
import { WhySection } from "@/components/why-section";
import { ProductsSection } from "@/components/products-section";
import { IngredientsSection } from "@/components/ingredients-section";
import { StatsBar } from "@/components/stats-bar";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Alum Fresh — Stay Fresh, Naturally.",
  description: "100% Alum. 0% Chemicals. Premium natural alum crystal roll-on deodorant.",
};

export const revalidate = 60;

async function getHomepageData() {
  try {
    const supabase = createServerSupabaseClient();
    const [productsResult] = await Promise.all([
      supabase.from("products").select("*, categories(*)").order("sort_order").limit(3),
    ]);
    return {
      products: (productsResult.data || []).filter(p => !!p),
    };
  } catch {
    return { products: [] };
  }
}

export default async function HomePage() {
  const { products } = await getHomepageData();

  return (
    <>
      <Hero />
      <MarqueeStrip />
      <WhySection />
      <IngredientsSection />
      <ProductsSection products={products} />
      <StatsBar />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
