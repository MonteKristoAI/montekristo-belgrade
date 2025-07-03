
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
    const baseRadius = 170; // Increased for better spacing
    const gentleFloat = Math.sin((systemPhase + agent.id * 20) * 0.02) * 8; // Gentle floating
    const orbitOffset = Math.sin((systemPhase + agent.id * 15) * 0.015) * 3; // Gentle orbital motion
    const radius = baseRadius + gentleFloat + orbitOffset;
    const radian = (agent.angle * Math.PI) / 180;
    
    return {
      x: 192 + Math.cos(radian) * radius,
      y: 192 + Math.sin(radian) * radius
    };
  };

  // Fixed label positioning - no overlaps, consistent distance
  const getLabelPosition = (agent: AgentWithAngle) => {
    const labelRadius = 230; // Increased distance for better spacing
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
      <div style={{ opacity: 0.08 }}>
        <BackgroundIntelligenceGrid />
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
      {[...Array(8)].map((_, i) => {
        const floatRadius = 90 + (i * 25);
        const angle = (systemPhase + i * 45) * 0.3;
        const x = 192 + Math.cos(angle * Math.PI / 180) * floatRadius;
        const y = 192 + Math.sin(angle * Math.PI / 180) * floatRadius;
        const opacity = 0.15 + Math.sin((systemPhase + i * 30) * 0.05) * 0.1;
        
        return (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full transition-opacity duration-1000"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${2 + Math.sin((systemPhase + i * 20) * 0.04)}px`,
              height: `${2 + Math.sin((systemPhase + i * 20) * 0.04)}px`,
              background: `radial-gradient(circle, rgba(139, 92, 246, ${opacity}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${4 + Math.sin((systemPhase + i * 15) * 0.06) * 2}px rgba(139, 92, 246, ${opacity * 0.8})`
            }}
          />
        );
      })}

    </div>
  );
};
