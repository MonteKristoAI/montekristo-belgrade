
import { Card, CardContent } from "@/components/ui/card";

const agents = [
  {
    name: "SDR Clone Agent",
    description: "Qualifies leads 24/7 using custom scripts",
    gradient: "from-blue-500 to-purple-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
      </svg>
    )
  },
  {
    name: "Outreach Flow Agent", 
    description: "Orchestrates email + LinkedIn cadences",
    gradient: "from-green-500 to-teal-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
      </svg>
    )
  },
  {
    name: "CRM Sync Agent",
    description: "Auto-logs notes, updates pipeline stages", 
    gradient: "from-orange-500 to-red-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    )
  },
  {
    name: "LinkedIn Engager",
    description: "Personalizes DMs at scale",
    gradient: "from-purple-500 to-pink-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    )
  },
  {
    name: "Content Repurposer",
    description: "Turns one post into ten assets",
    gradient: "from-indigo-500 to-blue-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    )
  },
  {
    name: "Sales Trainer Agent",
    description: "Onboards reps with AI micro-lessons",
    gradient: "from-yellow-500 to-orange-600",
    icon: (
      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
      </svg>
    )
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
                  className={`w-20 h-20 mx-auto bg-gradient-to-br ${agent.gradient} rounded-2xl flex items-center justify-center shadow-lg`}
                  role="img"
                  aria-label={`${agent.name} icon`}
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
