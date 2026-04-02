"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from "@/lib/constants";
import { Minus, Plus, X, ShoppingCart, Tag, Check, ArrowLeft, Truck, ShieldCheck, Ticket } from "lucide-react";
import { AddressDialog } from "@/components/address-dialog";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { items, updateQty, removeItem, getTotal, getItemCount, clearCart } = useCart();
  const { toast } = useToast();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPct, setDiscountPct] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [validCodes, setValidCodes] = useState<Record<string, number>>({});
  const [shippingRules, setShippingRules] = useState({ free_shipping_threshold: 499, shipping_charge: 49 });

  React.useEffect(() => {
    fetch("/api/discounts")
      .then(res => res.json())
      .then(data => setValidCodes(data || {}))
      .catch(console.error);

    fetch("/api/settings")
      .then(res => res.json())
      .then(data => setShippingRules(data))
      .catch(console.error);
  }, []);

  const subtotal = getTotal();
  const discountAmount = (subtotal * discountPct) / 100;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount >= shippingRules.free_shipping_threshold ? 0 : shippingRules.shipping_charge;
  const total = afterDiscount + shipping;

  function applyCode() {
    const code = discountCode.trim().toUpperCase();
    if (code && validCodes[code]) {
      setAppliedCode(code);
      setDiscountPct(validCodes[code]);
      toast({ title: `Code ${code} applied! 🎉`, description: `${validCodes[code]}% discount active.` });
    } else {
      toast({ title: "Invalid code", description: "Please verify your code and try again." });
    }
  }

  if (getItemCount() === 0) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-cream/30">
        <div className="max-w-7xl mx-auto px-6 text-center animate-fade-up">
          <div className="text-8xl mb-8 select-none">🛒</div>
          <h1 className="font-serif italic text-4xl text-charcoal mb-4">Your Basket is Breathable</h1>
          <p className="text-warm max-w-sm mx-auto mb-10 leading-relaxed text-[0.9rem]">It looks like you haven&apos;t added any natural freshness yet. Start exploring our collection for your perfect match.</p>
          <Button size="lg" asChild className="px-12 py-7 h-auto">
            <Link href="/category/roll-on">Explore Collection &nbsp;→</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 bg-cream/30">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-warm hover:text-charcoal transition-all text-[0.7rem] uppercase tracking-widest mb-12 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
          Keep Discovering
        </Link>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Area */}
          <div className="flex-1 space-y-12">
            <div className="animate-fade-up">
              <span className="eyebrow">Checkout Process</span>
              <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-light text-charcoal leading-tight flex items-baseline gap-4">
                Your Selection <em className="text-sage-dark text-[0.8em]">{getItemCount()} Items</em>
              </h1>
            </div>

            {/* Cart Items */}
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              {items.map((item, i) => (
                <div 
                  key={`${item.productId}-${item.variant}-${item.size}`} 
                  className="flex flex-col sm:flex-row sm:items-center gap-6 pb-6 border-b border-parchment group last:border-0"
                >
                  {/* Image */}
                  <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-5xl transition-all duration-500 overflow-hidden ${
                    item.variant === 'rose' ? 'bg-rose-light' : 
                    item.variant === 'charcoal' ? 'bg-parchment' : 
                    'bg-sage-light'
                  } group-hover:scale-105`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.variant === "rose" ? "🌸" : item.variant === "charcoal" ? "🫙" : "🌿"
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.65rem] font-medium tracking-widest uppercase text-sage-dark mb-1">
                      {item.variant} Edition
                    </div>
                    <h3 className="font-serif text-[1.25rem] text-charcoal mb-1 truncate">{item.name}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.72rem] text-warm bg-cream px-2 py-0.5 rounded border border-parchment uppercase tracking-tighter shadow-sm">{item.size}</span>
                      <span className="text-[0.72rem] text-warm">In Stock</span>
                    </div>
                  </div>

                  {/* Qty & Price row for mobile/desktop harmony */}
                  <div className="flex items-center justify-between sm:justify-start gap-8 mt-2 sm:mt-0">
                    <div className="flex items-center bg-white border border-parchment rounded-full p-1 shadow-sm">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-warm hover:text-charcoal hover:bg-cream transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-serif text-[1rem] w-8 text-center text-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-warm hover:text-charcoal hover:bg-cream transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <div className="font-serif text-[1.3rem] text-charcoal">{formatPrice(item.price * item.quantity)}</div>
                      {item.quantity > 1 && (
                        <div className="text-[0.65rem] text-warm opacity-70 leading-none">@ {formatPrice(item.price)} ea.</div>
                      )}
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-warm hover:text-rose-dark hover:bg-rose-light/20 transition-all ml-2"
                      title="Remove Item"
                    >
                      <X className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:w-[420px] shrink-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="sticky top-32 space-y-8">
              <div className="bg-white border border-parchment rounded-[2.5rem] p-8 md:p-10 shadow-[0_12px_45px_rgba(44,44,44,0.04)]">
                <h2 className="font-serif italic text-2xl text-charcoal mb-8 border-b border-parchment pb-4">Order Summary</h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[0.82rem] text-warm font-medium uppercase tracking-tighter">Subtotal</span>
                    <span className="font-serif text-[1.3rem] text-charcoal">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-baseline text-sage-dark">
                      <span className="text-[0.82rem] font-medium uppercase tracking-tighter flex items-center gap-1.5 focus-within:">
                        <Ticket className="w-3.5 h-3.5" /> Code: {appliedCode}
                      </span>
                      <span className="font-serif text-[1.2rem] opacity-90">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline">
                    <span className="text-[0.82rem] text-warm font-medium uppercase tracking-tighter flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-sage" /> Shipping
                    </span>
                    <span className={`font-serif text-[1.1rem] ${shipping === 0 ? "text-sage-dark" : "text-charcoal"}`}>
                      {shipping === 0 ? "Complimentary" : formatPrice(shipping)}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-sage-light/10 border border-sage-light/20 p-4 rounded-2xl flex items-center justify-between gap-4">
                      <p className="text-[0.7rem] text-warm leading-tight">Add {formatPrice(shippingRules.free_shipping_threshold - afterDiscount)} more to unlock complimentary shipping.</p>
                      <Link href="/category/roll-on" className="text-[0.65rem] font-black uppercase text-sage-dark hover:underline underline-offset-4 whitespace-nowrap">Explore</Link>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-dashed border-parchment pt-6 mb-10">
                  <div className="flex justify-between items-end">
                    <span className="font-serif italic text-xl text-charcoal">Total Amount</span>
                    <div className="text-right">
                      <span className="block text-[clamp(1.8rem,5vw,2.2rem)] font-serif text-charcoal leading-none">
                        <sub className="text-[0.4em] align-top mr-1 top-[-0.6em] font-sans">₹</sub>
                        {total}
                      </span>
                      <span className="text-[0.65rem] text-warm uppercase tracking-widest opacity-60">incl. all taxes</span>
                    </div>
                  </div>
                </div>

                {/* Voucher code UI */}
                {!appliedCode ? (
                  <div className="flex gap-2 mb-8 bg-cream/30 p-1.5 rounded-full border border-parchment group focus-within:border-charcoal transition-all">
                    <input
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      placeholder="ENTER VOUCHER"
                      className="flex-1 h-10 px-4 bg-transparent text-[0.72rem] font-bold tracking-[0.08em] uppercase text-charcoal placeholder:text-warm/40 placeholder:font-medium outline-none"
                      onKeyDown={(e) => e.key === "Enter" && applyCode()}
                    />
                    <button 
                      onClick={applyCode}
                      className="px-6 rounded-full bg-charcoal text-white text-[0.68rem] font-medium uppercase tracking-widest hover:bg-sage-dark transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="mb-8 flex items-center gap-3 p-5 bg-white border border-sage-light/30 rounded-2xl shadow-sm animate-fade-up">
                    <div className="w-10 h-10 rounded-full bg-sage-light/20 flex items-center justify-center shrink-0">
                      <Tag className="w-5 h-5 text-sage-dark" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.65rem] font-bold text-warm/60 tracking-widest uppercase mb-0.5">Voucher Applied</p>
                      <p className="font-serif text-[1.1rem] text-charcoal font-bold">{appliedCode}</p>
                    </div>
                    <button 
                      onClick={() => { 
                        setAppliedCode(null); 
                        setDiscountPct(0); 
                        setDiscountCode(""); 
                        toast({ title: "Voucher Removed", description: "Discount has been cleared from your total." });
                      }}
                      className="p-2.5 rounded-full hover:bg-rose-light/20 text-warm hover:text-rose-dark transition-all group"
                      title="Remove Voucher"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full py-8 text-[1.1rem] shadow-[0_12px_35px_rgba(44,44,44,0.2)] hover:shadow-[0_15px_45px_rgba(44,44,44,0.3)] group"
                  onClick={() => setCheckoutOpen(true)}
                >
                  Confirm Selection &nbsp;→
                </Button>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-warm opacity-60">
                  <ShieldCheck className="w-3.5 h-3.5 text-sage" />
                  <span className="text-[0.68rem] uppercase tracking-widest font-medium">Encrypted Checkout</span>
                </div>
              </div>

              {/* Secure payment logos placeholder logic - just text for purity */}
              <div className="text-center">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-warm mb-1 opacity-50 font-medium italic">Honouring traditional craftsmanship</p>
                <div className="flex items-center justify-center gap-4 text-[0.65rem] text-warm font-serif italic">
                  <span>Chemical-Free</span>
                  <span className="w-1 h-1 rounded-full bg-parchment" />
                  <span>Dermatologist Approved</span>
                  <span className="w-1 h-1 rounded-full bg-parchment" />
                  <span>Ancient Alum Wisdom</span>
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
    </main>
  );
}
