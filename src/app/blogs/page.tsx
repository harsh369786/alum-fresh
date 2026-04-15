import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ArrowRight, BookOpen } from "lucide-react";

import Image from "next/image";
import { getOptimizedImageUrl } from "@/lib/image-utils";

export const metadata = {
  title: "Journal | The Aura Company",
  description: "Explore our editorial on natural wellness, the science of alum, and sustainable living.",
};

export const revalidate = 60; // revalidate every minute

export default async function BlogsPage() {
  let blogs: any[] = [];
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co") {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("blogs")
      .select("id, slug, title, short_description, image_url, category, created_at")
      .eq("status", "published")
      .order("rank", { ascending: false })
      .order("created_at", { ascending: false });
      
    if (data) {
      blogs = data;
    }
  }

  return (
    <>
      <Header />
      
      <main className="pt-24 md:pt-32 pb-24 site-container min-h-screen">
        <div className="text-center mb-16 md:mb-24 animate-fade-up">
           <span className="eyebrow">Intellectual Wellness</span>
           <h1 className="font-serif italic text-5xl md:text-6xl text-charcoal mb-4">The Journal.</h1>
           <p className="text-[1rem] text-warm max-w-lg mx-auto">Explore clinical insights, lifestyle guides, and the undeniable science of natural elements.</p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-32 text-center bg-cream/20 border-dashed border border-parchment rounded-[2.5rem] animate-fade-up">
             <BookOpen className="w-8 h-8 text-warm opacity-30 mx-auto mb-4" />
             <p className="font-serif italic text-xl text-warm opacity-60">The ink is still drying on our first entry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {blogs.map((blog, i) => (
              <Link 
                href={`/blogs/${blog.slug}`} 
                key={blog.id} 
                className="group flex flex-col items-start animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-cream border border-parchment mb-6 relative">
                  {blog.image_url ? (
                    <Image 
                      src={getOptimizedImageUrl(blog.image_url, { width: 600, quality: 70 })} 
                      alt={blog.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-warm opacity-30">
                      <BookOpen className="w-10 h-10 mb-2" />
                      <span className="font-serif italic">Editorial Image</span>
                    </div>
                  )}
                  {blog.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[0.6rem] uppercase tracking-widest font-black text-sage-dark shadow-sm">
                      {blog.category}
                    </div>
                  )}
                </div>
                
                <span className="text-[0.7rem] uppercase tracking-widest text-warm font-bold mb-3 block">
                  {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                
                <h2 className="font-serif italic text-2xl text-charcoal mb-3 line-clamp-2 group-hover:text-sage-dark transition-colors">
                  {blog.title}
                </h2>
                
                <p className="text-[0.9rem] text-warm line-clamp-3 mb-5 leading-relaxed">
                  {blog.short_description}
                </p>
                
                <div className="mt-auto flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-black text-sage-dark group-hover:translate-x-2 transition-transform">
                  Read Editorial <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
