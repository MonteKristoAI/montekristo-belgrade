import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ExpandedViewData } from './types';

interface ExpandedViewProps {
  expandedView: ExpandedViewData;
  onClose: () => void;
}

export const ExpandedView = ({ expandedView, onClose }: ExpandedViewProps) => {
  return (
    <AnimatePresence>
      {expandedView.visible && expandedView.node && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-4 top-4 bg-card border border-border rounded-lg p-6 shadow-xl max-w-sm z-40"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg text-card-foreground">
              {expandedView.node.label}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {expandedView.node.description}
          </p>

          {expandedView.node.caseStudy && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-card-foreground mb-2">
                Case Study
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {expandedView.node.caseStudy}
              </p>
            </div>
          )}

          {expandedView.node.impact && (
            <div className="mb-4 p-3 bg-primary/10 rounded-md">
              <div className="text-sm font-medium text-primary">
                {expandedView.node.impact}
              </div>
            </div>
          )}

          <Button className="w-full" size="sm">
            Learn More About {expandedView.node.label}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};