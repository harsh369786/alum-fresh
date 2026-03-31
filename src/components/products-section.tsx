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
  { id: "1", name: "Alum Roll-on", description: "100% Natural alum to eleminated sweat smell", price: 399, variant: "natural", category_id: "roll-on", is_featured: true, in_stock: true, sort_order: 1, created_at: "", ingredients: [], benefits: [], slug: "alum-roll-on", sku: "AR01", image_url: "https://lyfugzdxfcqlrsmermjm.supabase.co/storage/v1/object/public/alumfresh-image/step1.jpeg", badge: null, badge_color: null, short_desc: "100% Natural alum to eliminated sweat smell", original_price: 999, size: "60g" },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "rose": return { bg: "bg-rose-light", emoji: "🌸" };
      case "natural": return { bg: "bg-sage-light", emoji: "🌿" };
      case "charcoal": return { bg: "bg-parchment", emoji: "🫙" };
      default: return { bg: "bg-cream", emoji: "✨" };
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
      size: "60g",
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
        <div className={`aspect-square flex items-center justify-center relative overflow-hidden ${styles.bg}`}>
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_14px_28px_rgba(0,0,0,0.08)]"
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
              Natural Alum
            </div>
            <span className="text-[0.65rem] text-warm bg-white/60 px-2 py-0.5 rounded-full border border-parchment">
              60g
            </span>
          </div>

          <h3 className="font-serif text-[1.3rem] text-charcoal mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[0.78rem] text-warm mb-5 line-clamp-2 leading-relaxed">
            {product.short_desc || product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-baseline text-charcoal">
              <span className="font-sans text-[1rem] mr-0.5">₹</span>
              <span className="font-serif text-[1.6rem] leading-none">{product.price}</span>
              {product.original_price && (
                <span className="font-sans text-[0.8rem] text-warm line-through ml-2.5 opacity-60">
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
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light mt-1 text-charcoal">
          Experience <em className="text-sage-dark">Natural Freshness.</em>
        </h2>
        <p className="max-w-[460px] mx-auto mt-4 text-[0.88rem] text-warm">
          A single promise of purity — pure, natural alum crystal that protects you all day.
        </p>
      </div>

      <div className="flex justify-center max-w-lg mx-auto">
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
