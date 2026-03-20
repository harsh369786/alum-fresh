"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="bg-gradient-to-br from-charcoal to-[#3d3830] text-center relative overflow-hidden py-24 px-6 md:px-8">
      {/* Decorative Blur Circles */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-sage-light/10 -top-[100px] -left-[100px] pointer-events-none"></div>
      <div className="absolute w-[280px] h-[280px] rounded-full bg-gold/10 -bottom-[80px] -right-[60px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto animate-fade-up">
        <span className="eyebrow !text-sage-light">Limited Time Offer</span>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light text-white mb-3">
          Get 20% off your<br />first order.
        </h2>
        <p className="text-[0.9rem] text-white/60 mb-7">
          Use code <strong className="text-gold-light font-medium">FRESH20</strong> at checkout. Free shipping above ₹499.
        </p>
        <Button variant="outline" size="lg" className="bg-cream text-charcoal border-transparent hover:bg-white hover:text-charcoal rounded-full px-9 py-6 text-[0.95rem] shadow-[0_4px_18px_rgba(255,255,255,0.1)] hover:shadow-[0_8px_28px_rgba(255,255,255,0.2)] hover:-translate-y-0.5" asChild>
          <Link href="/#products">Claim Offer &nbsp;→</Link>
        </Button>
      </div>
    </section>
  );
}
