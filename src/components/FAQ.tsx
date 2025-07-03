
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Can this replace my SDR team?",
    answer: "It augments & outperforms typical SDR output; most clients reassign reps to higher-value tasks."
  },
  {
    question: "Timeline to go live?",
    answer: "2-4 weeks from Discovery to full deployment."
  },
  {
    question: "Will the AI match our tone?",
    answer: "Yes—agents are fine-tuned on your brand corpus."
  },
  {
    question: "Security & compliance?",
    answer: "SOC 2-ready infra, on-prem or VPC deploy."
  },
  {
    question: "DIY training?",
    answer: "Post-launch dashboard lets you refine prompts & guardrails."
  }
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6">
            Frequently Asked Questions
          </h2>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
              <AccordionTrigger className="text-left text-lg font-semibold text-[#041122] hover:text-[#FF5C5C] transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#1D1F28]/80 text-lg leading-relaxed pt-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
