"use client";
import React from "react";
import { Leaf, Clock, Heart, Recycle } from "lucide-react";

export function WhySection() {
  const cards = [
    {
      icon: "🌱",
      title: "Chemical-Free",
      desc: "No aluminium chlorohydrate, no parabens, no phthalates. Pure crystalline alum the way nature intended.",
      delay: "0.05s",
    },
    {
      icon: "⏱",
      title: "Long-Lasting Freshness",
      desc: "Effective 24-hour odour control without blocking pores. Stay confident all day, the natural way.",
      delay: "0.15s",
    },
    {
      icon: "🤍",
      title: "Skin-Friendly",
      desc: "Dermatologically tested for all skin types — including sensitive skin. No irritation, ever.",
      delay: "0.25s",
    },
    {
      icon: "♻️",
      title: "Eco-Conscious",
      desc: "Minimal packaging, recyclable materials, zero-waste commitment. Planet-first, always.",
      delay: "0.35s",
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-8" id="story">
      <div className="text-center mb-16 animate-fade-up">
        <span className="eyebrow">Why Choose Us</span>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light mt-1 text-charcoal">
          Good for you.<br />
          <em className="text-sage-dark">Good for earth.</em>
        </h2>
        <p className="max-w-[460px] mx-auto mt-4 text-[0.88rem] text-warm">
          We believe personal care shouldn't come with a chemical cocktail. Nature does it best.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative p-8 rounded-3xl bg-cream border border-sage-light/20 transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:shadow-[0_16px_56px_rgba(44,44,44,0.12)] overflow-hidden animate-fade-up"
            style={{ animationDelay: card.delay }}
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage-light/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-light to-gold-light flex items-center justify-center text-[1.35rem] mb-6 transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-6">
                {card.icon}
              </div>
              <h4 className="font-serif text-[1.2rem] font-medium text-charcoal mb-2.5">
                {card.title}
              </h4>
              <p className="text-[0.82rem] leading-[1.7] text-warm">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
