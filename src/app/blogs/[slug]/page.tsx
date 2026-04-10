import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { createServerSupabaseClient } from "@/lib/supabase";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from 'next';

export const revalidate = 60;

async function getBlogBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co") {
    return null;
  }
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata(context: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await context.params;
  const blog = await getBlogBySlug(params.slug);
  if (!blog) {
    return { title: 'Not Found | The Aura Company' };
  }
  return {
    title: blog.seo_title || `${blog.title} | The Aura Company`,
    description: blog.seo_description || blog.short_description,
    openGraph: {
      images: blog.image_url ? [blog.image_url] : undefined
    }
  };
}

export default async function BlogDetailsPage(context: { params: Promise<{ slug: string }> }) {
  const params = await context.params;
  const blog = await getBlogBySlug(params.slug);

  if (!blog || blog.status !== 'published') {
    notFound();
  }

  // Fetch related blogs
  let relatedBlogs: any[] = [];
  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .neq("id", blog.id)
      .order("rank", { ascending: false })
      .limit(3);
    relatedBlogs = data || [];
  } catch (e) {}

  return (
    <>
      <Header />
      
      <main className="pt-32 md:pt-40 pb-24 site-container min-h-screen animate-fade-up">
        <div className="max-w-4xl mx-auto">
          
          <div className="max-w-3xl mx-auto">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-widest font-black text-warm hover:text-charcoal transition-colors mb-10 group">
               <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Journal
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {blog.category && (
                <span className="bg-sage-light/20 text-sage-dark px-3 py-1 rounded-full text-[0.65rem] uppercase tracking-widest font-black border border-sage-light/30">
                  {blog.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-[0.75rem] text-warm font-medium uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" /> 
                {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-[1.1]">
              {blog.title}
            </h1>
            
            {blog.short_description && (
               <p className="text-xl text-warm mb-10 font-medium leading-relaxed max-w-2xl">
                 {blog.short_description}
               </p>
            )}
          </div>

          {blog.image_url && (
            <div className="w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden mb-16 shadow-lg border border-parchment">
              <img 
                src={blog.image_url} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg prose-headings:font-serif prose-headings:italic prose-headings:text-charcoal prose-p:text-warm prose-p:leading-loose prose-a:text-sage-dark hover:prose-a:text-charcoal prose-img:rounded-3xl max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-parchment flex flex-wrap items-center gap-2">
                 <span className="text-[0.65rem] uppercase tracking-widest text-warm font-black mr-2">Tags:</span>
                 {blog.tags.map((tag: string) => (
                   <span key={tag} className="bg-cream/50 border border-parchment px-3 py-1.5 rounded-full text-[0.65rem] uppercase tracking-widest text-warm font-bold">
                     #{tag}
                   </span>
                 ))}
              </div>
            )}
          </div>

          {relatedBlogs.length > 0 && (
            <div className="mt-32 pt-16 border-t border-parchment">
              <h3 className="font-serif italic text-3xl text-charcoal mb-12">More Stories.</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map(rBlog => (
                   <Link href={`/blogs/${rBlog.slug}`} key={rBlog.id} className="group flex flex-col items-start h-full">
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-cream border border-parchment mb-4">
                        {rBlog.image_url ? (
                          <img src={rBlog.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center opacity-30"><Calendar className="w-6 h-6" /></div>
                        )}
                      </div>
                      <h4 className="font-serif italic text-xl text-charcoal group-hover:text-sage-dark transition-colors mb-2 line-clamp-2">{rBlog.title}</h4>
                      <p className="text-[0.75rem] text-warm line-clamp-2 leading-relaxed">{rBlog.short_description}</p>
                   </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
