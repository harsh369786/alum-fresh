"use client";
import React from "react";

interface GlowCardProps {
  glowColor?: string;
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function GlowCard({ glowColor = "rgba(0,212,200,0.2)", className = "", hover = true, children }: GlowCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl transition-all duration-300 ${hover ? "hover:-translate-y-1" : ""} ${className}`}
      style={{
        boxShadow: hover ? undefined : undefined,
      }}
      onMouseEnter={hover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.3)`;
        (e.currentTarget as HTMLDivElement).style.borderColor = glowColor.replace("0.2", "0.4");
      } : undefined}
      onMouseLeave={hover ? (e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        (e.currentTarget as HTMLDivElement).style.borderColor = "";
      } : undefined}
    >
      {children}
    </div>
  );
}
