
import { useState, useEffect } from "react";
import { BackgroundIntelligenceGrid } from "./BackgroundIntelligenceGrid";
import { BusinessOSCore } from "./BusinessOSCore";
import { AIAgentNode } from "./AIAgentNode";
import { ConnectionLine } from "./ConnectionLine";

interface LivingAISystemProps {
  className?: string;
}

interface AgentWithAngle {
  id: number;
  label: string;
  color: string;
  gradient: string;
  description: string;
  benefit: string;
  angle: number;
}

const agents = [
  {
    id: 1,
    label: "Lead Qualifier",
    color: "#F59E0B",
    gradient: "from-amber-500 to-rose-500",
    description: "Scores and prioritizes prospects automatically",
    benefit: "+12 hrs/wk"
  },
  {
    id: 2,
    label: "Outreach Agent",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-blue-500",
    description: "Personalizes and sends targeted campaigns",
    benefit: "+240% reply rate"
  },
  {
    id: 3,
    label: "CRM Sync",
    color: "#A855F7",
    gradient: "from-violet-500 to-indigo-500",
    description: "Syncs data across all business tools",
    benefit: "100% accuracy"
  },
  {
    id: 4,
    label: "Content Repurposer",
    color: "#10B981",
    gradient: "from-emerald-500 to-blue-500",
    description: "Turns videos into content threads",
    benefit: "10x content"
  },
  {
    id: 5,
    label: "Sales Trainer",
    color: "#EC4899",
    gradient: "from-pink-500 to-purple-500",
    description: "Coaches team with AI-driven insights",
    benefit: "+85% close rate"
  }
];

export const LivingAISystem = ({ className = "" }: LivingAISystemProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [systemPhase, setSystemPhase] = useState(0);
  const [adaptationPhase, setAdaptationPhase] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // System initialization
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // System adaptation cycle - slower, more elegant
  useEffect(() => {
    const interval = setInterval(() => {
      setAdaptationPhase(prev => (prev + 1) % 4);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Core system pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // System thinking cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemPhase(prev => (prev + 1) % 100);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Fixed positioning to avoid overlaps - consistent radius and spacing
  const getAgentPosition = (agent: AgentWithAngle) => {
    const baseRadius = 160; // Increased for better spacing
    const gentleFloat = Math.sin((systemPhase + agent.id * 20) * 0.02) * 6; // Gentle floating
    const radius = baseRadius + gentleFloat;
    const radian = (agent.angle * Math.PI) / 180;
    
    return {
      x: 192 + Math.cos(radian) * radius,
      y: 192 + Math.sin(radian) * radius
    };
  };

  // Fixed label positioning - no overlaps, consistent distance
  const getLabelPosition = (agent: AgentWithAngle) => {
    const labelRadius = 210; // Fixed distance for all labels
    const radian = (agent.angle * Math.PI) / 180;
    
    return {
      x: 192 + Math.cos(radian) * labelRadius,
      y: 192 + Math.sin(radian) * labelRadius
    };
  };

  // Even distribution of agents around circle - no overlaps
  const agentsWithAngles: AgentWithAngle[] = agents.map((agent, i) => ({
    ...agent,
    angle: i * 72 // 360/5 = 72 degrees apart
  }));

  return (
    <div className={`relative w-96 h-96 ${className}`}>
      {/* Layer 1: Background Intelligence Grid - reduced opacity for premium feel */}
      <div style={{ opacity: 0.12 }}>
        <BackgroundIntelligenceGrid />
      </div>

      {/* Layer 2: Business OS Core - enlarged and enhanced */}
      <div className="absolute inset-0 flex items-center justify-center">
        <BusinessOSCore 
          className={`transition-all duration-1000 scale-110 ${
            isLoaded ? 'animate-fade-in opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Layer 3: Connection Lines from Business OS to all agents */}
      {isLoaded && agentsWithAngles.map(agent => {
        const agentPos = getAgentPosition(agent);
        const corePos = { x: 192, y: 192 };
        const isActive = hoveredAgent === agent.id;
        
        return (
          <ConnectionLine
            key={`connection-${agent.id}`}
            from={corePos}
            to={agentPos}
            color={agent.color}
            isActive={isActive}
            pulsePhase={pulsePhase}
            className={`transition-all duration-500 ${
              isLoaded ? 'animate-fade-in' : 'opacity-0'
            }`}
          />
        );
      })}

      {/* Layer 4: AI Agent Nodes with premium positioning */}
      {agentsWithAngles.map(agent => {
        const position = getAgentPosition(agent);
        const labelPosition = getLabelPosition(agent);
        const isHovered = hoveredAgent === agent.id;
        
        return (
          <AIAgentNode
            key={`agent-${agent.id}`}
            agent={agent}
            position={position}
            labelPosition={labelPosition}
            isHovered={isHovered}
            onHover={setHoveredAgent}
            pulsePhase={pulsePhase}
            className={`transition-all duration-700 ${
              isLoaded ? 'animate-fade-in opacity-100' : 'opacity-0'
            }`}
          />
        );
      })}

      {/* Ambient glow particles for living ecosystem feel */}
      {[...Array(6)].map((_, i) => {
        const floatRadius = 80 + (i * 30);
        const angle = (systemPhase + i * 60) * 0.5;
        const x = 192 + Math.cos(angle * Math.PI / 180) * floatRadius;
        const y = 192 + Math.sin(angle * Math.PI / 180) * floatRadius;
        
        return (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: '4s'
            }}
          />
        );
      })}

      {/* Minimal system status indicator */}
      <div className="absolute bottom-4 right-4 text-xs font-inter font-medium">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-200/30 shadow-sm">
          <div 
            className="w-2 h-2 rounded-full bg-emerald-500"
            style={{ 
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))'
            }}
          />
          <span className="text-[#041122]/70 font-medium">System Active</span>
        </div>
      </div>
    </div>
  );
};
