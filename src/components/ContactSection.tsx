
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Deploy Your First AI Agent?
          </h2>
        </div>
        
        <Card className="shadow-2xl border-0">
          <CardContent className="p-12">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#041122] font-medium">Full Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your full name"
                    className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#041122] font-medium">Work Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@company.com"
                    className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[#041122] font-medium">Company Name *</Label>
                <Input 
                  id="company" 
                  placeholder="Your company name"
                  className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bottleneck" className="text-[#041122] font-medium">Biggest Bottleneck</Label>
                <Select>
                  <SelectTrigger className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]">
                    <SelectValue placeholder="Select your biggest challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outreach">Lead Outreach & Qualification</SelectItem>
                    <SelectItem value="crm">CRM Management & Updates</SelectItem>
                    <SelectItem value="content">Content Creation & Distribution</SelectItem>
                    <SelectItem value="sales">Sales Process Optimization</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[#041122] font-medium">Notes (optional)</Label>
                <Textarea 
                  id="notes" 
                  placeholder="Tell us more about your current challenges..."
                  className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C] min-h-[120px]"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-[#FF5C5C] hover:bg-[#FF5C5C]/90 text-white py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                data-event="cta-click"
              >
                Book AI Strategy Session
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
