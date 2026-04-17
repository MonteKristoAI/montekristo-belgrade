// Supabase Edge Function: mk-enrich-web
// Fetches PageSpeed Insights + scrapes OG / schema / CMS signals.
// No API key required for PSI free tier (with lower quota).
// Env (optional): PAGESPEED_API_KEY for higher quota.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

  const { url } = (await req.json()) as { url?: string };
  if (!url) {
    return new Response(JSON.stringify({ error: "url required" }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }

  const psiKey = Deno.env.get("PAGESPEED_API_KEY");

  const [psiRes, htmlRes] = await Promise.allSettled([
    fetchPageSpeed(url, psiKey),
    fetchHtml(url),
  ]);

  const psi = psiRes.status === "fulfilled" ? psiRes.value : null;
  const htmlData = htmlRes.status === "fulfilled" ? htmlRes.value : null;

  return new Response(
    JSON.stringify({
      url,
      lighthouse_score: psi?.performance ?? null,
      core_web_vitals_score: psi?.lcp ?? null,
      core_web_vitals: psi?.cwv ?? null,
      cms: htmlData?.cms ?? null,
      hosting: htmlData?.hosting ?? null,
      schema_present: htmlData?.schema_present ?? false,
      og_title: htmlData?.og_title ?? null,
      og_image: htmlData?.og_image ?? null,
      canonical: htmlData?.canonical ?? null,
      social_profiles: htmlData?.socials ?? {},
      raw: { psi_error: psiRes.status === "rejected" ? String(psiRes.reason) : null, html_error: htmlRes.status === "rejected" ? String(htmlRes.reason) : null },
    }),
    { status: 200, headers: { ...CORS, "Content-Type": "application/json" } }
  );
});

async function fetchPageSpeed(url: string, apiKey: string | undefined) {
  const params = new URLSearchParams({
    url,
    category: "performance",
    strategy: "mobile",
  });
  if (apiKey) params.set("key", apiKey);
  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    { headers: { "User-Agent": "MonteKristo-Onboarding/1.0" } }
  );
  if (!res.ok) throw new Error(`PSI ${res.status}`);
  const json = await res.json();
  const audits = json?.lighthouseResult?.audits ?? {};
  return {
    performance: Math.round((json?.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
    lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
    cwv: {
      lcp: audits["largest-contentful-paint"]?.displayValue ?? null,
      inp: audits["interaction-to-next-paint"]?.displayValue ?? null,
      cls: audits["cumulative-layout-shift"]?.displayValue ?? null,
      ttfb: audits["server-response-time"]?.displayValue ?? null,
    },
  };
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 MonteKristo-Onboarding/1.0" },
  });
  if (!res.ok) throw new Error(`HTML ${res.status}`);
  const html = await res.text();
  const headers = res.headers;

  // CMS fingerprinting
  const cmsSignals: string[] = [];
  if (/wp-content|wp-includes|\/wp-json/i.test(html)) cmsSignals.push("WordPress");
  if (/cdn\.shopify\.com|Shopify\./i.test(html)) cmsSignals.push("Shopify");
  if (/_next\/static|__NEXT_DATA__/.test(html)) cmsSignals.push("Next.js");
  if (/Framer\s+/.test(html) || /framerusercontent/i.test(html)) cmsSignals.push("Framer");
  if (/__NUXT__|_nuxt\//.test(html)) cmsSignals.push("Nuxt");
  if (/astro-island|_astro\//.test(html)) cmsSignals.push("Astro");
  if (/cdn\.webflow\.com/.test(html)) cmsSignals.push("Webflow");
  if (/squarespace|static1\.squarespace/.test(html)) cmsSignals.push("Squarespace");

  const server = headers.get("server") ?? "";
  const cfRay = headers.get("cf-ray");
  const powered = headers.get("x-powered-by") ?? "";

  const hostingSignals: string[] = [];
  if (cfRay) hostingSignals.push("Cloudflare");
  if (/vercel/i.test(server) || headers.get("x-vercel-id")) hostingSignals.push("Vercel");
  if (/netlify/i.test(server)) hostingSignals.push("Netlify");
  if (headers.get("x-served-by")?.includes("fastly")) hostingSignals.push("Fastly");
  if (server) hostingSignals.push(server);

  // Schema.org detection
  const schema_present =
    /application\/ld\+json/i.test(html) || /itemtype="http[s]?:\/\/schema\.org/i.test(html);

  // Open Graph
  const og_title = match(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']+)/i);
  const og_image = match(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']+)/i);
  const canonical = match(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i);

  // Social profiles
  const socials: Record<string, string> = {};
  const socialRe = {
    instagram: /https?:\/\/(?:www\.)?instagram\.com\/([a-zA-Z0-9_.-]+)/i,
    facebook: /https?:\/\/(?:www\.)?facebook\.com\/([a-zA-Z0-9.-]+)/i,
    linkedin: /https?:\/\/(?:[a-z]+\.)?linkedin\.com\/(?:company|in)\/([a-zA-Z0-9-]+)/i,
    twitter: /https?:\/\/(?:www\.|x\.com\/|twitter\.com\/)([a-zA-Z0-9_]+)/i,
    tiktok: /https?:\/\/(?:www\.)?tiktok\.com\/@([a-zA-Z0-9_.-]+)/i,
    youtube: /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/)([a-zA-Z0-9_-]+)/i,
  };
  for (const [k, re] of Object.entries(socialRe)) {
    const m = html.match(re);
    if (m) socials[k] = m[0];
  }

  return {
    cms: cmsSignals[0] ?? (powered || null),
    hosting: hostingSignals[0] ?? null,
    schema_present,
    og_title,
    og_image,
    canonical,
    socials,
  };
}

function match(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1] : null;
}
