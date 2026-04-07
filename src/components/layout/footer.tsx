"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINKS, BRAND_NAME, LOGO_URL } from "@/lib/constants";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/manage")) {
    return null;
  }

  return (
    <footer className="bg-charcoal text-white/65 px-8 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 max-w-7xl mx-auto mb-10">
        
        {/* Brand */}
        <div className="fbrand">
<<<<<<< HEAD
          <Link href="/" className="inline-block mb-3 p-1 bg-white/5 rounded-lg">
            <img src="/logo.png" alt="The Aura Company" className="h-12 w-auto object-contain" />
=======
          <Link href="/" className="inline-block mb-6 group transition-all duration-300 hover:opacity-80">
            <img 
              src={LOGO_URL} 
              alt="The Aura Company" 
              className="h-[52px] w-auto rounded-lg shadow-lg opacity-90 group-hover:opacity-100 transition-opacity"
            />
>>>>>>> 5bdbf6e (Logo centralization, mobile modal UX fixes, cart image restoration, and currency alignment optimization)
          </Link>
          <p className="text-[0.8rem] leading-[1.7] max-w-[260px] text-white/80">
            Stay fresh, naturally. Pure personal care, kind to your skin and the planet.
          </p>
          <div className="flex gap-2.5 mt-5">
            {[
              { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
              { icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
              { icon: <Facebook className="w-4 h-4" />, label: "Facebook" },
              { icon: <Youtube className="w-4 h-4" />, label: "Youtube" },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-[34px] h-[34px] rounded-full border border-white/20 flex items-center justify-center text-[0.8rem] transition-all duration-300 hover:border-sage-light hover:text-sage-light hover:-translate-y-[3px]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div className="fcol">
          <h5 className="font-sans text-[0.68rem] font-medium tracking-[0.14em] uppercase text-white mb-4">
            Shop
          </h5>
          <ul className="flex flex-col gap-2 list-none">
            {FOOTER_LINKS.shop.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-[0.8rem] text-white/65 hover:text-sage-light transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links */}
        <div className="fcol">
          <h5 className="font-sans text-[0.68rem] font-medium tracking-[0.14em] uppercase text-white mb-4">
            Company
          </h5>
          <ul className="flex flex-col gap-2 list-none">
            {FOOTER_LINKS.company.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-[0.8rem] text-white/65 hover:text-sage-light transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div className="fcol">
          <h5 className="font-sans text-[0.68rem] font-medium tracking-[0.14em] uppercase text-white mb-4">
            Support
          </h5>
          <ul className="flex flex-col gap-2 list-none">
            {FOOTER_LINKS.support.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-[0.8rem] text-white/65 hover:text-sage-light transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[0.75rem] gap-3 text-center">
        <p>© {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
        <p>Made with 🌿 in India</p>
      </div>
    </footer>
  );
}
