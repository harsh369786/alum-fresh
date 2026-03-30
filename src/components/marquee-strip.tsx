"use client";
import React from "react";

const ITEMS = [
  "✦ Chemical Free",
  "✦ Dermatologist Tested",
  "✦ Cruelty Free",
  "✦ Made in India",
  "✦ No Parabens",
  "✦ Vegan Formula",
  "✦ Long-Lasting",
];

export function MarqueeStrip() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden py-4" style={{ background: "#1b4332", zIndex: 1 }}>
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-7 text-[0.72rem] font-medium tracking-[0.12em] uppercase"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {item}
            <span className="inline-block w-1 h-1 rounded-full bg-[#7baa8a]" />
          </span>
        ))}
      </div>
    </div>
  );
}
