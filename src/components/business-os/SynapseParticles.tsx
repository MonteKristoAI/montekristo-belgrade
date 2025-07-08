import { motion } from 'framer-motion';
import { LinkData, NodeData } from './types';

interface SynapseParticlesProps {
  links: LinkData[];
}

export const SynapseParticles = ({ links }: SynapseParticlesProps) => {
  return (
    <g className="synapse-particles">
      {links.map((link, linkIndex) => {
        const source = link.source as NodeData;
        const target = link.target as NodeData;
        
        if (!source.x || !source.y || !target.x || !target.y) return null;
        
        // Create multiple particles per link
        return Array.from({ length: 3 }).map((_, particleIndex) => {
          const delay = (linkIndex * 0.3) + (particleIndex * 0.8);
          
          return (
            <motion.circle
              key={`${linkIndex}-${particleIndex}`}
              r="3"
              fill="url(#synapse-gradient)"
              filter="url(#synapse-glow)"
              animate={{
                cx: [source.x, target.x, source.x],
                cy: [source.y, target.y, source.y],
                opacity: [0, 1, 0.8, 1, 0],
                r: [2, 4, 3, 4, 2]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
              }}
            />
          );
        });
      })}
      
      {/* Synapse gradient and glow definitions */}
      <defs>
        <radialGradient id="synapse-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1"/>
          <stop offset="70%" stopColor="hsl(280 100% 70%)" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="hsl(200 100% 70%)" stopOpacity="0.6"/>
        </radialGradient>
        
        <filter id="synapse-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </g>
  );
};