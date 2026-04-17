"use client";
import React from "react";

const testimonials = [
  {
    txt: "I've struggled with sensitive skin for years. Alum Fresh is the only deodorant that doesn't irritate me. And it actually works!",
    initial: "P", name: "Priya Sharma", role: "Mumbai · Verified Buyer",
  },
  {
    txt: "This product truly works, highly recommended !! ",
    initial: "R", name: "Rahul Desai", role: "Mumbai · Verified Buyer",
  },
  {
    txt: "Was honestly not expecting much, but Alum Fresh really works. It doesn’t just cover the smell like deodorant, it actually keeps me fresh for hours. Feels light on the skin and no irritation at all. Definitely a daily essential now.",
    initial: "H", name: "Harsh Shah", role: "Mumbai · Verified Buyer",
  },
];

const trustStats = [
  { num: "100%", lbl: "Real Discovery" },
  { num: "4.9★", lbl: "Average Rating" },
  { num: "100%", lbl: "Mineral Purity" },
  { num: "0%", lbl: "Harmful Chemicals" },
];

export function TestimonialsSection() {
  return (
    <section
      id="testi"
      className="py-28 px-6 md:px-16 mx-4 md:mx-10 rounded-[2.5rem]"
      style={{ background: "#f0ede6" }}
    >
      <div className="text-center mb-20 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5" style={{ color: "#7baa8a" }}>
          <span className="inline-block w-6 h-px bg-[#7baa8a]" />
          Real Stories
        </div>
        <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-[#1b4332]">
          Loved by <em className="text-[#7baa8a]">thousands.</em>
        </h2>
        <p className="text-[0.95rem] leading-[1.8] mt-4" style={{ color: "#5a7a6a" }}>
          Don't take our word for it — hear from people who've made the switch to natural freshness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="relative bg-white rounded-3xl p-10 overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(45,106,79,0.15)]"
            style={{ boxShadow: "0 4px 24px rgba(45,106,79,0.08)" }}
          >
            {/* Quote mark */}
            <span
              className="absolute font-serif text-[8rem] font-light leading-none pointer-events-none"
              style={{ color: "rgba(123,170,138,0.1)", top: "-20px", left: "20px" }}
            >
              "
            </span>
            <div className="text-[0.85rem] tracking-[2px] mb-5" style={{ color: "#f5a623" }}>★★★★★</div>
            <p className="font-serif italic text-[1.1rem] font-light leading-[1.65] text-[#1b4332] mb-7 relative z-10">
              "{t.txt}"
            </p>
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-serif text-[1.2rem] font-medium text-[#1b4332] shrink-0"
                style={{ background: "linear-gradient(135deg, #d4ede1, #7baa8a)" }}
              >
                {t.initial}
              </div>
              <div>
                <div className="text-[0.82rem] font-bold text-[#1b4332]">{t.name}</div>
                <div className="text-[0.72rem] tracking-[0.05em]" style={{ color: "#7baa8a" }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust bar */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 max-w-5xl mx-auto rounded-3xl overflow-hidden"
        style={{ background: "rgba(123,170,138,0.2)", boxShadow: "0 20px 60px rgba(45,106,79,0.12)" }}
      >
        {trustStats.map((s, i) => (
          <div
            key={i}
            className="bg-white text-center px-6 py-9 transition-colors duration-300 hover:bg-[#d4ede1]"
          >
            <div className="font-serif text-[3rem] font-light text-[#1b4332] leading-none">{s.num}</div>
            <div className="text-[0.72rem] tracking-[0.1em] uppercase mt-2" style={{ color: "#7baa8a" }}>{s.lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
