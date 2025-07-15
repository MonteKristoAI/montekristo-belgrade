import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
              Blog
            </h1>
            <p className="text-xl text-[#1D1F28]/70 max-w-3xl mx-auto">
              Insights, trends, and best practices in AI automation and business intelligence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <article className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#041122] mb-3">
                  The Future of AI in Business Operations
                </h2>
                <p className="text-[#1D1F28]/70 mb-4">
                  Exploring how artificial intelligence is reshaping traditional business processes and creating new opportunities for growth.
                </p>
                <div className="text-sm text-[#1D1F28]/50">
                  December 15, 2024
                </div>
              </div>
            </article>
            
            <article className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#041122] mb-3">
                  ROI Measurement for AI Agent Deployments
                </h2>
                <p className="text-[#1D1F28]/70 mb-4">
                  Learn how to effectively measure and optimize the return on investment from your AI automation initiatives.
                </p>
                <div className="text-sm text-[#1D1F28]/50">
                  December 10, 2024
                </div>
              </div>
            </article>
            
            <article className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-orange-500 to-red-600"></div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-[#041122] mb-3">
                  Best Practices for AI Agent Integration
                </h2>
                <p className="text-[#1D1F28]/70 mb-4">
                  Essential guidelines for successfully integrating AI agents into existing business workflows and systems.
                </p>
                <div className="text-sm text-[#1D1F28]/50">
                  December 5, 2024
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;