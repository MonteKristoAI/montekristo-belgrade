import { motion, AnimatePresence } from 'framer-motion';
import { TooltipData } from './types';

interface TooltipPanelProps {
  tooltip: TooltipData;
}

export const TooltipPanel = ({ tooltip }: TooltipPanelProps) => {
  return (
    <AnimatePresence>
      {tooltip.visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltip.x + 20,
            top: tooltip.y - 60,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-xs">
            <h3 className="font-bold text-sm text-card-foreground mb-1">
              {tooltip.node.label}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tooltip.node.description}
            </p>
            {tooltip.node.impact && (
              <div className="mt-2 px-2 py-1 bg-primary/10 rounded text-xs font-medium text-primary">
                {tooltip.node.impact}
              </div>
            )}
          </div>
          {/* Arrow */}
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid hsl(var(--border))'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};