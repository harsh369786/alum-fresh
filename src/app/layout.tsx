import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#f8f4ed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <CartProvider>
          {/* Ambient soft background blob */}
          <div className="ambient-blob-teal" aria-hidden="true" />

          <Header />
          <main className="relative z-10 w-full overflow-x-hidden">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
