"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify, formatDate } from "@/lib/utils";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    const { data } = await (supabase as any).from("categories").select("*").order("sort_order");
    setCategories(data || []);
  }

  async function save() {
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    if (editing) {
      await (supabase as any).from("categories").update(payload).eq("id", editing.id);
    } else {
      await (supabase as any).from("categories").insert([payload]);
    }
    setShowForm(false); setEditing(null); fetch();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category?")) return;
    await (supabase as any).from("categories").delete().eq("id", id); fetch();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-syne font-black text-2xl text-text-primary">Categories</h1>
        <Button variant="teal" onClick={() => { setEditing(null); setForm({ name: "", slug: "", description: "" }); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Add Category</Button>
      </div>
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between mb-4"><h2 className="font-syne font-bold text-lg text-text-primary">{editing ? "Edit" : "Add"} Category</h2><button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-text-muted" /></button></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))} placeholder="Roll-On Deodorants" className="mt-1" /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="roll-on" className="mt-1" /></div>
            <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Category description" className="mt-1" /></div>
          </div>
          <div className="flex gap-3"><Button variant="teal" onClick={save}>Save Category</Button><Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </div>
      )}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-text-muted border-b border-white/8 bg-surface2">{["Name","Slug","Description","Date",""].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id} className="border-b border-white/5 hover:bg-white/3">
                <td className="px-4 py-3 text-text-primary font-medium">{c.name}</td>
                <td className="px-4 py-3 text-text-muted font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-text-muted max-w-xs truncate">{c.description}</td>
                <td className="px-4 py-3 text-text-muted">{formatDate(c.created_at)}</td>
                <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => { setEditing(c); setForm({ name: c.name, slug: c.slug, description: c.description || "" }); setShowForm(true); }} className="p-1 text-text-muted hover:text-teal"><Edit2 className="w-4 h-4" /></button><button onClick={() => deleteCategory(c.id)} className="p-1 text-text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
