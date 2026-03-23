"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash, Ticket, Tag } from "lucide-react";

type DiscountMap = Record<string, number>;

export default function DiscountsManagerPage() {
  const [discounts, setDiscounts] = useState<DiscountMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New discount state
  const [newCode, setNewCode] = useState("");
  const [newPercent, setNewPercent] = useState("");

  useEffect(() => {
    fetchDiscounts();
  }, []);

  async function fetchDiscounts() {
    setLoading(true);
    try {
      const res = await fetch("/api/discounts");
      const data = await res.json();
      setDiscounts(data || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function saveDiscounts(newData: DiscountMap) {
    setSaving(true);
    try {
      const res = await fetch("/api/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      if (res.ok) setDiscounts(newData);
    } catch (e) {
      console.error("Failed to save discounts", e);
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() {
    const code = newCode.trim().toUpperCase();
    const percent = parseInt(newPercent);
    
    if (!code || isNaN(percent) || percent <= 0 || percent > 100) {
      alert("Please enter a valid code and percentage (1-100)");
      return;
    }

    const updated = { ...discounts, [code]: percent };
    saveDiscounts(updated);
    setNewCode("");
    setNewPercent("");
  }

  function handleRemove(code: string) {
    const updated = { ...discounts };
    delete updated[code];
    saveDiscounts(updated);
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow block">Promotions</span>
          <h1 className="font-serif italic text-3xl text-charcoal flex items-center gap-3">
            Discount Codes <Ticket className="text-sage-dark w-6 h-6" />
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Current Discounts */}
        <div className="md:col-span-3 bg-white border border-parchment rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <h2 className="font-serif italic text-2xl text-charcoal mb-8 border-b border-parchment pb-4">Active Vouchers</h2>
          
          {loading ? (
            <div className="py-12 text-center text-warm italic">Loading promotions...</div>
          ) : Object.keys(discounts).length === 0 ? (
            <div className="py-16 text-center bg-cream/20 rounded-3xl border border-dashed border-parchment">
              <p className="font-serif text-[1.1rem] text-warm opacity-60">No discount codes active.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(discounts).map(([code, pct]) => (
                <div key={code} className="flex items-center justify-between p-5 bg-cream/30 border border-parchment rounded-2xl group hover:border-sage-light transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage-light/20 flex items-center justify-center text-sage-dark">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-widest text-[0.85rem] text-charcoal">{code}</p>
                      <p className="text-[0.7rem] text-warm font-medium uppercase">{pct}% OFF</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemove(code)}
                    disabled={saving}
                    className="p-2 text-warm/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Section */}
        <div className="md:col-span-2 bg-white border border-parchment rounded-[2.5rem] p-8 shadow-sm h-fit sticky top-24">
          <h2 className="font-serif italic text-2xl text-charcoal mb-6">Create New</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Voucher Code</label>
              <input 
                value={newCode}
                onChange={e => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="w-full h-12 px-5 rounded-full bg-cream/30 border border-parchment text-[0.85rem] font-bold tracking-widest uppercase placeholder:text-warm/40 focus:border-sage-dark outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Discount Percentage (%)</label>
              <input 
                type="number"
                min="1"
                max="100"
                value={newPercent}
                onChange={e => setNewPercent(e.target.value)}
                placeholder="25"
                className="w-full h-12 px-5 rounded-full bg-cream/30 border border-parchment text-[1rem] font-serif focus:border-sage-dark outline-none"
              />
            </div>
            <button 
              onClick={handleAdd}
              disabled={saving || !newCode || !newPercent}
              className="w-full h-12 mt-6 rounded-full bg-charcoal text-white text-[0.7rem] font-black uppercase tracking-widest hover:bg-sage-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
