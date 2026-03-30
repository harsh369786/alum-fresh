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

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Natural Mist", description: "Pure crystallised potassium alum for sensitive skin. Long-lasting freshness without any chemicals.", price: 499, variant: "natural", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 1, created_at: "", ingredients: [], benefits: [], slug: "natural-mist", sku: "NM01", image_url: null, badge: null, badge_color: null, short_desc: "Crystal-pure freshness, all day.", original_price: 599, size: "50ml" },
  { id: "2", name: "Rose Quartz", description: "Infused with organic rose water and aloe vera extracts for a delicate feminine freshness.", price: 549, variant: "rose", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 2, created_at: "", ingredients: [], benefits: [], slug: "rose-quartz", sku: "RQ01", image_url: null, badge: "Best Seller", badge_color: null, short_desc: "Floral, natural, refreshing.", original_price: 699, size: "50ml" },
  { id: "3", name: "Earth's Clay", description: "Activated charcoal for deep detox and all-day protection against odour.", price: 599, variant: "charcoal", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 3, created_at: "", ingredients: [], benefits: [], slug: "earths-clay", sku: "EC01", image_url: null, badge: null, badge_color: null, short_desc: "Deep detox, bold freshness.", original_price: null, size: "50ml" },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "rose":    return { bg: "bg-rose-light", emoji: "🌸" };
      case "natural": return { bg: "bg-sage-light", emoji: "🌿" };
      case "charcoal":return { bg: "bg-parchment", emoji: "🫙"  };
      default:        return { bg: "bg-cream", emoji: "✨" };
    }
  };

  const styles = getVariantStyles(product.variant || "natural");

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      variant: product.variant,
      size: product.size,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url,
      badge: product.badge,
    });
    router.push("/cart");
  }

  return (
    <>
      <div
        className="group block rounded-3xl overflow-hidden border border-parchment bg-cream transition-all duration-450 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(44,44,44,0.13)] animate-fade-up cursor-pointer"
        style={{ animationDelay: `${index * 0.1}s` }}
        onClick={() => setModalOpen(true)}
      >
        {/* Image Area */}
        <div className={`h-[280px] flex items-center justify-center relative overflow-hidden ${styles.bg}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-40 h-40 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1.5 drop-shadow-[0_14px_28px_rgba(0,0,0,0.12)]"
            />
          ) : (
            <div className="text-[7rem] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:-translate-y-1.5 drop-shadow-[0_14px_28px_rgba(0,0,0,0.12)] opacity-80">
              {styles.emoji}
            </div>
          )}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-charcoal text-white text-[0.65rem] font-medium tracking-[0.08em] px-3 py-1 rounded-full uppercase">
              {product.badge}
            </span>
          )}
          {/* Quick view hint */}
          <div className="absolute inset-0 bg-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 backdrop-blur-sm text-charcoal text-[0.72rem] font-bold uppercase tracking-wider shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[0.68rem] font-bold tracking-[0.14em] uppercase text-sage-dark">
              {product.variant} Edition
            </div>
            {product.size && (
              <span className="text-[0.65rem] text-warm bg-white/60 px-2 py-0.5 rounded-full border border-parchment">
                {product.size}
              </span>
            )}
          </div>

          <h3 className="font-serif text-[1.3rem] text-charcoal mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[0.78rem] text-warm mb-5 line-clamp-2 leading-relaxed">
            {product.short_desc || product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="font-serif text-[1.5rem] text-charcoal">
              <sub className="font-sans text-[0.72rem] align-super mr-0.5">₹</sub>
              {product.price}
              {product.original_price && (
                <span className="font-sans text-[0.8rem] text-warm line-through ml-2 opacity-60">
                  ₹{product.original_price}
                </span>
              )}
            </div>

            <Button
              className="bg-charcoal text-white hover:bg-sage-dark rounded-full px-5 py-2.5 h-auto text-[0.75rem] font-medium tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95 gap-1.5"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      <ProductDetailModal
        product={product}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}

export function ProductsSection({ products }: { products: Product[] }) {
  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;

  return (
    <section className="bg-white py-24 px-6 md:px-8" id="products">
      <div className="text-center mb-16 animate-fade-up max-w-7xl mx-auto">
        <span className="eyebrow">Our Collection</span>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light mt-1 text-charcoal">
          Find your <em className="text-sage-dark">perfect match.</em>
        </h2>
        <p className="max-w-[460px] mx-auto mt-4 text-[0.88rem] text-warm">
          Three unique variants, one promise — pure, natural freshness that lasts all day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-7xl mx-auto">
        {displayProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
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
