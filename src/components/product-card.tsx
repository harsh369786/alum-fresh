"use client";
import React, { useState } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { VARIANT_GLOW_COLORS } from "@/lib/constants";
import { ShoppingCart, Eye } from "lucide-react";
import { ProductDetailModal } from "@/components/product-detail-modal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const glowColor = product.variant
    ? VARIANT_GLOW_COLORS[product.variant] || "rgba(0,212,200,0.25)"
    : "rgba(0,212,200,0.25)";

  const badgeVariant =
    product.badge_color === "magenta"
      ? "magenta"
      : product.badge_color === "purple"
      ? "purple"
      : "teal";

  const variantEmojis: Record<string, string> = {
    rose: "🌹",
    natural: "🌿",
    charcoal: "🖤",
  };

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
    toast({ title: "Added to cart ✓", description: product.name, variant: "success" as any });
  }

  return (
    <>
      <div
        className="group relative rounded-2xl bg-surface border border-white/8 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
        style={{ "--glow": glowColor } as React.CSSProperties}
        onClick={() => setModalOpen(true)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${glowColor}, 0 12px 40px rgba(0,0,0,0.4)`;
          (e.currentTarget as HTMLDivElement).style.borderColor = glowColor.replace("0.25", "0.45");
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
          (e.currentTarget as HTMLDivElement).style.borderColor = "";
        }}
      >
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={badgeVariant as any}>{product.badge}</Badge>
          </div>
        )}

        {/* Quick view button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-text-muted hover:text-teal transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image */}
        <div
          className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(circle at center, ${glowColor.replace("0.25", "0.12")} 0%, transparent 70%)`,
          }}
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-36 h-36 object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="text-6xl transition-transform duration-500 group-hover:scale-110">
              {product.variant ? variantEmojis[product.variant] : "✨"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="mb-1 flex items-center gap-2">
            {product.variant && (
              <span className="text-xs text-text-muted capitalize">{product.variant} Edition</span>
            )}
            {product.size && (
              <span className="text-xs bg-white/8 text-text-muted px-2 py-0.5 rounded-full">
                {product.size}
              </span>
            )}
          </div>
          <h3 className="font-syne font-bold text-base text-text-primary mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.short_desc && (
            <p className="text-xs text-text-muted mb-3 line-clamp-2 leading-relaxed">
              {product.short_desc}
            </p>
          )}

          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-lg font-bold text-text-primary">{formatPrice(product.price)}</span>
              {product.original_price && (
                <span className="text-xs text-text-muted line-through ml-2">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
            <Button
              variant={product.variant === "rose" ? "magenta" : product.variant === "charcoal" ? "purple" : "teal"}
              size="sm"
              onClick={handleAddToCart}
              className="gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
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
