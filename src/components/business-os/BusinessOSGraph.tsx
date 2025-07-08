import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ForceSimulation } from './ForceSimulation';
import { NodeComponent } from './NodeComponent';
import { EdgeComponent } from './EdgeComponent';
import { TooltipPanel } from './TooltipPanel';
import { ExpandedView } from './ExpandedView';
import { BackgroundGrid } from './BackgroundGrid';
import { SynapseParticles } from './SynapseParticles';
import { businessOSData } from './data';
import { NodeData, LinkData, TooltipData, ExpandedViewData } from './types';

interface BusinessOSGraphProps {
  className?: string;
}

export const BusinessOSGraph = ({ className = "" }: BusinessOSGraphProps) => {
  const [nodes, setNodes] = useState<NodeData[]>(businessOSData.nodes);
  const [links, setLinks] = useState<LinkData[]>(businessOSData.links);
  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({
    node: {} as NodeData,
    x: 0,
    y: 0,
    visible: false
  });
  const [expandedView, setExpandedView] = useState<ExpandedViewData>({
    node: null,
    visible: false
  });

  const width = 800;
  const height = 600;

  // Handle node updates from force simulation
  const handleNodeUpdate = useCallback((updatedNodes: NodeData[]) => {
    setNodes(updatedNodes);
  }, []);

  // Handle link updates from force simulation
  const handleLinkUpdate = useCallback((updatedLinks: LinkData[]) => {
    setLinks(updatedLinks);
  }, []);

  // Handle node hover
  const handleNodeHover = useCallback((node: NodeData | null, event?: React.MouseEvent) => {
    setHoveredNode(node);
    
    if (node && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        node,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        visible: true
      });
    } else {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  }, []);

  // Handle node click
  const handleNodeClick = useCallback((node: NodeData) => {
    if (node.id === 'business-os') return; // Don't expand center node
    
    setExpandedView({
      node,
      visible: true
    });
  }, []);

  // Close expanded view
  const closeExpandedView = useCallback(() => {
    setExpandedView({ node: null, visible: false });
  }, []);

  // Check if link should be highlighted
  const isLinkHighlighted = useCallback((link: LinkData): boolean => {
    if (!hoveredNode) return false;
    const source = link.source as NodeData;
    const target = link.target as NodeData;
    return source.id === hoveredNode.id || target.id === hoveredNode.id;
  }, [hoveredNode]);

  // Detect mobile and reduced motion preferences
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkReducedMotion = () => 
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    checkMobile();
    checkReducedMotion();

    window.addEventListener('resize', checkMobile);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', checkReducedMotion);

    return () => {
      window.removeEventListener('resize', checkMobile);
      motionQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

  // Mobile fallback - simplified static layout
  if (isMobile) {
    return (
      <div className={`flex flex-col items-center space-y-6 p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto mb-4 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OS</span>
          </div>
          <h3 className="font-bold text-lg">Business OS</h3>
          <p className="text-sm text-muted-foreground">AI orchestration hub</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {businessOSData.nodes
            .filter(node => node.id !== 'business-os')
            .map(node => (
              <motion.div
                key={node.id}
                className="bg-card border border-border rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: node.color }}
                />
                <h4 className="font-medium text-sm mb-1">{node.label}</h4>
                <p className="text-xs text-muted-foreground">{node.impact}</p>
              </motion.div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} id="business-os-graph">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
          style={{ background: 'transparent' }}
        >
          {/* Background grid and ambient effects */}
          <BackgroundGrid width={width} height={height} />

          {/* Render edges */}
          {links.map((link, index) => (
            <EdgeComponent
              key={index}
              link={link}
              isHighlighted={isLinkHighlighted(link)}
            />
          ))}

          {/* Synapse particles */}
          <SynapseParticles links={links} />

          {/* Render nodes */}
          {nodes.map(node => (
            <NodeComponent
              key={node.id}
              node={node}
              isHovered={hoveredNode?.id === node.id}
              onHover={handleNodeHover}
              onClick={handleNodeClick}
            />
          ))}
        </svg>

        {/* Force simulation */}
        <ForceSimulation
          data={{ nodes, links }}
          width={width}
          height={height}
          onNodeUpdate={handleNodeUpdate}
          onLinkUpdate={handleLinkUpdate}
        />

        {/* Tooltip */}
        <TooltipPanel tooltip={tooltip} />

        {/* Expanded view */}
        <ExpandedView
          expandedView={expandedView}
          onClose={closeExpandedView}
        />
      </motion.div>
    </div>
  );
};