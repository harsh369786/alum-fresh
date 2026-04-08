import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { hasSupabase } from "@/lib/data-service";
import { createServerSupabaseClient } from "@/lib/supabase";

const dataFilePath = path.join(process.cwd(), "src", "data", "discounts.json");

export async function GET() {
  try {
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from("settings").select("value").eq("key", "discounts").single();
      if (!error && data) return NextResponse.json(data.value);
    }
    const fileData = await fs.readFile(dataFilePath, "utf8");
    const discounts = JSON.parse(fileData);
    return NextResponse.json(discounts);
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function POST(req: Request) {
  try {
    const newDiscounts = await req.json();
    if (typeof newDiscounts !== 'object' || newDiscounts === null) {
      return NextResponse.json({ error: "Invalid format" }, { status: 400 });
    }

    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      console.log("Attempting to save discounts to Supabase...");
      
      const { error } = await supabase
        .from("settings")
        .upsert({ key: "discounts", value: newDiscounts }, { onConflict: "key" });

      if (error) {
        console.error("Supabase error saving discounts:", error);
        // If it's a "table does not exist" error (code 42P01), give a specific message
        const isTableMissing = error.code === '42P01';
        return NextResponse.json({ 
          error: isTableMissing ? "The 'settings' table is missing in your production Supabase database." : error.message,
          code: error.code,
          hint: isTableMissing ? "Please create a 'settings' table with columns: id (uuid/int), key (text), value (jsonb)." : error.hint
        }, { status: 500 });
      }
    } else {
      // Local fallback for dev mode
      await fs.writeFile(dataFilePath, JSON.stringify(newDiscounts, null, 2), "utf8");
    }
    
    return NextResponse.json({ success: true, discounts: newDiscounts });
  } catch (error: any) {
    console.error("General error in discounts POST:", error);
    return NextResponse.json({ 
      error: "Critical failure saving discounts.", 
      details: error.message 
    }, { status: 500 });
  }
}

