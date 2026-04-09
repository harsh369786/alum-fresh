"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "";

  return (
    <div className="max-w-2xl mx-auto px-6 text-center animate-fade-up">
      <div className="w-32 h-32 rounded-full bg-sage-light/20 border-2 border-sage-light/40 flex items-center justify-center mx-auto mb-10 relative">
        <Check className="w-16 h-16 text-sage-dark" />
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 border-2 border-sage-dark" />
      </div>
      
      <h1 className="font-serif italic text-5xl md:text-6xl text-charcoal mb-6">Payment Successful.</h1>
      
      <div className="mb-10 p-8 bg-white border border-parchment rounded-[2.5rem] shadow-sm">
        <span className="text-[0.7rem] uppercase tracking-widest text-warm font-bold block mb-2">Order Reference</span>
        <span className="font-mono text-2xl font-black text-charcoal tracking-tighter">#{orderId}</span>
        
        <div className="mt-8 pt-8 border-t border-parchment border-dashed flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-sage-dark font-black text-[0.8rem] uppercase tracking-[0.2em]">
            <Package className="w-5 h-5" />
            Nature is on the way
          </div>
          <p className="text-[0.88rem] text-warm leading-relaxed max-w-sm">
            A confirmation has been sent to your email. We&apos;ll notify you when your natural essentials are dispatched.
          </p>
        </div>
      </div>
      
      <Button size="lg" asChild className="px-12 py-7 h-auto text-[1.05rem] shadow-lg group">
        <Link href="/category/roll-on">
          Continue Exploring <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 bg-cream/30 flex items-center justify-center">
      <Suspense fallback={<div className="animate-pulse text-warm">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
