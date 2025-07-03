
import { useState } from "react";

interface AgentCubeProps {
  label: string;
  position: "top" | "middle" | "bottom";
  delay: number;
  alt: string;
}

export const AgentCube = ({ label, position, delay, alt }: AgentCubeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const positionClasses = {
    top: "transform -translate-x-16 -translate-y-8",
    middle: "transform translate-x-0 translate-y-0",
    bottom: "transform translate-x-16 translate-y-8"
  };

  return (
    <div 
      className={`absolute ${positionClasses[position]} animate-float`}
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-lg shadow-xl transition-all duration-300 flex items-center justify-center text-white font-medium text-sm text-center px-2 ${
          isHovered ? 'transform scale-110 shadow-2xl' : 'animate-spin-slow'
        }`}
        role="img"
        aria-label={alt}
      >
        {label}
      </div>
    </div>
  );
};
