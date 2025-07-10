
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, [isVisible]);

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center relative overflow-hidden bg-[#FAF8F4] pt-1"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-8">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(4, 17, 34, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(4, 17, 34, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className={`space-y-8 text-center lg:text-left transition-all duration-800 ease-out ${
            isVisible 
              ? 'opacity-100 translate-x-0 translate-y-0' 
              : 'opacity-0 -translate-x-16 translate-y-4'
          }`}>
            <h1 className="text-6xl lg:text-7xl font-bold text-[#041122] leading-tight">
              Deploy AI Agents That Do the Work of{" "}
              <span className="text-[#FF5C5C]">5 Teams</span>
            </h1>
            
            <h3 className="text-xl lg:text-2xl text-[#1D1F28]/80 leading-relaxed">
              We embed custom AI systems that supercharge outreach, sales, CRM, and content workflows—built around{" "}
              <em className="text-[#FF5C5C]">your</em> SaaS stack.
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-[#041122] hover:bg-[#041122]/90 text-white px-8 py-4 text-lg font-medium transition-all duration-150 hover:scale-105"
                data-event="cta-click"
              >
                Book AI Strategy Session
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#041122] text-[#041122] hover:bg-[#041122]/5 px-8 py-4 text-lg font-medium transition-all duration-150"
              >
                Browse Agents
              </Button>
            </div>
          </div>
          
          {/* Right: AI Intelligence Cores */}
          <div className="flex justify-center items-center">
            <div className={`ai-cores-float ${isVisible ? 'animate-float-subtle' : ''}`}>
              <img 
                src="/lovable-uploads/30c29c54-fbb9-41ee-ab6e-0fe4617eb5e6.png"
                alt="Four luminous AI intelligence cores hover and connect, illustrating each step in the AI transformation protocol: Discovery, Blueprint, Deployment, and Optimisation"
                className={`w-full max-w-[350px] sm:max-w-[400px] lg:max-w-[450px] h-auto object-contain ai-cores-image transition-all duration-800 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-x-0 translate-y-0' 
                    : 'opacity-0 -translate-x-16 translate-y-4'
                }`}
                style={{
                  transitionDelay: isVisible ? '0.2s' : '0s'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
