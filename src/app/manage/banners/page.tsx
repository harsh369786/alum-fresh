"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Banner } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { Plus, Edit2, Trash2, X, ImageIcon, Layout, Loader2, UploadCloud } from "lucide-react";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    subtitle: "", 
    cta_text: "Discover Collection", 
    cta_link: "/category/roll-on", 
    bg_gradient: "linear-gradient(135deg, #F8F4ED 0%, #EDE8DC 100%)", 
    image_url: "",
    is_active: true, 
    sort_order: 0 
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchBanners(); }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setForm(f => ({ ...f, image_url: data.url }));
    } catch (err) { alert("Failed to upload image"); }
    setUploading(false);
  }

  async function fetchBanners() {
    setLoading(true);
    const { data } = await (supabase as any).from("banners").select("*").order("sort_order");
    setBanners(data || []);
    setLoading(false);
  }

  async function save() {
    if (editing) {
      await (supabase as any).from("banners").update(form).eq("id", editing.id);
    } else {
      await (supabase as any).from("banners").insert([form]);
    }
    setShowForm(false); setEditing(null); fetchBanners();
  }

  async function deleteBanner(id: string) {
    if (!confirm("Remove this visual narrative from the sequence?")) return;
    await (supabase as any).from("banners").delete().eq("id", id); fetchBanners();
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow block">Visual Communication</span>
          <h1 className="font-serif italic text-3xl text-charcoal">Banner Sequence</h1>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ title: "", subtitle: "", cta_text: "Discover Collection", cta_link: "/category/roll-on", bg_gradient: "linear-gradient(135deg, #F8F4ED 0%, #EDE8DC 100%)", image_url: "", is_active: true, sort_order: 0 }); setShowForm(true); }} className="gap-2 shadow-lg">
           <Plus className="w-4 h-4" /> Add Sequence
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-parchment rounded-[2.5rem] p-10 shadow-2xl animate-fade-up relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-12 text-charcoal">
             <ImageIcon className="w-48 h-48" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="font-serif italic text-2xl text-charcoal">{editing ? "Refine Sequence" : "Establish New Sequence"}</h2>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full border border-parchment flex items-center justify-center hover:bg-cream transition-colors">
              <X className="w-4 h-4 text-warm" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Primary Headline</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Natural Radiance." className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Supporting Narrative</Label>
                <Input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. 100% Alum. 0% Synthetic Fragrance." className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">CTA Action Text</Label>
                  <Input value={form.cta_text} onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))} placeholder="Discover Collection" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Action Destination</Label>
                  <Input value={form.cta_link} onChange={e => setForm(f => ({ ...f, cta_link: e.target.value }))} placeholder="/category/roll-on" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Visual Aesthetic (CSS Gradient)</Label>
                <Input value={form.bg_gradient} onChange={e => setForm(f => ({ ...f, bg_gradient: e.target.value }))} placeholder="linear-gradient(...)" className="rounded-[1.5rem] bg-cream/20 border-parchment px-6 h-11 text-[0.7rem] font-mono text-sage-dark focus-visible:ring-charcoal shadow-inner" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Banner Image Override</Label>
                <div className="flex items-center gap-4 mt-2">
                   {form.image_url && (
                     <div className="w-16 h-16 rounded-xl bg-parchment overflow-hidden shrink-0 border border-parchment/50">
                       <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}
                   <label className="flex-1 h-11 px-5 border border-dashed border-sage-dark/30 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-cream/50 transition-colors text-[0.8rem] text-sage-dark font-medium bg-cream/20">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {uploading ? "Uploading..." : form.image_url ? "Change Image" : "Upload Banner Image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                   </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Sequence Order</Label>
                  <Input value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} type="number" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] text-center" />
                </div>
                <div className="flex items-center gap-3 pt-6 ml-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-5 h-5 accent-sage-dark rounded-md border-parchment" />
                    <span className="text-[0.72rem] font-bold uppercase tracking-wider text-warm group-hover:text-charcoal transition-colors">Active Segment</span>
                  </label>
                </div>
              </div>
              
              {/* Preview Box */}
              <div className="p-4 rounded-[1.5rem] bg-cream/10 border border-parchment">
                 <p className="text-[0.6rem] uppercase tracking-[0.2em] font-black text-warm mb-3 opacity-40">Live Aesthetic Preview</p>
                 <div className="h-24 rounded-2xl flex items-center justify-center p-4 border border-parchment/40" style={{ background: form.bg_gradient }}>
                    <div className="text-center">
                       <p className="text-[0.8rem] font-serif text-charcoal leading-none mb-1">{form.title || "Headline"}</p>
                       <p className="text-[0.6rem] text-warm italic opacity-70">{form.subtitle || "Narrative"}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-10 mt-8 border-t border-parchment/40 relative z-10">
            <Button onClick={save} className="px-12 py-7 text-[0.9rem] shadow-xl text-white">Commit Sequence &nbsp;→</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="px-10 py-7 text-[0.9rem]">Discard Changes</Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-parchment rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
             <div className="py-20 text-center text-warm opacity-40">Syncing Banners...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-widest text-warm border-b border-parchment bg-cream/30">
                  <th className="py-6 pl-8 font-black">Segment Narrative</th>
                  <th className="py-6 font-black">Action Anchor</th>
                  <th className="py-6 font-black text-center">Status</th>
                  <th className="py-6 font-black">Logged Date</th>
                  <th className="py-6 pr-8 font-black text-right">Curation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/40">
                {banners.map(b => (
                  <tr key={b.id} className="group hover:bg-cream/20 transition-all">
                    <td className="py-6 pl-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-parchment shrink-0 shadow-inner group-hover:scale-105 transition-transform" style={{ background: b.bg_gradient }}>
                             <Layout className="w-5 h-5 text-charcoal opacity-20" />
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[0.94rem] font-serif text-charcoal">{b.title}</span>
                             <span className="text-[0.72rem] text-warm italic opacity-70 leading-tight line-clamp-1">{b.subtitle}</span>
                          </div>
                       </div>
                    </td>
                    <td className="py-6">
                       <span className="text-[0.7rem] font-bold uppercase tracking-widest text-sage-dark bg-sage-light/10 px-4 py-1 rounded-full border border-sage-light/20">
                         {b.cta_text}
                       </span>
                    </td>
                    <td className="py-6 text-center">
                       <span className={`px-4 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest border transition-all ${b.is_active ? "bg-sage-light/20 text-sage-dark border-sage-light/30" : "bg-cream text-warm border-parchment/60"}`}>
                         {b.is_active ? "In Sequence" : "Paused"}
                       </span>
                    </td>
                    <td className="py-6 text-[0.75rem] text-warm opacity-60">
                       {formatDate(b.created_at)}
                    </td>
                    <td className="py-6 pr-8 text-right">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setEditing(b); setForm({ title: b.title || "", subtitle: b.subtitle || "", cta_text: b.cta_text || "Shop Now", cta_link: b.cta_link || "/", bg_gradient: b.bg_gradient || "", image_url: b.image_url || "", is_active: b.is_active, sort_order: b.sort_order }); setShowForm(true); }} className="w-9 h-9 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-charcoal hover:border-charcoal transition-all shadow-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                         </button>
                         <button onClick={() => deleteBanner(b.id)} className="w-9 h-9 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-rose-dark hover:border-rose-dark/40 transition-all shadow-sm">
                            <Trash2 className="w-3.5 h-3.5" />
                         </button>
                       </div>
                    </td>
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
