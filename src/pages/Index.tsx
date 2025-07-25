import React from "react";
import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import { WhySection } from "@/components/WhySection";
import { AgentCatalog } from "@/components/AgentCatalog";
import { Framework } from "@/components/Framework";
import { UseCases } from "@/components/UseCases";
import { Results } from "@/components/Results";
import { FAQ } from "@/components/FAQ";
import { BlogTeaser } from "@/components/BlogTeaser";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <WhySection />
      <div id="agents">
        <AgentCatalog />
      </div>
      <div id="protocol">
        <Framework />
      </div>
      <div id="use-cases">
        <UseCases />
      </div>
      <Results />
      <FAQ />
      <BlogTeaser />
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;