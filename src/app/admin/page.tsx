import React from "react";
import { createServerSupabaseClient } from "@/lib/supabase";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard | Alum Fresh" };

export default async function AdminPage() {
  let stats = { orders: 0, revenue: 0, products: 0 };
  let recentOrders: any[] = [];

  try {
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
  } catch {}

  const statCards = [
    { label: "Total Orders", value: stats.orders, icon: "📦", color: "teal" },
    { label: "Revenue", value: formatPrice(stats.revenue), icon: "💰", color: "purple" },
    { label: "Products", value: stats.products, icon: "🧴", color: "magenta" },
  ];

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    confirmed: "text-teal",
    shipped: "text-purple-light",
    delivered: "text-green-400",
    cancelled: "text-red-400",
  };

  return (
    <div>
      <h1 className="font-syne font-black text-2xl text-text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        {statCards.map(card => (
          <div key={card.label} className="glass-card rounded-2xl p-6">
            <div className="text-3xl mb-3">{card.icon}</div>
            <div className="font-syne font-black text-2xl gradient-text mb-1">{card.value}</div>
            <div className="text-text-muted text-sm">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-syne font-bold text-lg text-text-primary">Recent Orders</h2>
          <a href="/admin/orders" className="text-sm text-teal hover:underline">View all</a>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-text-muted text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/8">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/3">
                  <td className="py-3 text-teal font-mono text-xs">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="py-3 text-text-primary">{order.user_name}</td>
                  <td className="py-3 text-text-primary">{formatPrice(order.total)}</td>
                  <td className={`py-3 capitalize font-medium ${statusColors[order.status] || "text-text-muted"}`}>{order.status}</td>
                  <td className="py-3 text-text-muted">{formatDate(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
