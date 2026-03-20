"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-teal bg-teal/10 border-teal/20",
  shipped: "text-purple-light bg-purple/10 border-purple/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    const { data } = await (supabase as any).from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await (supabase as any).from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    fetchOrders();
  }

  return (
    <div>
      <h1 className="font-syne font-black text-2xl text-text-primary mb-8">Orders</h1>

      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No orders yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/8 bg-surface2">
                {["Order ID", "Customer", "Items", "Total", "Status", "Date", ""].map(h => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="border-b border-white/5 hover:bg-white/3 cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                    <td className="px-4 py-3 text-teal font-mono text-xs">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div className="text-text-primary">{order.user_name}</div>
                      <div className="text-text-muted text-xs">{order.user_email}</div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{Array.isArray(order.items) ? order.items.length : 0} item(s)</td>
                    <td className="px-4 py-3 text-text-primary font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value); }}
                        onClick={e => e.stopPropagation()}
                        className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer focus:outline-none bg-transparent ${STATUS_COLORS[order.status] || ""}`}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-surface text-text-primary capitalize">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3"><ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${expanded === order.id ? "rotate-180" : ""}`} /></td>
                  </tr>
                  {expanded === order.id && (
                    <tr className="bg-surface2/50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-6 text-sm">
                          <div>
                            <p className="text-text-muted mb-2 font-medium">Delivery Address</p>
                            <p className="text-text-primary">{order.address?.line1}</p>
                            <p className="text-text-muted">{order.address?.city}, {order.address?.state} — {order.address?.pincode}</p>
                          </div>
                          <div>
                            <p className="text-text-muted mb-2 font-medium">Items Ordered</p>
                            {Array.isArray(order.items) && order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm mb-1">
                                <span className="text-text-primary">{item.name} × {item.qty} {item.variant ? `(${item.variant})` : ""}</span>
                                <span className="text-teal">{formatPrice(item.price * item.qty)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
