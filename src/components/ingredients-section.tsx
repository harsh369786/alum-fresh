"use client";
import React from "react";
import Image from "next/image";

const items = [
  { num: "01", title: "Mineral, Not Chemical", desc: "Potassium alum creates an inhospitable environment for odour-causing bacteria — no toxic blockers needed." },
  { num: "02", title: "Clinically Proven", desc: "Independently tested and dermatologist-approved for all skin types including the most sensitive." },
];

export function IngredientsSection() {
  const ingredients = [
    { emoji: "💎", name: "Potassium Alum", sub: "The Original Deodorant", desc: "Natural mineral crystal that blocks odour-causing bacteria without disrupting your skin's natural perspiration.", check: "Blocks bacteria naturally" },
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
          <div className="relative flex items-center justify-center min-h-[450px] md:min-h-[550px] w-full">
            {/* Background Glows */}
            <div className="absolute w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle,rgba(168,213,187,0.25),transparent 70%)", filter: "blur(50px)" }} />
            
            {/* First Image (Bottom/Back) */}
            <div className="absolute left-0 top-10 md:top-0 animate-float" style={{ animationDelay: "1s" }}>
              <Image
                src="https://lyfugzdxfcqlrsmermjm.supabase.co/storage/v1/object/public/alumfresh-image/1774611862532-product.png"
                alt="Alum Fresh Edition 1"
                width={300}
                height={300}
                className="w-[180px] md:w-[280px] h-auto object-contain rounded-3xl rotate-[-6deg] opacity-90"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" }}
              />
            </div>

            {/* Second Image (Top/Front) - THE NEW ONE */}
            <div className="relative z-10 animate-float md:translate-x-12 translate-y-8">
              <Image
                src="https://lyfugzdxfcqlrsmermjm.supabase.co/storage/v1/object/public/alumfresh-image/product_2.png"
                alt="Alum Fresh Edition 2"
                width={320}
                height={320}
                className="w-[220px] md:w-[320px] h-auto object-contain rounded-3xl rotate-[4deg] scale-110 md:scale-125"
                style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.25))" }}
              />
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
              Pure Mineral
            </div>
            <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-[#1b4332] mb-4">
              Nature&apos;s most<br /><em className="text-[#7baa8a]">powerful crystal.</em>
            </h2>
            <p className="text-[1rem] leading-[1.8] text-[#5a7a6a]">
              We use 100% pure Potassium Alum, a natural mineral crystal that has been used for centuries for its incredible antibacterial and deodorizing properties.
            </p>
          </div>
          <div className="md:col-span-2">
            {ingredients.map((ing, i) => (
              <div
                key={i}
                className="relative p-12 rounded-[2rem] border overflow-hidden transition-all duration-400"
                style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.75)", boxShadow: "0 20px 60px rgba(45,106,79,0.12)" }}
              >
                <div className="flex flex-col md:flex-row gap-10 items-center">
                   <span className="block text-[5rem] shrink-0">{ing.emoji}</span>
                   <div>
                      <div className="font-serif text-[2.2rem] font-medium text-[#1b4332] mb-1">{ing.name}</div>
                      <div className="text-[0.8rem] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#7baa8a" }}>{ing.sub}</div>
                      <p className="text-[1.05rem] leading-[1.8] mb-6" style={{ color: "#6a8a78" }}>{ing.desc}</p>
                      <div className="flex items-center gap-3 text-[0.9rem] font-bold" style={{ color: "#2d6a4f" }}>
                        <div className="w-6 h-6 rounded-full bg-[#d4ede1] flex items-center justify-center text-[0.7rem]">✓</div> 
                        {ing.check}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
