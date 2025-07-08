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
        .distance(120)
        .strength(0.8))
      .force('charge', d3.forceManyBody()
        .strength(-300)
        .distanceMax(200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide()
        .radius((d: NodeData) => d.id === 'business-os' ? 45 : 30)
        .strength(0.7));

    // Pin the center node
    const centerNode = data.nodes.find(n => n.id === 'business-os');
    if (centerNode) {
      centerNode.fx = width / 2;
      centerNode.fy = height / 2;
    }

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