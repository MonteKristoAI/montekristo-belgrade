// Supabase Edge Function: mk-ai-chat
// Streams Anthropic Claude response scoped to a given client.
// Requires env: ANTHROPIC_API_KEY
// Deploy: supabase functions deploy mk-ai-chat --project-ref tydafqhnzxmrpnclaxnl
//
// Request body: { clientContext: string, messages: [{role, content}] }
// Response: text/event-stream (SSE)

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODEL = "claude-sonnet-4-6";

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

  let body: { clientContext?: string; messages?: Array<{ role: string; content: string }> };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const systemPrompt = `You are MonteKristo AI's internal co-pilot for our internal team (not client-facing). We run an AI agency. You are embedded in our onboarding portal and have deep context about the specific client in question. Your role: help our team think more clearly, spot opportunities, draft work-product, and act as an ever-present second brain.

Rules:
- Respond in the same language the user writes in (Serbian or English).
- Be concrete, specific, and action-oriented. Avoid generic business advice.
- When asked for ideas, give ideas that fit THIS client's context — not textbook playbooks.
- When drafting copy, honor any banned vocabulary in the brand voice section.
- You can propose SQL queries, n8n workflows, blog topics, ad creatives, voice agent scripts, SEO actions. Do not hallucinate integrations we don't have.
- No emojis. No "I'd be happy to help" filler. Get straight to value.

CLIENT CONTEXT (full profile):
${body.clientContext ?? "(no context provided)"}`;

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      stream: true,
      system: [
        { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
      ],
      messages: (body.messages ?? []).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text();
    return new Response(JSON.stringify({ error: "upstream", detail: text }), {
      status: 502,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  // Transform Anthropic SSE → simpler "text/event-stream" for the client.
  // Client listens for `data: {"text": "..."}` and `data: [DONE]`.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = line.slice(6).trim();
            if (!payload) continue;
            try {
              const evt = JSON.parse(payload);
              if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: evt.delta.text })}\n\n`)
                );
              } else if (evt.type === "message_stop") {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
              } else if (evt.type === "error") {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: evt.error })}\n\n`)
                );
              }
            } catch {
              /* ignore parse errors */
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...CORS,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});
