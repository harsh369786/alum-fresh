"use client";
import React from "react";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden text-center mx-4 md:mx-10 mb-16 rounded-[2.5rem] py-24 px-6 md:px-16"
      style={{ background: "linear-gradient(160deg, #1b4332 0%, #2d6a4f 50%, #3a7d5e 100%)" }}
    >
      {/* Center glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,213,187,0.2), transparent)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto animate-fade-up">
        <div className="inline-flex items-center justify-center gap-3 text-[0.68rem] font-bold tracking-[0.15em] uppercase mb-5"
          style={{ color: "rgba(212,237,225,0.8)" }}>
          <span className="inline-block w-6 h-px" style={{ background: "rgba(212,237,225,0.6)" }} />
          Limited Time Offer
        </div>
        <h2 className="font-serif font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.1] text-white mb-4">
          Get 60% off your<br />
          <em style={{ color: "#a8d5bb" }}>first order.</em>
        </h2>
        <p className="text-[0.95rem] leading-[1.8] mb-12 max-w-[500px] mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          Free shipping on all orders. No coupon required.
        </p>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 px-11 py-5 rounded-full bg-white text-[#1b4332] text-[0.85rem] font-bold uppercase tracking-wider shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(0,0,0,0.3)] transition-all duration-300"
          >
            Claim Offer →
          </Link>
          <div
            className="inline-flex items-center gap-3 px-7 py-5 rounded-full text-white text-[0.85rem] tracking-[0.05em]"
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(12px)" }}
          >
            No coupon required
          </div>
        </div>
      </div>
    </section>
  );
}
