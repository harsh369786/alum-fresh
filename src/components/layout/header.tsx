"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { NAV_LINKS, BRAND_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Header() {
  const { getItemCount } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemCount = getItemCount();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 py-3 transition-all duration-300 ${
          scrolled
            ? "bg-cream/90 backdrop-blur-xl border-b border-sage-light/20 shadow-sm py-2"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-medium text-charcoal cursor-pointer">
          Alum<span className="text-sage-dark">Fresh</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 list-none">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/');
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[0.82rem] tracking-wider relative transition-colors cursor-pointer group pb-1 ${
                    isActive ? "text-sage-dark" : "text-charcoal hover:text-sage-dark"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-sage-dark transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative cursor-pointer p-1">
            <ShoppingCart className="w-[20px] h-[20px] text-charcoal" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 w-[15px] h-[15px] bg-sage-dark text-white rounded-full text-[0.58rem] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <Button
            variant="teal"
            size="sm"
            className="hidden md:inline-flex bg-sage-dark text-white hover:bg-sage hover:-translate-y-0.5 shadow-sm rounded-full px-5 py-2 h-auto text-[0.78rem]"
            asChild
          >
            <Link href="/category/roll-on">Shop Now</Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1 text-charcoal"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cream/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 pt-16">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-serif text-charcoal hover:text-sage-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="teal" size="lg" className="bg-sage-dark rounded-full mt-4" asChild>
            <Link href="/category/roll-on" onClick={() => setMenuOpen(false)}>
              Shop Now
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
