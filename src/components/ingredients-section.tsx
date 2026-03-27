"use client";
import React from "react";
import Image from "next/image";

const items = [
  { num: "01", title: "Mineral, Not Chemical", desc: "Potassium alum creates an inhospitable environment for odour-causing bacteria — no toxic blockers needed." },
  { num: "02", title: "Clinically Proven", desc: "Independently tested and dermatologist-approved for all skin types including the most sensitive." },
  { num: "03", title: "Truly Sustainable", desc: "From sourcing to shelf to bin — every decision is guided by our commitment to the planet." },
];

export function IngredientsSection() {
  const ingredients = [
    { emoji: "💎", name: "Potassium Alum", sub: "The Original Deodorant", desc: "Natural mineral crystal that blocks odour-causing bacteria without disrupting your skin's natural perspiration.", check: "Blocks bacteria naturally" },
    { emoji: "🌿", name: "Aloe Vera", sub: "Soothe & Hydrate", desc: "Organic aloe vera calms the skin, locks in moisture, and helps heal micro-irritations with every application.", check: "Hydrates and soothes" },
    { emoji: "🌼", name: "Turmeric", sub: "Brighten & Protect", desc: "Raw turmeric extract evens skin tone, brightens underarms naturally, and provides additional antibacterial action.", check: "Brightens & fights bacteria" },
    { emoji: "🌹", name: "Rose Water", sub: "Tone & Refresh", desc: "Distilled rose water tones the skin delicately, imparting a faint natural fragrance while maintaining pH balance.", check: "Gentle fragrance, tones skin" },
  ];

  return (
    <>
      {/* WHY SECTION */}
      <section
        id="why"
        className="relative overflow-hidden mx-4 md:mx-10 rounded-[2.5rem] py-20 px-6 md:px-16"
        style={{ background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)", color: "white" }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center max-w-5xl mx-auto relative z-10">
          <div>
            <div className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5" style={{ color: "rgba(212,237,225,0.8)" }}>
              <span className="inline-block w-6 h-px" style={{ background: "rgba(212,237,225,0.6)" }} />
              Our Promise
            </div>
            <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-white mb-4">
              The honest<br /><em style={{ color: "#a8d5bb" }}>difference.</em>
            </h2>
            <p className="text-[0.95rem] leading-[1.8] mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
              We've reimagined deodorant from scratch — starting with a single powerful mineral and building a ritual your skin will thank you for.
            </p>
            <div className="flex flex-col gap-5">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-5 p-6 rounded-2xl border transition-all duration-300 hover:translate-x-2"
                  style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <div className="font-serif text-[2.5rem] font-light leading-none min-w-[48px]" style={{ color: "rgba(168,213,187,0.5)" }}>{item.num}</div>
                  <div>
                    <h4 className="font-serif text-[1.2rem] font-medium text-white mb-1.5">{item.title}</h4>
                    <p className="text-[0.83rem] leading-[1.7]" style={{ color: "rgba(255,255,255,0.6)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex items-center justify-center min-h-[400px]">
            <div className="absolute w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle,rgba(168,213,187,0.3),transparent 70%)", filter: "blur(40px)" }} />
            <Image
              src="/product.png"
              alt="Alum Fresh Product"
              width={240}
              height={300}
              className="relative z-10 w-[200px] md:w-[240px] h-auto object-contain animate-float rounded-2xl"
              style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.4))" }}
            />
            <div className="absolute top-12 left-0 z-30 px-5 py-3 rounded-2xl border" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.2)" }}>
              <div className="font-serif text-[1.8rem] font-medium text-white leading-none">14k+</div>
              <div className="text-[0.65rem] tracking-[0.1em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>Happy Customers</div>
            </div>
            <div className="absolute bottom-20 right-0 z-30 px-5 py-3 rounded-2xl border" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.2)" }}>
              <div className="font-serif text-[1.8rem] font-medium text-white leading-none">4.9★</div>
              <div className="text-[0.65rem] tracking-[0.1em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section id="ingredients" className="py-28 px-6 md:px-16 relative" style={{ background: "transparent" }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20 max-w-6xl mx-auto">
          <div className="md:col-span-1 md:sticky md:top-32 h-fit">
            <div className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5" style={{ color: "#7baa8a" }}>
              <span className="inline-block w-6 h-px bg-[#7baa8a]" />
              Pure Ingredients
            </div>
            <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-[#1b4332] mb-4">
              Every drop<br /><em className="text-[#7baa8a]">tells a story.</em>
            </h2>
            <p className="text-[0.95rem] leading-[1.8]" style={{ color: "#5a7a6a" }}>
              We source only the finest natural ingredients, each chosen with purpose. No fillers. No surprises. Just honest beauty.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ingredients.map((ing, i) => (
              <div
                key={i}
                className="relative p-9 rounded-3xl border overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(45,106,79,0.15)]"
                style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.75)", boxShadow: "0 20px 60px rgba(45,106,79,0.12)" }}
              >
                <span className="block text-[2.5rem] mb-5">{ing.emoji}</span>
                <div className="font-serif text-[1.3rem] font-medium text-[#1b4332] mb-1">{ing.name}</div>
                <div className="text-[0.75rem] font-bold uppercase tracking-wider mb-3" style={{ color: "#7baa8a" }}>{ing.sub}</div>
                <p className="text-[0.83rem] leading-[1.7] mb-4" style={{ color: "#6a8a78" }}>{ing.desc}</p>
                <div className="flex items-center gap-2 text-[0.75rem] font-medium" style={{ color: "#2d6a4f" }}>
                  <span className="font-bold">✓</span> {ing.check}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
