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
import PaymentAndPolicies from "./pages/legal/PaymentAndPolicies";
import Pricing from "./pages/Pricing";
import Reports from "./pages/Reports";
import ReigSolarQ12026 from "./pages/reports/ReigSolarQ12026";
import BreathMasteryQ12026 from "./pages/reports/BreathMasteryQ12026";
import LuxeShuttersGuide from "./pages/reports/LuxeShuttersGuide";
import LrmbOnboarding from "./pages/reports/LrmbOnboarding";
import LrmbResults from "./pages/reports/LrmbResults";
import AiiaPortal from "./pages/reports/AiiaPortal";
import AiiaOnboarding from "./pages/reports/AiiaOnboarding";
import AiiaResults from "./pages/reports/AiiaResults";
import NotFound from "./pages/NotFound";
import OnboardingRoutes from "./pages/onboarding/OnboardingRoutes";
import PortalRoutes from "./portal/PortalRoutes";

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
          <Route path="/legal/payment-and-policies" element={<PaymentAndPolicies />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/reig-solar-q1-2026" element={<ReigSolarQ12026 />} />
          <Route path="/reports/breathmastery-q1-2026" element={<BreathMasteryQ12026 />} />
          <Route path="/reports/luxeshutters-ai-guide" element={<LuxeShuttersGuide />} />
          <Route path="/reports/lrmb-onboarding" element={<LrmbOnboarding />} />
          <Route path="/results/lrmb" element={<LrmbResults />} />
          <Route path="/aiia" element={<AiiaPortal />} />
          <Route path="/aiia/onboarding" element={<AiiaOnboarding />} />
          <Route path="/aiia/results" element={<AiiaResults />} />
          <Route path="/onboarding/*" element={<OnboardingRoutes />} />
          {/* MonteKristo Client Portal — schema-driven onboarding intake. Magic-link auth, 30s autosave + manual Save, asset upload, MK admin dashboard. Backed by Supabase project hvdlyrquohxfazhgkfuh (separate from main site). */}
          <Route path="/reports/portal/*" element={<PortalRoutes />} />
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
