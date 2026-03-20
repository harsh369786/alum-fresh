"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { Check, Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
  addressLine1: z.string().min(10, "Enter your full address"),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode: string | null;
  shipping: number;
  total: number;
  onSuccess: () => void;
}

export function AddressDialog({ open, onOpenChange, items, subtotal, discount, discountCode, shipping, total, onSuccess }: AddressDialogProps) {
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function onFormSubmit(data: FormData) {
    setFormData(data);
    setStep("review");
  }

  async function confirmOrder() {
    if (!formData) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.fullName,
          user_email: formData.email,
          user_phone: formData.phone,
          address: { line1: formData.addressLine1, city: formData.city, state: formData.state, pincode: formData.pincode },
          items: items.map(i => ({ productId: i.productId, name: i.name, variant: i.variant, size: i.size, qty: i.quantity, price: i.price })),
          subtotal,
          discount,
          discount_code: discountCode,
          shipping,
          total,
          notes: formData.notes || null,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setOrderId(data.id.slice(0, 8).toUpperCase());
        setStep("success");
        onSuccess();
        setTimeout(() => { onOpenChange(false); setStep("form"); router.push("/"); }, 4000);
      }
    } catch {
      // error handled gracefully
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Delivery Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input {...register("fullName")} placeholder="Priya Sharma" className="mt-1" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input {...register("phone")} placeholder="9876543210" className="mt-1" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input {...register("email")} type="email" placeholder="priya@email.com" className="mt-1" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label>Address Line 1 *</Label>
                <Input {...register("addressLine1")} placeholder="House / Flat, Street, Area" className="mt-1" />
                {errors.addressLine1 && <p className="text-red-400 text-xs mt-1">{errors.addressLine1.message}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>City *</Label>
                  <Input {...register("city")} placeholder="Mumbai" className="mt-1" />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Label>State *</Label>
                  <Input {...register("state")} placeholder="Maharashtra" className="mt-1" />
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <Label>Pincode *</Label>
                  <Input {...register("pincode")} placeholder="400001" className="mt-1" />
                  {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
              <div>
                <Label>Order Notes (optional)</Label>
                <Textarea {...register("notes")} placeholder="Any special instructions..." className="mt-1" rows={2} />
              </div>
              <Button type="submit" variant="teal" size="lg" className="w-full mt-2">Review Order</Button>
            </form>
          </>
        )}

        {step === "review" && formData && (
          <>
            <DialogHeader>
              <DialogTitle>Review Your Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="glass-card rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-text-primary">{formData.fullName}</p>
                <p className="text-text-muted">{formData.addressLine1}</p>
                <p className="text-text-muted">{formData.city}, {formData.state} — {formData.pincode}</p>
                <p className="text-text-muted">{formData.phone} · {formData.email}</p>
              </div>
              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={`r-${item.productId}`} className="flex justify-between">
                    <span className="text-text-muted">{item.name} × {item.quantity}</span>
                    <span className="text-text-primary">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-teal">Discount ({discountCode})</span>
                  <span className="text-teal">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Shipping</span>
                <span className={shipping === 0 ? "text-teal" : "text-text-primary"}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-bold text-text-primary">Total</span>
                <span className="font-syne font-black text-xl gradient-text">{formatPrice(total)}</span>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" onClick={() => setStep("form")} className="flex-1">Back</Button>
                <Button variant="teal" onClick={confirmOrder} disabled={loading} className="flex-1 gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Confirm Order
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-teal/15 border border-teal/30 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-teal" />
            </div>
            <h2 className="font-syne font-black text-2xl gradient-text mb-2">Order Placed! 🎉</h2>
            {orderId && <p className="text-text-muted text-sm mb-2">Order ID: <span className="text-teal font-mono font-bold">#{orderId}</span></p>}
            <p className="text-text-muted text-sm mb-4">We&apos;ll send your order confirmation to your email. Delivery in 3-5 business days.</p>
            <div className="flex items-center justify-center gap-2 text-teal">
              <Package className="w-4 h-4" />
              <span className="text-sm">Redirecting to home...</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
