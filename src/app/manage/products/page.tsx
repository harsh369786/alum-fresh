"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, Sparkles, Loader2, X, PackageOpen, Search, UploadCloud } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", sku: "", variant: "natural", size: "60g", price: "", original_price: "", short_desc: "", description: "", badge: "", is_featured: false, in_stock: true, image_url: "" });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data || []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    }
    setLoading(false);
  }

  async function generateWithAI() {
    if (!form.name) return alert("Enter product name first.");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: form.name, variant: "natural", ingredients: ["Potassium Alum"] }),
      });
      const data = await res.json();
      if (data.description) {
        setForm(f => ({ ...f, description: data.description, short_desc: data.shortDesc || f.short_desc }));
      }
    } catch { }
    setAiLoading(false);
  }

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

  async function saveProduct() {
    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      sku: form.sku,
      variant: form.variant as any,
      size: form.size as any,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : null,
      short_desc: form.short_desc,
      description: form.description,
      badge: form.badge || null,
      is_featured: form.is_featured,
      in_stock: form.in_stock,
      image_url: form.image_url || null,
    };
    
    try {
      if (editing) {
        await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...payload })
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save product.");
    }
    
    setShowForm(false);
    setEditing(null);
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Remove this product from the archives?")) return;
    try {
      await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      alert("Failed to delete product.");
    }
    fetchProducts();
  }

  function editProduct(p: Product) {
    setEditing(p);
    setForm({ name: p.name, sku: p.sku, variant: p.variant || "natural", size: p.size || "50ml", price: String(p.price), original_price: String(p.original_price || ""), short_desc: p.short_desc || "", description: p.description || "", badge: p.badge || "", is_featured: p.is_featured, in_stock: p.in_stock, image_url: p.image_url || "" });
    setShowForm(true);
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="eyebrow block">Collection Manager</span>
          <h1 className="font-serif italic text-3xl text-charcoal">Archives & Items</h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm opacity-40 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-2.5 rounded-full bg-white border border-parchment text-[0.82rem] outline-none focus:border-sage-dark transition-all min-w-[240px]"
              />
           </div>
           <Button onClick={() => { setEditing(null); setForm({ name: "", sku: "", variant: "natural", size: "60g", price: "", original_price: "", short_desc: "", description: "", badge: "", is_featured: false, in_stock: true, image_url: "" }); setShowForm(true); }} className="gap-2 shadow-lg">
             <Plus className="w-4 h-4" /> Add Item
           </Button>
        </div>
      </div>

      {/* Product Form Overlay/Section */}
      {showForm && (
        <div className="bg-white border border-parchment rounded-[2.5rem] p-10 shadow-2xl animate-fade-up relative overflow-hidden">
          <div className="absolute right-[-20px] top-[-20px] opacity-5 rotate-12">
             <PackageOpen className="w-48 h-48 text-charcoal" />
          </div>

          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="font-serif italic text-2xl text-charcoal">{editing ? "Refine Product" : "Archive New Item"}</h2>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full border border-parchment flex items-center justify-center hover:bg-cream transition-colors">
              <X className="w-4 h-4 text-warm" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Item Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Alum Fresh Rose Edition" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">SKU Reference</Label>
                  <Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="AF-ROSE" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Market Badge</Label>
                  <Input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Best Seller" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Product Image</Label>
                <div className="flex items-center gap-4 mt-2">
                   {form.image_url && (
                     <div className="w-16 h-16 rounded-xl bg-parchment overflow-hidden shrink-0 border border-parchment/50">
                       <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                   )}
                   <label className="flex-1 h-11 px-5 border border-dashed border-sage-dark/30 rounded-full flex items-center justify-center gap-2 cursor-pointer hover:bg-cream/50 transition-colors text-[0.8rem] text-sage-dark font-medium bg-cream/20">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {uploading ? "Uploading..." : form.image_url ? "Change Image" : "Upload Display Image"}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                   </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Investment (₹)</Label>
                  <Input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="349" type="number" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Original Val (₹)</Label>
                  <Input value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="499" type="number" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
                </div>
              </div>
                <div className="space-y-1.5 opacity-50 pointer-events-none">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Format (Standardized)</Label>
                  <Input value="60g Natural Alum" readOnly className="rounded-full bg-cream/10 border-parchment px-6 h-11 text-[0.85rem] italic" />
                </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">Elevator Pitch (Short Desc)</Label>
                <Input value={form.short_desc} onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))} placeholder="One-line summary for cards" className="rounded-full bg-cream/20 border-parchment px-6 h-11 text-[0.85rem] focus-visible:ring-charcoal" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between mb-1.5 pr-4">
                  <Label className="text-[0.65rem] uppercase tracking-widest text-warm ml-4 italic">In-depth Narrative</Label>
                  <button onClick={generateWithAI} disabled={aiLoading} className="text-[0.6rem] font-black uppercase tracking-widest text-sage-dark hover:text-charcoal flex items-center gap-1.5 disabled:opacity-50 transition-all">
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    Inspire with AI
                  </button>
                </div>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="The full product story..." rows={6} className="rounded-[1.5rem] bg-cream/20 border-parchment px-6 py-4 text-[0.85rem] focus-visible:ring-charcoal resize-none shadow-inner" />
              </div>
              <div className="flex items-center gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-5 h-5 accent-sage-dark rounded-md border-parchment" />
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider text-warm group-hover:text-charcoal transition-colors">Show as Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={form.in_stock} onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))} className="w-5 h-5 accent-sage-dark rounded-md border-parchment" />
                  <span className="text-[0.72rem] font-bold uppercase tracking-wider text-warm group-hover:text-charcoal transition-colors">Currently in Stock</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-10 mt-8 border-t border-parchment/40 relative z-10">
            <Button onClick={saveProduct} className="px-10 py-7 text-[0.9rem] shadow-xl">Commit to Archives &nbsp;→</Button>
            <Button variant="outline" onClick={() => setShowForm(false)} className="px-10 py-7 text-[0.9rem]">Discard Changes</Button>
          </div>
        </div>
      )}

      {/* Products Table Area */}
      <div className="bg-white border border-parchment rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-4 text-warm opacity-40">
             <Loader2 className="w-8 h-8 animate-spin" />
             <p className="text-[0.7rem] uppercase tracking-[0.3em] font-black">Decrypting Archives...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-32 text-center text-warm">
             <p className="font-serif italic text-xl">No items found in the current view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-widest text-warm border-b border-parchment bg-cream/30">
                  <th className="py-6 pl-8 font-black">Item Detail</th>
                  <th className="py-6 font-black">Edition</th>
                  <th className="py-6 font-black">Investment</th>
                  <th className="py-6 font-black">Inventory</th>
                  <th className="py-6 pr-8 font-black text-right">Curation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/40">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="group hover:bg-cream/20 transition-all">
                    <td className="py-6 pl-8">
                       <div className="flex flex-col">
                          <span className="text-[0.94rem] font-serif text-charcoal">{p.name}</span>
                          <span className="text-[0.65rem] font-mono text-warm opacity-60 tracking-tighter uppercase">{p.sku}</span>
                       </div>
                    </td>
                    <td className="py-6">
                       <span className="text-[0.72rem] font-bold uppercase tracking-widest text-sage-dark">
                          60g <span className="opacity-30 mx-1">·</span> Natural
                       </span>
                    </td>
                    <td className="py-6 font-serif text-[1.2rem] text-charcoal">{formatPrice(p.price)}</td>
                    <td className="py-6">
                       <span className={`px-4 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest border transition-all ${p.in_stock ? "bg-sage-light/20 text-sage-dark border-sage-light/30" : "bg-rose-light/20 text-rose border-rose-light/30"}`}>
                         {p.in_stock ? "Available" : "Exhausted"}
                       </span>
                    </td>
                    <td className="py-6 pr-8">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => editProduct(p)} className="w-9 h-9 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-charcoal hover:border-charcoal transition-all shadow-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                         </button>
                         <button onClick={() => deleteProduct(p.id)} className="w-9 h-9 rounded-full bg-white border border-parchment flex items-center justify-center text-warm hover:text-rose-dark hover:border-rose-dark/40 transition-all shadow-sm">
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
