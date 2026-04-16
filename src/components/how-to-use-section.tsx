"use client";
import React from "react";
import Image from "next/image";

const steps = [
  {
    num: "01",
    title: "Wet",
    desc: "Open the Alum Roll-on and lightly wet it under running water.",
    img: "/images/step1.jpeg"
  },
  {
    num: "02",
    title: "Apply",
    desc: "Apply and rub gently on one underarm.",
    img: "/images/step2.jpeg"
  },
  {
    num: "03",
    title: "Repeat",
    desc: "Re-wet the crystal and repeat on the other underarm.",
    img: "/images/step3.jpeg"
  },
  {
    num: "04",
    title: "Dry",
    desc: "Wipe dry and leave open for 15-30 mins before closing.",
    img: "/images/step4.jpeg"
  }
];

export function HowToUseSection() {
  return (
    <section id="how-to-use" className="py-28 px-6 md:px-16 bg-cream/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
           <div className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5" style={{ color: "#7baa8a" }}>
              <span className="inline-block w-6 h-px bg-[#7baa8a]" />
              The Ritual
           </div>
           <h2 className="text-[clamp(2.4rem,4vw,3.8rem)] font-serif font-light text-charcoal leading-tight">
             How to <em className="text-sage-dark">Use.</em>
           </h2>
           <p className="mt-4 text-[#5a7a6a] max-w-lg mx-auto text-[0.95rem]">
             Applying nature&apos;s crystal is a simple, mindful ritual for all-day freshness.
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {steps.map((step, i) => (
             <div key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-parchment aspect-[3875/5463] transition-all duration-500 hover:shadow-2xl translate-y-0 hover:-translate-y-2">
                <Image 
                   src={step.img} 
                   alt={`${step.num}: ${step.title} - ${step.desc}`}
                   fill
                   sizes="(max-width: 768px) 100vw, 25vw"
                   className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Subtle Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
