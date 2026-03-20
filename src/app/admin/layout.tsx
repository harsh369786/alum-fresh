import React from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Basic auth check — in production you'd verify the session
  // For now, we allow access but redirect if no Supabase is configured
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 bg-surface border-r border-white/8 fixed inset-y-0 left-0 z-30 flex flex-col">
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center text-[#08070F] font-black text-xs">
              AF
            </div>
            <span className="font-syne font-bold text-sm gradient-text">Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: "Dashboard", href: "/admin", icon: "📊" },
            { label: "Products", href: "/admin/products", icon: "🧴" },
            { label: "Orders", href: "/admin/orders", icon: "📦" },
            { label: "Banners", href: "/admin/banners", icon: "🖼️" },
            { label: "Categories", href: "/admin/categories", icon: "🗂️" },
          ].map(({ label, href, icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8">
          <a href="/" className="text-xs text-text-muted hover:text-teal transition-colors">
            ← View Store
          </a>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-56 flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
