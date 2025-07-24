import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import workflowHero from "@/assets/workflow-hero.jpg";

const Blog = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              Blog
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Insights, trends, and best practices in AI automation and business intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/blog/from-checkboxes-to-growth-engines'}>
              <img 
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                alt="White robot representing AI-powered adaptive learning"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#041122] mb-3">
                  From Checkboxes to Growth Engines: How AI‑Powered Adaptive Learning Supercharges SaaS Teams
                </h2>
                <p className="text-[#1D1F28]/70 mb-4">
                  Ditch static training decks—see how AI‑powered adaptive learning turns L&D into a revenue growth engine for SaaS companies.
                </p>
                <div className="text-sm text-[#1D1F28]/50">
                  July 23, 2025 • ≈ 10 min read
                </div>
              </div>
            </article>
            
            <article className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/blog/workflow-first-ai-automation'}>
              <img 
                src={workflowHero}
                alt="Colorful abstract representation of AI automation workflows"
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#041122] mb-3">
                  Workflow‑First AI Automation: How Founder‑Led SaaS Teams Can Scale Without the Busywork
                </h2>
                <p className="text-[#1D1F28]/70 mb-4">
                  Map workflows before you add bots—unlock AI automation that drives SaaS growth without head‑count sprawl.
                </p>
                <div className="text-sm text-[#1D1F28]/50">
                  July 23, 2025 • ≈ 10 min read
                </div>
              </div>
            </article>
            
            <article className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#041122] mb-3">
                  Best Practices for AI Agent Integration
                </h2>
                <p className="text-[#1D1F28]/70 mb-4">
                  Essential guidelines for successfully integrating AI agents into existing business workflows and systems.
                </p>
                <div className="text-sm text-[#1D1F28]/50">
                  December 5, 2024
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;