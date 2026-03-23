"use client";
import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { ArrowRight, Sparkles, Gift, Leaf } from "lucide-react";

interface CategoryGridProps {
  categories: Category[];
}

const FALLBACK_CATEGORIES = [
  { id: "1", name: "Roll-On Deodorants", slug: "roll-on", description: "Natural alum crystal roll-ons. Chemical-free, dermatologically tested, and vegan friendly.", image_url: null, sort_order: 0, created_at: "" },
  { id: "2", name: "Bundles & Gift Sets", slug: "bundles", description: "Discover our best value with curated combo packs featuring all three natural variants.", image_url: null, sort_order: 1, created_at: "" },
  { id: "3", name: "Natural Skincare", slug: "skincare", description: "Coming soon. Expanding our range with ancient Ayurvedic wisdom for modern skin.", image_url: null, sort_order: 2, created_at: "" },
];

const CATEGORY_DETAILS = [
  { icon: <Leaf className="w-6 h-6" />, bg: "bg-sage-light/10", border: "border-sage-light/20", text: "text-sage-dark", emoji: "🌿" },
  { icon: <Gift className="w-6 h-6" />, bg: "bg-rose-light/10", border: "border-rose-light/20", text: "text-rose-dark", emoji: "🎁" },
  { icon: <Sparkles className="w-6 h-6" />, bg: "bg-parchment/30", border: "border-parchment/60", text: "text-warm", emoji: "✨" },
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  const cats = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="py-24 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <span className="eyebrow block">Curated Selection</span>
          <h2 className="font-serif italic text-[clamp(2rem,5vw,3rem)] text-charcoal leading-tight mb-4">
            Shop by <em className="text-sage-dark">Category.</em>
          </h2>
          <p className="text-[1rem] text-warm max-w-md mx-auto leading-relaxed font-light opacity-80">
            Find the perfect natural ritual for your daily lifestyle.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cats.map((cat, idx) => {
            const details = CATEGORY_DETAILS[idx % CATEGORY_DETAILS.length];
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`group relative rounded-[2.5rem] overflow-hidden border ${details.border} ${details.bg} p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-charcoal/5 block animate-fade-up`}
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/40 bg-white/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${details.text}`}>
                    {details.icon}
                  </div>
                  
                  <h3 className="font-serif text-[1.6rem] text-charcoal leading-tight mb-4 group-hover:text-sage-dark transition-colors">
                    {cat.name}
                  </h3>
                  
                  <p className="text-[0.88rem] text-warm leading-relaxed mb-8 opacity-70 group-hover:opacity-100 transition-opacity min-h-[4em]">
                    {cat.description}
                  </p>

                  <div className={`inline-flex items-center gap-2 text-[0.7rem] font-black uppercase tracking-[0.2em] transition-all group-hover:gap-4 ${details.text}`}>
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-5 pointer-events-none group-hover:rotate-12 group-hover:scale-125 transition-all duration-700">
                   {details.emoji}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
