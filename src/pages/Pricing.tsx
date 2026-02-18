import { useRef } from "react";
import { SEOHead } from "@/components/SEOHead";

const Pricing = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Services & Pricing | MonteKristo AI",
    "description": "AI automations, marketing systems, and growth execution for service businesses. Full pricing for AI agents, ads management, website packages, and podcast production.",
    "url": "https://montekristobelgrade.com/pricing",
    "publisher": {
      "@type": "Organization",
      "name": "MonteKristo AI",
      "url": "https://montekristobelgrade.com"
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0d1117" }}>
      <SEOHead
        title="Services & Pricing | MonteKristo AI"
        description="AI automations, marketing systems, and growth execution for service businesses. Full pricing for AI agents, ads management, website packages, and podcast production."
        canonical="/pricing"
        schema={[pricingSchema]}
      />

      <style>{`
        .pricing-bar { padding: 10px 24px; }
        .pricing-label { display: inline; }
        @media (max-width: 640px) {
          .pricing-bar { padding: 8px 12px; }
          .pricing-label { display: none; }
        }
      `}</style>

      {/* Top control bar */}
      <div
        className="pricing-bar"
        style={{
          background: "#0d1117",
          borderBottom: "1px solid rgba(255,255,255,0.09)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          gap: "12px",
        }}
      >
        <a
          href="/"
          style={{
            color: "rgba(255,255,255,0.50)",
            textDecoration: "none",
            fontSize: "12px",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            letterSpacing: "0.03em",
            fontWeight: 500,
          }}
        >
          ← montekristobelgrade.com
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            className="pricing-label"
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.28)",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Services &amp; Pricing 2026
          </span>
          <button
            onClick={handlePrint}
            style={{
              background: "#e85539",
              color: "#fff",
              border: "none",
              borderRadius: "7px",
              padding: "7px 16px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            Save as PDF
          </button>
        </div>
      </div>

      {/* Pricing document */}
      <iframe
        ref={iframeRef}
        src="/pricing.html"
        style={{ flex: 1, border: "none", width: "100%" }}
        title="MonteKristo Services & Pricing"
      />
    </div>
  );
};

export default Pricing;
