
import { useState, useEffect, useRef } from "react";

interface BusinessOSCoreProps {
  className?: string;
  onMouseMove?: (x: number, y: number) => void;
}

export const BusinessOSCore = ({ className = "", onMouseMove }: BusinessOSCoreProps) => {
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const coreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingPhase(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!coreRef.current) return;
    
    const rect = coreRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;
    
    setMousePosition({ x: x * 8, y: y * 8 });
    onMouseMove?.(x, y);
  };

  const getBreathingScale = () => {
    return 1 + Math.sin(thinkingPhase * 0.04) * 0.06; // Gentle breathing
  };

  const getThinkingIntensity = () => {
    return 0.7 + Math.sin(thinkingPhase * 0.06) * 0.25;
  };

  return (
    <div 
      ref={coreRef}
      className={`relative w-36 h-36 ${className}`}
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
    >
      <svg
        width="144"
        height="144"
        viewBox="0 0 144 144"
        className="absolute inset-0"
      >
        <defs>
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.95"/>
            <stop offset="30%" stopColor="#8B5CF6" stopOpacity="0.85"/>
            <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.3"/>
          </radialGradient>
          
          <filter id="coreGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Orbital particles - more elegant */}
        {[...Array(8)].map((_, i) => {
          const angle = (i * 45) + (thinkingPhase * 1.5);
          const radius = 50 + Math.sin((thinkingPhase + i * 25) * 0.04) * 8;
          const x = 72 + Math.cos(angle * Math.PI / 180) * radius;
          const y = 72 + Math.sin(angle * Math.PI / 180) * radius;
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.5 + Math.sin((thinkingPhase + i * 15) * 0.08) * 1}
              fill="#8B5CF6"
              opacity={0.4 + Math.sin((thinkingPhase + i * 12) * 0.06) * 0.3}
              filter="url(#coreGlow)"
            />
          );
        })}

        {/* Gentle breathing outer ring */}
        <circle
          cx="72"
          cy="72"
          r={55 + Math.sin(thinkingPhase * 0.03) * 5}
          fill="none"
          stroke="#6366F1"
          strokeWidth="1.5"
          strokeOpacity="0.3"
          filter="url(#coreGlow)"
        />

        {/* Main core with enhanced breathing */}
        <g transform={`translate(72, 72) scale(${getBreathingScale()}) translate(${mousePosition.x}, ${mousePosition.y})`}>
          <circle
            r="38"
            fill="url(#coreGradient)"
            filter="url(#coreGlow)"
            style={{ opacity: getThinkingIntensity() }}
          />
          
          {/* Inner neural core */}
          <circle
            r="28"
            fill="#8B5CF6"
            opacity="0.5"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          {/* Central thinking node */}
          <circle
            r="15"
            fill="#6366F1"
            opacity={0.8 + Math.sin(thinkingPhase * 0.1) * 0.2}
            filter="url(#coreGlow)"
          />
        </g>

        {/* Data pulse streams - more refined */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const streamLength = 45;
          const startX = 72 + Math.cos(angle * Math.PI / 180) * 38;
          const startY = 72 + Math.sin(angle * Math.PI / 180) * 38;
          const endX = 72 + Math.cos(angle * Math.PI / 180) * (38 + streamLength);
          const endY = 72 + Math.sin(angle * Math.PI / 180) * (38 + streamLength);
          
          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#8B5CF6"
              strokeWidth="2.5"
              strokeOpacity={0.3 + Math.sin((thinkingPhase + i * 25) * 0.05) * 0.2}
              filter="url(#coreGlow)"
            />
          );
        })}
      </svg>

      {/* Business OS Label - premium typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className="text-base font-space-grotesk font-bold text-white text-center leading-tight"
          style={{ 
            textShadow: '0 0 20px #8B5CF6, 0 0 40px #6366F1, 0 2px 4px rgba(0,0,0,0.3)',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            letterSpacing: '0.05em'
          }}
        >
          Business<br/>OS
        </span>
      </div>
    </div>
  );
};
