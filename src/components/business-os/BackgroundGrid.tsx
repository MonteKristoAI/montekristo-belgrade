import { motion } from 'framer-motion';

interface BackgroundGridProps {
  width: number;
  height: number;
}

export const BackgroundGrid = ({ width, height }: BackgroundGridProps) => {
  const gridSize = 40;
  const horizontalLines = Math.ceil(height / gridSize);
  const verticalLines = Math.ceil(width / gridSize);

  return (
    <g className="opacity-5">
      <defs>
        <pattern
          id="background-grid"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>

        {/* Animated flowing particles */}
        <filter id="glow-particle">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grid pattern */}
      <rect
        width="100%"
        height="100%"
        fill="url(#background-grid)"
      />

      {/* Floating particles for ambient intelligence */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.circle
          key={i}
          r="2"
          fill="hsl(var(--primary))"
          filter="url(#glow-particle)"
          opacity="0.4"
          animate={{
            x: [
              Math.random() * width,
              Math.random() * width,
              Math.random() * width
            ],
            y: [
              Math.random() * height,
              Math.random() * height,
              Math.random() * height
            ]
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Subtle gradient overlay for depth */}
      <defs>
        <radialGradient id="depth-gradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#depth-gradient)"
      />
    </g>
  );
};