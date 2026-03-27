"use client";
import React, { useEffect, useRef } from "react";

const cards = [
  { icon: "🌱", title: "Chemical‑Free", desc: "No aluminium chlorohydrate, no parabens, no phthalates. Pure crystalline alum the way nature intended." },
  { icon: "⏱", title: "Long-Lasting Freshness", desc: "Effective 24-hour odour control without blocking pores. Stay confident all day, the natural way." },
  { icon: "🤍", title: "Skin-Friendly", desc: "Dermatologically tested for all skin types — including sensitive skin. No irritation, ever." },
  { icon: "♻️", title: "Eco-Conscious", desc: "Minimal packaging, recyclable materials, zero-waste commitment. Planet-first, always." },
];

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export function WhySection() {
  useReveal();

  return (
    <section id="story" className="py-28 px-6 md:px-16 relative" style={{ background: "transparent" }}>
      <div className="reveal text-center max-w-2xl mx-auto mb-20">
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5"
          style={{ color: "#7baa8a" }}>
          <span className="inline-block w-6 h-px bg-[#7baa8a]" />
          Why Choose Us
        </div>
        <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-[#1b4332]">
          Good for you.<br /><em className="text-[#7baa8a]">Good for earth.</em>
        </h2>
        <p className="text-[0.95rem] leading-[1.8] mt-4" style={{ color: "#5a7a6a" }}>
          We believe personal care shouldn't come with a chemical cocktail. Nature does it best — and so do we.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className="reveal feature-card group relative p-10 rounded-3xl border transition-all duration-400 cursor-pointer overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.75)",
              boxShadow: "0 20px 60px rgba(45,106,79,0.12)",
              transitionDelay: `${i * 0.1}s`,
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
              style={{ background: "rgba(123,170,138,0.15)" }}
            >
              {card.icon}
            </div>
            <h4 className="font-serif text-[1.4rem] font-medium text-[#1b4332] mb-3 leading-tight">{card.title}</h4>
            <p className="text-[0.85rem] leading-[1.75]" style={{ color: "#6a8a78" }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
