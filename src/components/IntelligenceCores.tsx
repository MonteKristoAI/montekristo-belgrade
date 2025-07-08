import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export const IntelligenceCores = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'intro' | 'assembly' | 'idle'>('intro');

  // 7-second cinematic loop timeline
  useEffect(() => {
    if (!isInView) return;

    const runAnimation = async () => {
      if (shouldReduceMotion) {
        setAnimationPhase('idle');
        return;
      }

      // Phase 1: Intro (0-1s) - Fade-in + upward drift
      setAnimationPhase('intro');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Phase 2: Assembly (1-3s) - Magnetic snap effects
      setAnimationPhase('assembly');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Phase 3: Idle loop (3-7s) - Breathing and oscillation
      setAnimationPhase('idle');
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Loop back to idle
      runAnimation();
    };

    runAnimation();
  }, [isInView, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      className="relative w-[500px] h-[500px] lg:w-[600px] lg:h-[600px] mx-auto"
      // Scroll entrance animation
      initial={{ opacity: 0, scale: 0.93, y: '12%' }}
      animate={isInView ? { opacity: 1, scale: 1, y: '0%' } : { opacity: 0, scale: 0.93, y: '12%' }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Hover parallax and bloom effect */}
      {isHovered && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: Math.random() * 16 - 8, // ±8px parallax
            y: Math.random() * 16 - 8,
            z: 14
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            boxShadow: '0 0 30px rgba(0, 234, 255, 0.2)', // #00eaff bloom
            borderRadius: '50%'
          }}
        />
      )}

      {/* Main PNG asset with all animations */}
      <motion.img
        src="/lovable-uploads/333ab008-cb5f-41c2-a7bc-7a3428d57e7c.png"
        alt="Four luminous AI cores hover and connect, illustrating each step of the AI-transformation protocol."
        className="w-full h-full object-contain"
        initial={{ opacity: 0 }}
        animate={{
          // Intro phase (0-1s): Fade-in + upward drift
          opacity: animationPhase === 'intro' ? [0, 1] : 1,
          y: animationPhase === 'intro' ? [-8, 0] : 0,
          
          // Assembly phase (1-3s): Scale pops + motion blur
          scale: animationPhase === 'assembly' ? [0.96, 1.02, 1] : 1,
          
          // Idle phase (3-7s): Yaw oscillation + breathing glow
          rotateY: animationPhase === 'idle' && !shouldReduceMotion ? [0, 4, 0, -4, 0] : 0,
          filter: animationPhase === 'idle' ? 
            [
              'drop-shadow(0 0 18px rgba(0, 234, 255, 0.68))', // 85% intensity
              'drop-shadow(0 0 18px rgba(0, 234, 255, 0.8))',  // 100% intensity
              'drop-shadow(0 0 18px rgba(0, 234, 255, 0.68))'  // 85% intensity
            ] : 
            'drop-shadow(0 0 18px rgba(0, 234, 255, 0.68))'
        }}
        transition={{
          opacity: { duration: 1, ease: "easeOut" },
          y: { duration: 1, ease: "easeOut" },
          scale: { 
            duration: 2, 
            ease: "easeOut",
            times: [0, 0.08, 1] // 80ms for first pop
          },
          rotateY: { 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatType: "loop"
          },
          filter: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop"
          }
        }}
        style={{
          transformStyle: 'preserve-3d'
        }}
      />

      {/* Assembly jolts - three additional Y-jolts at 1.2s, 1.4s, 1.6s */}
      {animationPhase === 'assembly' && !shouldReduceMotion && (
        <>
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              y: [0, -3, 0]
            }}
            transition={{
              delay: 0.2, // at t=1.2s
              duration: 0.16,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              y: [0, -3, 0]
            }}
            transition={{
              delay: 0.4, // at t=1.4s
              duration: 0.16,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              y: [0, -3, 0]
            }}
            transition={{
              delay: 0.6, // at t=1.6s
              duration: 0.16,
              ease: "easeOut"
            }}
          />
        </>
      )}

      {/* Motion blur streak during assembly */}
      {animationPhase === 'assembly' && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            filter: [
              'blur(0px)',
              'blur(2px) brightness(1.1)',
              'blur(0px)'
            ]
          }}
          transition={{
            duration: 0.067, // 2 frames at 30fps
            ease: "easeInOut"
          }}
          style={{
            background: 'linear-gradient(40deg, transparent 40%, rgba(0, 234, 255, 0.1) 50%, transparent 60%)'
          }}
        />
      )}

      {/* Dust particle overlay - optional heartbeat pulse every 4s during idle */}
      {animationPhase === 'idle' && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop"
          }}
          style={{
            background: 'radial-gradient(circle, rgba(0, 234, 255, 0.05) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      )}
    </motion.div>
  );
};