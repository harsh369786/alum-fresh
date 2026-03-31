import React from "react";
import type { Metadata } from "next";
import { getProducts } from "@/lib/data-service";
import { Hero } from "@/components/hero";
import { MarqueeStrip } from "@/components/marquee-strip";
import { WhySection } from "@/components/why-section";
import { ProductsSection } from "@/components/products-section";
import { IngredientsSection } from "@/components/ingredients-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaBanner } from "@/components/cta-banner";
import { HowToUseSection } from "@/components/how-to-use-section";

export const metadata: Metadata = {
  title: "The Aura Company — Stay Fresh, Naturally.",
  description: "100% Alum. 0% Chemicals. Premium natural alum crystal roll-on deodorant.",
};

export const revalidate = 60;

async function getHomepageData() {
  try {
    const allProducts = await getProducts();
    const sorted = allProducts
      .filter(p => !!p.in_stock)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
      .slice(0, 3);
    return { products: sorted };
  } catch (e) {
    console.error(e);
    return { products: [] };
  }
}

export default async function HomePage() {
  const { products } = await getHomepageData();

  return (
    <>
      <Hero />
      <MarqueeStrip />
      <ProductsSection products={products} />
      <TestimonialsSection />
      <WhySection />
      <HowToUseSection />
      <IngredientsSection />
      <CtaBanner />
    </>
  );
}
