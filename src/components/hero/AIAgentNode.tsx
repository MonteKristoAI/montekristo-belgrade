
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
      {/* Premium Agent Label - no overlaps, consistent styling */}
      <div
        className={`font-space-grotesk font-semibold text-sm transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-105' : 'opacity-90'
        }`}
        style={{
          left: `${labelPosition.x - 70}px`,
          top: `${labelPosition.y - 14}px`,
          width: '140px',
          textAlign: 'center',
          background: `linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))`,
          color: '#1a1a1a',
          textShadow: `0 0 12px ${agent.color}25, 0 1px 2px rgba(0,0,0,0.08)`,
          backdropFilter: 'blur(12px)',
          border: `1.5px solid ${agent.color}15`,
          borderRadius: '20px',
          padding: '8px 16px',
          letterSpacing: '0.02em',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: `0 8px 25px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.6) inset, 0 0 20px ${agent.color}10`
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
