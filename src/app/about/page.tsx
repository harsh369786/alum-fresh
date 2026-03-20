import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/cta-banner";

export const metadata: Metadata = {
  title: "Our Story | Alum Fresh",
  description: "Learn about Alum Fresh — the brand that started with a grandmother's alum ritual in Jaipur and grew into India's premium natural deodorant.",
};

const TEAM = [
  { name: "Meera Sharma", role: "Co-Founder & CEO", emoji: "👩🏽", location: "Jaipur" },
  { name: "Arjun Patel", role: "Head of Formulation", emoji: "👨🏽‍🔬", location: "Bangalore" },
  { name: "Rhea Kapoor", role: "Brand & Creative Lead", emoji: "👩🏻‍🎨", location: "Mumbai" },
];

const MISSION_CARDS = [
  { emoji: "🌱", title: "Honest Ingredients", desc: "We disclose every ingredient in our products. No hidden chemicals, no misleading claims. Just pure, transparent formulas." },
  { emoji: "♻️", title: "Responsible Packaging", desc: "Our packaging uses recyclable materials and minimal plastic. We are on a journey to zero-waste by 2026." },
  { emoji: "🤝", title: "Fair Sourcing", desc: "We partner with ethical suppliers and local farmers who share our commitment to sustainability and fair trade." },
];

const ECO_STATS = [
  { value: "2,400+", label: "Trees Planted", emoji: "🌳" },
  { value: "100%", label: "Recyclable Packaging", emoji: "♻️" },
  { value: "Zero", label: "Carbon Offset Program", emoji: "🌍" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial pointer-events-none opacity-30"
          style={{ background: "radial-gradient(circle, rgba(0,212,200,0.08) 0%, transparent 70%)" }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-1.5 rounded-full mb-6">
            <span className="text-xs text-teal font-medium">Our Story</span>
          </div>
          <h1 className="font-syne font-black text-4xl sm:text-6xl text-text-primary mb-6 leading-tight">
            Born from a{" "}
            <span className="gradient-text italic">Grandmother&apos;s Ritual</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            It started in Jaipur, in a small kitchen, watching our grandmother rub an alum crystal under her arms every morning. Simple, effective, chemical-free. We thought — why had the world forgotten this?
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64 rounded-3xl glass-card flex items-center justify-center text-8xl"
                style={{ boxShadow: "0 0 60px rgba(0,212,200,0.12)" }}>
                💎
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center text-xl">🌿</div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-purple/20 border border-purple-light/30 flex items-center justify-center text-xl">🌸</div>
              </div>
            </div>
            <div>
              <h2 className="font-syne font-black text-3xl text-text-primary mb-4">
                The <span className="gradient-text">Origin</span>
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>In 2020, during the pandemic lockdown, our co-founder Meera returned to her family home in Jaipur. She watched her 78-year-old grandmother glide a crystal block under her arms, just as she had every morning for six decades.</p>
                <p>She had never used a commercial deodorant in her life — and her skin was flawless. No irritation, no dark marks, no chemicals. Just pure alum crystal.</p>
                <p>That moment sparked a mission: bring this ancient Ayurvedic wisdom to modern India, in a form that&apos;s convenient, beautiful, and genuinely effective.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="section-padding bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="glass-card rounded-2xl p-8">
              <div className="text-3xl mb-4">⚠️</div>
              <h3 className="font-syne font-bold text-xl text-text-primary mb-3">The Problem</h3>
              <p className="text-text-muted leading-relaxed">95% of commercial deodorants contain aluminum chloride, parabens, synthetic fragrances, and other chemicals linked to skin irritation, hormonal disruption, and long-term health concerns. Yet we apply them to one of our body&apos;s most sensitive areas every single day.</p>
            </div>
            <div className="glass-card rounded-2xl p-8 border-teal/20" style={{ borderColor: "rgba(0,212,200,0.15)" }}>
              <div className="text-3xl mb-4">✨</div>
              <h3 className="font-syne font-bold text-xl text-text-primary mb-3">Our Solution</h3>
              <p className="text-text-muted leading-relaxed">Alum Fresh uses potassium alum — a 100% natural mineral salt that creates an inhospitable environment for odor-causing bacteria without blocking your pores or introducing harmful chemicals. Available in Rose, Natural, and Charcoal variants for every preference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-syne font-black text-3xl sm:text-4xl text-text-primary mb-3">
              Our <span className="gradient-text">Mission</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {MISSION_CARDS.map(card => (
              <div key={card.title} className="glass-card rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform cursor-default">
                <div className="text-4xl mb-4">{card.emoji}</div>
                <h3 className="font-syne font-bold text-lg text-text-primary mb-2">{card.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-surface/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-syne font-black text-3xl sm:text-4xl text-text-primary mb-3">
              Meet the <span className="gradient-text">Team</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="glass-card rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform cursor-default">
                <div className="text-6xl mb-3">{member.emoji}</div>
                <h3 className="font-syne font-bold text-base text-text-primary mb-1">{member.name}</h3>
                <p className="text-teal text-xs font-medium mb-1">{member.role}</p>
                <p className="text-text-muted text-xs">{member.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eco stats */}
      <section className="section-padding" id="eco">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-10">
            <h2 className="font-syne font-black text-2xl text-text-primary text-center mb-8">Our Environmental Commitment</h2>
            <div className="grid grid-cols-3 gap-8 text-center">
              {ECO_STATS.map(stat => (
                <div key={stat.label}>
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="font-syne font-black text-3xl gradient-text mb-1">{stat.value}</div>
                  <div className="text-text-muted text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
