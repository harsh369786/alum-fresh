import { NextRequest, NextResponse } from "next/server";
import { generateProductDescription } from "@/ai/flows/generate-product-description";
import { z } from "zod";

const inputSchema = z.object({
  productName: z.string(),
  variant: z.string().optional().default("natural"),
  ingredients: z.array(z.string()).optional().default(["Potassium Alum"]),
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        description: "Premium natural alum crystal deodorant. Chemical-free, vegan, and suitable for all skin types.",
        shortDesc: "Stay Fresh, Naturally.",
        benefits: ["24-hour protection", "Chemical-free formula", "Gentle on skin", "Vegan formula"],
        seoTitle: "Alum Fresh Natural Deodorant",
        seoDescription: "Natural alum crystal deodorant. Chemical-free, vegan, suitable for all skin types.",
      });
    }

    const body = await req.json();
    const input = inputSchema.parse(body);
    const result = await generateProductDescription(input);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
