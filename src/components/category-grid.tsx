"use client";
import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface CategoryGridProps {
  categories: Category[];
}

const FALLBACK_CATEGORIES = [
  { id: "1", name: "Roll-On Deodorants", slug: "roll-on", description: "Natural alum crystal roll-on deodorants. Chemical-free, derma-tested, vegan.", image_url: null, sort_order: 0, created_at: "" },
  { id: "2", name: "Bundles & Gift Sets", slug: "bundles", description: "Try all variants with our curated combo packs. Best value for new customers.", image_url: null, sort_order: 1, created_at: "" },
  { id: "3", name: "Natural Skincare", slug: "skincare", description: "Coming soon. Expanding our range of natural, chemical-free skincare products.", image_url: null, sort_order: 2, created_at: "" },
];

const CATEGORY_DETAILS = [
  { emoji: "🌿", gradientStart: "rgba(0,212,200,0.15)", gradientEnd: "transparent", badge: "Popular", glowColor: "rgba(0,212,200,0.25)" },
  { emoji: "🎁", gradientStart: "rgba(160,132,202,0.15)", gradientEnd: "transparent", badge: "Best Value", glowColor: "rgba(160,132,202,0.25)" },
  { emoji: "✨", gradientStart: "rgba(214,58,249,0.12)", gradientEnd: "transparent", badge: "Coming Soon", glowColor: "rgba(214,58,249,0.2)" },
];

export function CategoryGrid({ categories }: CategoryGridProps) {
  const cats = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="font-syne font-black text-3xl sm:text-4xl text-text-primary mb-3">
            Shop by <span className="gradient-text">Category</span>
          </h2>
          <p className="text-text-muted max-w-md mx-auto">
            Find the perfect natural deodorant for your lifestyle
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cats.map((cat, idx) => {
            const details = CATEGORY_DETAILS[idx % CATEGORY_DETAILS.length];
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden glass-card p-6 transition-all duration-300 hover:-translate-y-2 block"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 30px ${details.glowColor}, 0 12px 40px rgba(0,0,0,0.4)`;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = details.glowColor.replace("0.25","0.45");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "";
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${details.gradientStart} 0%, ${details.gradientEnd} 60%)` }}
                />

                <div className="relative z-10">
                  <div className="text-5xl mb-4">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-16 h-16 object-contain" />
                    ) : (
                      details.emoji
                    )}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-syne font-bold text-lg text-text-primary leading-tight">{cat.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-text-muted border border-white/10 ml-2 shrink-0">
                      {details.badge}
                    </span>
                  </div>
                  <p className="text-text-muted text-sm leading-relaxed mb-4">{cat.description}</p>
                  <div className="flex items-center gap-1 text-teal text-sm font-medium group-hover:gap-2 transition-all">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
