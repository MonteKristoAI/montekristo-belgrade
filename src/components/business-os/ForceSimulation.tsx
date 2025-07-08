import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { GraphData, NodeData, LinkData } from './types';

interface ForceSimulationProps {
  data: GraphData;
  width: number;
  height: number;
  onNodeUpdate: (nodes: NodeData[]) => void;
  onLinkUpdate: (links: LinkData[]) => void;
}

export const ForceSimulation = ({ 
  data, 
  width, 
  height, 
  onNodeUpdate, 
  onLinkUpdate 
}: ForceSimulationProps) => {
  const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null);

  useEffect(() => {
    // Create force simulation
    const simulation = d3.forceSimulation<NodeData>(data.nodes)
      .force('link', d3.forceLink<NodeData, LinkData>(data.links)
        .id((d: NodeData) => d.id)
        .distance(140)
        .strength(0.6))
      .force('charge', d3.forceManyBody()
        .strength(-400)
        .distanceMax(250))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius((d: NodeData) => d.id === 'business-os' ? 55 : 35)
        .strength(0.8));

    // Pin the center node
    const centerNode = data.nodes.find(n => n.id === 'business-os');
    if (centerNode) {
      centerNode.fx = width / 2;
      centerNode.fy = height / 2;
    }

    // Store original positions for rotation
    const originalPositions = new Map();
    data.nodes.forEach(node => {
      if (node.id !== 'business-os') {
        originalPositions.set(node.id, { x: node.x, y: node.y });
      }
    });

    // Idle animation variables
    let baseRotationAngle = 0;
    let animationStartTime = 0;
    let isUserInteracting = false;
    let animationId: number;

    // Track user interactions
    const handleInteractionStart = () => { isUserInteracting = true; };
    const handleInteractionEnd = () => { 
      setTimeout(() => { isUserInteracting = false; }, 500); // Resume after 500ms
    };

    // Add interaction listeners
    const graphElement = document.getElementById('business-os-graph');
    if (graphElement) {
      graphElement.addEventListener('mouseenter', handleInteractionStart);
      graphElement.addEventListener('mouseleave', handleInteractionEnd);
      graphElement.addEventListener('click', handleInteractionStart);
    }

    const idleAnimate = (currentTime: number) => {
      if (!animationStartTime) animationStartTime = currentTime;
      
      const elapsed = currentTime - animationStartTime;
      const cycleTime = 5000; // 5 seconds total cycle
      const rotationTime = 500; // 0.5 seconds rotation
      const holdTime = 4500; // 4.5 seconds hold
      
      const cyclePosition = elapsed % cycleTime;
      
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 
          !isUserInteracting && 
          cyclePosition <= rotationTime) {
        
        // During rotation phase (first 0.5 seconds)
        const rotationProgress = cyclePosition / rotationTime;
        const targetAngle = baseRotationAngle + (Math.PI / 6) * rotationProgress; // 30 degrees
        
        data.nodes.forEach(node => {
          if (node.id !== 'business-os' && node.x && node.y) {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.sqrt(Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2));
            const currentAngle = Math.atan2(node.y - centerY, node.x - centerX);
            
            // Smooth rotation using easing
            const easedProgress = 1 - Math.pow(1 - rotationProgress, 3); // Ease out cubic
            const newAngle = currentAngle + (Math.PI / 6) * easedProgress / 60; // Incremental
            
            node.x = centerX + radius * Math.cos(newAngle);
            node.y = centerY + radius * Math.sin(newAngle);
          }
        });
        
        onNodeUpdate([...data.nodes]);
        onLinkUpdate([...data.links]);
      } else if (cyclePosition > rotationTime && cyclePosition <= cycleTime) {
        // During hold phase - update base angle for next cycle
        if (cyclePosition - rotationTime < 16) { // Only update once at start of hold
          baseRotationAngle += Math.PI / 6; // Add 30 degrees for next cycle
        }
      }
      
      animationId = requestAnimationFrame(idleAnimate);
    };
    
    animationId = requestAnimationFrame(idleAnimate);

    // Update positions on tick
    simulation.on('tick', () => {
      onNodeUpdate([...data.nodes]);
      onLinkUpdate([...data.links]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      cancelAnimationFrame(animationId);
      if (graphElement) {
        graphElement.removeEventListener('mouseenter', handleInteractionStart);
        graphElement.removeEventListener('mouseleave', handleInteractionEnd);
        graphElement.removeEventListener('click', handleInteractionStart);
      }
    };
  }, [data, width, height, onNodeUpdate, onLinkUpdate]);

  // Reheat simulation when component becomes visible
  const reheatSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.3).restart();
    }
  };

  // Expose reheat function for scroll triggers
  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reheatSimulation();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5
    });

    const element = document.getElementById('business-os-graph');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return null; // This component only manages the simulation
};