import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Connect to Supabase Securely
    const supabase = createServerSupabaseClient();
    
    // Convert memory file into ArrayBuffer
    const bytes = await file.arrayBuffer();

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Upload directly to the user's Supabase 'alumfresh-image' bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("alumfresh-image")
      .upload(safeName, bytes, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase storage error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Retrieve the public URL for database saving
    const { data } = supabase.storage.from("alumfresh-image").getPublicUrl(safeName);

    return NextResponse.json({ 
      success: true, 
      url: data.publicUrl
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
