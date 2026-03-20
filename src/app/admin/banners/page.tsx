"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: "", subtitle: "", cta_text: "Shop Now", cta_link: "/category/roll-on", bg_gradient: "linear-gradient(135deg, #08070F 0%, #0E0B1A 100%)", is_active: true, sort_order: 0 });

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    const { data } = await (supabase as any).from("banners").select("*").order("sort_order");
    setBanners(data || []);
  }

  async function save() {
    if (editing) {
      await (supabase as any).from("banners").update(form).eq("id", editing.id);
    } else {
      await (supabase as any).from("banners").insert([form]);
    }
    setShowForm(false); setEditing(null); fetch();
  }

  async function deleteBanner(id: string) {
    if (!confirm("Delete this banner?")) return;
    await (supabase as any).from("banners").delete().eq("id", id); fetch();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne font-black text-2xl text-text-primary">Banners</h1>
        <Button variant="teal" onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Add Banner</Button>
      </div>
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between mb-4"><h2 className="font-syne font-bold text-lg text-text-primary">{editing ? "Edit" : "Add"} Banner</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-text-muted" /></button></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Stay Fresh, Naturally." className="mt-1" /></div>
            <div><Label>Subtitle</Label><Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="100% Alum. 0% Chemicals." className="mt-1" /></div>
            <div><Label>CTA Text</Label><Input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} placeholder="Shop Now" className="mt-1" /></div>
            <div><Label>CTA Link</Label><Input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} placeholder="/category/roll-on" className="mt-1" /></div>
            <div><Label>Sort Order</Label><Input value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} type="number" className="mt-1" /></div>
            <div className="flex items-end pb-1"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-teal w-4 h-4" /><span className="text-sm text-text-muted">Active</span></label></div>
          </div>
          <div className="flex gap-3"><Button variant="teal" onClick={save}>Save Banner</Button><Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </div>
      )}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-text-muted border-b border-white/8 bg-surface2">{["Title","CTA","Active","Date",""].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {banners.map(b => (
              <tr key={b.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3"><div className="text-text-primary">{b.title}</div><div className="text-text-muted text-xs">{b.subtitle}</div></td>
                <td className="px-4 py-3 text-text-muted">{b.cta_text}</td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${b.is_active ? "text-teal" : "text-text-muted"}`}>{b.is_active ? "Active" : "Inactive"}</span></td>
                <td className="px-4 py-3 text-text-muted">{formatDate(b.created_at)}</td>
                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditing(b); setForm({ title: b.title || "", subtitle: b.subtitle || "", cta_text: b.cta_text || "Shop Now", cta_link: b.cta_link || "/", bg_gradient: b.bg_gradient || "", is_active: b.is_active, sort_order: b.sort_order }); setShowForm(true); }} className="p-1 text-text-muted hover:text-teal"><Edit2 className="w-4 h-4" /></button><button onClick={() => deleteBanner(b.id)} className="p-1 text-text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
