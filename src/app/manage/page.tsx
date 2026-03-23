import React from "react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getProducts } from "@/lib/data-service";
import { formatPrice, formatDate } from "@/lib/utils";
import { TrendingUp, Package, ShoppingBag, ArrowRight, User, DollarSign } from "lucide-react";

export const metadata = { title: "Overview | Alum Fresh Admin" };

export default async function AdminPage() {
  let stats = { orders: 0, revenue: 0, products: 0 };
  let recentOrders: any[] = [];

  try {
    const hasSupabase = !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co"
    );

    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
    const [ordersRes, productsRes, recentRes] = await Promise.all([
      supabase.from("orders").select("total, status"),
      supabase.from("products").select("id", { count: "exact" }),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
    ]);
    stats.orders = ordersRes.data?.length || 0;
    stats.revenue = ordersRes.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
      stats.products = productsRes.count || 0;
      recentOrders = recentRes.data || [];
    } else {
      const allProducts = await getProducts();
      stats.products = allProducts.length;
    }
  } catch (err) {
    console.error("Admin stats error:", err);
  }

  const statCards = [
    { label: "Total Orders", value: stats.orders, icon: <Package className="w-5 h-5" />, trend: "+12%" },
    { label: "Total Revenue", value: formatPrice(stats.revenue), icon: <DollarSign className="w-5 h-5" />, trend: "+8.5%" },
    { label: "Total Products", value: stats.products, icon: <ShoppingBag className="w-5 h-5" />, trend: "Active" },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-orange-100 text-orange-700 border-orange-200",
    confirmed: "bg-sage-light/20 text-sage-dark border-sage-light/30",
    shipped: "bg-parchment text-charcoal border-parchment/60",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow block">Analytics Overview</span>
          <h1 className="font-serif italic text-3xl text-charcoal">Dashboard &nbsp;📊</h1>
        </div>
        <Link href="/manage/orders" className="text-[0.7rem] uppercase tracking-widest font-black text-sage-dark flex items-center gap-2 group">
           Detailed Reports <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {statCards.map((card, i) => (
          <div key={card.label} className="bg-white border border-parchment rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all duration-500">
            <div className="flex items-center justify-between mb-6">
               <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-sage-dark">
                  {card.icon}
               </div>
               <span className="text-[0.65rem] font-bold uppercase tracking-widest text-sage-dark bg-sage-light/10 px-2 py-0.5 rounded italic">
                  {card.trend}
               </span>
            </div>
            <div className="font-serif text-[2rem] text-charcoal leading-none mb-1">{card.value}</div>
            <div className="text-[0.75rem] uppercase tracking-wider text-warm font-medium opacity-60">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-parchment rounded-[2.5rem] p-8 md:p-10 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-serif italic text-2xl text-charcoal">Recent Shipments</h2>
          <Link href="/manage/orders" className="text-[0.65rem] uppercase font-bold tracking-widest text-warm hover:text-charcoal transition-colors">
            Manage All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-20 text-center bg-cream/20 rounded-[2rem] border border-parchment border-dashed">
            <p className="font-serif text-[1.2rem] text-warm opacity-60">The order book is currently breathing...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-widest text-warm border-b border-parchment">
                  <th className="pb-5 pl-4 font-black">Ref ID</th>
                  <th className="pb-5 font-black">Customer</th>
                  <th className="pb-5 font-black">Investment</th>
                  <th className="pb-5 font-black">Current Status</th>
                  <th className="pb-5 pr-4 font-black">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/40">
                {recentOrders.map(order => (
                  <tr key={order.id} className="group hover:bg-cream/20 transition-all">
                    <td className="py-5 pl-4 font-mono text-[0.7rem] text-sage-dark font-black">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-parchment flex items-center justify-center text-[0.6rem] font-black text-charcoal flex-shrink-0">
                             {order.user_name?.charAt(0)}
                          </div>
                          <span className="text-[0.88rem] font-medium text-charcoal">{order.user_name}</span>
                       </div>
                    </td>
                    <td className="py-5 font-serif text-[1.1rem] text-charcoal">{formatPrice(order.total)}</td>
                    <td className="py-5">
                       <span className={`px-4 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-tighter border ${statusColors[order.status] || "bg-cream text-warm border-parchment"}`}>
                          {order.status}
                       </span>
                    </td>
                    <td className="py-5 pr-4 text-[0.78rem] text-warm">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
