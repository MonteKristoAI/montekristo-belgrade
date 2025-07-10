
import { Hero } from "@/components/Hero";
import { WhySection } from "@/components/WhySection";
import { AgentCatalog } from "@/components/AgentCatalog";
import { Framework } from "@/components/Framework";
import { UseCases } from "@/components/UseCases";
import { Results } from "@/components/Results";
import { FAQ } from "@/components/FAQ";
import { BlogTeaser } from "@/components/BlogTeaser";
import { ContactSection } from "@/components/ContactSection";
import Header from "@/components/Header";
import MonteKristoFooter from "@/components/MonteKristoFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-montekristo-dark">
      <Header />
      <main className="pt-16 lg:pt-20">
        <Hero />
        <WhySection />
        <AgentCatalog />
        <Framework />
        <UseCases />
        <Results />
        <FAQ />
        <BlogTeaser />
        <ContactSection />
      </main>
      <MonteKristoFooter />
    </div>
  );
};

export default Index;
