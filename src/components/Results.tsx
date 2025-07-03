
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    value: "3.5×",
    label: "Lead Conversion Growth"
  },
  {
    value: "500 h",
    label: "Saved / Month / Client"
  },
  {
    value: "60%",
    label: "Faster Sales Cycles"
  }
];

export const Results = () => {
  return (
    <section id="results" className="py-24 bg-[#041122] text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Proven Impact
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-[#1D1F28] border-0 text-center">
              <CardContent className="p-12">
                <div className="text-5xl font-bold text-[#FF5C5C] mb-4">
                  {stat.value}
                </div>
                <div className="text-xl text-white/80">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <blockquote className="text-2xl italic text-white/90 max-w-4xl mx-auto">
            "Montekristo AI cut our prospecting time by 80%—CRO, Series-B SaaS"
          </blockquote>
        </div>
      </div>
    </section>
  );
};
