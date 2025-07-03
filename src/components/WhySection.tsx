
export const WhySection = () => {
  return (
    <section id="why" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#041122] leading-tight">
              Automation Is Dead—Welcome{" "}
              <span className="text-[#FF5C5C]">Precision AI Transformation</span>
            </h2>
            
            <div className="space-y-6">
              <p className="text-xl text-[#1D1F28]/80 leading-relaxed max-w-lg">
                Generic automation tools blast prospects and clog CRMs.
              </p>
              <p className="text-xl text-[#1D1F28]/80 leading-relaxed max-w-lg">
                Our precision agents learn your playbooks, act in real time, and deliver compounding ROI.
              </p>
            </div>
          </div>
          
          {/* Right: Diagram */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#041122] mb-8 text-center">
              Productivity Comparison
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1D1F28] font-medium">Generic Automation</span>
                  <span className="text-[#FF5C5C] font-bold">2.1x</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 rounded-full w-[30%] transition-all duration-1000" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#1D1F28] font-medium">AI Agents</span>
                  <span className="text-[#FF5C5C] font-bold">8.7x</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] rounded-full w-[87%] transition-all duration-1000" />
                </div>
              </div>
            </div>
            
            <p className="text-center text-sm text-[#1D1F28]/60 mt-4">
              Output multiplier vs manual processes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
