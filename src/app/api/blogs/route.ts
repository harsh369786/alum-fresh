import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const publishOnly = searchParams.get("published") === "true";
    
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder.supabase.co") {
      return NextResponse.json([]); // Return empty array if no db connected
    }

    const supabase = createServerSupabaseClient();
    let query = supabase.from("blogs").select("*").order("rank", { ascending: false }).order("created_at", { ascending: false });
    
    if (publishOnly) {
      query = query.eq("status", "published");
    }

    const { data: blogs, error } = await query;

    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist yet, return empty gracefully.
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(blogs || []);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await req.json();

    const {
      title,
      slug,
      short_description,
      content,
      image_url,
      rank,
      status,
      category,
      tags,
      seo_title,
      seo_description
    } = body;

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          slug,
          short_description,
          content,
          image_url,
          rank: rank || 0,
          status: status || 'draft',
          category,
          tags: tags || [],
          seo_title,
          seo_description
        }
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
