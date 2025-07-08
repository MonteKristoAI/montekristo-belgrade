import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

interface Core {
  id: string;
  label: string;
  color: string;
  glowColor: string;
  position: { x: number; y: number };
}

const cores: Core[] = [
  {
    id: 'discovery',
    label: 'DISCOVERY',
    color: '#FF6B47', // warm coral
    glowColor: '#FF6B47',
    position: { x: 80, y: 120 }
  },
  {
    id: 'blueprint',
    label: 'BLUEPRINT', 
    color: '#B946DB', // magenta-violet
    glowColor: '#B946DB',
    position: { x: 220, y: 80 }
  },
  {
    id: 'deployment',
    label: 'DEPLOYMENT',
    color: '#00BFFF', // electric-blue
    glowColor: '#00BFFF',
    position: { x: 280, y: 200 }
  },
  {
    id: 'optimisation',
    label: 'OPTIMISATION',
    color: '#00E5CC', // cyan-teal
    glowColor: '#00E5CC',
    position: { x: 140, y: 240 }
  }
];

export const IntelligenceCores = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [assemblyComplete, setAssemblyComplete] = useState(false);

  useEffect(() => {
    if (isInView && !shouldReduceMotion) {
      const timer = setTimeout(() => setAssemblyComplete(true), 3000);
      return () => clearTimeout(timer);
    } else if (isInView) {
      setAssemblyComplete(true);
    }
  }, [isInView, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      className="relative w-96 h-96 mx-auto"
      initial={{ opacity: 0, scale: 0.93, y: '12%' }}
      animate={isInView ? { opacity: 1, scale: 1, y: '0%' } : { opacity: 0, scale: 0.93, y: '12%' }}
      transition={{ duration: 1, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Hover shadow bloom */}
      {isHovered && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: 'radial-gradient(circle, rgba(0, 234, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(30px)',
            transform: 'translateZ(14px)'
          }}
        />
      )}

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 320"
        className="overflow-visible"
        style={{ background: 'transparent' }}
      >
        <defs>
          {cores.map(core => (
            <filter key={`glow-${core.id}`} id={`glow-${core.id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          ))}
          
          {/* Particle gradient */}
          <radialGradient id="particleGradient">
            <stop offset="0%" stopColor="#00eaff" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#00eaff" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Floating particles */}
        <motion.g
          animate={{
            scale: shouldReduceMotion ? 1 : [1, 1.1, 1],
            opacity: shouldReduceMotion ? 0.6 : [0.6, 0.9, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + (i * 20) + Math.sin(i) * 40}
              cy={160 + Math.cos(i) * 60}
              r="2"
              fill="url(#particleGradient)"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: shouldReduceMotion ? 0.3 : [0.3, 0.7, 0.3],
                y: shouldReduceMotion ? 0 : [0, -10, 0]
              }}
              transition={{
                duration: 3 + (i * 0.2),
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.g>

        {/* Intelligence Cores */}
        {cores.map((core, index) => (
          <motion.g
            key={core.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: assemblyComplete && !shouldReduceMotion ? [0, 4, 0, -4, 0] : 0
            }}
            transition={{
              opacity: { delay: shouldReduceMotion ? 0 : 1 + (index * 0.5), duration: 0.6 },
              scale: { delay: shouldReduceMotion ? 0 : 1 + (index * 0.5), duration: 0.6 },
              rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Core glow */}
            <motion.circle
              cx={core.position.x}
              cy={core.position.y}
              r="32"
              fill={core.glowColor}
              opacity="0.3"
              filter={`url(#glow-${core.id})`}
              animate={{
                opacity: shouldReduceMotion ? 0.3 : [0.25, 0.4, 0.25],
                scale: shouldReduceMotion ? 1 : [0.9, 1.1, 0.9]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Core shell */}
            <motion.rect
              x={core.position.x - 24}
              y={core.position.y - 24}
              width="48"
              height="48"
              rx="8"
              fill="#0d1117"
              stroke={core.color}
              strokeWidth="2"
              className="drop-shadow-lg"
              whileHover={shouldReduceMotion ? {} : {
                scale: 1.1,
                x: isHovered ? Math.random() * 16 - 8 : 0,
                y: isHovered ? Math.random() * 16 - 8 : 0
              }}
            />
            
            {/* Inner glow cavity */}
            <motion.circle
              cx={core.position.x}
              cy={core.position.y}
              r="12"
              fill={core.color}
              opacity="0.6"
              filter={`url(#glow-${core.id})`}
            />
            
            {/* Core label */}
            <motion.text
              x={core.position.x}
              y={core.position.y + 45}
              textAnchor="middle"
              className="font-poppins font-semibold text-xs tracking-wider"
              fill={core.color}
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1
              }}
              transition={{ 
                delay: shouldReduceMotion ? 0 : 1.5 + (index * 0.5),
                duration: 0.12 
              }}
            >
              {core.label}
            </motion.text>
            
            {/* Connection lines */}
            {index < cores.length - 1 && (
              <motion.line
                x1={core.position.x}
                y1={core.position.y}
                x2={cores[index + 1].position.x}
                y2={cores[index + 1].position.y}
                stroke="url(#particleGradient)"
                strokeWidth="1"
                opacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ 
                  pathLength: 1
                }}
                transition={{ 
                  delay: shouldReduceMotion ? 0 : 2 + (index * 0.5),
                  duration: 0.8 
                }}
              />
            )}
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
};