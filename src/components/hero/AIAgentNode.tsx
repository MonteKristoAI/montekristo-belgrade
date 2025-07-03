
import { useState } from "react";

interface AIAgentNodeProps {
  agent: {
    id: number;
    label: string;
    color: string;
    gradient: string;
    description: string;
    benefit: string;
  };
  position: { x: number; y: number };
  labelPosition: { x: number; y: number };
  isHovered: boolean;
  onHover: (id: number | null) => void;
  pulsePhase: number;
  className?: string;
}

export const AIAgentNode = ({ 
  agent, 
  position, 
  labelPosition,
  isHovered, 
  onHover, 
  pulsePhase,
  className = ""
}: AIAgentNodeProps) => {

  return (
    <div className={`absolute pointer-events-none ${className}`}>
      {/* Agent Node */}
      <div
        className="relative cursor-pointer pointer-events-auto"
        style={{
          left: `${position.x - 28}px`,
          top: `${position.y - 28}px`,
          width: '56px',
          height: '56px',
        }}
        onMouseEnter={() => onHover(agent.id)}
        onMouseLeave={() => onHover(null)}
      >
        <svg width="56" height="56" viewBox="0 0 56 56">
          <defs>
            <radialGradient id={`gradient-${agent.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={agent.color} stopOpacity="0.95"/>
              <stop offset="70%" stopColor={agent.color} stopOpacity="0.7"/>
              <stop offset="100%" stopColor={agent.color} stopOpacity="0.3"/>
            </radialGradient>
            
            <filter id={`glow-${agent.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer glow ring - breathing effect */}
          <circle
            cx="28"
            cy="28"
            r={isHovered ? "25" : "22"}
            fill="none"
            stroke={agent.color}
            strokeWidth="1.5"
            strokeOpacity={0.4 + Math.sin((pulsePhase + agent.id * 15) * 0.08) * 0.3}
            className="transition-all duration-500"
            filter={`url(#glow-${agent.id})`}
          />

          {/* Main node with enhanced hover effect */}
          <circle
            cx="28"
            cy="28"
            r={isHovered ? "18" : "15"}
            fill={`url(#gradient-${agent.id})`}
            filter={`url(#glow-${agent.id})`}
            className="transition-all duration-500"
            style={{
              opacity: isHovered ? 1 : 0.85,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />

          {/* Inner core */}
          <circle
            cx="28"
            cy="28"
            r="8"
            fill={agent.color}
            opacity={0.3 + Math.sin((pulsePhase + agent.id * 20) * 0.06) * 0.2}
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Premium Agent Label - no overlaps, consistent styling */}
      <div
        className={`font-space-grotesk font-semibold text-sm transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-105' : 'opacity-90'
        }`}
        style={{
          left: `${labelPosition.x - 60}px`,
          top: `${labelPosition.y - 12}px`,
          width: '120px',
          textAlign: 'center',
          background: `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))`,
          color: agent.color,
          textShadow: `0 0 8px ${agent.color}30, 0 1px 3px rgba(0,0,0,0.1)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${agent.color}20`,
          borderRadius: '16px',
          padding: '6px 12px',
          letterSpacing: '0.025em',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: `0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset`
        }}
      >
        {agent.label}
      </div>

      {/* Hover Tooltip - cleaner, more premium */}
      {isHovered && (
        <div
          className="bg-white/98 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-sm text-[#041122] shadow-xl animate-fade-in pointer-events-none font-inter"
          style={{
            left: `${position.x - 80}px`,
            top: `${position.y - 75}px`,
            width: '160px',
            textAlign: 'center',
            zIndex: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8) inset'
          }}
        >
          <div className="font-medium text-gray-900 mb-1">{agent.label}</div>
          <div className="text-xs text-gray-600 leading-relaxed">{agent.description}</div>
        </div>
      )}
    </div>
  );
};
