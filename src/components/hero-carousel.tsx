"use client";
import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroCarouselProps {
  banners: Banner[];
}

const FALLBACK_SLIDES = [
  {
    id: "1",
    title: "Stay Fresh, Naturally.",
    subtitle: "100% Alum. 0% Chemicals. Pure freshness that lasts all day.",
    cta_text: "Shop Now",
    cta_link: "/category/roll-on",
    bg_gradient: "linear-gradient(135deg, #08070F 0%, #0E0B1A 100%)",
    image_url: null,
    is_active: true,
    sort_order: 0,
    created_at: "",
  },
  {
    id: "2",
    title: "Rose Edition.",
    subtitle: "Infused with rose water for a delicate, feminine freshness.",
    cta_text: "Shop Rose",
    cta_link: "/category/roll-on",
    bg_gradient: "linear-gradient(135deg, #1a0820 0%, #08070F 100%)",
    image_url: null,
    is_active: true,
    sort_order: 1,
    created_at: "",
  },
  {
    id: "3",
    title: "Charcoal Edition.",
    subtitle: "Activated charcoal meets pure alum. The ultimate detox deodorant.",
    cta_text: "Explore",
    cta_link: "/category/roll-on",
    bg_gradient: "linear-gradient(135deg, #0D0B18 0%, #08070F 100%)",
    image_url: null,
    is_active: true,
    sort_order: 2,
    created_at: "",
  },
];

const SLIDE_EMOJIS = ["🌿", "🌹", "🖤"];
const GLOW_COLORS = ["rgba(0,212,200,0.15)", "rgba(214,58,249,0.12)", "rgba(160,132,202,0.12)"];

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const slides = banners.length > 0 ? banners : FALLBACK_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center" ref={emblaRef as any}>
      <div className="flex h-full w-full" style={{ willChange: "transform" }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="relative min-w-full min-h-screen flex items-center justify-center"
            style={{ background: slide.bg_gradient || "#08070F" }}
          >
            {/* Ambient glow for slide */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 70% 50%, ${GLOW_COLORS[idx % GLOW_COLORS.length]} 0%, transparent 60%)`,
              }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Text */}
                <div className="text-center md:text-left">
                  {/* Trust badge */}
                  <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                    <span className="text-xs text-text-muted font-medium">100% Natural · Derma Tested</span>
                  </div>

                  <h1 className="font-syne font-black text-4xl sm:text-5xl md:text-6xl text-text-primary leading-tight mb-4">
                    {idx === 0 ? (
                      <>
                        Stay Fresh,{" "}
                        <span className="gradient-text">Naturally.</span>
                      </>
                    ) : (
                      <span className="gradient-text">{slide.title}</span>
                    )}
                  </h1>
                  <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                    {slide.subtitle}
                  </p>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Button variant="teal" size="lg" asChild>
                      <Link href={slide.cta_link || "/category/roll-on"}>
                        {slide.cta_text || "Shop Now"}
                      </Link>
                    </Button>
                    <Button variant="ghost" size="lg" asChild>
                      <Link href="/about">Our Story</Link>
                    </Button>
                  </div>

                  {/* Social proof */}
                  <div className="mt-8 flex items-center gap-3 justify-center md:justify-start">
                    <div className="flex -space-x-2">
                      {["🧑🏽‍🦱","👩🏻","🧑🏿"].map((emoji, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-surface2 border-2 border-surface flex items-center justify-center text-sm">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-text-muted">
                      <span className="text-teal font-semibold">14,000+</span> happy customers
                    </span>
                  </div>
                </div>

                {/* Visual */}
                <div className="relative flex items-center justify-center">
                  <div className="relative">
                    {/* Rotating rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-64 h-64 rounded-full border-2 animate-spin-slow opacity-30"
                        style={{ borderColor: GLOW_COLORS[idx % GLOW_COLORS.length].replace("0.15","0.6") }}
                      />
                      <div
                        className="absolute w-80 h-80 rounded-full border animate-spin-slower opacity-20"
                        style={{ borderColor: GLOW_COLORS[idx % GLOW_COLORS.length].replace("0.15","0.4") }}
                      />
                    </div>

                    {/* Product orb */}
                    <div
                      className="relative w-52 h-52 rounded-full flex items-center justify-center animate-float z-10"
                      style={{
                        background: `radial-gradient(circle, ${GLOW_COLORS[idx % GLOW_COLORS.length].replace("0.15","0.25")} 0%, transparent 70%)`,
                        boxShadow: `0 0 60px ${GLOW_COLORS[idx % GLOW_COLORS.length].replace("0.15","0.4")}`,
                      }}
                    >
                      {slide.image_url ? (
                        <img src={slide.image_url} alt={slide.title || "Product"} className="w-36 h-36 object-contain" />
                      ) : (
                        <span className="text-8xl">{SLIDE_EMOJIS[idx % SLIDE_EMOJIS.length]}</span>
                      )}
                    </div>

                    {/* Glass badge overlays */}
                    <div className="absolute -top-4 -right-4 glass-card px-3 py-1.5 rounded-full animate-float-delayed">
                      <span className="text-xs font-semibold text-teal">100% Natural ✓</span>
                    </div>
                    <div className="absolute -bottom-4 -left-4 glass-card px-3 py-1.5 rounded-full animate-float">
                      <span className="text-xs font-semibold text-purple-light">Derma Tested ✓</span>
                    </div>
                    <div className="absolute top-1/2 -right-8 glass-card px-3 py-1.5 rounded-full">
                      <span className="text-xs font-semibold text-magenta">0% Chemicals ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-card border border-white/15 flex items-center justify-center hover:border-teal/30 hover:text-teal text-text-muted transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-card border border-white/15 flex items-center justify-center hover:border-teal/30 hover:text-teal text-text-muted transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
