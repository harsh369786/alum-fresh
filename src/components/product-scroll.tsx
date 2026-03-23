"use client";
import React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductScrollProps {
  products: Product[];
  title?: string;
  loading?: boolean;
}

export function ProductScroll({ products, title = "Our Collection", loading = false }: ProductScrollProps) {
  return (
    <section className="py-24 px-6 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <span className="eyebrow">Discover</span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light mt-1 text-charcoal">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="text-sage-dark">{title.split(" ").slice(-1)}</em>
          </h2>
          <p className="max-w-[460px] mx-auto mt-4 text-[0.85rem] text-warm leading-[1.7]">
            Natural ingredients, ethical sourcing, and pure potassium alum crystals for a refreshing, chemical-free experience.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-cream border border-parchment overflow-hidden overflow-hidden">
                <Skeleton className="h-64" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/5" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-1/3 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-3xl animate-fade-up">
            <p className="text-7xl mb-6">🌿</p>
            <h3 className="font-serif text-[1.5rem] text-charcoal mb-2">No products found</h3>
            <p className="text-[0.88rem] text-warm max-w-sm mx-auto">
              Our curated collection is currently out of stock or filtered. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
