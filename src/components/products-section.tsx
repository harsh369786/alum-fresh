"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Eye } from "lucide-react";
import { ProductDetailModal } from "@/components/product-detail-modal";

import { ProductCard } from "@/components/product-card";

export function ProductsSection({ products }: { products: Product[] }) {
  const displayProducts = products;

  return (
    <section className="bg-white py-24 px-6 md:px-8" id="products">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light mt-1 text-charcoal">
          Experience <em className="text-sage-dark">Natural Freshness.</em>
        </h2>
        <p className="max-w-[460px] mx-auto mt-4 text-[0.88rem] text-warm">
          A single promise of purity — pure, natural alum crystal that protects you all day.
        </p>
      </div>

      <div className="flex justify-center max-w-lg mx-auto">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-14">
        <Link
          href="/category/roll-on"
          className="inline-flex items-center gap-3 text-[0.72rem] font-black uppercase tracking-[0.2em] text-charcoal hover:text-sage-dark transition-all underline underline-offset-8 decoration-parchment hover:decoration-sage-dark"
        >
          Browse All Products &nbsp;→
        </Link>
      </div>
    </section>
  );
}
