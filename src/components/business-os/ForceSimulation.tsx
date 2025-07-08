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

    // Add orbital motion to peripheral nodes
    let orbitAngle = 0;
    const orbitSpeed = Math.PI / 36; // 5 degrees per second at 60fps
    
    const animate = () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        orbitAngle += orbitSpeed / 60; // Adjust for frame rate
        
        data.nodes.forEach(node => {
          if (node.id !== 'business-os' && node.x && node.y) {
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.sqrt(Math.pow(node.x - centerX, 2) + Math.pow(node.y - centerY, 2));
            const angle = Math.atan2(node.y - centerY, node.x - centerX) + orbitSpeed / 60;
            
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
          }
        });
        
        onNodeUpdate([...data.nodes]);
        onLinkUpdate([...data.links]);
      }
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);

    // Update positions on tick
    simulation.on('tick', () => {
      onNodeUpdate([...data.nodes]);
      onLinkUpdate([...data.links]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
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