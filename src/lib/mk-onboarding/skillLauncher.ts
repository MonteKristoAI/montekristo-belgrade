// Deliverable → MK Skill mapping.
// Builds a prompt that can be pasted into Claude Code to launch the relevant skill.

export type DeliverableType =
  | "website" | "blog_post" | "seo_audit" | "automation" | "voice_agent"
  | "ad_campaign" | "email_campaign" | "social_campaign" | "crm_setup"
  | "integration" | "report" | "design" | "research" | "other";

export function buildSkillPrompt(params: {
  type: DeliverableType;
  clientName: string;
  clientSlug: string;
  clientUrl?: string | null;
  deliverableTitle: string;
  deliverableNotes?: string | null;
  clientBrandVoice?: string | null;
}): { skill: string; command: string; copyText: string } {
  const { type, clientName, clientSlug, clientUrl, deliverableTitle, deliverableNotes, clientBrandVoice } = params;

  const baseContext = `Client: ${clientName} (slug: ${clientSlug})${clientUrl ? `\nURL: ${clientUrl}` : ""}\nDeliverable: ${deliverableTitle}${deliverableNotes ? `\nNotes: ${deliverableNotes}` : ""}${clientBrandVoice ? `\n\nBrand voice: ${clientBrandVoice}` : ""}`;

  switch (type) {
    case "website":
      return {
        skill: "montekristo-website",
        command: "/montekristo-website build",
        copyText: `/montekristo-website build\n\nBuild a premium website for this client:\n\n${baseContext}\n\nUse the clients/${clientSlug}/website/ folder. Follow MK brand: coral #FF5C5C for metric accents only, navy #041122 for headings, Poppins/Inter.`,
      };
    case "blog_post":
      return {
        skill: "blog-write",
        command: "/blog write",
        copyText: `/blog write\n\nWrite a new blog post for ${clientName}.\n\n${baseContext}\n\nFollow the client's blog system files under Blog/clients/${clientSlug}/.`,
      };
    case "seo_audit":
      return {
        skill: "seo-audit",
        command: "/seo audit",
        copyText: `/seo audit ${clientUrl ?? clientSlug}\n\n${baseContext}`,
      };
    case "voice_agent":
      return {
        skill: "retell-agent-builder",
        command: "/retell-agent-builder build",
        copyText: `/retell-agent-builder build\n\nBuild a voice agent for ${clientName}.\n\n${baseContext}`,
      };
    case "ad_campaign":
      return {
        skill: "meta-ads",
        command: "/meta-ads build",
        copyText: `/meta-ads build\n\nBuild a Meta ads campaign for ${clientName}.\n\n${baseContext}\n\nRun full Research → Strategy → Creative → Critic pipeline. Budget + audience to be confirmed; assume initial $50/day learning phase.`,
      };
    case "automation":
      return {
        skill: "n8n",
        command: "Build n8n workflow",
        copyText: `Build an n8n workflow for ${clientName}.\n\n${baseContext}\n\nUse n8n-mcp to create and deploy on the Railway instance. Attach global error handler (8N1HZ9RMBZc5oi0z).`,
      };
    case "email_campaign":
      return {
        skill: "blog-repurpose",
        command: "Draft email campaign",
        copyText: `Draft an email campaign for ${clientName}.\n\n${baseContext}\n\nOne-off campaign + 3-step nurture. Honor the brand voice — ZERO AI tells.`,
      };
    case "crm_setup":
      return {
        skill: "highlevel-automation",
        command: "Configure GHL",
        copyText: `Configure GHL CRM for ${clientName}.\n\n${baseContext}\n\nProvision pipelines, custom fields, tags, automation triggers.`,
      };
    case "report":
      return {
        skill: "report",
        command: "/report generate",
        copyText: `/report generate\n\nGenerate a performance report for ${clientName}.\n\n${baseContext}\n\nOutput to clients/${clientSlug}/reports/ and upload to Drive.`,
      };
    case "design":
      return {
        skill: "frontend-design",
        command: "/frontend-design",
        copyText: `/frontend-design\n\nDesign task for ${clientName}.\n\n${baseContext}`,
      };
    case "research":
      return {
        skill: "perplexity",
        command: "Deep research",
        copyText: `Deep research task for ${clientName}.\n\n${baseContext}\n\nUse perplexity + firecrawl to gather insights, summarize into structured brief.`,
      };
    default:
      return {
        skill: "general",
        command: "Deliverable",
        copyText: `${deliverableTitle}\n\n${baseContext}`,
      };
  }
}
