
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { 
  sanitizeInput, 
  validateSecureEmail, 
  checkRateLimit, 
  initializeCSRF, 
  getCSRFToken 
} from "@/utils/security";

// Secure form validation schema
const contactFormSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(254, "Email must be less than 254 characters"),
  company: z.string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-&'\.]+$/, "Company name contains invalid characters"),
  bottleneck: z.enum(["outreach", "crm", "content", "sales", "other"]).refine(val => val !== undefined, {
    message: "Please select a bottleneck"
  }),
  notes: z.string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initializeCSRF();
  }, []);
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      notes: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Advanced rate limiting
      if (!checkRateLimit('contact_form', 3, 300000)) { // 3 attempts per 5 minutes
        toast.error("Too many attempts. Please wait before submitting again.");
        return;
      }

      // Additional email validation
      if (!validateSecureEmail(data.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
      
      // Get CSRF token for security
      const csrfToken = getCSRFToken();
      if (!csrfToken) {
        toast.error("Security token missing. Please refresh the page.");
        return;
      }
      
      // Sanitize all input data
      const sanitizedData = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email.toLowerCase()),
        company: sanitizeInput(data.company),
        bottleneck: data.bottleneck,
        notes: data.notes ? sanitizeInput(data.notes) : "",
        csrfToken,
        timestamp: Date.now(),
        userAgent: navigator.userAgent.substring(0, 200) // Limited for privacy
      };

      // Validate sanitized data isn't empty
      if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.company) {
        toast.error("Please fill in all required fields with valid data.");
        return;
      }
      
      // TODO: Replace with secure backend submission to Supabase
      console.log("Secure form submission:", sanitizedData);
      
      toast.success("Thank you! We'll be in touch within 24 hours.");
      form.reset();
      
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#041122] font-medium">Full Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name"
                            className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#041122] font-medium">Work Email *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="your.email@company.com"
                            className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#041122] font-medium">Company Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your company name"
                          className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bottleneck"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#041122] font-medium">Biggest Bottleneck</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C]">
                            <SelectValue placeholder="Select your biggest challenge" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="outreach">Lead Outreach & Qualification</SelectItem>
                          <SelectItem value="crm">CRM Management & Updates</SelectItem>
                          <SelectItem value="content">Content Creation & Distribution</SelectItem>
                          <SelectItem value="sales">Sales Process Optimization</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#041122] font-medium">Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your current challenges..."
                          className="border-gray-300 focus:border-[#FF5C5C] focus:ring-[#FF5C5C] min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full bg-[#FF5C5C] hover:bg-[#FF5C5C]/90 text-white py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  data-event="cta-click"
                >
                  {isSubmitting ? "Submitting..." : "Book AI Strategy Session"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
