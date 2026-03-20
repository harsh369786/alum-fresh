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
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-syne font-black text-3xl sm:text-4xl text-text-primary mb-3">
            {title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gradient-text">{title.split(" ").slice(-1)}</span>
          </h2>
          <p className="text-text-muted max-w-md mx-auto">
            Natural deodorants crafted with pure alum crystal and botanical ingredients
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-surface border border-white/8 overflow-hidden">
                <Skeleton className="h-56" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <p className="text-6xl mb-4">🌿</p>
            <p className="text-text-muted">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
