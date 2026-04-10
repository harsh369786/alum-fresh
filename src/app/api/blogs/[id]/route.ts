import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const supabase = createServerSupabaseClient();
    const { data: blog, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !blog) {
      // maybe it's a slug? Let's check by slug if not found by UUID
      const { data: slugBlog, error: slugError } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", params.id)
        .single();
      
      if (slugError || !slugBlog) {
         return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(slugBlog);
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const supabase = createServerSupabaseClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from("blogs")
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
