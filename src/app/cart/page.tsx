"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { DISCOUNT_CODES, FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from "@/lib/constants";
import { Minus, Plus, X, ShoppingCart, Tag, Check, ArrowLeft, Truck } from "lucide-react";
import { AddressDialog } from "@/components/address-dialog";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, updateQty, removeItem, getTotal, getItemCount, clearCart } = useCart();
  const { toast } = useToast();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const subtotal = getTotal();
  const discountAmount = (subtotal * discountPct) / 100;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = afterDiscount + shipping;

  function applyCode() {
    const code = discountCode.trim().toUpperCase();
    if (DISCOUNT_CODES[code]) {
      setAppliedCode(code);
      setDiscountPct(DISCOUNT_CODES[code]);
      toast({ title: `Code ${code} applied! 🎉`, description: `${DISCOUNT_CODES[code]}% off applied to your order.`, variant: "success" as any });
    } else {
      toast({ title: "Invalid code", description: "Please check your discount code and try again." });
    }
  }

  if (getItemCount() === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="font-syne font-black text-3xl text-text-primary mb-3">Your cart is empty</h1>
          <p className="text-text-muted mb-8">Looks like you haven&apos;t added anything yet. Explore our natural deodorant collection.</p>
          <Button variant="teal" size="lg" asChild>
            <Link href="/category/roll-on">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-teal transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <h1 className="font-syne font-black text-3xl sm:text-4xl text-text-primary mb-8">
            Your <span className="gradient-text">Cart</span>
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variant}-${item.size}`} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl bg-white/5 shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain" />
                    ) : (
                      item.variant === "rose" ? "🌹" : item.variant === "charcoal" ? "🖤" : "🌿"
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-syne font-bold text-sm text-text-primary truncate">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {item.variant && (
                        <Badge variant={item.variant === "rose" ? "magenta" : item.variant === "charcoal" ? "purple" : "teal"} className="text-xs py-0">
                          {item.variant}
                        </Badge>
                      )}
                      {item.size && <span className="text-xs text-text-muted">{item.size}</span>}
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-text-muted hover:text-teal hover:border-teal/40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-text-primary font-medium w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-text-muted hover:text-teal hover:border-teal/40 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0">
                    <div className="text-text-primary font-bold">{formatPrice(item.price * item.quantity)}</div>
                    {item.quantity > 1 && (
                      <div className="text-xs text-text-muted">{formatPrice(item.price)} ea.</div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:text-red-400 transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-syne font-bold text-lg text-text-primary mb-4">Order Summary</h2>

                <div className="space-y-2 text-sm mb-4">
                  {items.map((item) => (
                    <div key={`s-${item.productId}-${item.variant}`} className="flex justify-between">
                      <span className="text-text-muted truncate max-w-[180px]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-text-primary shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/8 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="text-text-primary">{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-teal flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> {appliedCode} ({discountPct}%)
                      </span>
                      <span className="text-teal">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-muted flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Shipping
                    </span>
                    <span className={shipping === 0 ? "text-teal" : "text-text-primary"}>
                      {shipping === 0 ? "FREE 🎉" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-text-muted">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - afterDiscount)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-white/8 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-syne font-bold text-text-primary">Total</span>
                    <span className="font-syne font-black text-2xl gradient-text">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Discount code */}
                <div className="mt-4">
                  {appliedCode ? (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-teal/10 border border-teal/20">
                      <Check className="w-4 h-4 text-teal" />
                      <span className="text-teal text-sm font-medium">{appliedCode} applied!</span>
                      <button
                        onClick={() => { setAppliedCode(null); setDiscountPct(0); setDiscountCode(""); }}
                        className="ml-auto text-text-muted hover:text-red-400 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Discount code"
                        className="flex-1 h-10 px-3 rounded-xl border border-white/10 bg-white/5 text-sm text-text-primary placeholder:text-text-muted focus:border-teal focus:outline-none"
                        onKeyDown={(e) => e.key === "Enter" && applyCode()}
                      />
                      <Button variant="ghost" size="sm" onClick={applyCode}>Apply</Button>
                    </div>
                  )}
                </div>

                <Button
                  variant="teal"
                  size="lg"
                  className="w-full mt-6"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Trust badges */}
              <div className="glass-card rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-center text-xs text-text-muted">
                  {["🔒 Secure Checkout","🚚 Free Delivery","🔄 Easy Returns","✅ Derma Tested"].map(t => (
                    <div key={t}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={items}
        subtotal={subtotal}
        discount={discountAmount}
        discountCode={appliedCode}
        shipping={shipping}
        total={total}
        onSuccess={() => { clearCart(); setCheckoutOpen(false); }}
      />
    </>
  );
}
