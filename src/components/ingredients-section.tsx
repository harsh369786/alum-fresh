"use client";
import React from "react";

export function IngredientsSection() {
  const list = [
    { name: "Potassium Alum Crystal", ben: "Blocks odour-causing bacteria naturally", color: "bg-sage" },
    { name: "Organic Aloe Vera", ben: "Hydrates and soothes the skin", color: "bg-gold" },
    { name: "Raw Turmeric Extract", ben: "Brightens and evens skin tone", color: "bg-gold" },
    { name: "Rose Water", ben: "Gentle fragrance, tones the skin", color: "bg-rose" },
  ];

  return (
    <section className="py-24 px-6 md:px-8" id="ingredients">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
        
        {/* Visual / Floating Cards */}
        <div className="relative h-[300px] md:h-[420px] w-full">
          {/* Background Blur Blob */}
          <div className="absolute inset-[10%] md:inset-[15%] rounded-full bg-[radial-gradient(circle,var(--sage-light)_0%,var(--gold-light)_60%,transparent_100%)] blur-[28px] opacity-60 z-0"></div>
          
          <div className="absolute top-0 md:left-[8%] left-[2%] bg-white/70 backdrop-blur-xl border border-white/95 rounded-2xl p-5 shadow-[0_8px_32px_rgba(44,44,44,0.07)] min-w-[170px] animate-float hover:scale-105 transition-transform z-10">
            <div className="text-[2.2rem] mb-2 leading-none">💎</div>
            <div className="font-serif text-[1.1rem] font-medium text-charcoal mb-1">Potassium Alum</div>
            <div className="text-[0.73rem] text-warm">Natural mineral crystal, the original deodorant</div>
          </div>

          <div className="absolute top-[45%] md:left-[42%] right-[2%] -translate-y-1/2 bg-white/70 backdrop-blur-xl border border-white/95 rounded-2xl p-5 shadow-[0_8px_32px_rgba(44,44,44,0.07)] min-w-[170px] animate-float hover:scale-105 transition-transform" style={{ animationDelay: "1.5s", zIndex: 11 }}>
            <div className="text-[2.2rem] mb-2 leading-none">🌿</div>
            <div className="font-serif text-[1.1rem] font-medium text-charcoal mb-1">Aloe Vera</div>
            <div className="text-[0.73rem] text-warm">Soothes, hydrates & calms skin</div>
          </div>

          <div className="absolute bottom-0 md:left-[3%] left-[10%] bg-white/70 backdrop-blur-xl border border-white/95 rounded-2xl p-5 shadow-[0_8px_32px_rgba(44,44,44,0.07)] min-w-[170px] animate-float hover:scale-105 transition-transform" style={{ animationDelay: "3.0s", zIndex: 12 }}>
            <div className="text-[2.2rem] mb-2 leading-none">🌼</div>
            <div className="font-serif text-[1.1rem] font-medium text-charcoal mb-1">Turmeric</div>
            <div className="text-[0.73rem] text-warm">Brightens underarms & fights bacteria</div>
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <span className="eyebrow">Pure Ingredients</span>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-light mb-5 text-charcoal">
            Every drop<br />
            <em className="text-sage-dark">tells a story.</em>
          </h2>
          <p className="text-[0.88rem] mb-8 text-warm">
            We source only the finest natural ingredients, each chosen with purpose. No fillers. No surprises. Just honest beauty.
          </p>

          <div className="flex flex-col gap-3.5">
            {list.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3.5 md:p-4 bg-white rounded-2xl border border-parchment transition-all duration-300 hover:border-sage-light hover:shadow-[0_4px_20px_rgba(44,44,44,0.06)] hover:translate-x-1">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`}></div>
                <div>
                  <div className="text-[0.85rem] font-medium text-charcoal leading-tight">{item.name}</div>
                  <div className="text-[0.75rem] text-warm mt-0.5">{item.ben}</div>
                </div>
                <span className="ml-auto text-sage-dark text-[0.9rem] font-medium">✓</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
