import { NextResponse } from "next/server";
import { getProducts, saveProducts, hasSupabase } from "@/lib/data-service";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from("products").insert([payload]).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const products = await getProducts();
      const newProduct = { ...payload, id: `demo-${Date.now()}` };
      await saveProducts([...products, newProduct]);
      return NextResponse.json(newProduct);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...payload } = await req.json();
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from("products").update(payload).eq("id", id).select().single();
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const products = await getProducts();
      const updatedProducts = products.map(p => p.id === id ? { ...p, ...payload } : p);
      await saveProducts(updatedProducts as any);
      return NextResponse.json({ id, ...payload });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (hasSupabase) {
      const supabase = createServerSupabaseClient();
      await supabase.from("products").delete().eq("id", id);
    } else {
      const products = await getProducts();
      await saveProducts(products.filter(p => p.id !== id) as any);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
