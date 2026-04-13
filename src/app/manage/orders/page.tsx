"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { ChevronDown, Package, MapPin, Inbox, Loader2, ArrowRight, Phone, Mail } from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_STYLING: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  confirmed: "bg-sage-light/20 text-sage-dark border-sage-light/30",
  shipped: "bg-parchment text-charcoal border-parchment/60",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [razorpayStates, setRazorpayStates] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleExpand(id: string) {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);

    const activeOrder = orders.find((o) => o.id === id);
    if (activeOrder?.notes && activeOrder.notes.includes("[Razorpay Payment ID:")) {
      const match = activeOrder.notes.match(/\[Razorpay Payment ID:\s*(.*?)\]/);
      if (match && match[1]) {
        const pid = match[1];
        if (!razorpayStates[id]) {
          fetch(`/api/razorpay/payment-status?id=${pid}`)
            .then((res) => res.json())
            .then((data) => {
              if (!data.error) setRazorpayStates((prev) => ({ ...prev, [id]: data }));
            })
            .catch(() => {});
        }
      }
    }
  }

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchOrders();
    } catch (e) {
      console.error("Status updated failed: ", e);
    }
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow block">Fulfillment Terminal</span>
          <h1 className="font-serif italic text-3xl text-charcoal">Customer Orders</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-white border border-parchment px-5 py-2 rounded-full shadow-sm">
          <Inbox className="w-4 h-4 text-sage-dark" />
          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-warm">
            Queue: {orders.length}
          </span>
        </div>
      </div>

      <div className="bg-white border border-parchment rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4 text-warm opacity-40">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-[0.7rem] uppercase tracking-[0.3em] font-black">
              Syncing Order Ledger...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-32 text-center bg-cream/20 border-dashed border border-parchment rounded-[2.5rem] m-8">
            <p className="font-serif italic text-xl text-warm opacity-60">
              The order book is currently breathing...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-widest text-warm border-b border-parchment bg-cream/30">
                  <th className="py-6 pl-8 font-black">Ref ID</th>
                  <th className="py-6 font-black">Customer Detail</th>
                  <th className="py-6 font-black text-center">Volume</th>
                  <th className="py-6 font-black">Investment</th>
                  <th className="py-6 font-black">Track Status</th>
                  <th className="py-6 font-black">Logged Date</th>
                  <th className="py-6 pr-8 font-black"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/40">
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className={`group hover:bg-cream/20 transition-all cursor-pointer ${
                        expanded === order.id ? "bg-cream/40" : ""
                      }`}
                      onClick={() => handleExpand(order.id)}
                    >
                      <td className="py-6 pl-8">
                        <span className="font-mono text-[0.7rem] text-sage-dark font-black tracking-tighter">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="text-[0.9rem] font-medium text-charcoal">
                            {order.user_name}
                          </span>
                          <span className="text-[0.65rem] text-warm opacity-60 italic">
                            {order.user_email}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 text-center">
                        <span className="text-[0.8rem] font-serif text-warm italic">
                          {Array.isArray(order.items) ? order.items.length : 0} items
                        </span>
                      </td>
                      <td className="py-6">
                        <span className="font-serif text-[1.1rem] text-charcoal">
                          {formatPrice(order.total)}
                        </span>
                      </td>
                      <td className="py-6">
                        <select
                          value={order.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            updateStatus(order.id, e.target.value);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`text-[0.6rem] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border cursor-pointer outline-none shadow-sm transition-all appearance-none text-center ${
                            STATUS_STYLING[order.status] || ""
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-white text-charcoal capitalize">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-6">
                        <span className="text-[0.78rem] text-warm">
                          {formatDate(order.created_at)}
                        </span>
                      </td>
                      <td className="py-6 pr-8 text-right">
                        <ChevronDown
                          className={`w-4 h-4 text-parchment group-hover:text-sage-dark transition-all ${
                            expanded === order.id ? "rotate-180 text-sage-dark" : ""
                          }`}
                        />
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr className="bg-cream/10 border-t border-parchment shadow-inner animate-fade-up">
                        <td colSpan={7} className="px-12 py-10">
                          <div className="grid md:grid-cols-2 gap-12 relative">
                            {/* Vertical line separator */}
                            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-parchment/40 -translate-x-1/2" />

                            {/* Left: Shipping Info */}
                            <div className="space-y-6">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-sage-dark" />
                                  <h4 className="text-[0.7rem] uppercase font-black tracking-widest text-charcoal">
                                    Recipient Logistics
                                  </h4>
                                </div>
                                {razorpayStates[order.id] && (
                                  <span
                                    className={`text-[0.6rem] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${
                                      razorpayStates[order.id].status === "captured"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-orange-100 text-orange-800"
                                    }`}
                                  >
                                    Razorpay: {razorpayStates[order.id].status}
                                  </span>
                                )}
                              </div>
                              <div className="bg-white/60 border border-parchment/60 rounded-[1.5rem] p-6 space-y-3">
                                <p className="font-serif text-[1.2rem] text-charcoal italic">
                                  {order.user_name}
                                </p>
                                <div className="space-y-1 text-[0.85rem] text-warm leading-snug">
                                  <p>{order.address?.line1}</p>
                                  <p className="font-medium uppercase tracking-[0.05em]">
                                    {order.address?.city}, {order.address?.state} —{" "}
                                    {order.address?.pincode}
                                  </p>
                                </div>
                                <div className="pt-4 border-t border-parchment/30 grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-2 text-[0.7rem] text-warm">
                                    <Phone className="w-3.5 h-3.5 opacity-40" /> {order.user_phone}
                                  </div>
                                  <div className="flex items-center gap-2 text-[0.7rem] text-warm">
                                    <Mail className="w-3.5 h-3.5 opacity-40" /> {order.user_email}
                                  </div>
                                </div>
                              </div>
                              {order.notes && (
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                  <p className="text-[0.65rem] uppercase font-black text-orange-800 tracking-wider mb-2">
                                    Customer Directives
                                  </p>
                                  <p className="text-[0.82rem] text-orange-700 italic font-medium leading-relaxed">
                                    &quot;{order.notes}&quot;
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Right: Manifest */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="w-4 h-4 text-sage-dark" />
                                <h4 className="text-[0.7rem] uppercase font-black tracking-widest text-charcoal">
                                  Package Manifest
                                </h4>
                              </div>
                              <div className="space-y-4 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                                {Array.isArray(order.items) &&
                                  order.items.map((item, i) => (
                                    <div
                                      key={i}
                                      className="flex justify-between items-center group/item"
                                    >
                                      <div className="flex flex-col">
                                        <span className="text-[0.92rem] font-serif text-charcoal">
                                          {item.name}
                                        </span>
                                        <span className="text-[0.62rem] uppercase tracking-widest text-warm font-bold">
                                          {item.variant} <em className="opacity-40 mx-1">/</em>{" "}
                                          {item.size} <em className="opacity-40 mx-1">/</em> ×
                                          {item.qty}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="font-serif text-[1rem] text-charcoal">
                                          {formatPrice(item.price * item.qty)}
                                        </span>
                                        <span className="block text-[0.6rem] text-warm italic opacity-60">
                                          @{formatPrice(item.price)} ea.
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              <div className="pt-6 border-t border-parchment border-dashed flex justify-between items-end">
                                <div className="flex flex-col">
                                  <span className="text-[0.65rem] uppercase tracking-widest font-black text-sage-dark mb-1">
                                    Total Valuation
                                  </span>
                                  <span className="text-[0.75rem] text-warm font-medium uppercase">
                                    Incl. Shipping &amp; Taxes
                                  </span>
                                </div>
                                <span className="font-serif text-[2.2rem] text-charcoal leading-none">
                                  {formatPrice(order.total)}
                                </span>
                              </div>
                              {/* INVOICE FEATURE TEMPORARILY DISABLED
                              <button 
                                onClick={(e) => { e.stopPropagation(); window.open(`/api/invoice?id=${order.id}`, '_blank'); }}
                                className="w-full py-4 rounded-full border border-parchment hover:bg-charcoal hover:text-white transition-all text-[0.7rem] uppercase font-black tracking-widest flex items-center justify-center gap-2"
                              >
                                Download Invoice <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                              */}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
