
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
    <div className="min-h-screen bg-[#FAF8F4]">
      <Hero />
      <WhySection />
      <AgentCatalog />
      <Framework />
      <UseCases />
      <Results />
      <FAQ />
      <BlogTeaser />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
