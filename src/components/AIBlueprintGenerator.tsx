
import { useState, useEffect } from "react";

interface AIBlueprintGeneratorProps {
  className?: string;
}

const agents = [
  { id: 1, label: "CRM Sync", angle: 0, color: "#8B5CF6" },
  { id: 2, label: "Outreach Agent", angle: 72, color: "#34D399" },
  { id: 3, label: "Content Repurposer", angle: 144, color: "#0EA5E9" },
  { id: 4, label: "Lead Qualifier", angle: 216, color: "#F59E0B" },
  { id: 5, label: "Sales Trainer", angle: 288, color: "#EF4444" }
];

export const AIBlueprintGenerator = ({ className = "" }: AIBlueprintGeneratorProps) => {
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);
  const [morphPhase, setMorphPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMorphPhase(prev => (prev + 1) % 3);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getAgentPosition = (agent: typeof agents[0]) => {
    const baseRadius = 120;
    const morphOffset = morphPhase * 20;
    const radius = baseRadius + (agent.id % 2 === 0 ? morphOffset : -morphOffset);
    const adjustedAngle = agent.angle + (morphPhase * 10);
    const radian = (adjustedAngle * Math.PI) / 180;
    
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  return (
    <div className={`relative w-80 h-80 ${className}`}>
      <svg
        width="320"
        height="320"
        viewBox="0 0 320 320"
        className="absolute inset-0"
        style={{ filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))' }}
      >
        {/* Grid Background */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(4, 17, 34, 0.1)" strokeWidth="0.5"/>
          </pattern>
          
          {/* Gradient Definitions */}
          <linearGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4"/>
          </linearGradient>
          
          {agents.map(agent => (
            <linearGradient key={`gradient-${agent.id}`} id={`agentGradient-${agent.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={agent.color} stopOpacity="0.8"/>
              <stop offset="100%" stopColor={agent.color} stopOpacity="0.4"/>
            </linearGradient>
          ))}
          
          {/* Flow Animation */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent"/>
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="transparent"/>
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-100 0;100 0;-100 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* Grid Background */}
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>

        {/* Connection Lines */}
        {agents.map(agent => {
          const pos = getAgentPosition(agent);
          const isHovered = hoveredAgent === agent.id;
          
          return (
            <g key={`connection-${agent.id}`}>
              {/* Base Connection Line */}
              <line
                x1="160"
                y1="160"
                x2={160 + pos.x}
                y2={160 + pos.y}
                stroke={agent.color}
                strokeWidth={isHovered ? "3" : "1.5"}
                strokeOpacity={isHovered ? "0.8" : "0.4"}
                className="transition-all duration-300"
              />
              
              {/* Animated Flow Line */}
              <line
                x1="160"
                y1="160"
                x2={160 + pos.x}
                y2={160 + pos.y}
                stroke="url(#flowGradient)"
                strokeWidth="2"
                strokeOpacity="0.6"
              />
            </g>
          );
        })}

        {/* Central Business OS Core */}
        <g>
          <circle
            cx="160"
            cy="160"
            r="24"
            fill="url(#coreGradient)"
            className="animate-pulse"
            style={{ 
              filter: `drop-shadow(0 0 ${hoveredAgent ? '15px' : '10px'} rgba(139, 92, 246, 0.5))`
            }}
          />
          <circle
            cx="160"
            cy="160"
            r="30"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="animate-spin-slow"
          />
        </g>

        {/* Agent Nodes */}
        {agents.map(agent => {
          const pos = getAgentPosition(agent);
          const isHovered = hoveredAgent === agent.id;
          
          return (
            <g
              key={`agent-${agent.id}`}
              transform={`translate(${160 + pos.x}, ${160 + pos.y})`}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              <circle
                r={isHovered ? "18" : "14"}
                fill={`url(#agentGradient-${agent.id})`}
                className="transition-all duration-300"
                style={{ 
                  filter: `drop-shadow(0 0 ${isHovered ? '12px' : '6px'} ${agent.color}40)`
                }}
              />
              <circle
                r={isHovered ? "22" : "18"}
                fill="none"
                stroke={agent.color}
                strokeWidth="1"
                strokeOpacity="0.6"
                className="animate-pulse"
              />
            </g>
          );
        })}
      </svg>

      {/* Agent Labels */}
      {agents.map(agent => {
        const pos = getAgentPosition(agent);
        const isHovered = hoveredAgent === agent.id;
        
        return (
          <div
            key={`label-${agent.id}`}
            className={`absolute text-xs font-medium text-white transition-all duration-300 pointer-events-none ${
              isHovered ? 'opacity-100 scale-110' : 'opacity-80'
            }`}
            style={{
              left: `${160 + pos.x - 30}px`,
              top: `${160 + pos.y + 25}px`,
              width: '60px',
              textAlign: 'center',
              textShadow: `0 0 10px ${agent.color}`,
            }}
          >
            {agent.label}
          </div>
        );
      })}

      {/* Central Label */}
      <div 
        className="absolute text-sm font-bold text-white pointer-events-none"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textShadow: '0 0 10px #8B5CF6',
        }}
      >
        Business OS
      </div>
    </div>
  );
};
