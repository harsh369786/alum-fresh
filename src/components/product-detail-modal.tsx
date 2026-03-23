"use client";
import React, { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { VARIANTS, SIZES } from "@/lib/constants";
import { ShoppingCart, Minus, Plus, Check, Leaf, Shield, Star, Sparkles } from "lucide-react";

interface ProductDetailModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState(product.variant || "natural");
  const [selectedSize, setSelectedSize] = useState(product.size || "50ml");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Map variant values to their background classes and emojis
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "rose":
        return { bg: "bg-rose-light", emoji: "🌸", accent: "text-rose-dark", glow: "rgba(212, 153, 138, 0.2)" };
      case "natural":
        return { bg: "bg-sage-light", emoji: "🌿", accent: "text-sage-dark", glow: "rgba(143, 175, 143, 0.2)" };
      case "charcoal":
        return { bg: "bg-parchment", emoji: "🫙", accent: "text-charcoal", glow: "rgba(44, 44, 44, 0.1)" };
      default:
        return { bg: "bg-cream", emoji: "✨", accent: "text-sage-dark", glow: "rgba(248, 244, 237, 0.5)" };
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
    setAdded(true);
    toast({ 
      title: "Added to cart ✓", 
      description: `${product.name} × ${qty}`,
    });
    setTimeout(() => setAdded(false), 2000);
  }

  const ingredients = product.ingredients?.length ? product.ingredients : ["Potassium Alum", "Aloe Vera", "Turmeric", "Essential Oils"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] md:max-w-3xl p-0 overflow-hidden bg-white border-parchment rounded-[2rem] shadow-2xl max-h-[92vh] flex flex-col">
        <div className="grid md:grid-cols-2 overflow-y-auto custom-scrollbar flex-1">
          {/* Visual Area */}
          <div
            className={`relative flex items-center justify-center min-h-[300px] md:min-h-full p-8 md:p-12 transition-colors duration-700 ${styles.bg}`}
          >
            {/* Background floating particles or sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Sparkles className="absolute top-10 left-10 w-4 h-4 text-white opacity-40 animate-pulse" />
              <Sparkles className="absolute bottom-12 right-12 w-6 h-6 text-white opacity-30 animate-pulse" style={{ animationDelay: "1s" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/30 rounded-full blur-[60px] animate-blob" />
            </div>

            <div className="relative z-10 text-[7rem] md:text-[11rem] drop-shadow-[0_25px_45px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-105 select-none">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-48 h-48 md:w-56 md:h-56 object-contain" />
              ) : (
                styles.emoji
              )}
            </div>
          </div>

          {/* Details Area */}
          <div className="p-6 md:p-10 flex flex-col bg-white">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[0.68rem] font-medium tracking-[0.15em] uppercase text-sage-dark bg-sage-light/20 px-3 py-1 rounded-full border border-sage-light/30">
                  {selectedVariant} Edition
                </span>
                {product.badge && (
                  <span className="text-[0.68rem] font-medium tracking-[0.15em] uppercase text-rose bg-rose-light/20 px-3 py-1 rounded-full border border-rose-light/30">
                    {product.badge}
                  </span>
                )}
              </div>
              <DialogTitle className="font-serif text-[1.8rem] md:text-[2.2rem] text-charcoal leading-tight mb-3">
                {product.name}
              </DialogTitle>
              <p className="text-[0.88rem] text-warm leading-relaxed">
                {product.description || "Premium natural alum deodorant. 100% chemical-free formula crafted for skin that deserves only nature's finest protection."}
              </p>
            </DialogHeader>

            <div className="space-y-8 flex-1">
              {/* Variant selector */}
              <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
                <p className="text-[0.65rem] text-warm mb-3 font-medium uppercase tracking-[0.1em]">Select Edition</p>
                <div className="flex flex-wrap gap-2.5">
                  {VARIANTS.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => setSelectedVariant(v.value as any)}
                      className={`px-4 py-2 rounded-full text-[0.72rem] font-medium border transition-all duration-300 ${
                        selectedVariant === v.value
                          ? "bg-charcoal text-white border-charcoal shadow-sm"
                          : "bg-cream/50 text-warm border-parchment hover:border-sage-light hover:text-charcoal"
                      }`}
                    >
                      {v.emoji} {v.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
                <p className="text-[0.65rem] text-warm mb-3 font-medium uppercase tracking-[0.1em]">Size</p>
                <div className="flex gap-2.5">
                  {SIZES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedSize(s.value as any)}
                      className={`px-5 py-2 rounded-full text-[0.72rem] font-medium border transition-all duration-300 ${
                        selectedSize === s.value
                          ? "bg-charcoal text-white border-charcoal"
                          : "bg-cream/50 text-warm border-parchment hover:border-sage-light hover:text-charcoal"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients */}
              <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
                <p className="text-[0.65rem] text-warm mb-3 font-medium uppercase tracking-[0.1em]">Active Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {ingredients.slice(0, 4).map((ing) => (
                    <span key={ing} className="px-3 py-1 text-[0.7rem] bg-cream border border-parchment rounded-full text-charcoal">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Qty and Price */}
              <div className="flex items-center justify-between pt-4 border-t border-parchment animate-fade-up" style={{ animationDelay: "0.25s" }}>
                <div className="flex items-center bg-cream/50 border border-parchment rounded-full px-2 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-warm hover:text-charcoal transition-colors hover:bg-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-serif text-[1.1rem] text-charcoal">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-warm hover:text-charcoal transition-colors hover:bg-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-right leading-none">
                  <div className="font-serif text-[1.8rem] text-charcoal">
                    <sub className="font-sans text-[0.8rem] align-super mr-0.5">₹</sub>
                    {product.price * qty}
                  </div>
                  {product.original_price && (
                    <div className="font-sans text-[0.78rem] text-warm line-through opacity-50 italic">
                      ₹{product.original_price * qty}
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 flex flex-col gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Button
                  size="lg"
                  onClick={handleAdd}
                  className="w-full bg-charcoal text-white hover:bg-charcoal/90 rounded-full py-7 text-[0.95rem] font-medium tracking-wide shadow-[0_4px_18px_rgba(44,44,44,0.15)] hover:shadow-[0_8px_25px_rgba(44,44,44,0.25)] transition-all active:scale-[0.98] group"
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-3 group-hover:translate-x-0.5 transition-transform" />
                      Secure Addition &nbsp;→
                    </>
                  )}
                </Button>

                {/* Trust indications */}
                <div className="flex items-center justify-between px-2 text-[0.65rem] text-warm uppercase tracking-[0.05em] font-medium">
                  <div className="flex items-center gap-1.5"><Leaf className="w-3 h-3 text-sage" /> Organic Formula</div>
                  <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-sage" /> 100% Non-Toxic</div>
                  <div className="flex items-center gap-1.5"><Star className="w-3 h-3 text-sage" /> Rated 4.9+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
