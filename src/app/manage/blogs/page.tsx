"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Blog {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  content: string;
  image_url: string;
  rank: number;
  status: string;
  category: string;
  tags: string[];
  created_at: string;
}

export default function ManageBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<Blog>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBlogs(data);
      } else {
        setBlogs([]);
      }
    } catch (e) {
      console.error(e);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      fetchBlogs();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setCurrentBlog({ ...currentBlog, image_url: data.url });
      }
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const isUpdate = !!currentBlog.id;
      const url = isUpdate ? `/api/blogs/${currentBlog.id}` : "/api/blogs";
      const method = isUpdate ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentBlog)
      });
      
      if (res.ok) {
        setIsEditing(false);
        setCurrentBlog({});
        fetchBlogs();
      } else {
         const data = await res.json();
         alert("Error: " + (data.error || "Failed to save"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-8 animate-fade-up">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsEditing(false)} className="p-2 bg-white rounded-full border border-parchment hover:bg-cream transition-colors">
            <ArrowLeft className="w-4 h-4 text-charcoal" />
          </button>
          <div>
            <h1 className="font-serif italic text-3xl text-charcoal">{currentBlog.id ? "Edit Journal Entry" : "New Journal Entry"}</h1>
          </div>
        </div>

        <form onSubmit={handleSave} className="bg-white border border-parchment rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Blog Title</label>
              <input required value={currentBlog.title || ''} onChange={e => setCurrentBlog({ ...currentBlog, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })} className="w-full h-12 rounded-full border border-parchment bg-cream/30 px-6 text-[0.9rem] focus:outline-none focus:border-sage-dark transition-colors" placeholder="e.g. The Science of Alum" />
            </div>
            <div className="space-y-2">
              <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">URL Slug</label>
              <input required value={currentBlog.slug || ''} onChange={e => setCurrentBlog({ ...currentBlog, slug: e.target.value })} className="w-full h-12 rounded-full border border-parchment bg-cream/30 px-6 text-[0.9rem] focus:outline-none focus:border-sage-dark transition-colors" placeholder="e.g. the-science-of-alum" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Short Description / Excerpt</label>
            <textarea required rows={2} value={currentBlog.short_description || ''} onChange={e => setCurrentBlog({ ...currentBlog, short_description: e.target.value })} className="w-full rounded-[1.5rem] border border-parchment bg-cream/30 px-6 py-4 text-[0.9rem] focus:outline-none focus:border-sage-dark transition-colors resize-none" placeholder="A brief summary of the blog post..." />
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Featured Image</label>
            <div className="flex items-center gap-6">
              {currentBlog.image_url ? (
                <img src={currentBlog.image_url} alt="Featured" className="w-32 h-24 object-cover rounded-xl shadow-sm border border-parchment" />
              ) : (
                <div className="w-32 h-24 bg-cream/50 rounded-xl border border-dashed border-parchment flex items-center justify-center text-warm">
                  <ImageIcon className="w-6 h-6 opacity-30" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                <label htmlFor="image-upload" className="px-5 py-2 bg-white border border-parchment rounded-full text-[0.7rem] uppercase tracking-widest font-bold text-sage-dark cursor-pointer hover:bg-cream transition-colors text-center">
                  {uploading ? "Uploading..." : "Upload Creative"}
                </label>
                <input value={currentBlog.image_url || ''} onChange={e => setCurrentBlog({ ...currentBlog, image_url: e.target.value })} className="w-full md:w-64 h-10 rounded-full border border-parchment bg-cream/30 px-4 text-[0.75rem] focus:outline-none focus:border-sage-dark" placeholder="Or enter image URL" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Full Content (HTML / Markdown supported text)</label>
            <textarea required rows={10} value={currentBlog.content || ''} onChange={e => setCurrentBlog({ ...currentBlog, content: e.target.value })} className="w-full rounded-[1.5rem] border border-parchment bg-cream/30 px-6 py-4 text-[0.9rem] focus:outline-none focus:border-sage-dark transition-colors" placeholder="Write your full editorial here... Use HTML tags like <h2> or <p> or <br> to format text nicely." />
          </div>

          <div className="grid md:grid-cols-4 gap-6">
             <div className="space-y-2">
               <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Status</label>
               <select value={currentBlog.status || 'draft'} onChange={e => setCurrentBlog({ ...currentBlog, status: e.target.value })} className="w-full h-12 rounded-full border border-parchment bg-cream/30 px-6 text-[0.8rem] focus:outline-none focus:border-sage-dark appearance-none">
                 <option value="draft">Draft</option>
                 <option value="published">Published</option>
               </select>
             </div>
             <div className="space-y-2">
               <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Category</label>
               <input value={currentBlog.category || ''} onChange={e => setCurrentBlog({ ...currentBlog, category: e.target.value })} className="w-full h-12 rounded-full border border-parchment bg-cream/30 px-6 text-[0.8rem] focus:outline-none focus:border-sage-dark" placeholder="e.g. Wellness" />
             </div>
             <div className="space-y-2">
               <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Display Rank (0=highest)</label>
               <input type="number" value={currentBlog.rank || 0} onChange={e => setCurrentBlog({ ...currentBlog, rank: parseInt(e.target.value) || 0 })} className="w-full h-12 rounded-full border border-parchment bg-cream/30 px-6 text-[0.8rem] focus:outline-none focus:border-sage-dark" />
             </div>
             <div className="space-y-2">
               <label className="text-[0.65rem] uppercase tracking-widest text-warm font-bold ml-2">Tags (comma sep)</label>
               <input value={currentBlog.tags ? currentBlog.tags.join(', ') : ''} onChange={e => setCurrentBlog({ ...currentBlog, tags: e.target.value.split(',').map(t=>t.trim()).filter(Boolean) })} className="w-full h-12 rounded-full border border-parchment bg-cream/30 px-6 text-[0.8rem] focus:outline-none focus:border-sage-dark" placeholder="e.g. skin, natural" />
             </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-parchment/60">
            <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3 rounded-full border border-parchment text-[0.7rem] uppercase tracking-widest font-bold text-warm hover:text-charcoal hover:bg-cream transition-colors">
              Cancel
            </button>
            <Button type="submit" disabled={saving || uploading} className="px-10 py-3 text-[0.8rem] shadow-md">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {saving ? "Saving..." : "Save Blog Entry"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="eyebrow block">Content Engine</span>
          <h1 className="font-serif italic text-3xl text-charcoal">Journal & Blogs</h1>
        </div>
        <Button onClick={() => { setCurrentBlog({ rank: 0, status: 'draft' }); setIsEditing(true); }} className="gap-2 px-6 shadow-sm">
           <Plus className="w-4 h-4" /> New Entry
        </Button>
      </div>

      <div className="bg-white border border-parchment rounded-[2.5rem] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4 text-warm opacity-40">
             <Loader2 className="w-8 h-8 animate-spin" />
             <p className="text-[0.7rem] uppercase tracking-[0.3em] font-black">Syncing Editorials...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-24 text-center bg-cream/20 border-dashed border border-parchment rounded-[2rem] m-8">
             <p className="font-serif italic text-xl text-warm opacity-60">The journal is empty. Write your first story.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.65rem] uppercase tracking-widest text-warm border-b border-parchment bg-cream/30">
                  <th className="py-6 pl-8 font-black">Visual</th>
                  <th className="py-6 font-black">Title & Details</th>
                  <th className="py-6 font-black">Category</th>
                  <th className="py-6 font-black text-center">Rank</th>
                  <th className="py-6 font-black">Status</th>
                  <th className="py-6 pr-8 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment/40">
                {blogs.map(blog => (
                  <tr key={blog.id} className="group hover:bg-cream/20 transition-all">
                    <td className="py-4 pl-8">
                      {blog.image_url ? (
                        <img src={blog.image_url} alt="" className="w-16 h-12 object-cover rounded-lg border border-parchment shadow-sm" />
                      ) : (
                        <div className="w-16 h-12 bg-cream rounded-lg border border-parchment flex items-center justify-center text-warm">
                          <ImageIcon className="w-4 h-4 opacity-40" />
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <p className="font-serif text-[1.1rem] text-charcoal line-clamp-1">{blog.title}</p>
                      <p className="text-[0.75rem] text-warm truncate max-w-xs">{blog.slug}</p>
                    </td>
                    <td className="py-4 text-[0.8rem] text-charcoal uppercase tracking-wider font-medium">{blog.category || '-'}</td>
                    <td className="py-4 text-center font-mono text-[0.85rem] text-warm">{blog.rank}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[0.6rem] font-black uppercase tracking-widest border ${blog.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="py-4 pr-8 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => { setCurrentBlog(blog); setIsEditing(true); }} className="p-2 text-warm hover:text-sage-dark bg-white border border-parchment rounded-lg hover:bg-cream transition-all shadow-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="p-2 text-warm hover:text-red-600 bg-white border border-parchment rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
