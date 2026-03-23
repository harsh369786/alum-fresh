"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Eye } from "lucide-react";
import { ProductDetailModal } from "@/components/product-detail-modal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

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

  const styles = getVariantStyles(product.variant || "natural");

  function handleAddToCart(e: React.MouseEvent) {
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
    toast({ 
      title: "Added to cart ✓", 
      description: product.name,
    });
  }

  return (
    <>
      <div
        className="group block rounded-3xl overflow-hidden border border-parchment bg-cream transition-all duration-450 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(44,44,44,0.13)] animate-fade-up group"
        onClick={() => setModalOpen(true)}
      >
        {/* Image Area */}
        <div className={`h-[240px] flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${styles.bg}`}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-40 h-40 object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1.5 drop-shadow-[0_14px_28px_rgba(0,0,0,0.12)]"
            />
          ) : (
            <div className="text-7xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1.5 drop-shadow-[0_14px_28px_rgba(0,0,0,0.12)] opacity-80">
              {styles.emoji}
            </div>
          )}
          
          {product.is_featured && (
            <span className="absolute top-4 right-4 bg-charcoal text-white text-[0.65rem] font-medium tracking-[0.08em] px-3 py-1 rounded-full uppercase">
              Best Seller
            </span>
          )}

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-charcoal/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-charcoal shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-[0.68rem] font-medium tracking-[0.14em] uppercase text-sage-dark">
              {product.variant} Edition
            </div>
            {product.size && (
              <span className="text-[0.65rem] text-warm bg-white/50 px-2 py-0.5 rounded-full border border-parchment">
                {product.size}
              </span>
            )}
          </div>
          
          <h3 className="font-serif text-[1.25rem] text-charcoal mb-2 leading-tight">
            {product.name}
          </h3>
          
          <p className="text-[0.78rem] text-warm mb-5 line-clamp-2 leading-relaxed">
            {product.description || product.short_desc}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="font-serif text-[1.4rem] text-charcoal">
              <sub className="font-sans text-[0.7rem] align-super mr-0.5">₹</sub>
              {product.price}
              {product.original_price && (
                <span className="font-sans text-[0.8rem] text-warm line-through ml-2 opacity-60">
                  ₹{product.original_price}
                </span>
              )}
            </div>
            
            <Button 
              className="bg-charcoal text-white hover:bg-charcoal/90 rounded-full px-5 py-2.5 h-auto text-[0.75rem] font-medium tracking-wide shadow-sm hover:shadow-md transition-all active:scale-95"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-2" />
              Add
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
