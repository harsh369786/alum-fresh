import { z } from "genkit";
import { ai } from "@/ai/genkit";

const inputSchema = z.object({
  context: z.string(),
  type: z.string(), // 'banner' | 'category' | 'ad'
});

const outputSchema = z.object({
  headline: z.string(),
  subtext: z.string(),
  ctaText: z.string(),
});

export const generateMarketingCopy = ai.defineFlow(
  {
    name: "generateMarketingCopy",
    inputSchema,
    outputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `You are a creative director for Alum Fresh, a premium natural alum deodorant brand.
Write powerful ${input.type} marketing copy with a dark-luxury, minimal aesthetic.

Context: ${input.context}

Return ONLY valid JSON:
{
  "headline": "Short impactful headline (max 8 words)",
  "subtext": "Supporting copy (max 20 words)",
  "ctaText": "CTA button text (2-4 words)"
}

Tone: Premium, clean, confident. Tagline reference: "Stay Fresh, Naturally."`,
    });

    try {
      const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return {
        headline: "Stay Fresh, Naturally.",
        subtext: "100% Alum. 0% Chemicals. Pure freshness for every day.",
        ctaText: "Shop Now",
      };
    }
  }
);
