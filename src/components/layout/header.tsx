"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Menu, X, Search, LayoutDashboard } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Header() {
  const { getItemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data.filter((p: any) => p.in_stock)))
      .catch(console.error);
  }, []);

  const suggestions = searchQuery.trim() 
    ? products
        .filter(item => item.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()))
        .map(p => p.name)
        .slice(0, 5)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  }

  const itemCount = getItemCount();

  if (pathname.startsWith("/manage")) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-3 md:py-5 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-parchment shadow-sm py-2 md:py-3"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="font-serif text-[1.3rem] md:text-[1.4rem] font-medium text-charcoal tracking-tight group shrink-0">
          The Aura <span className="text-sage-dark group-hover:text-charcoal transition-colors">Company</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex gap-8 list-none">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[0.65rem] font-black uppercase tracking-[0.18em] relative transition-all group pb-1 ${
                    isActive ? "text-sage-dark" : "text-charcoal hover:text-sage-dark opacity-60 hover:opacity-100"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-[1.5px] bg-sage-dark transition-all duration-500 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:bg-cream rounded-full transition-colors text-charcoal opacity-60 hover:opacity-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-cream rounded-full transition-colors group" aria-label="Cart">
            <ShoppingCart className="w-5 h-5 text-charcoal opacity-60 group-hover:opacity-100 transition-opacity" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-sage-dark text-white rounded-full text-[0.55rem] font-bold flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Shop button */}
          <Button
            variant="sage"
            size="sm"
            className="hidden md:inline-flex rounded-full px-5 lg:px-8 py-2.5 h-auto text-[0.65rem] lg:text-[0.7rem] shadow-lg shadow-sage-dark/10 shrink-0"
            asChild
          >
            <Link href="/category/roll-on">Shop</Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-charcoal hover:bg-cream rounded-full transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal/10 backdrop-blur-sm flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-parchment overflow-hidden animate-fade-up" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-4 px-6 py-4">
              <Search className="w-5 h-5 text-warm shrink-0" />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for rose, charcoal, natural, bundle..."
                className="flex-1 text-[1rem] text-charcoal placeholder:text-warm/40 outline-none bg-transparent py-2"
              />
              {searchQuery && (
                <button type="submit" className="px-6 py-2 bg-charcoal text-white rounded-full text-[0.7rem] font-bold uppercase tracking-widest hover:bg-sage-dark transition-colors shrink-0">
                  Search
                </button>
              )}
              <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-warm hover:text-charcoal rounded-full hover:bg-cream transition-colors">
                <X className="w-4 h-4" />
              </button>
            </form>
            <div className="px-6 pb-5 border-t border-parchment pt-4">
              {searchQuery.trim() ? (
                <>
                  <p className="text-[0.6rem] uppercase tracking-widest text-warm font-bold mb-3 opacity-60">Suggestions</p>
                  <div className="flex flex-col gap-1">
                    {suggestions.length > 0 ? suggestions.map(s => (
                      <button key={s} onClick={() => { setSearchQuery(s); router.push(`/search?q=${encodeURIComponent(s)}`); setSearchOpen(false); }}
                        className="text-left px-4 py-3 bg-cream/30 hover:bg-cream border border-transparent rounded-xl text-[0.85rem] text-charcoal font-medium transition-all flex items-center gap-3">
                        <Search className="w-4 h-4 text-warm opacity-50" /> {s}
                      </button>
                    )) : (
                      <p className="text-[0.8rem] text-warm italic py-2 px-2">No direct matches for &quot;{searchQuery}&quot;. Hit search to browse all.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-[0.6rem] uppercase tracking-widest text-warm font-bold mb-3 opacity-60">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Rose Edition", "Charcoal", "Natural 50ml", "Bundle"].map(s => (
                      <button key={s} onClick={() => { setSearchQuery(s); router.push(`/search?q=${encodeURIComponent(s)}`); setSearchOpen(false); }}
                        className="px-4 py-1.5 bg-cream border border-parchment rounded-full text-[0.72rem] text-warm hover:text-charcoal hover:border-charcoal/20 transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 animate-fade-up">
          <div className="absolute top-4 right-4">
            <button onClick={() => setMenuOpen(false)} className="p-3 rounded-full border border-parchment text-warm hover:text-charcoal hover:bg-cream transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <Link href="/" onClick={() => setMenuOpen(false)} className="font-serif italic text-[1.8rem] text-charcoal mb-4">
            The Aura <span className="text-sage-dark">Company</span>
          </Link>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-[1.4rem] font-serif text-charcoal hover:text-sage-dark transition-colors ${pathname === link.href ? "text-sage-dark" : ""}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex gap-4 mt-4">
            <Button variant="sage" size="lg" className="rounded-full px-10 py-5 h-auto text-[0.85rem] shadow-xl" asChild>
              <Link href="/category/roll-on" onClick={() => setMenuOpen(false)}>Shop Collection</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
