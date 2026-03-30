"use client";
import React, { useEffect, useRef } from "react";

const cards = [
  { icon: "🌱", title: "Chemical‑Free", desc: "No aluminium chlorohydrate, no parabens, no phthalates. Pure crystalline alum the way nature intended." },
  { icon: "⏱", title: "Long-Lasting Freshness", desc: "Effective 24-hour odour control without blocking pores. Stay confident all day, the natural way." },
  { icon: "🤍", title: "Skin-Friendly", desc: "Dermatologically tested for all skin types — including sensitive skin. No irritation, ever." },
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
      <div className="reveal text-center max-w-3xl mx-auto mb-20">
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5"
          style={{ color: "#7baa8a" }}>
          <span className="inline-block w-6 h-px bg-[#7baa8a]" />
          Our Story
        </div>
        <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-[#1b4332] mb-8">
          It began with a <em className="text-[#7baa8a]">real problem.</em>
        </h2>
        <div className="text-[1rem] leading-[1.8] space-y-6 text-[#5a7a6a]">
          <p>
            After getting married, we noticed how something as common as underarm odor could affect comfort—both at home and in daily life. Sitting close to your partner or attending meetings by the end of a long day often came with a sense of discomfort and lost confidence.
          </p>
          <p>
            Like everyone else, we tried deodorants and perfumes. They worked for a few hours—but once the fragrance faded, the sweat odor took over again. It was clear they were only masking the problem.
          </p>
          <p>
            Looking for a real solution, we turned to research—and found the answer in nature itself. A time-tested remedy used for generations: Alum (Fitkiri). Known for its ability to kill odor-causing bacteria, it naturally eliminates bad odor at the source.
          </p>
          <p className="font-medium text-[#1b4332]">
            What started as a personal need became our purpose—to create a natural, effective solution that truly works for everyone.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
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

