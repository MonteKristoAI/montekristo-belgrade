
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const useCases = [
  {
    title: "Manual SDR → AI SDR",
    description: "8 h/day saved, 3.5× reply rate"
  },
  {
    title: "Blog → 7 Social Posts", 
    description: "Publish omnichannel content in 5 min"
  },
  {
    title: "Stale CRM → Live Snapshot",
    description: "0 missed follow-ups, 60% faster cycles"
  }
];

export const UseCases = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section id="usecases" className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
            From Chaos to Compounding Wins
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="p-12 text-center">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold text-[#041122]">
                  {useCases[activeSlide].title}
                </h3>
                <p className="text-xl text-[#1D1F28]/80 leading-relaxed">
                  {useCases[activeSlide].description}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Carousel controls */}
          <div className="flex justify-center space-x-4 mt-8">
            {useCases.map((_, index) => (
              <Button
                key={index}
                variant={activeSlide === index ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSlide(index)}
                className={activeSlide === index ? "bg-[#FF5C5C] hover:bg-[#FF5C5C]/90" : ""}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
