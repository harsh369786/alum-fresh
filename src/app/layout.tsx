import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: { default: "Alum Fresh — Stay Fresh, Naturally.", template: "%s | Alum Fresh" },
  description: "100% Alum. 0% Chemicals. Natural alum-based roll-on deodorant. Chemical-free, dermatologist tested, vegan, cruelty-free. Made in India.",
  keywords: ["natural deodorant", "alum deodorant", "chemical-free", "vegan deodorant", "India", "Alum Fresh"],
  openGraph: {
    siteName: "Alum Fresh",
    title: "Alum Fresh — Stay Fresh, Naturally.",
    description: "100% Alum. 0% Chemicals. Premium natural deodorant.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary font-inter antialiased" suppressHydrationWarning>
        <CartProvider>
          {/* Ambient glow blobs */}
          <div className="ambient-blob-teal" aria-hidden="true" />
          <div className="ambient-blob-purple" aria-hidden="true" />
          <div className="ambient-blob-magenta" aria-hidden="true" />

          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
