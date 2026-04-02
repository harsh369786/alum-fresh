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
      const { error } = await supabase.from("settings").upsert({ key: "discounts", value: newDiscounts }, { onConflict: "key" });
      if (error) {
        console.error("Supabase upsert failed, saving locally as fallback:", error);
        await fs.writeFile(dataFilePath, JSON.stringify(newDiscounts, null, 2), "utf8");
      }
    } else {
      await fs.writeFile(dataFilePath, JSON.stringify(newDiscounts, null, 2), "utf8");
    }
    
    return NextResponse.json({ success: true, discounts: newDiscounts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save discounts" }, { status: 500 });
  }
}

