import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { REPORTS_STORAGE_KEY, AUTH_TOKEN } from "@/pages/Reports";

const REPORT_SRC = "/reports/breathmastery-q1-2026-seo-4tVn9wRx.html";

const BreathMasteryQ12026 = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(REPORTS_STORAGE_KEY) !== AUTH_TOKEN) {
      navigate("/reports", { replace: true });
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">

      {/* Sticky nav bar */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md
        border-b border-white/[0.07] px-4 sm:px-6 py-3
        flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white
              text-sm transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </button>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-400 text-xs sm:text-sm truncate">
            BreathMastery — SEO Progress Report · Q1 2026
          </span>
        </div>

        <a
          href={REPORT_SRC}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300
            text-xs flex-shrink-0 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Open full page</span>
        </a>
      </div>

      {/* Report */}
      <iframe
        src={REPORT_SRC}
        className="flex-1 w-full border-0"
        style={{ minHeight: "calc(100vh - 49px)" }}
        title="BreathMastery — SEO Progress Report Q1 2026"
      />
    </div>
  );
};

export default BreathMasteryQ12026;
