import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import workflowHero from "@/assets/workflow-hero.jpg";
import aiAgentsHero from "@/assets/ai-agents-hero.png";

const blogPosts = [
  {
    title: "From Checkboxes to Growth Engines: How AI‑Powered Adaptive Learning Supercharges SaaS Teams",
    excerpt: "Ditch static training decks—see how AI‑powered adaptive learning turns L&D into a revenue growth engine for SaaS companies.",
    slug: "from-checkboxes-to-growth-engines",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Workflow‑First AI Automation: How Founder‑Led SaaS Teams Can Scale Without the Busywork",
    excerpt: "Map workflows before you add bots—unlock AI automation that drives SaaS growth without head‑count sprawl.",
    slug: "workflow-first-ai-automation",
    image: workflowHero
  },
  {
    title: "AI Agents Without the Hype: A Practical Playbook for 2025 Growth",
    excerpt: "Cut through the 2025 AI‑agent hype—see what autonomous agents can and can't do for real‑world growth.",
    slug: "ai-agents-practical-playbook",
    image: aiAgentsHero
  }
];

export const BlogTeaser = () => {
  const navigate = useNavigate();

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
            Latest Insights
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card 
              key={index} 
              className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg cursor-pointer"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <CardContent className="p-8">
                <img 
                  src={post.image}
                  alt={`${post.title} hero image`}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <h3 className="text-xl font-bold text-[#041122] mb-4 leading-tight">
                  {post.title}
                </h3>
                <p className="text-[#1D1F28]/70 leading-relaxed">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg" className="border-[#041122] text-[#041122] hover:bg-[#041122]/5" onClick={() => window.location.href = '/blog'}>
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};