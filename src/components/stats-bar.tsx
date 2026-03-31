"use client";
import React, { useEffect, useState, useRef } from "react";

export function StatsBar() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { num: "14,000+", lbl: "Happy Customers", delay: "0.05s" },
    { num: "4.9★", lbl: "Average Rating", delay: "0.15s" },
    { num: "100%", lbl: "Mineral Purity", delay: "0.25s" },
    { num: "0%", lbl: "Harmful Chemicals", delay: "0.35s" },
  ];

  return (
    <section ref={ref} className="py-16 px-6 md:px-8 bg-parchment">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto text-center">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ease-out fill-mode-both ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
            }`}
            style={{ transitionDelay: stat.delay }}
          >
            <div className="font-serif text-[2.8rem] text-sage-dark leading-none">
              {stat.num}
            </div>
            <div className="text-[0.72rem] tracking-[0.12em] uppercase text-warm mt-1.5">
              {stat.lbl}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
