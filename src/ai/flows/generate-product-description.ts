import { z } from "genkit";
import { ai } from "@/ai/genkit";

const inputSchema = z.object({
  productName: z.string(),
  variant: z.string(),
  ingredients: z.array(z.string()),
});

const outputSchema = z.object({
  description: z.string(),
  shortDesc: z.string(),
  benefits: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
});

export const generateProductDescription = ai.defineFlow(
  {
    name: "generateProductDescription",
    inputSchema,
    outputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `You are a copywriter for Alum Fresh, a premium natural deodorant brand with a dark luxury aesthetic.
Write compelling, clean, minimal product copy in a dark-luxury tone.

Product: ${input.productName}
Variant: ${input.variant}
Key ingredients: ${input.ingredients.join(", ")}

Return ONLY valid JSON matching this exact schema:
{
  "description": "Full product description (100-150 words, premium dark tone)",
  "shortDesc": "One-sentence hook (max 15 words)",
  "benefits": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"],
  "seoTitle": "SEO-optimized page title (max 60 chars)",
  "seoDescription": "SEO meta description (max 160 chars)"
}

Brand values: chemical-free, vegan, suitable for all skin types, Made in India, natural ingredients, long-lasting freshness.`,
    });

    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return {
        description: `${input.productName} — A premium natural deodorant powered by pure alum crystal. Chemical-free, vegan, and suitable for all skin types for all-day freshness.`,
        shortDesc: `Pure alum freshness, naturally.`,
        benefits: ["24-hour odor protection", "Chemical & paraben-free", "Gentle on sensitive skin", "Vegan & cruelty-free"],
        seoTitle: `${input.productName} | Alum Fresh`,
        seoDescription: `${input.productName} — Natural alum crystal deodorant. Chemical-free, vegan, suitable for all skin types. Shop Alum Fresh.`,
      };
    }
  }
);
