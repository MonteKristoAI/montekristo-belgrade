import { motion } from 'framer-motion';
import { LinkData, NodeData } from './types';

interface EdgeComponentProps {
  link: LinkData;
  isHighlighted: boolean;
}

export const EdgeComponent = ({ link, isHighlighted }: EdgeComponentProps) => {
  const source = link.source as NodeData;
  const target = link.target as NodeData;

  if (!source.x || !source.y || !target.x || !target.y) return null;

  const strokeWidth = isHighlighted ? 3 : 1.5;
  const strokeOpacity = isHighlighted ? 0.8 : 0.4;

  return (
    <g>
      {/* Main connection line */}
      <motion.line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke="hsl(var(--primary))"
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
        transition={{ duration: 0.3 }}
      />

      {/* Animated data flow */}
      <motion.line
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        stroke="url(#flow-gradient)"
        strokeWidth="2"
        strokeOpacity="0.6"
        strokeDasharray="5,10"
        animate={{
          strokeDashoffset: [0, 15]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Pulse effect when highlighted */}
      {isHighlighted && (
        <motion.line
          x1={source.x}
          y1={source.y}
          x2={target.x}
          y2={target.y}
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeOpacity="0.3"
          animate={{
            strokeOpacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Flow gradient definition */}
      <defs>
        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent"/>
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="transparent"/>
        </linearGradient>
      </defs>
    </g>
  );
};