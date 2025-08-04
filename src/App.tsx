import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { SecurityProvider } from "@/components/SecurityProvider";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import AdaptiveLearning from "./pages/blog/AdaptiveLearning";
import WorkflowFirstAIAutomation from "./pages/blog/WorkflowFirstAIAutomation";
import AIAgentsPracticalPlaybook from "./pages/blog/AIAgentsPracticalPlaybook";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <SecurityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/from-checkboxes-to-growth-engines" element={<AdaptiveLearning />} />
          <Route path="/blog/workflow-first-ai-automation" element={<WorkflowFirstAIAutomation />} />
          <Route path="/blog/ai-agents-practical-playbook" element={<AIAgentsPracticalPlaybook />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SecurityProvider>
  </HelmetProvider>
  </QueryClientProvider>
);

export default App;
