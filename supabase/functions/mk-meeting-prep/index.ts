// Supabase Edge Function: mk-meeting-prep
// Generates pre-call brief given a client profile.
// Returns structured markdown.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: CORS });
  }

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const { clientContext } = (await req.json()) as { clientContext?: string };

  const system = `You are MonteKristo AI's prep assistant. Given a client profile, generate a pre-call brief in markdown with these sections:

1. **TL;DR** — 2 sentences: status + key priority
2. **Open questions to raise** — bullet list (max 5)
3. **Blockers needing resolution** — bullet list
4. **Recently shipped** — brief list with dates
5. **MK proposed next 2 weeks** — 3 items max
6. **Talking points** — specific things to mention (brand voice rules, recent blockers, growth opportunities)

Be tactical, not generic. Every bullet must reference concrete data from the client profile. Match the language (Serbian if Serbian).

Return pure markdown only. No preamble.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Pripremi call brief za:\n\n${clientContext ?? ""}` }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: "upstream", detail: text }), {
      status: 502,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const data = await res.json();
  const text: string = data?.content?.[0]?.text ?? "";

  return new Response(JSON.stringify({ markdown: text }), {
    status: 200,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
