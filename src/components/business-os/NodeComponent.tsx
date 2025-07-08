import { motion } from 'framer-motion';
import { NodeData } from './types';

interface NodeComponentProps {
  node: NodeData;
  isHovered: boolean;
  onHover: (node: NodeData | null) => void;
  onClick: (node: NodeData) => void;
}

export const NodeComponent = ({ node, isHovered, onHover, onClick }: NodeComponentProps) => {
  const isCenterNode = node.id === 'business-os';
  const radius = isCenterNode ? 45 : 25; // Larger center node
  const scale = isHovered ? 1.2 : 1;

  return (
    <g
      transform={`translate(${node.x || 0}, ${node.y || 0})`}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => onHover(node)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(node)}
    >
      {/* Glow effect */}
      <defs>
        <filter id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id={`gradient-${node.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={node.color} stopOpacity="0.9"/>
          <stop offset="70%" stopColor={node.color} stopOpacity="0.6"/>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
        </radialGradient>
      </defs>

      {/* Outer pulse ring */}
      <motion.circle
        r={radius + 10}
        fill="none"
        stroke={node.color}
        strokeWidth="1"
        strokeOpacity="0.3"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main node circle */}
      <motion.circle
        r={radius}
        fill={`url(#gradient-${node.id})`}
        filter={`url(#glow-${node.id})`}
        style={{
          filter: `drop-shadow(0 0 ${isHovered ? '15px' : '8px'} ${node.color}40)`
        }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      {/* Node label */}
      <text
        y={radius + 25}
        textAnchor="middle"
        className="text-xs font-medium fill-foreground"
        style={{
          textShadow: `0 0 8px ${node.color}`,
          opacity: isHovered ? 1 : 0.8
        }}
      >
        {node.label}
      </text>

      {/* Center node special styling */}
      {isCenterNode && (
        <motion.circle
          r={radius - 5}
          fill="none"
          stroke={node.color}
          strokeWidth="2"
          strokeOpacity="0.6"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      )}
    </g>
  );
};