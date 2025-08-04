import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import workflowHero from "@/assets/workflow-hero.jpg";
import aiAgentsHero from "@/assets/ai-agents-hero.png";

const blogPosts = [
  {
    title: "From Checkboxes to Growth Engines: How AI‑Powered Adaptive Learning Supercharges SaaS Teams",
    excerpt: "Ditch static training decks—see how AI‑powered adaptive learning turns L&D into a revenue growth engine for SaaS companies.",
    slug: "from-checkboxes-to-growth-engines",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    date: "December 15, 2024",
    readTime: "≈ 8 min"
  },
  {
    title: "Workflow‑First AI Automation: How Founder‑Led SaaS Teams Can Scale Without the Busywork",
    excerpt: "Map workflows before you add bots—unlock AI automation that drives SaaS growth without head‑count sprawl.",
    slug: "workflow-first-ai-automation",
    image: workflowHero,
    date: "December 10, 2024",
    readTime: "≈ 9 min"
  },
  {
    title: "AI Agents Without the Hype: A Practical Playbook for 2025 Growth",
    excerpt: "Cut through the 2025 AI‑agent hype—see what autonomous agents can and can't do for real‑world growth.",
    slug: "ai-agents-practical-playbook",
    image: aiAgentsHero,
    date: "July 24, 2025",
    readTime: "≈ 10 min"
  }
];

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
            {blogPosts.map((post, index) => (
              <article key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = `/blog/${post.slug}`}>
                <img 
                  src={post.image}
                  alt={`${post.title} hero image`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#041122] mb-3">
                    {post.title}
                  </h2>
                  <p className="text-[#1D1F28]/70 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="text-sm text-[#1D1F28]/50">
                    {post.date} • {post.readTime} read
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;