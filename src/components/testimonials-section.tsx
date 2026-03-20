"use client";
import React from "react";

export function TestimonialsSection() {
  const testimonials = [
    {
      txt: "I've struggled with sensitive skin for years. Alum Fresh is the only deodorant that doesn't irritate me. And it actually works!",
      initial: "P",
      name: "Priya Sharma",
      role: "Mumbai · Verified buyer",
      color: "bg-rose",
      delay: "0.05s",
    },
    {
      txt: "The difference in how my skin feels is night and day. No more dark underarms — and it smells absolutely divine.",
      initial: "A",
      name: "Ananya Mehta",
      role: "Bengaluru · Verified buyer",
      color: "bg-sage",
      delay: "0.15s",
    },
    {
      txt: "My dermatologist recommended going natural. Alum Fresh is genuinely the real deal. Already on my third order!",
      initial: "R",
      name: "Rahul Desai",
      role: "Delhi · Verified buyer",
      color: "bg-gold",
      delay: "0.25s",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-8 bg-cream">
      <div className="text-center mb-16 animate-fade-up">
        <span className="eyebrow">Real Stories</span>
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-light mt-1 text-charcoal">
          Loved by <em className="text-sage-dark">thousands.</em>
        </h2>
        <p className="max-w-[460px] mx-auto mt-4 text-[0.88rem] text-warm">
          Don't just take our word for it — hear from people who've made the switch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl p-7 border border-parchment transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_16px_56px_rgba(44,44,44,0.1)] animate-fade-up"
            style={{ animationDelay: t.delay }}
          >
            <div className="text-gold text-[0.78rem] tracking-[2px] mb-2.5">★★★★★</div>
            <span className="font-serif text-[2.8rem] text-sage-light leading-none block mb-1">"</span>
            <p className="font-serif italic text-[0.98rem] text-charcoal leading-[1.7] mb-5">
              {t.txt}
            </p>
            <div className="flex items-center gap-2.5 mt-auto">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.75rem] font-medium text-white shrink-0 ${t.color}`}>
                {t.initial}
              </div>
              <div>
                <div className="text-[0.83rem] font-medium text-charcoal">{t.name}</div>
                <div className="text-[0.72rem] text-warm">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
