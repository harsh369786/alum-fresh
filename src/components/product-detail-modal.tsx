"use client";
import React, { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { VARIANT_GLOW_COLORS, VARIANTS, SIZES } from "@/lib/constants";
import { ShoppingCart, Minus, Plus, Check, Leaf, Shield, Star } from "lucide-react";

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

  const glowColor = VARIANT_GLOW_COLORS[selectedVariant] || "rgba(0,212,200,0.25)";

  const variantEmojis: Record<string, string> = { rose: "🌹", natural: "🌿", charcoal: "🖤" };

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
    toast({ title: "Added to cart ✓", description: `${product.name} × ${qty}`, variant: "success" as any });
    setTimeout(() => setAdded(false), 2000);
  }

  const tags = product.ingredients?.length ? product.ingredients : ["Alum Crystal", "Aloe Vera", "Turmeric", "Rose Water"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-surface border-white/10">
        <div className="grid md:grid-cols-2">
          {/* Visual */}
          <div
            className="relative flex items-center justify-center min-h-[260px] p-8"
            style={{ background: `radial-gradient(circle at center, ${glowColor.replace("0.3","0.15")} 0%, transparent 70%)` }}
          >
            <div className="text-8xl animate-float">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-40 h-40 object-contain" />
              ) : (
                variantEmojis[selectedVariant] || "✨"
              )}
            </div>
            {/* Rotating rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-48 h-48 rounded-full border animate-spin-slow opacity-20"
                style={{ borderColor: glowColor.replace("0.3", "0.6") }}
              />
              <div
                className="absolute w-60 h-60 rounded-full border animate-spin-slower opacity-10"
                style={{ borderColor: glowColor.replace("0.3", "0.4") }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col gap-4">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {product.badge && (
                  <Badge variant={product.badge_color === "magenta" ? "magenta" : product.badge_color === "purple" ? "purple" : "teal"}>
                    {product.badge}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{product.name}</DialogTitle>
              <p className="text-text-muted text-sm mt-1">
                {product.short_desc || "Premium natural alum deodorant. Chemical-free, vegan, and dermatologist tested."}
              </p>
            </DialogHeader>

            {/* Variant selector */}
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Variant</p>
              <div className="flex gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v.value}
                    onClick={() => setSelectedVariant(v.value as any)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedVariant === v.value
                        ? "border-teal text-teal bg-teal/10"
                        : "border-white/15 text-text-muted hover:border-white/30"
                    }`}
                  >
                    {v.emoji} {v.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wide">Size</p>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedSize(s.value as any)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedSize === s.value
                        ? "border-teal text-teal bg-teal/10"
                        : "border-white/15 text-text-muted hover:border-white/30"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-teal/40 text-text-muted hover:text-teal transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-text-primary font-medium w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center hover:border-teal/40 text-text-muted hover:text-teal transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div>
                <span className="text-xl font-bold gradient-text-teal">{formatPrice(product.price * qty)}</span>
                {product.original_price && (
                  <span className="text-xs text-text-muted line-through ml-2">{formatPrice(product.original_price * qty)}</span>
                )}
              </div>
            </div>

            {/* Ingredient pills */}
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-muted">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Button
              variant={selectedVariant === "rose" ? "magenta" : selectedVariant === "charcoal" ? "purple" : "teal"}
              size="lg"
              onClick={handleAdd}
              className="w-full mt-auto gap-2"
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              {added ? "Added!" : "Add to Cart"}
            </Button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><Leaf className="w-3 h-3 text-teal" /> Vegan</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-purple-light" /> Derma Tested</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-magenta" /> 4.9★</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
