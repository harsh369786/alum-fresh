"use client";
import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Leaf, Sparkles, ShieldCheck } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";

interface HeroCarouselProps {
  banners: Banner[];
}

const FALLBACK_SLIDES = [
  {
    id: "1",
    title: "Stay Fresh, Naturally.",
    subtitle: "100% Alum. 0% Chemicals. Pure freshness that lasts all day, inspired by ancient rituals.",
    cta_text: "Explore Collection",
    cta_link: "/category/roll-on",
    bg_gradient: "linear-gradient(135deg, #F8F4ED 0%, #EDE8DC 100%)",
    image_url: null,
    is_active: true,
    sort_order: 0,
    created_at: "",
  },
];

const GLOW_COLORS = ["rgba(143,175,143,0.1)"];
const EMOJIS = ["🌿"];



export function HeroCarousel({ banners }: HeroCarouselProps) {
  const slides = banners.length > 0 ? banners : FALLBACK_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    AutoPlay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-cream" ref={emblaRef as any}>
      <div className="flex">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="relative min-w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: slide.bg_gradient || "#F8F4ED" }}
          >
            {/* Ambient Animated Glow */}
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                background: `radial-gradient(ellipse at 70% 50%, ${GLOW_COLORS[idx % GLOW_COLORS.length]} 0%, transparent 60%)`,
              }}
            />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-10 flex flex-col md:flex-row items-center gap-16 md:gap-24">
               {/* Content Block */}
               <div className="flex-1 text-center md:text-left animate-fade-up">
                  <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md border border-parchment px-5 py-2 rounded-full mb-8 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-charcoal opacity-80">Ancient Wisdom · Modern Form</span>
                  </div>

                  <h1 className="font-serif italic text-[clamp(2.5rem,8vw,5.5rem)] text-charcoal leading-[1.1] mb-8">
                     {slide.title}
                  </h1>
                  
                  <p className="text-[1.1rem] text-warm max-w-lg mb-12 leading-relaxed font-light opacity-90 mx-auto md:mx-0">
                     {slide.subtitle}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 items-center justify-center md:justify-start">
                     <Button size="lg" asChild className="px-10 py-7 h-auto text-[0.95rem] shadow-xl group">
                       <Link href={slide.cta_link || "/category/roll-on"}>
                         {slide.cta_text || "Discover Collection"} &nbsp;→
                       </Link>
                     </Button>
                     <Link 
                       href="/about" 
                       className="text-[0.7rem] uppercase tracking-widest font-black text-warm hover:text-charcoal transition-all underline underline-offset-8"
                     >
                       Our Scientific Ritual
                     </Link>
                  </div>

                  {/* Social Proof Removed for Launch */}
                  <div className="mt-12 flex items-center gap-4 justify-center md:justify-start pt-8 border-t border-parchment/40">
                    <div>
                      <span className="block text-[0.75rem] font-bold text-charcoal uppercase tracking-wider">Freshness Ritual Started</span>
                      <span className="block text-[0.65rem] text-warm italic">Join the Alum evolution today</span>
                    </div>
                  </div>
               </div>

               {/* Visual Block */}
               <div className="flex-1 relative flex items-center justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
                  <div className="relative group">
                    {/* Atmospheric Elements */}
                    <div className="absolute inset-0 bg-sage-light/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-1000 group-hover:scale-125" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-parchment/60 animate-spin-slow opacity-30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-sage-light/20 animate-spin-slower opacity-20" />

                    {/* Product Orb */}
                    <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white shadow-[0_25px_80px_rgba(44,44,44,0.08)] rounded-full flex items-center justify-center border border-parchment animate-float">
                       <Image 
                          src={getOptimizedImageUrl(slide.image_url || "https://lyfugzdxfcqlrsmermjm.supabase.co/storage/v1/object/public/alumfresh-image/1774611862532-product.png", { width: 800, quality: 80 })} 
                          alt={slide.title || "Banner Product Image"} 
                          width={400}
                          height={400}
                          className="w-[110%] h-[110%] object-contain scale-125 drop-shadow-[0_20px_35px_rgba(44,44,44,0.15)] transition-transform duration-700 group-hover:scale-[1.35] group-hover:-translate-y-4"
                          priority={idx === 0}
                       />
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute -top-4 -right-12 md:-right-16 bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-float z-30" style={{ animationDelay: "1s" }}>
                       <Leaf className="w-3.5 h-3.5 text-sage-dark" />
                       <span className="text-[0.6rem] font-black uppercase tracking-widest text-charcoal">Pure Crystal</span>
                    </div>
                    <div className="absolute -bottom-6 -left-12 md:-left-24 bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-2 rounded-full shadow-lg flex items-center gap-2 animate-float-delayed z-30">
                       <ShieldCheck className="w-3.5 h-3.5 text-rose-dark" />
                       <span className="text-[0.6rem] font-black uppercase tracking-widest text-charcoal">Suitable for all skin types</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-charcoal hover:shadow-lg transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-charcoal hover:shadow-lg transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bars */}
      <div className="absolute left-0 right-0 top-0 h-1 z-30 flex gap-1">
         {slides.map((_, i) => (
           <div key={i} className="flex-1 bg-parchment/30 overflow-hidden relative">
              <div className="absolute inset-0 bg-sage-dark/40 origin-left animate-marquee" style={{ animationDuration: '5s', animationIterationCount: 'infinite' }} />
           </div>
         ))}
      </div>
    </section>
  );
}
