"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!stageRef.current) return;
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      stageRef.current.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg)`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden min-h-screen grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16 px-6 md:px-16 pt-28 pb-16 md:pt-32"
    >
      {/* Pulsing rings */}
      <div className="hero-ring hr1 absolute pointer-events-none" />
      <div className="hero-ring hr2 absolute pointer-events-none" />
      <div className="hero-ring hr3 absolute pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="eyebrow animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          ✦ Pure by Nature
        </div>
        <h1
          className="font-serif font-light text-[clamp(3rem,5.5vw,5.5rem)] leading-[1.05] text-[#1b4332] mb-7 animate-fade-up"
          style={{ animationDelay: "0.4s", opacity: 0 }}
        >
          Stay Fresh,<br />
          <em className="text-[#7baa8a]">Naturally.</em>
        </h1>
        <p
          className="text-[1rem] font-light leading-[1.75] text-[#5a7a6a] max-w-[460px] mb-10 animate-fade-up"
          style={{ animationDelay: "0.6s", opacity: 0 }}
        >
          An effective 100% natural alum solution that kills odor-causing bacteria and eliminates sweat odor completely. Alcohol-free, gentle on skin, and delivers long-lasting freshness without blocking pores.
        </p>
        <div
          className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-up"
          style={{ animationDelay: "0.8s", opacity: 0 }}
        >
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#1b4332] text-white text-[0.82rem] font-medium uppercase tracking-wider shadow-[0_8px_32px_rgba(27,67,50,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(27,67,50,0.4)] transition-all duration-300"
          >
            Shop Now →
          </Link>
          <Link
            href="/#story"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/60 backdrop-blur-md border border-[rgba(45,106,79,0.2)] text-[#2d6a4f] text-[0.82rem] font-medium uppercase tracking-wider hover:bg-white hover:border-[#7baa8a] hover:-translate-y-1 transition-all duration-300"
          >
            Our Story
          </Link>
        </div>

        {/* Stats */}
        <div
          className="flex gap-8 md:gap-10 mt-14 justify-center md:justify-start animate-fade-up"
          style={{ animationDelay: "1s", opacity: 0 }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-serif text-[2.2rem] font-medium text-[#1b4332] leading-none">14k+</span>
            <span className="text-[0.72rem] tracking-[0.1em] uppercase text-[#7baa8a]">Happy Customers</span>
          </div>
          <div className="w-px bg-[rgba(123,170,138,0.3)]" />
          <div className="flex flex-col gap-1">
            <span className="font-serif text-[2.2rem] font-medium text-[#1b4332] leading-none">4.9★</span>
            <span className="text-[0.72rem] tracking-[0.1em] uppercase text-[#7baa8a]">Avg. Rating</span>
          </div>
          <div className="w-px bg-[rgba(123,170,138,0.3)]" />
          <div className="flex flex-col gap-1">
            <span className="font-serif text-[2.2rem] font-medium text-[#1b4332] leading-none">0%</span>
            <span className="text-[0.72rem] tracking-[0.1em] uppercase text-[#7baa8a]">Harmful Chemicals</span>
          </div>
        </div>
      </div>

      {/* Product Visual */}
      <div
        className="relative z-10 flex items-center justify-center animate-fade-up"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      >
        <div
          ref={stageRef}
          className="relative w-[320px] h-[420px] md:w-[460px] md:h-[560px] flex items-center justify-center"
          style={{ transformStyle: "preserve-3d", perspective: "1000px", transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)" }}
        >
          {/* Glow */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-8 rounded-full bg-[rgba(123,170,138,0.5)] blur-xl animate-pulse" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-6 rounded-full bg-[rgba(27,67,50,0.2)] blur-2xl" />

          {/* Product image */}
          <div className="relative z-10 animate-float drop-shadow-[0_40px_60px_rgba(27,67,50,0.18)]">
            <Image
              src="https://lyfugzdxfcqlrsmermjm.supabase.co/storage/v1/object/public/alumfresh-image/1774611862532-product.png"
              alt="Alum Fresh Natural Mineral Deodorant"
              width={340}
              height={400}
              className="w-[260px] md:w-[340px] h-auto object-contain rounded-3xl scale-125 md:scale-[1.35]"
              priority
            />
          </div>

          {/* Float badges */}
          <div className="fbadge-hero absolute top-0 -left-6 md:top-8 md:-left-16 flex items-center gap-3 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(45,106,79,0.1)] animate-float z-30" style={{ animationDelay: "0s" }}>
            <span className="text-xl">🌿</span>
            <div>
              <div className="text-[0.72rem] font-bold text-[#1b4332]">100% Natural</div>
              <div className="text-[0.62rem] text-[#7baa8a]">Potassium Alum Crystal</div>
            </div>
          </div>

          <div className="fbadge-hero absolute bottom-0 -left-4 md:bottom-28 md:-left-12 flex items-center gap-3 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-3 shadow-[0_20px_60px_rgba(45,106,79,0.1)] animate-float z-30" style={{ animationDelay: "-3s" }}>
            <span className="text-xl">✨</span>
            <div>
              <div className="text-[0.72rem] font-bold text-[#1b4332]">No Fragrance</div>
              <div className="text-[0.62rem] text-[#7baa8a]">Safe for all skin types</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
