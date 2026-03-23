"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify, formatDate } from "@/lib/utils";
import { Plus, Edit2, Trash2, X, Tags, Layers, UploadCloud, Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

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

  async function fetchCategories() {
    setLoading(true);
    const { data } = await (supabase as any).from("categories").select("*").order("sort_order");
    setCategories(data || []);
    setLoading(false);
  }

  async function save() {
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) {
      await (supabase as any).from("categories").update(payload).eq("id", editing.id);
    } else {
      await (supabase as any).from("categories").insert([payload]);
    }
    setShowForm(false); setEditing(null); fetchCategories();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Permanently remove this collection segment?")) return;
    await (supabase as any).from("categories").delete().eq("id", id); fetchCategories();
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow block">Organizational Taxonomy</span>
          <h1 className="font-serif italic text-3xl text-charcoal">Category Segments</h1>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ name: "", slug: "", description: "", image_url: "" }); setShowForm(true); }} className="gap-2 shadow-lg">
           <Plus className="w-4 h-4" /> New Segment
        </Button>
      </div>

      {showForm && (
        <div className="bg-white border border-parchment rounded-[2.5rem] p-10 shadow-2xl animate-fade-up relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-12">
             <Tags className="w-48 h-48 text-charcoal" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="font-serif italic text-2xl text-charcoal">{editing ? "Refine Segment" : "Design New Segment"}</h2>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full border border-parchment flex items-center justify-center hover:bg-cream transition-colors">
              <X className="w-4 h-4 text-warm" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Segment Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="e.g. Roll-On Deodorants" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">URL Slug (Auto-generated)</Label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="roll-on" className="rounded-full bg-cream/25 border-parchment px-6 h-11 text-[0.85rem] font-mono text-sage-dark" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Categorical Narrative</Label>
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the essence of this segment..." className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Category Image Override</Label>
                <div className="flex items-center gap-4 mt-2">
                   {form.image_url && (
                     <div className="w-16 h-16 rounded-xl bg-parchment overflow-hidden shrink-0 border border-parchment/50">
                       <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}
                   <label className="flex-1 h-11 px-5 border border-dashed border-sage-dark/30 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-cream/50 transition-colors text-[0.8rem] text-sage-dark font-medium bg-cream/20">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {uploading ? "Uploading..." : form.image_url ? "Change Image" : "Upload Category Image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                   </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-10 mt-8 border-t border-parchment/40 relative z-10">
            <Button onClick={save} className="px-10 py-7 text-[0.9rem] shadow-xl text-white">Commit Segment &nbsp;→</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="px-10 py-7 text-[0.9rem]">Discard Changes</Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-parchment rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
             <div className="py-20 text-center text-warm opacity-40">Loading Taxonomy...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-widest text-warm border-b border-parchment bg-cream/30">
                  <th className="py-6 pl-8 font-black">Segment Detail</th>
                  <th className="py-6 font-black">Indexing Slug</th>
                  <th className="py-6 font-black">Description</th>
                  <th className="py-6 font-black">Logged Date</th>
                  <th className="py-6 pr-8 font-black text-right">Curation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/40">
                {categories.map(c => (
                  <tr key={c.id} className="group hover:bg-cream/20 transition-all">
                    <td className="py-6 pl-8">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-sage-dark group-hover:bg-white transition-colors">
                              <Layers className="w-4 h-4" />
                          </div>
                          <span className="text-[0.94rem] font-serif text-charcoal">{c.name}</span>
                       </div>
                    </td>
                    <td className="py-6">
                       <span className="font-mono text-[0.7rem] text-sage-dark font-black tracking-tighter uppercase px-3 py-1 bg-sage-light/10 rounded-full border border-sage-light/20">
                         /{c.slug}
                       </span>
                    </td>
                    <td className="py-6 max-w-xs">
                       <p className="text-[0.82rem] text-warm truncate font-light italic">{c.description || "No narrative established."}</p>
                    </td>
                    <td className="py-6 text-[0.75rem] text-warm opacity-60">
                       {formatDate(c.created_at)}
                    </td>
                    <td className="py-6 pr-8 text-right">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || "", image_url: c.image_url || "" }); setShowForm(true); }} className="w-9 h-9 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-charcoal hover:border-charcoal transition-all shadow-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                         </button>
                         <button onClick={() => deleteCategory(c.id)} className="w-9 h-9 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-rose-dark hover:border-rose-dark/40 transition-all shadow-sm">
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
