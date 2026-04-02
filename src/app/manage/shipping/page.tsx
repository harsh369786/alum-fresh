"use client";
import React, { useState, useEffect } from "react";
import { Truck, Save, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ShippingSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ free_shipping_threshold: 499, shipping_charge: 49 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast({ title: "Settings Saved", description: "Shipping rules have been updated globally." });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update settings." });
    }
    setSaving(false);
  }

  if (loading) return <div className="py-20 text-center italic text-warm">Loading logistics...</div>;

  return (
    <div className="space-y-12">
      <div>
        <span className="eyebrow block">Global Logistics</span>
        <h1 className="font-serif italic text-3xl text-charcoal flex items-center gap-3">
          Shipping Rules <Truck className="text-sage-dark w-6 h-6" />
        </h1>
      </div>

      <div className="max-w-2xl bg-white border border-parchment rounded-[2.5rem] p-10 shadow-sm space-y-8 animate-fade-up">
        <div className="flex items-start gap-4 p-5 bg-cream/30 border border-parchment rounded-2xl">
          <Info className="w-5 h-5 text-sage-dark shrink-0 mt-0.5" />
          <p className="text-[0.8rem] text-warm leading-relaxed italic">
            These values override the environment defaults once saved. Changes reflect immediately across the store.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="space-y-2">
            <Label className="text-[0.7rem] uppercase tracking-widest text-warm font-bold ml-4 italic">Free Shipping Threshold (₹)</Label>
            <Input 
              type="number" 
              value={settings.free_shipping_threshold} 
              onChange={e => setSettings(s => ({ ...s, free_shipping_threshold: Number(e.target.value) }))}
              placeholder="499"
              className="rounded-full bg-cream/20 border-parchment px-6 h-12 text-[1rem] focus-visible:ring-charcoal"
            />
            <p className="text-[0.65rem] text-warm ml-4 opacity-60 italic">Orders equal to or above this amount will have no shipping fee.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[0.7rem] uppercase tracking-widest text-warm font-bold ml-4 italic">Standard Shipping Charge (₹)</Label>
            <Input 
              type="number" 
              value={settings.shipping_charge} 
              onChange={e => setSettings(s => ({ ...s, shipping_charge: Number(e.target.value) }))}
              placeholder="49"
              className="rounded-full bg-cream/20 border-parchment px-6 h-12 text-[1rem] focus-visible:ring-charcoal"
            />
            <p className="text-[0.65rem] text-warm ml-4 opacity-60 italic">Default charge applied for orders below the threshold.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-parchment/40">
          <Button onClick={handleSave} disabled={saving} className="w-full py-8 text-[1rem] shadow-xl group">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />}
            Save & Update Store Logistics &nbsp;→
          </Button>
        </div>
      </div>
    </div>
  );
}
