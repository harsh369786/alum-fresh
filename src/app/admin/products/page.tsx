"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice, formatDate } from "@/lib/utils";
import { Plus, Edit2, Trash2, Sparkles, Loader2, X } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", variant: "natural", size: "50ml", price: "", original_price: "", short_desc: "", description: "", badge: "", is_featured: false, in_stock: true });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const { data } = await (supabase as any).from("products").select("*").order("sort_order");
    setProducts(data || []);
    setLoading(false);
  }

  async function generateWithAI() {
    if (!form.name) return alert("Enter product name first.");
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/product-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: form.name, variant: form.variant, ingredients: ["Alum Crystal", "Aloe Vera", "Turmeric"] }),
      });
      const data = await res.json();
      if (data.description) {
        setForm(f => ({ ...f, description: data.description, short_desc: data.shortDesc || f.short_desc }));
      }
    } catch { }
    setAiLoading(false);
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
    };
    if (editing) {
      await (supabase as any).from("products").update(payload).eq("id", editing.id);
    } else {
      await (supabase as any).from("products").insert([payload]);
    }
    setShowForm(false);
    setEditing(null);
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await (supabase as any).from("products").delete().eq("id", id);
    fetchProducts();
  }

  function editProduct(p: Product) {
    setEditing(p);
    setForm({ name: p.name, sku: p.sku, variant: p.variant || "natural", size: p.size || "50ml", price: String(p.price), original_price: String(p.original_price || ""), short_desc: p.short_desc || "", description: p.description || "", badge: p.badge || "", is_featured: p.is_featured, in_stock: p.in_stock });
    setShowForm(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne font-black text-2xl text-text-primary">Products</h1>
        <Button variant="teal" onClick={() => { setEditing(null); setForm({ name: "", sku: "", variant: "natural", size: "50ml", price: "", original_price: "", short_desc: "", description: "", badge: "", is_featured: false, in_stock: true }); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-bold text-lg text-text-primary">{editing ? "Edit Product" : "Add Product"}</h2>
            <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-text-muted" /></button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><Label>Product Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Alum Fresh Rose" className="mt-1" /></div>
            <div><Label>SKU</Label><Input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="AF-ROSE" className="mt-1" /></div>
            <div><Label>Price (₹) *</Label><Input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="349" type="number" className="mt-1" /></div>
            <div><Label>Original Price (₹)</Label><Input value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))} placeholder="499" type="number" className="mt-1" /></div>
            <div><Label>Variant</Label>
              <select value={form.variant} onChange={e => setForm(f => ({ ...f, variant: e.target.value }))} className="mt-1 w-full h-11 px-3 rounded-xl border border-white/10 bg-white/5 text-sm text-text-primary focus:outline-none">
                <option value="rose">Rose</option><option value="natural">Natural</option><option value="charcoal">Charcoal</option>
              </select>
            </div>
            <div><Label>Size</Label>
              <select value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} className="mt-1 w-full h-11 px-3 rounded-xl border border-white/10 bg-white/5 text-sm text-text-primary focus:outline-none">
                <option value="50ml">50ml</option><option value="100ml">100ml</option>
              </select>
            </div>
            <div><Label>Badge</Label><Input value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} placeholder="Best Seller" className="mt-1" /></div>
          </div>
          <div className="mb-4">
            <Label>Short Description</Label>
            <Input value={form.short_desc} onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))} placeholder="One-line product summary" className="mt-1" />
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <Label>Description</Label>
              <Button variant="purple" size="sm" onClick={generateWithAI} disabled={aiLoading} className="gap-1.5 text-xs h-8">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Generate with AI
              </Button>
            </div>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Full product description..." rows={4} />
          </div>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-teal" />
              <span className="text-sm text-text-muted">Featured Product</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.in_stock} onChange={e => setForm(f => ({ ...f, in_stock: e.target.checked }))} className="w-4 h-4 accent-teal" />
              <span className="text-sm text-text-muted">In Stock</span>
            </label>
          </div>
          <div className="flex gap-3">
            <Button variant="teal" onClick={saveProduct}>Save Product</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-white/8 bg-surface2">
                {["Name", "SKU", "Variant", "Size", "Price", "Stock", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/3">
                  <td className="px-4 py-3 text-text-primary">{p.name}</td>
                  <td className="px-4 py-3 text-text-muted font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 capitalize text-text-muted">{p.variant}</td>
                  <td className="px-4 py-3 text-text-muted">{p.size}</td>
                  <td className="px-4 py-3 text-teal font-medium">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${p.in_stock ? "text-teal" : "text-red-400"}`}>
                      {p.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => editProduct(p)} className="p-1 text-text-muted hover:text-teal transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
