
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const agents = [
  {
    name: "SDR Clone Agent",
    description: "Qualifies leads 24/7 using custom scripts",
    icon: "📞"
  },
  {
    name: "Outreach Flow Agent", 
    description: "Orchestrates email + LinkedIn cadences",
    icon: "📧"
  },
  {
    name: "CRM Sync Agent",
    description: "Auto-logs notes, updates pipeline stages", 
    icon: "📊"
  },
  {
    name: "LinkedIn Engager",
    description: "Personalizes DMs at scale",
    icon: "💼"
  },
  {
    name: "Content Repurposer",
    description: "Turns one post into ten assets",
    icon: "✨"
  },
  {
    name: "Sales Trainer Agent",
    description: "Onboards reps with AI micro-lessons",
    icon: "🎓"
  }
];

export const AgentCatalog = () => {
  return (
    <section id="agents" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
            Explore the Agent Catalog
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl hover:transform hover:scale-105 transition-all duration-300 border-0 shadow-lg overflow-hidden"
            >
              <CardContent className="p-8 text-center space-y-6">
                <div 
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                  role="img"
                  aria-label={`Illustration of ${agent.name} branded cube`}
                >
                  {agent.icon}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-[#041122]">
                    {agent.name}
                  </h3>
                  <p className="text-[#1D1F28]/70 leading-relaxed">
                    {agent.description}
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-[#FF5C5C] text-[#FF5C5C] hover:bg-[#FF5C5C] hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                  data-event="cta-click"
                >
                  Try Demo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
