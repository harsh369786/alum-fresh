"use client";
import React, { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { VARIANTS, SIZES } from "@/lib/constants";
import { ShoppingCart, Minus, Plus, Check, Leaf, Shield, Star } from "lucide-react";

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variant || "natural");
  const [selectedSize, setSelectedSize] = useState(product.size || "60g");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "rose":     return { bg: "bg-rose-light",  emoji: "✨" };
      case "natural":  return { bg: "bg-sage-light",  emoji: "🌿" };
      case "charcoal": return { bg: "bg-parchment",   emoji: "🫙" };
      default:         return { bg: "bg-cream",        emoji: "✨" };
    }
  };

  const styles = getVariantStyles(selectedVariant);

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      variant: selectedVariant,
      size: selectedSize,
      price: product.price,
      quantity: qty,
      imageUrl: product.image_url,
      badge: product.badge,
    });
    onOpenChange(false);
    router.push("/cart");
  }

  const ingredients = product.ingredients?.length
    ? product.ingredients
    : ["Potassium Alum", "Purified Water", "Mineral Salts"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        Key layout fix:
        - The modal itself scrolls (overflow-y-auto on DialogContent).
        - On desktop: two-column side-by-side, image column is fixed height 
          so it never pushes the button off screen.
        - On mobile: single column stacked (image top, form below).
      */}
      <DialogContent className="p-0 bg-white border-parchment md:max-w-3xl md:rounded-[2rem]">
        <div className="flex flex-col md:flex-row md:items-stretch">

          {/* ── Image Column ── fixed height on all screen sizes */}
          <div
            className={`
              relative flex items-center justify-center shrink-0
              h-[200px] md:h-auto md:w-[280px] lg:w-[320px]
              transition-colors duration-500 ${styles.bg}
              md:rounded-l-[2rem] rounded-t-[2rem] md:rounded-tr-none
            `}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[inherit]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/25 rounded-full blur-[40px]" />
            </div>
            <div className="relative z-10 select-none">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-2xl"
                />
              ) : (
                <span className="text-[5rem] md:text-[7rem]">{styles.emoji}</span>
              )}
            </div>
          </div>

          {/* ── Details Column ── only this side scrolls if content overflows */}
          <div className="flex flex-col flex-1 overflow-y-auto max-h-[70vh] md:max-h-[80vh] p-5 md:p-8">

            {/* Header */}
            <DialogHeader className="mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[0.63rem] font-bold tracking-widest uppercase text-sage-dark bg-sage-light/20 px-3 py-1 rounded-full border border-sage-light/30">
                  {selectedVariant} Edition
                </span>
                {product.badge && (
                  <span className="text-[0.63rem] font-bold tracking-widest uppercase text-rose bg-rose-light/20 px-3 py-1 rounded-full border border-rose-light/30">
                    {product.badge}
                  </span>
                )}
              </div>
              <DialogTitle className="font-serif text-[1.5rem] md:text-[1.9rem] text-charcoal leading-tight">
                {product.name}
              </DialogTitle>
              <p className="text-[0.83rem] text-warm leading-relaxed mt-1">
                {product.description || "100% chemical-free alum deodorant for long-lasting freshness."}
              </p>
            </DialogHeader>

            {/* Controls */}
            <div className="flex flex-col gap-4">

              {/* Variant */}
              <div>
                <p className="text-[0.6rem] text-warm mb-2 font-bold uppercase tracking-[0.1em]">Edition</p>
                <div className="flex flex-wrap gap-2">
                  {VARIANTS.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => setSelectedVariant(v.value as any)}
                      className={`px-4 py-2 rounded-full text-[0.72rem] font-medium border transition-all min-h-[40px] ${
                        selectedVariant === v.value
                          ? "bg-charcoal text-white border-charcoal"
                          : "bg-cream/60 text-warm border-parchment hover:border-sage-light"
                      }`}
                    >
                      {v.emoji} {v.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <p className="text-[0.6rem] text-warm mb-2 font-bold uppercase tracking-[0.1em]">Size</p>
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedSize(s.value as any)}
                      className={`px-5 py-2 rounded-full text-[0.72rem] font-medium border transition-all min-h-[40px] ${
                        selectedSize === s.value
                          ? "bg-charcoal text-white border-charcoal"
                          : "bg-cream/60 text-warm border-parchment hover:border-sage-light"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <p className="text-[0.6rem] text-warm mb-2 font-bold uppercase tracking-[0.1em]">Active Ingredients</p>
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.slice(0, 4).map((ing) => (
                    <span key={ing} className="px-3 py-1 text-[0.68rem] bg-cream border border-parchment rounded-full text-charcoal">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qty + Price */}
              <div className="flex items-center justify-between pt-3 border-t border-parchment">
                <div className="flex items-center bg-cream/60 border border-parchment rounded-full px-1.5 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-warm hover:text-charcoal hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center font-serif text-[1.05rem] text-charcoal">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-warm hover:text-charcoal hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-right leading-none">
                  <div className="font-serif text-[1.6rem] text-charcoal">
                    <sub className="font-sans text-[0.75rem] align-super mr-0.5">₹</sub>
                    {product.price * qty}
                  </div>
                  {product.original_price && (
                    <div className="font-sans text-[0.72rem] text-warm line-through opacity-50">
                      ₹{product.original_price * qty}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA — always visible, sticky feel via natural flow at bottom */}
              <div className="flex flex-col gap-2.5 pt-1">
                <Button
                  onClick={handleAdd}
                  className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-full py-6 text-[0.9rem] font-medium tracking-wide shadow-md active:scale-[0.98] transition-all"
                >
                  {added ? (
                    <><Check className="w-4 h-4 mr-2" /> Added to Cart</>
                  ) : (
                    <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart &nbsp;→</>
                  )}
                </Button>
                <div className="flex items-center justify-around text-[0.6rem] text-warm uppercase tracking-[0.05em] font-medium py-1">
                  <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-sage" /> Organic</span>
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-sage" /> Non-Toxic</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-sage" /> 4.9★</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
