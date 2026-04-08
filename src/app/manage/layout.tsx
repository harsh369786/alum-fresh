"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Image as ImageIcon, Tags, ArrowLeft, Menu, X, Ticket, LogOut, Truck } from "lucide-react";
import { LOGO_URL } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { label: "Overview", href: "/manage", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Products", href: "/manage/products", icon: <ShoppingBag className="w-4 h-4" /> },
    { label: "Orders", href: "/manage/orders", icon: <Package className="w-4 h-4" /> },
    { label: "Shipping", href: "/manage/shipping", icon: <Truck className="w-4 h-4" /> },
    { label: "Promotions", href: "/manage/discounts", icon: <Ticket className="w-4 h-4" /> },
    { label: "Banners", href: "/manage/banners", icon: <ImageIcon className="w-4 h-4" /> },
    { label: "Categories", href: "/manage/categories", icon: <Tags className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-cream/30 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-parchment sticky top-0 z-40 shadow-sm">
        <Link href="/manage" className="flex items-center gap-3 group whitespace-nowrap overflow-hidden">
          <img src={LOGO_URL} alt="Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm shrink-0" />
          <div className="min-w-0">
            <span className="font-serif text-[0.9rem] text-charcoal block leading-none truncate">The Aura Company</span>
            <span className="text-[0.55rem] uppercase tracking-widest text-sage-dark font-bold block mt-1">Admin Console</span>
          </div>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-cream rounded-full text-charcoal">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sliding Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] z-30 bg-white flex flex-col p-6 animate-fade-up border-b border-parchment shadow-xl">
          <nav className="flex-1 space-y-2">
            {NAV_ITEMS.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[0.85rem] font-bold tracking-wide transition-all duration-300 ${pathname === href ? 'bg-sage-dark text-white' : 'text-warm hover:text-charcoal hover:bg-cream'}`}
              >
                <span className={pathname === href ? 'text-white' : 'text-sage-dark'}>{icon}</span>
                {label}
              </Link>
            ))}
          </nav>
          <div className="pt-6 border-t border-parchment mt-6">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-[0.7rem] uppercase tracking-widest font-black text-warm hover:text-charcoal transition-colors bg-cream py-3 rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
            </Link>
            <button 
              onClick={async () => { await fetch("/api/auth/login", { method: "DELETE" }); window.location.href = "/admin-login"; }}
              className="flex items-center justify-center w-full gap-2 text-[0.7rem] uppercase tracking-widest font-black text-rose-dark hover:text-rose transition-colors bg-rose-light/10 py-3 rounded-xl mt-2"
            >
              <LogOut className="w-3.5 h-3.5" /> Secure Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-parchment fixed inset-y-0 left-0 z-30 flex-col shadow-sm">
        <div className="p-6">
          <Link href="/manage" className="flex items-center gap-3 group whitespace-nowrap">
            <img src={LOGO_URL} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-md transition-transform group-hover:scale-110 shrink-0" />
            <div className="min-w-0">
              <span className="font-serif text-[0.9rem] text-charcoal block leading-none truncate">The Aura Company</span>
              <span className="text-[0.55rem] uppercase tracking-widest text-sage-dark font-bold block mt-1">Admin Console</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 mt-4 space-y-2">
          {NAV_ITEMS.map(({ label, href, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[0.82rem] font-bold tracking-wide transition-all duration-300 group ${pathname === href ? 'bg-sage-dark text-white shadow-md' : 'text-warm hover:text-charcoal hover:bg-cream'}`}
            >
              <span className={pathname === href ? 'text-white/90' : 'text-parchment group-hover:text-sage-dark transition-colors'}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t border-parchment flex flex-col gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-black text-warm hover:text-charcoal transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            Return to Store
          </Link>
          <button 
            onClick={async () => { await fetch("/api/auth/login", { method: "DELETE" }); window.location.href = "/admin-login"; }}
            className="flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-black text-rose-dark hover:text-rose transition-colors group text-left"
          >
            <LogOut className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 md:ml-64 w-full max-w-[100vw] overflow-x-hidden md:max-w-none">
        <div className="p-4 sm:p-6 md:p-10 animate-fade-up max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
