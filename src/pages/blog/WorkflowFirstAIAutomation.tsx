import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const heroImageUrl = "https://images.unsplash.com/photo-1500673922987-e212871f6ac1?auto=format&fit=crop&w=1920&q=80";
const workflowImageUrl = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80";

const WorkflowFirstAIAutomation = () => {
  const navigate = useNavigate();
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGetStarted = () => {
    navigate('/');
    setTimeout(() => {
      scrollToSection('contact');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 max-w-4xl py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#041122] mb-6 leading-tight">
              Workflow‑First AI Automation: How Founder‑Led SaaS Teams Can Scale Without the Busywork
            </h1>
            <p className="text-xl text-[#1D1F28]/70 mb-6 leading-relaxed">
              Map workflows before you add bots—unlock AI automation that drives SaaS growth without head‑count sprawl.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-[#1D1F28]/60">
              <span>≈ 10 min read</span>
              <span>•</span>
              <span>2300 words</span>
              <span>•</span>
              <span>July 23, 2025</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mb-12">
            <img 
              src={heroImageUrl}
              alt="Colorful lights representing AI workflow automation"
              className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            
            {/* Teaser */}
            <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10 p-6 rounded-lg mb-8">
              <p className="text-lg font-medium text-[#041122] mb-0">
                Launching a SaaS in 2024 feels like standing on the cliff's edge: bold moves mean flight, sloppy systems mean free‑fall. AI can be the wings—<strong>but only if you understand your workflows before you bolt on bots.</strong> Below you'll learn how Montekristo AI Solutions helps founder‑led teams replace heroic manual effort with scalable, workflow‑first automation.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">The Cliff‑Edge Reality of SaaS in 2024</h2>
            
            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Nine out of ten startups still fail—70% between years two and five. Rising capital costs, shifting buyer budgets, and talent inflation mean doing <strong>more with less</strong> is no longer optional.
            </p>

            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Yet office workers spend <strong>over 50% of their day on repetitive work</strong> like manual data entry and document updates. Another survey shows employees lose <strong>8.7 hours each week to unnecessary tasks and meetings</strong>.
            </p>

            <div className="bg-[#041122]/5 border-l-4 border-[#8B5CF6] p-6 my-8">
              <p className="text-lg font-medium text-[#041122] mb-0 italic">
                "If half of your team's week is repetitive busywork, your runway is leaking."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">AI Alone Isn't a Silver Bullet—Workflow Clarity Comes First</h2>
            
            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Generative AI adoption jumped from 33% to 71% of companies in just one year, ranging across IT, marketing, and support. But without a clear map of <em>how work actually flows</em>, many initiatives hit a plateau—creating dashboard clutter, orphaned bots, and frustrated teams.
            </p>

            <h3 className="text-2xl font-semibold text-[#041122] mt-8 mb-4">What Is Workflow Mapping?</h3>
            
            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Workflow mapping breaks down every step, dependency, and decision point in a process. Done right, it exposes "white‑space" hand‑offs and duplicate effort—improving efficiency by up to 30%.
            </p>

            <h3 className="text-2xl font-semibold text-[#041122] mt-8 mb-4">The Value‑Stream Lens</h3>
            
            <p className="text-[#1D1F28]/80 mb-8 leading-relaxed">
              Borrowed from lean manufacturing, <strong>value‑stream mapping</strong> visualises the flow of value to the customer. For SaaS, that's often <em>lead → demo → closed‑won → adoption</em>. Documenting time, tools, and blockers at each step reveals prime automation candidates.
            </p>

            {/* Workflow Image */}
            <div className="mb-8">
              <img 
                src={workflowImageUrl}
                alt="Technical workflow mapping visualization"
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
              <p className="text-sm text-[#1D1F28]/60 mt-2 text-center italic">
                Visualising your value stream uncovers automation opportunities
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">Building a Multi‑Channel Lead Engine That Sells While You Sleep</h2>
            
            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Multichannel outreach boosts conversions by <strong>up to 287%</strong> compared with single‑channel playbooks. Montekristo deploys AI‑orchestrated cadences spanning email, LinkedIn, WhatsApp, and voice drops, adjusting timing and copy based on prospect behaviour.
            </p>

            <h3 className="text-2xl font-semibold text-[#041122] mt-8 mb-4">Lead‑Scoring Agents</h3>
            
            <p className="text-[#1D1F28]/80 mb-4 leading-relaxed">
              Instead of simply <strong>responding</strong>, our agents <em>act</em>:
            </p>
            
            <ul className="list-disc pl-6 mb-6 text-[#1D1F28]/80">
              <li>Escalate warm leads directly into your CRM opportunity pipeline</li>
              <li>Qualify based on fit and intent signals</li>
              <li>Trigger personalised micro‑demos or calendar links automatically</li>
            </ul>

            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Case studies in customer support show AI agents deflect <strong>43% of tickets</strong> and cut volume in half. The same active‑agent pattern turns cold data into booked meetings.
            </p>

            <div className="bg-[#041122]/5 border-l-4 border-[#0EA5E9] p-6 my-8">
              <p className="text-lg font-medium text-[#041122] mb-0 italic">
                "Chatbots answer questions; <strong>agents take action.</strong> That's the difference between support cost‑centre and growth engine."
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">Beyond Support Chatbots: Action‑Oriented Agents Across the Funnel</h2>
            
            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Most "AI" tickets tools still hand off to humans. By embedding decision trees and GPT‑4 reasoning, Montekristo agents can:
            </p>

            {/* Funnel Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#041122] text-white">
                    <th className="border border-gray-300 p-3 text-left">Funnel Stage</th>
                    <th className="border border-gray-300 p-3 text-left">Manual Step</th>
                    <th className="border border-gray-300 p-3 text-left">Agent Automation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">Top‑of‑Funnel</td>
                    <td className="border border-gray-300 p-3">Lookup ICP fit</td>
                    <td className="border border-gray-300 p-3">Real‑time enrichment & scoring</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Mid‑Funnel</td>
                    <td className="border border-gray-300 p-3">Email follow‑ups</td>
                    <td className="border border-gray-300 p-3">Personalized, channel‑aware nudges</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Support</td>
                    <td className="border border-gray-300 p-3">Triage & escalate</td>
                    <td className="border border-gray-300 p-3">Self‑service deflection + auto‑escalation</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Success</td>
                    <td className="border border-gray-300 p-3">QBR prep</td>
                    <td className="border border-gray-300 p-3">Account‑health summaries & upsell signals</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">Implementation Roadmap: From Map to Bot in 90 Days</h2>

            {/* Implementation Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#8B5CF6] text-white">
                    <th className="border border-gray-300 p-3 text-left">Day</th>
                    <th className="border border-gray-300 p-3 text-left">Milestone</th>
                    <th className="border border-gray-300 p-3 text-left">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold">1‑15</td>
                    <td className="border border-gray-300 p-3"><strong>Workshop</strong>: Map current value stream</td>
                    <td className="border border-gray-300 p-3">Bottlenecks & candidate automations prioritised</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">16‑30</td>
                    <td className="border border-gray-300 p-3"><strong>MVP Sprint</strong></td>
                    <td className="border border-gray-300 p-3">One high‑impact bot live (e.g., MQL → demo scheduling)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3 font-semibold">31‑60</td>
                    <td className="border border-gray-300 p-3"><strong>Pilot</strong></td>
                    <td className="border border-gray-300 p-3">Multi‑channel engine covering 30% of outreach volume</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3 font-semibold">61‑90</td>
                    <td className="border border-gray-300 p-3"><strong>Scale</strong></td>
                    <td className="border border-gray-300 p-3">Agents integrated across CRM, helpdesk, and Slack</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#0EA5E9]/10 p-6 rounded-lg mb-8">
              <p className="text-[#041122] font-medium mb-0">
                <strong>Tip:</strong> Use an A/B "control vs. automated" branch to prove ROI in real numbers—demo booked, seat time saved, tickets deflected.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">Metrics & ROI Cheat‑Sheet</h2>

            {/* Metrics Table */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-[#0EA5E9] text-white">
                    <th className="border border-gray-300 p-3 text-left">KPI</th>
                    <th className="border border-gray-300 p-3 text-left">Pre‑Automation</th>
                    <th className="border border-gray-300 p-3 text-left">After 90 Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-3">Lead‑to‑Meeting Rate</td>
                    <td className="border border-gray-300 p-3">4%</td>
                    <td className="border border-gray-300 p-3 font-bold text-green-600">11%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Ticket Volume</td>
                    <td className="border border-gray-300 p-3">100%</td>
                    <td className="border border-gray-300 p-3 font-bold text-green-600">↓ 50%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Repetitive Task Time</td>
                    <td className="border border-gray-300 p-3">50% of work week</td>
                    <td className="border border-gray-300 p-3 font-bold text-green-600">&lt;25%</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 p-3">Unproductive Meeting Hours</td>
                    <td className="border border-gray-300 p-3">8.7 h/week</td>
                    <td className="border border-gray-300 p-3 font-bold text-green-600">↓ 40%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-3">Startup Burn Rate</td>
                    <td className="border border-gray-300 p-3">Baseline</td>
                    <td className="border border-gray-300 p-3 font-bold text-green-600">‑15% (automation OPEX savings)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[#1D1F28]/80 mb-6 leading-relaxed">
              Most small SaaS teams recover platform costs inside six months thanks to a double‑lift in productivity and pipeline velocity.
            </p>

            <h2 className="text-3xl font-bold text-[#041122] mt-12 mb-6">Key Takeaways</h2>
            
            <ul className="list-disc pl-6 mb-8 text-[#1D1F28]/80 space-y-2">
              <li>Map processes <em>before</em> you automate—efficiency compounds.</li>
              <li>Multichannel, action‑oriented agents convert leads and deflect tickets.</li>
              <li>Privacy‑by‑design integrations turn compliance into competitive edge.</li>
              <li>A 90‑day roadmap is enough to prove hard ROI and cut burn.</li>
            </ul>

            <div className="bg-[#041122]/5 border-l-4 border-[#8B5CF6] p-6 my-8">
              <p className="text-lg font-medium text-[#041122] mb-0 italic">
                "Workflow‑first AI lets 10‑person SaaS teams out‑execute 100‑person competitors—no extra headcount needed."
              </p>
            </div>

            <Separator className="my-12" />

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] rounded-lg p-8 text-center text-white mb-12">
              <h3 className="text-2xl font-bold mb-4">Ready to ditch busywork?</h3>
              <p className="text-lg mb-6 opacity-90">
                Transform your SaaS operations with workflow-first AI automation.
              </p>
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="bg-white text-[#8B5CF6] hover:bg-white/90 font-semibold"
                  onClick={handleGetStarted}
                >
                  Get Started Today
                </Button>
                <br />
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10"
                  onClick={handleGetStarted}
                >
                  Download Workflow Mapping Canvas →
                </Button>
              </div>
            </div>

          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WorkflowFirstAIAutomation;