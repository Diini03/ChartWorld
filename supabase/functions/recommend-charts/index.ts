import { createOpenAI } from "npm:@ai-sdk/openai";
import { streamText } from "npm:ai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "../_shared/run-id.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-lovable-aig-run-id",
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

type CatalogItem = { slug: string; name: string; category: string; whenToUse: string[] };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) return json({ error: "AI is not configured." }, 500);
    const { description, goal, catalog } = await req.json() as { description?: string; goal?: string; catalog?: CatalogItem[] };
    if (!description?.trim() || !Array.isArray(catalog) || !catalog.length) return json({ error: "Please describe your data." }, 400);
    if (description.length + (goal?.length ?? 0) > 3000) return json({ error: "Description is too long (max 3000 characters)." }, 400);
    const slugs = new Set(catalog.map((c) => c.slug));

    const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(req));
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const catalogText = catalog.slice(0, 80).map((c) => `${c.slug} | ${c.name} | ${c.category} | ${c.whenToUse.join("; ")}`).join("\n");
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      system:
        "You are a data visualization expert. Recommend 3 to 5 chart types from the catalog ONLY (use exact slugs). " +
        'Reply with JSON only, no markdown: {"summary": string, "recommendations": [{"slug": string, "fit": "Best" | "Good" | "Alternative", "why": string, "tip": string}]}. ' +
        "'why' explains in 1-2 plain sentences why it fits this data and goal; 'tip' is one practical design tip. Order best first.",
      messages: [{ role: "user", content: `Chart catalog (slug | name | category | when to use):\n${catalogText}\n\nMy data: ${description}\nMy goal: ${goal || "(not specified)"}` }],
      abortSignal: req.signal,
      providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", include: ["reasoning.encrypted_content"] } },
    });

    let text = "";
    try {
      text = await result.text;
    } catch (e) {
      const status = (e as { statusCode?: number })?.statusCode ?? 500;
      if (status === 429) return json({ error: "Too many requests right now — try again in a moment." }, 429);
      if (status === 402) return json({ error: "AI credits have run out. Add credits to keep using recommendations." }, 402);
      if (status === 403) return json({ error: "AI access is currently blocked for this workspace." }, 403);
      throw e;
    }
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return json({ error: "The AI didn't return recommendations. Try rephrasing." }, 502);
    const parsed = JSON.parse(match[0]);
    const recommendations = (parsed.recommendations ?? []).filter((r: { slug: string }) => slugs.has(r.slug)).slice(0, 5);
    return json({ summary: String(parsed.summary ?? ""), recommendations });
  } catch (e) {
    if (req.signal.aborted) return json({ error: "Cancelled" }, 499);
    console.error(e);
    return json({ error: "Something went wrong getting recommendations." }, 500);
  }
});
