// Supabase Edge Function: mk-growth-ideas
// Generates 5 concrete growth ideas for a given client profile.
// One-shot (not streamed). Returns JSON with structured output.

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

  const system = `You are MonteKristo AI's internal strategist. Your job: given a client's full profile, propose exactly 5 concrete, MK-flavored growth ideas. Each idea must be:
1. Specific to THIS client (not generic)
2. Actionable within 2-4 weeks
3. Use MK's stack where possible (n8n, Retell, GHL, Claude, blog engine, Meta ads)
4. One-sentence rationale + one-sentence concrete next step

Return pure JSON (no code fence): { "ideas": [{ "title": "...", "rationale": "...", "next_step": "...", "impact": "low|medium|high", "effort": "low|medium|high", "tags": ["..."] }] }. No commentary before or after the JSON.

Match the language of the client context (Serbian if Serbian, else English).`;

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
      messages: [{ role: "user", content: `Generisi 5 ideja za ovog klijenta:\n\n${clientContext ?? ""}` }],
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

  let parsed: any = null;
  try {
    const match = text.match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : null;
  } catch {
    /* parse failed */
  }

  return new Response(
    JSON.stringify(parsed ?? { raw: text, error: "failed to parse model response" }),
    {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    }
  );
});
