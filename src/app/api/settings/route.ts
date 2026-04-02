import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { hasSupabase } from "@/lib/data-service";
import { createServerSupabaseClient } from "@/lib/supabase";

const dataFilePath = path.join(process.cwd(), "src", "data", "settings.json");

const DEFAULT_SETTINGS = {
  free_shipping_threshold: 499,
  shipping_charge: 49
};

export async function GET() {
  try {
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from("settings").select("value").eq("key", "shipping").single();
      if (!error && data) return NextResponse.json(data.value);
    }
    const fileData = await fs.readFile(dataFilePath, "utf8");
    return NextResponse.json(JSON.parse(fileData));
  } catch (error) {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function POST(req: Request) {
  try {
    const newSettings = await req.json();
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase.from("settings").upsert({ key: "shipping", value: newSettings }, { onConflict: "key" });
      if (error) throw error;
    } else {
      await fs.writeFile(dataFilePath, JSON.stringify(newSettings, null, 2), "utf8");
    }
    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
