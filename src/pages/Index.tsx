import React from "react";
import Header from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import { Hero } from "@/components/Hero";
import { WhySection } from "@/components/WhySection";
import { AgentCatalog } from "@/components/AgentCatalog";
import { Framework } from "@/components/Framework";
import { UseCases } from "@/components/UseCases";
import { Results } from "@/components/Results";
import { FAQ } from "@/components/FAQ";
import { BlogTeaser } from "@/components/BlogTeaser";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MonteKristo AI",
    "url": "https://montekristoai.com",
    "logo": "https://montekristoai.com/logo/favicon-512.png",
    "description": "AI transformation partner for scalable SaaS growth. We design & deploy custom AI agents that replace manual outreach, CRM updates, and content bottlenecks.",
    "sameAs": [
      "https://www.linkedin.com/company/montekristo-ai",
      "https://twitter.com/montekristoai"
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MonteKristo AI",
    "url": "https://montekristoai.com"
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can this replace my SDR team?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It augments & outperforms typical SDR output; most clients reassign reps to higher-value tasks."
        }
      },
      {
        "@type": "Question",
        "name": "Timeline to go live?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "2-4 weeks from Discovery to full deployment."
        }
      },
      {
        "@type": "Question",
        "name": "Will the AI match our tone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes—agents are fine-tuned on your brand corpus."
        }
      },
      {
        "@type": "Question",
        "name": "Security & compliance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SOC 2-ready infra, on-prem or VPC deploy."
        }
      },
      {
        "@type": "Question",
        "name": "DIY training?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Post-launch dashboard lets you refine prompts & guardrails."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="AI Agents & Automation for SaaS | MonteKristo AI"
        description="MonteKristo builds custom AI agents to automate sales outreach and content workflows for SaaS teams—supercharge your output and drive scalable growth."
        canonical="/"
        schema={[organizationSchema, websiteSchema, faqSchema]}
      />
      <PerformanceOptimizer />
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <WhySection />
      <div id="agents">
        <AgentCatalog />
      </div>
      <div id="protocol">
        <Framework />
      </div>
      <div id="use-cases">
        <UseCases />
      </div>
      <Results />
      <FAQ />
      <BlogTeaser />
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;