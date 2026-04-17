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
import { Check, Loader2, Package, Truck, ArrowLeft, ShieldCheck, MapPin, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address"),
  addressLine1: z.string().min(10, "Enter your full address (flat/house no, street, area)"),
  city: z.string().min(2, "Enter city"),
  state: z.string().min(2, "Enter state"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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
  const [step, setStep] = useState<"form" | "review" | "processing" | "success">("form");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ 
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      city: "",
      state: "",
      pincode: "",
      notes: "",
    }
  });

  function onFormSubmit(data: FormData) {
    setFormData(data);
    setStep("review");
  }

  async function confirmOrder() {
    if (!formData) return;
    setLoading(true);
    setOrderError(null);

    try {
      // 0. Handle 100% discount / Free orders
      if (total === 0) {
        await createInternalOrder("FREE_ORDER_VOUCHER_" + (discountCode || "NOMINAL"));
        return;
      }

      // 1. Create Razorpay order
      const rpRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const rpData = await rpRes.json();

      if (!rpData.id) {
        throw new Error(rpData.error || "Failed to initiate payment");
      }

      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 3. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rpData.amount,
        currency: rpData.currency,
        name: "The Aura Company",
        description: "Purchase of Natural Essentials",
        order_id: rpData.id,
        handler: async function (response: any) {
          try {
            setStep("processing");
            // 4. Verify Payment Signature
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              await createInternalOrder(response.razorpay_payment_id);
            } else {
              setOrderError("Payment verification failed.");
              toast({ title: "Payment Failed", description: "Verification check failed.", variant: "error" });
              setLoading(false);
            }
          } catch (e) {
            setOrderError("Error verifying payment.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#2c2c2c",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        setOrderError(response.error.description || "Payment failed");
        toast({ title: "Payment Failed", description: response.error.description, variant: "error" });
        setLoading(false);
      });
      paymentObject.open();
    } catch (e: any) {
      setOrderError(e.message || "Network error. Please check your connection.");
      setLoading(false);
      toast({ title: "Error", description: e.message || "Something went wrong", variant: "error" });
    }
  }

  async function createInternalOrder(paymentId: string) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData!.fullName,
          user_email: formData!.email,
          user_phone: formData!.phone,
          address: { line1: formData!.addressLine1, city: formData!.city, state: formData!.state, pincode: formData!.pincode },
          items: items.map(i => ({ productId: i.productId, name: i.name, variant: i.variant, size: i.size, qty: i.quantity, price: i.price })),
          subtotal,
          discount,
          discount_code: discountCode,
          shipping,
          total,
          notes: (formData!.notes ? formData!.notes + "\n" : "") + `[Razorpay Payment ID: ${paymentId}]`,
        }),
      });
      const data = await res.json();
      if (data.id) {
        const displayId = String(data.id); // YYMMDDSRNO format e.g. 2604110001
        setOrderId(displayId); // set BEFORE redirect so success step shows correct ID
        onSuccess(); // clears cart
        onOpenChange(false); // close the dialog
        toast({ title: "Order Confirmed! 🌿", description: `Your order #${displayId} is confirmed.` });
        router.push(`/order-success?id=${displayId}`);
      } else {
        const errMsg = data.error || "Something went wrong saving the internal order.";
        setOrderError(errMsg);
        toast({ title: "Order Logging Failed", description: errMsg, variant: "error" });
      }
    } catch (e: any) {
      setOrderError("Network error while creating internal order.");
      toast({ title: "Connection Error", description: "Internal order creation error.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* On mobile the base Dialog already slides up as a bottom sheet */}
      <DialogContent className="p-0 bg-white border-parchment md:max-w-2xl md:rounded-[2.5rem] md:max-h-[92vh] md:flex md:flex-col">
        <div className="flex flex-col md:grid md:grid-cols-5 md:flex-1 md:min-h-0 md:overflow-hidden">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:flex md:col-span-2 bg-cream/50 p-10 flex-col border-r border-parchment overflow-y-auto">
            <div className="mb-12">
              <span className="eyebrow block mb-4">Final Step</span>
              <h2 className="font-serif italic text-3xl text-charcoal leading-tight">Securing your <em className="text-sage-dark">natural choice.</em></h2>
            </div>
            
            <div className="space-y-6 flex-1">
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[0.8rem] font-bold border-2 transition-all ${step === 'form' ? 'bg-charcoal text-white border-charcoal' : 'bg-sage-dark text-white border-sage-dark'}`}>
                  {step === 'form' ? '01' : <Check className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-charcoal">Delivery Details</p>
                  <p className="text-[0.65rem] text-warm mt-0.5">Where shall we send your order?</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[0.8rem] font-bold border-2 transition-all ${step === 'review' ? 'bg-charcoal text-white border-charcoal' : step === 'success' ? 'bg-sage-dark text-white border-sage-dark' : 'bg-white text-warm border-parchment'}`}>
                  02
                </div>
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-widest text-charcoal">Order Review</p>
                  <p className="text-[0.65rem] text-warm mt-0.5">Quick verify before we ship.</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-parchment/60">
              <div className="flex items-center gap-2 text-sage-dark mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[0.65rem] font-bold uppercase tracking-wider">Trusted Protection</span>
              </div>
              <p className="text-[0.6rem] text-warm leading-snug">Suitable for all skin types and ethically sourced alum crystal products.</p>
            </div>
          </div>

          {/* Main Content Area — scrollable on both mobile and desktop */}
          <div className="md:col-span-3 p-5 md:p-10 flex flex-col bg-white overflow-y-auto">
            {step === "form" && (
              <div className="animate-fade-up">
                <DialogHeader className="mb-8">
                  <DialogTitle className="font-serif text-2xl text-charcoal">Where should we deliver?</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4">Full Name</Label>
                      <Input {...register("fullName")} placeholder="Ayesha Kapoor" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                      {errors.fullName && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.fullName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4">Mobile Number</Label>
                      <Input {...register("phone")} placeholder="+91 98765 43210" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                      {errors.phone && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4">Email Address</Label>
                    <Input {...register("email")} type="email" placeholder="ayesha@example.com" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                    {errors.email && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4">Complete Address</Label>
                    <Input {...register("addressLine1")} placeholder="Flat, Street, Area" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                    {errors.addressLine1 && <p className="text-rose text-[0.65rem] mt-1 ml-4 font-medium">{errors.addressLine1.message}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-2">City</Label>
                      <Input {...register("city")} placeholder="Mumbai" className="rounded-full bg-cream/20 border-parchment px-4 h-11 text-[0.85rem] focus-visible:ring-charcoal text-center" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-2">State</Label>
                      <Input {...register("state")} placeholder="Raj" className="rounded-full bg-cream/20 border-parchment px-4 h-11 text-[0.85rem] focus-visible:ring-charcoal text-center" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-2">Pincode</Label>
                      <Input {...register("pincode")} placeholder="302001" className="rounded-full bg-cream/20 border-parchment px-4 h-11 text-[0.85rem] focus-visible:ring-charcoal text-center" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4">Delivery Notes (Optional)</Label>
                    <Textarea {...register("notes")} placeholder="Special instructions for the runner..." className="rounded-[1.5rem] bg-cream/20 border-parchment px-6 py-4 text-[0.85rem] focus-visible:ring-charcoal resize-none" rows={2} />
                  </div>
                  
                  <div className="pt-4">
                    <Button type="submit" className="w-full py-7 text-[1rem] shadow-lg group">
                      Review Your Selection &nbsp;→
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === "review" && formData && (
              <div className="animate-fade-up">
                <DialogHeader className="mb-8">
                  <DialogTitle className="font-serif text-2xl text-charcoal">Order Verification</DialogTitle>
                </DialogHeader>
                <div className="space-y-8">
                  <div className="bg-cream/40 border border-parchment/60 rounded-[1.5rem] p-6 space-y-3 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-12 group-hover:rotate-0 transition-transform">
                      <MapPin className="w-24 h-24 text-charcoal" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                       <p className="text-[0.65rem] font-black uppercase tracking-widest text-sage-dark">Ship to Address</p>
                    </div>
                    <p className="font-serif text-[1.2rem] text-charcoal leading-none mb-1">{formData.fullName}</p>
                    <p className="text-[0.82rem] text-warm leading-snug">{formData.addressLine1}</p>
                    <p className="text-[0.82rem] text-warm font-medium uppercase tracking-[0.05em]">{formData.city}, {formData.state} — {formData.pincode}</p>
                    <p className="text-[0.72rem] text-charcoal font-bold mt-2 pt-2 border-t border-parchment/30">{formData.phone} <span className="mx-2 opacity-20">|</span> {formData.email}</p>
                  </div>

                  <div className="space-y-3 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                    {items.map(item => (
                      <div key={`r-${item.productId}`} className="flex justify-between items-center text-[0.82rem]">
                        <span className="text-warm italic">{item.name} <em className="text-[0.9em] opacity-60">× {item.quantity}</em></span>
                        <span className="font-bold text-[1rem] text-charcoal">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-parchment border-dashed space-y-3 font-medium text-[0.8rem]">
                    <div className="flex justify-between">
                      <span className="text-warm uppercase tracking-widest opacity-60">Subtotal</span>
                      <span className="text-charcoal">{formatPrice(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sage-dark">
                        <span className="uppercase tracking-widest">Promotion ({discountCode})</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-warm uppercase tracking-widest opacity-60 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                      <span className={shipping === 0 ? "text-sage-dark" : "text-charcoal"}>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
                    </div>
                    <div className="pt-4 flex justify-between items-end">
                      <span className="font-serif italic text-xl text-charcoal">Final Amount</span>
                      <span className="font-bold text-2xl text-charcoal">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {orderError && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-[0.75rem] text-red-700">{orderError}</p>
                    </div>
                  )}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setStep("form")} 
                      className="flex-1 flex items-center justify-center gap-2 text-[0.7rem] uppercase font-black text-warm hover:text-charcoal transition-colors group"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
                      Edit Details
                    </button>
                    <Button 
                      onClick={confirmOrder} 
                      disabled={loading} 
                      className="flex-[2] py-7 text-[0.9rem] shadow-lg"
                    >
                      {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Placing Order...</> : "Place My Order"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="text-center py-20 animate-fade-up flex flex-col items-center justify-center h-full min-h-[300px]">
                <Loader2 className="w-10 h-10 animate-spin text-sage-dark mb-6" />
                <h2 className="font-serif italic text-3xl text-charcoal mb-3">Authenticating Payment.</h2>
                <p className="text-[0.85rem] text-warm max-w-[260px] mx-auto leading-relaxed">
                  Please wait while we verify your transaction securely and finalize your order directly with the gateway.
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-12 animate-fade-up">
                <div className="w-24 h-24 rounded-full bg-sage-light/20 border border-sage-light/40 flex items-center justify-center mx-auto mb-8 relative">
                  <Check className="w-12 h-12 text-sage-dark" />
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 border-2 border-sage-dark" />
                </div>
                <h2 className="font-serif italic text-4xl text-charcoal mb-4">Nature is on the way.</h2>
                <div className="mb-8">
                   <span className="text-[0.65rem] uppercase tracking-widest text-warm font-bold block mb-1">Your Order Token</span>
                   <span className="font-mono text-xl font-black text-charcoal tracking-tighter">#{orderId}</span>
                </div>
                <p className="text-[0.88rem] text-warm leading-relaxed mb-12 max-w-[280px] mx-auto">A confirmation has been sent to your email. We&apos;ll notify you when your natural essentials are dispatched.</p>
                
                <div className="bg-cream/30 border border-parchment rounded-2xl p-6 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-sage-dark font-black text-[0.7rem] uppercase tracking-[0.2em]">
                    <Package className="w-4 h-4" />
                    Securely Packing
                  </div>
                  <p className="text-[0.6rem] text-warm/60 uppercase">Redirecting home for more discovery...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
