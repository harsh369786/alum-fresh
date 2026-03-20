"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-8 lg:pt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center max-w-7xl mx-auto px-6 py-8 md:py-16 text-center md:text-left relative z-10">
        <div className="order-2 md:order-1 animate-fade-up">
          <span className="eyebrow">✦ Pure by Nature</span>
          <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-serif italic font-light leading-[1.06] mb-5 text-charcoal">
            Stay <span className="text-sage-dark font-normal">Fresh,</span><br/>
            <em>Naturally.</em>
          </h1>
          <p className="text-[0.95rem] text-warm mb-8 max-w-[360px] leading-[1.75] mx-auto md:mx-0">
            100% Alum. 0% Chemicals. Crafted for skin that deserves nothing but the best nature can offer.
          </p>
          <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
            <Button variant="teal" size="lg" className="bg-charcoal text-white hover:bg-charcoal/90 rounded-full shadow-[0_4px_18px_rgba(44,44,44,0.22)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(44,44,44,0.32)]" asChild>
              <Link href="/#products">Shop Now &nbsp;→</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-[1.5px] border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-full bg-transparent hover:-translate-y-0.5" asChild>
              <Link href="/#story">Our Story</Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="flex -space-x-2">
              <div className="w-[30px] h-[30px] rounded-full border-2 border-cream bg-sage flex items-center justify-center text-[0.68rem] font-medium text-white">A</div>
              <div className="w-[30px] h-[30px] rounded-full border-2 border-cream bg-rose flex items-center justify-center text-[0.68rem] font-medium text-white">M</div>
              <div className="w-[30px] h-[30px] rounded-full border-2 border-cream bg-gold flex items-center justify-center text-[0.68rem] font-medium text-white">R</div>
            </div>
            <p className="text-[0.78rem] text-warm"><strong className="text-charcoal font-medium">14,000+</strong> happy customers</p>
          </div>
        </div>
        
        <div className="order-1 md:order-2 relative flex items-center justify-center min-h-[280px] md:min-h-[440px] animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="absolute w-[240px] h-[240px] md:w-[380px] md:h-[380px] rounded-full filter blur-[20px] bg-gradient-to-br from-sage-light via-gold-light to-rose-light animate-blob opacity-80 mix-blend-multiply"></div>
          <div className="text-7xl md:text-[8.5rem] relative z-10 animate-float drop-shadow-2xl">🌿</div>
          
          <div className="absolute bg-white/75 backdrop-blur-md border border-white/95 rounded-2xl p-3 md:p-4 shadow-[0_8px_32px_rgba(44,44,44,0.08)] z-20 
                          top-[20px] right-[10px] md:top-[55px] md:right-[15px] text-center animate-[float_5s_ease-in-out_infinite_reverse]">
            <div className="font-serif text-xl md:text-[1.7rem] text-charcoal leading-none">100%</div>
            <div className="text-[0.55rem] md:text-[0.65rem] text-warm tracking-[0.08em] uppercase mt-1">Natural</div>
          </div>
          
          <div className="hidden md:flex absolute bg-white/75 backdrop-blur-md border border-white/95 rounded-2xl p-4 shadow-[0_8px_32px_rgba(44,44,44,0.08)] z-20 
                          bottom-[65px] left-0 items-center gap-3 animate-float">
            <div className="w-8 h-8 bg-sage-light rounded-full flex items-center justify-center text-[0.85rem]">✓</div>
            <div>
              <div className="text-[0.78rem] font-medium text-charcoal">Derma Tested</div>
              <div className="text-[0.68rem] text-warm">Clinically proven</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-2 md:-bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[0.68rem] tracking-[0.12em] uppercase text-warm">
        <div className="w-[1px] h-10 bg-gradient-to-b from-sage-dark to-transparent animate-pulse"></div>
        <span>scroll</span>
      </div>
    </section>
  );
}
