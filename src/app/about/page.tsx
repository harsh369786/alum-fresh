import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/cta-banner";
import { Sparkles, Leaf, Shield, Heart, Globe, Recycle } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story | The Aura Company",
  description: "Learn about Alum Fresh — from traditional alum rituals in Mumbai to India's premium natural deodorant.",
};

const TEAM = [
  { name: "Meera Sharma", role: "Co-Founder & CEO", emoji: "👩🏽", location: "Mumbai" },
  { name: "Arjun Patel", role: "Head of Formulation", emoji: "👨🏽‍🔬", location: "Bangalore" },
  { name: "Rhea Kapoor", role: "Brand & Creative Lead", emoji: "👩🏻‍🎨", location: "Mumbai" },
];

const MISSION_CARDS = [
  { icon: <Leaf className="w-6 h-6" />, title: "Honest Ingredients", desc: "We disclose every single element. No hidden chemicals, no misleading claims. Just pure, transparent nature." },
  { icon: <Shield className="w-6 h-6" />, title: "Time-Tested Wisdom", desc: "We use Alum (Fitkiri), a natural mineral crystal used for generations to kill odor-causing bacteria at the source." },
  { icon: <Heart className="w-6 h-6" />, title: "Personal Purpose", desc: "Started as a personal need to find a real solution for daily comfort, it became our mission to share it with everyone." },
];

export default function AboutPage() {
  return (
    <main className="bg-cream/30 min-h-screen">
      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden px-6 md:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sage-light/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-up">
          <span className="eyebrow">Our Story</span>
          <h1 className="font-serif italic text-[clamp(2.5rem,6vw,4.5rem)] text-charcoal leading-tight mb-8">
            Born from a <em className="text-sage-dark">real problem.</em>
          </h1>
          <p className="text-[1.1rem] text-warm max-w-2xl mx-auto leading-relaxed font-light">
            We noticed how something as common as underarm odor could affect comfort—both at home and in daily life. 
            Alum Fresh was born from our search for a solution that truly works.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-24 px-6 md:px-8 bg-white border-y border-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="relative animate-fade-up">
              <div className="aspect-[4/5] bg-cream rounded-[3rem] overflow-hidden border border-parchment p-12 flex items-center justify-center relative group">
                <div className="text-[12rem] drop-shadow-[0_25px_50px_rgba(0,0,0,0.12)] transition-transform duration-700 group-hover:scale-105 group-hover:-translate-y-4">
                  💎
                </div>
                <div className="absolute top-10 right-10 w-20 h-20 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-parchment/30 animate-float">
                  🌿
                </div>
                <div className="absolute bottom-16 left-12 w-16 h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-parchment/30 animate-float" style={{ animationDelay: "1s" }}>
                  🌸
                </div>
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <span className="eyebrow">The Origin</span>
              <h2 className="font-serif text-[2.5rem] opacity-90 text-charcoal leading-tight mb-8">
                The crystal that <em className="text-sage-dark">changed everything.</em>
              </h2>
              <div className="space-y-6 text-[0.95rem] text-warm leading-[1.8] font-light">
                <p>
                  It began with a simple, real problem. After getting married, we noticed how something as common as underarm odor could affect comfort—both at home and in daily life. Sitting close to your partner or attending meetings by the end of a long day often came with a sense of discomfort and lost confidence.
                </p>
                <p>
                  Like everyone else, we tried deodorants and perfumes. They worked for a few hours—but once the fragrance faded, the sweat odor took over again. It was clear they were only masking the problem.
                </p>
                <p>
                  Looking for a real solution, we turned to research—and found the answer in nature itself. A time-tested remedy used for generations: Alum (Fitkiri). Known for its ability to kill odor-causing bacteria, it naturally eliminates bad odor at the source.
                </p>
                <p className="font-medium text-charcoal">
                  What started as a personal need became our purpose—to create a natural, effective solution that truly works for everyone.
                </p>
              </div>
              <div className="pt-10 flex gap-4">
                <div className="flex items-center gap-3 bg-cream/50 px-5 py-3 rounded-full border border-parchment shadow-sm">
                   <Shield className="w-4 h-4 text-sage-dark" />
                   <span className="text-[0.7rem] font-bold uppercase tracking-widest text-charcoal">Pure & Mineral Based</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Grid */}
      <section className="py-32 px-6 md:px-8 bg-cream/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-fade-up">
            <span className="eyebrow">Commitment</span>
            <h2 className="font-serif text-[2.5rem] text-charcoal">What fuels <em className="text-sage-dark">our growth.</em></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {MISSION_CARDS.map((card, i) => (
              <div 
                key={card.title} 
                className="bg-white border border-parchment rounded-[2.5rem] p-10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-fade-up group"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-14 h-14 bg-cream rounded-2xl flex items-center justify-center text-sage-dark mb-8 group-hover:scale-110 transition-transform duration-500">
                  {card.icon}
                </div>
                <h3 className="font-serif text-[1.4rem] text-charcoal mb-4">{card.title}</h3>
                <p className="text-[0.88rem] text-warm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose Statement */}
      <section className="py-32 px-6 md:px-8 relative overflow-hidden bg-charcoal text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-up">
          <Heart className="w-8 h-8 text-sage mx-auto mb-8 opacity-60" />
          <h2 className="font-serif italic text-[2.2rem] md:text-[2.8rem] leading-snug mb-10">
            &quot;We don&apos;t just sell Alum Roll-Ons; we sell the peace of mind that comes from knowing exactly what you&apos;re putting on your skin.&quot;
          </h2>
          <div className="w-24 h-px bg-sage/30 mx-auto" />
        </div>
      </section>

      <CtaBanner />
    </main>
  );
}
