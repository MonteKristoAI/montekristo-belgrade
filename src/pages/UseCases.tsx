import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const UseCases = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              Use Cases
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Discover how AI agents can transform your business operations across different industries and scenarios.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Use case examples can be added here */}
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold text-[#041122] mb-4">
                Sales Automation
              </h3>
              <p className="text-[#1D1F28]/70">
                Automate lead qualification, follow-ups, and pipeline management to increase conversion rates.
              </p>
            </div>
            
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold text-[#041122] mb-4">
                Customer Support
              </h3>
              <p className="text-[#1D1F28]/70">
                Provide 24/7 intelligent customer support with AI agents that understand context and intent.
              </p>
            </div>
            
            <div className="p-8 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-bold text-[#041122] mb-4">
                Content Creation
              </h3>
              <p className="text-[#1D1F28]/70">
                Scale content production with AI agents that maintain brand voice and quality standards.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UseCases;