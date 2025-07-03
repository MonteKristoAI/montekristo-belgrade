
export const Framework = () => {
  const steps = [
    {
      number: "1",
      title: "Discovery",
      description: "Deep-dive workshop → pain map"
    },
    {
      number: "2", 
      title: "Blueprint",
      description: "Custom agent schema & ROI model"
    },
    {
      number: "3",
      title: "Deployment", 
      description: "Integration + user training"
    },
    {
      number: "4",
      title: "Optimization",
      description: "KPI dashboard & continuous fine-tuning"
    }
  ];

  return (
    <section id="framework" className="py-24 bg-gradient-to-br from-[#041122] to-[#1D1F28] text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Our AI Deployment Protocol
          </h2>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] transform -translate-y-1/2 hidden lg:block" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step circle */}
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] rounded-full flex items-center justify-center text-2xl font-bold shadow-lg relative z-10">
                  {step.number}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">
                    {step.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
