import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const Protocol = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              AI Deployment Protocol
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Our proven methodology for implementing AI agents in enterprise environments with minimal disruption and maximum ROI.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-[#041122] mb-8">
                  4-Phase Implementation
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-[#041122] mb-4">
                    Discovery & Analysis
                  </h3>
                  <p className="text-[#1D1F28]/70">
                    Comprehensive audit of current processes and identification of automation opportunities.
                  </p>
                </div>
                
                <div className="p-8 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-[#041122] mb-4">
                    Agent Design & Development
                  </h3>
                  <p className="text-[#1D1F28]/70">
                    Custom AI agent creation tailored to your specific business requirements and workflows.
                  </p>
                </div>
                
                <div className="p-8 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-[#041122] mb-4">
                    Pilot Testing & Refinement
                  </h3>
                  <p className="text-[#1D1F28]/70">
                    Controlled deployment with continuous monitoring and optimization based on real-world performance.
                  </p>
                </div>
                
                <div className="p-8 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-[#041122] mb-4">
                    Full Deployment & Scaling
                  </h3>
                  <p className="text-[#1D1F28]/70">
                    Enterprise-wide rollout with comprehensive training and ongoing support infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Protocol;