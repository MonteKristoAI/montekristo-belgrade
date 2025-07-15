import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgentCatalog } from "@/components/AgentCatalog";

const Agents = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              AI Agent Catalog
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Explore our comprehensive collection of specialized AI agents designed to automate and optimize your business processes.
            </p>
          </div>
        </div>
      </main>
      <AgentCatalog />
      <Footer />
    </div>
  );
};

export default Agents;