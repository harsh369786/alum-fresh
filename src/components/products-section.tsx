"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Natural Mist", description: "Pure crystallised potassium alum for sensitive skin.", price: 499, variant: "natural", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 1, created_at: "", ingredients: [], benefits: [], slug: "natural-mist", sku: "NM01", image_url: null, badge: null, badge_color: null, short_desc: null, original_price: null, size: "50ml" },
  { id: "2", name: "Rose Quartz", description: "Infused with organic rose water and aloe vera extracts.", price: 549, variant: "rose", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 2, created_at: "", ingredients: [], benefits: [], slug: "rose-quartz", sku: "RQ01", image_url: null, badge: null, badge_color: null, short_desc: null, original_price: null, size: "50ml" },
  { id: "3", name: "Earth's Clay", description: "Activated charcoal for deep detox and all-day protection.", price: 599, variant: "charcoal", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 3, created_at: "", ingredients: [], benefits: [], slug: "earths-clay", sku: "EC01", image_url: null, badge: null, badge_color: null, short_desc: null, original_price: null, size: "50ml" },
];

export function ProductsSection({ products }: { products: Product[] }) {
  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;
  
  // Map variant values to their background classes and emojis based on the HTML
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "rose":
        return { bg: "bg-rose-light", emoji: "🌸" };
      case "natural":
        return { bg: "bg-sage-light", emoji: "🌿" };
      case "charcoal":
        return { bg: "bg-parchment", emoji: "🫙" };
      default:
        return { bg: "bg-cream", emoji: "✨" };
    }
  };

  return (
    <section className="bg-white py-24 px-6 md:px-8" id="products">
      <div className="text-center mb-16 animate-fade-up">
        <span className="eyebrow">Our Collection</span>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light mt-1 text-charcoal">
          Find your <em className="text-sage-dark">perfect match.</em>
        </h2>
        <p className="max-w-[460px] mx-auto mt-4 text-[0.88rem] text-warm">
          Three unique variants, one promise — pure, natural freshness that lasts all day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-7xl mx-auto">
        {displayProducts.map((product, i) => {
          const styles = getVariantStyles(product.variant || "natural");
          
          return (
            <Link
              href={`/category/${product.category_id}`} 
              key={product.id}
              className="group block rounded-3xl overflow-hidden border border-parchment bg-cream transition-all duration-450 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(44,44,44,0.13)] animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Image Area */}
              <div className={`h-[280px] flex items-center justify-center relative overflow-hidden ${styles.bg}`}>
                <div className="text-[7rem] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-1.5 drop-shadow-[0_14px_28px_rgba(0,0,0,0.12)] opacity-80">
                  {styles.emoji}
                </div>
                {product.is_featured && (
                  <span className="absolute top-4 right-4 bg-charcoal text-white text-[0.65rem] font-medium tracking-[0.08em] px-3 py-1 rounded-full uppercase">
                    Best Seller
                  </span>
                )}
              </div>

              {/* Info Area */}
              <div className="p-6">
                <div className="text-[0.68rem] font-medium tracking-[0.14em] uppercase text-sage-dark mb-1.5">
                  {product.variant} Edition
                </div>
                <h3 className="font-serif text-[1.3rem] text-charcoal mb-2">
                  {product.name}
                </h3>
                <p className="text-[0.78rem] text-warm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="font-serif text-[1.5rem] text-charcoal">
                    <sub className="font-sans text-[0.72rem] align-super">₹</sub>
                    {product.price}
                  </div>
                  <Button variant="teal" className="bg-charcoal text-white hover:bg-charcoal/90 rounded-full px-5 py-2.5 h-auto text-[0.78rem]">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
