import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const Resources = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              Resources
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Downloads, guides, and tools to help you succeed with AI automation in your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#041122] mb-8">
                Downloadable Resources
              </h2>
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-[#041122] mb-2">
                    AI Readiness Assessment
                  </h3>
                  <p className="text-[#1D1F28]/70 mb-4">
                    Evaluate your organization's readiness for AI implementation with our comprehensive assessment tool.
                  </p>
                  <button className="bg-[#ff5b5b] text-white px-6 py-2 rounded-lg hover:bg-[#e94e4e] transition-colors">
                    Download PDF
                  </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-[#041122] mb-2">
                    ROI Calculator
                  </h3>
                  <p className="text-[#1D1F28]/70 mb-4">
                    Calculate potential cost savings and efficiency gains from AI agent deployment.
                  </p>
                  <button className="bg-[#ff5b5b] text-white px-6 py-2 rounded-lg hover:bg-[#e94e4e] transition-colors">
                    Download Excel
                  </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-[#041122] mb-2">
                    Implementation Checklist
                  </h3>
                  <p className="text-[#1D1F28]/70 mb-4">
                    Step-by-step guide to ensure successful AI agent deployment in your organization.
                  </p>
                  <button className="bg-[#ff5b5b] text-white px-6 py-2 rounded-lg hover:bg-[#e94e4e] transition-colors">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[#041122] mb-8">
                Learning Materials
              </h2>
              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-[#041122] mb-2">
                    Webinar Series
                  </h3>
                  <p className="text-[#1D1F28]/70 mb-4">
                    Join our monthly webinars covering the latest in AI automation and best practices.
                  </p>
                  <button className="bg-[#ff5b5b] text-white px-6 py-2 rounded-lg hover:bg-[#e94e4e] transition-colors">
                    View Schedule
                  </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-[#041122] mb-2">
                    Case Studies
                  </h3>
                  <p className="text-[#1D1F28]/70 mb-4">
                    Real-world examples of successful AI agent implementations across various industries.
                  </p>
                  <button className="bg-[#ff5b5b] text-white px-6 py-2 rounded-lg hover:bg-[#e94e4e] transition-colors">
                    Browse Cases
                  </button>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-bold text-[#041122] mb-2">
                    Documentation
                  </h3>
                  <p className="text-[#1D1F28]/70 mb-4">
                    Technical documentation and API references for developers and system administrators.
                  </p>
                  <button className="bg-[#ff5b5b] text-white px-6 py-2 rounded-lg hover:bg-[#e94e4e] transition-colors">
                    View Docs
                  </button>
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

export default Resources;