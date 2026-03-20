"use client";
import React from "react";
import { MARQUEE_ITEMS } from "@/lib/constants";

export function MarqueeStrip() {
  // Duplicate items to ensure scrolling is seamless
  const displayItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="overflow-hidden border-y border-sage-light/30 bg-white py-3">
      <div className="flex gap-12 whitespace-nowrap animate-marquee w-max">
        {displayItems.map((item, i) => (
          <span
            key={`marquee-${i}`}
            className="text-[0.7rem] tracking-[0.18em] uppercase text-warm font-medium"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
