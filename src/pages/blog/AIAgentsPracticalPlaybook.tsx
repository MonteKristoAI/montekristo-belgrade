import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import aiAgentsHero from "@/assets/ai-agents-hero.png";


const AIAgentsPracticalPlaybook = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGetStarted = () => {
    navigate("/#contact");
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#041122] to-[#1a3a52] text-white py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              AI Agents Without the Hype: A Practical Playbook for 2025 Growth
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Cut through the 2025 AI‑agent hype—see what autonomous agents can and can't do for real‑world growth.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/70">
              <span>≈ 10 min read</span>
              <span>•</span>
              <span>2250 words</span>
              <span>•</span>
              <span>July 24, 2025</span>
            </div>
          </div>
        </section>

        {/* Hero Image */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <img 
              src={aiAgentsHero}
              alt="Colorful illustration of diverse professionals collaborating with AI agents"
              className="w-full rounded-lg shadow-lg"
            />
            <figcaption className="text-center text-sm text-gray-600 mt-4 italic">
              Colourful, text‑free hero: AI agents join humans as teammates, not replacements.
            </figcaption>
          </div>
        </section>

        {/* Article Content */}
        <article className="container mx-auto px-4 max-w-4xl py-12">
          <div className="prose prose-lg max-w-none">
            
            {/* Teaser */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-12 rounded">
              <p className="text-lg font-medium text-gray-800 mb-0">
                <strong>Teaser:</strong> 2025 is drenched in "agentic" buzzwords, but most teams still struggle to turn demos into dollars. This guide strips away the hype to reveal <em>exactly</em> where AI agents boost revenue, when humans must intervene, and how to future‑proof your stack for scale.
              </p>
            </div>

            {/* Section 1 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">1. What <em>Is</em> an AI Agent, Really?</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              AI agents are <strong>autonomous software pieces that can perceive, plan, and act on goals, often calling external tools via APIs</strong>. They move beyond single‑prompt chatbots by breaking work into subtasks, choosing the right tools, and monitoring outcomes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Unlike traditional RPA, modern agents are powered by large language models (LLMs) or multimodal transformers, giving them broad reasoning capabilities. This architecture allows an agent to draft emails, query a CRM, generate follow‑up content, and even schedule a meeting—without human keystrokes in between.
            </p>
            
            <blockquote className="border-l-4 border-[#8B5CF6] bg-purple-50 p-6 my-8 rounded">
              <p className="text-lg font-medium text-gray-800 mb-0">
                <strong>Tweetable:</strong> "An AI agent is <em>not</em> another chatbot—it's software that can <strong>plan and act</strong> on your behalf. #AgenticAI"
              </p>
            </blockquote>

            {/* Three Core Layers */}
            <h3 className="text-2xl font-semibold text-[#041122] mb-4">1.1 The Three Core Layers</h3>
            
            
            <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700 mb-8">
              <li><strong>Perception</strong> – vector search, document embeddings, or API responses.</li>
              <li><strong>Decision</strong> – LLM‑based reasoning and tool selection.</li>
              <li><strong>Action</strong> – API calls, code execution, or task orchestration.</li>
            </ol>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              These layers mirror the <em>sense‑think‑act</em> loop found in robotics, but tuned for digital workflows—from lead nurturing to compliance checks.
            </p>

            {/* Section 2 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">2. The Business Case: Hype vs. Reality</h2>
            
            <h3 className="text-2xl font-semibold text-[#041122] mb-4">2.1 ROI Snapshot</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A McKinsey global survey shows <strong>27% of companies already attribute ≥5% EBIT lift to generative‑AI use cases</strong>—with autonomous agents driving the steepest gains. Creole Studios analysed 10 agent deployments and found a median <strong>38% cost reduction</strong> and <strong>42% cycle‑time savings</strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Small‑business sentiment mirrors the trend: <strong>50% of SMBs are piloting AI to stay competitive</strong>, per Reimagine Main Street.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              But reality bites when teams plug generic "agent stacks" into messy data. IBM research notes that only <strong>9% of early pilots reach full production</strong> because leaders underestimate governance and change‑management debt.
            </p>

            {/* Where Agents Excel Table */}
            <h3 className="text-2xl font-semibold text-[#041122] mb-4">2.2 Where Agents Excel <em>Today</em></h3>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Use Case</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Impact</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Human Oversight Needed?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Outbound SDR Sequences</strong></td>
                    <td className="border border-gray-300 px-4 py-3">+55% lead‑touch volume; 18% higher conversion</td>
                    <td className="border border-gray-300 px-4 py-3">Yes—review messaging for brand tone</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>Knowledge‑base Drafting</strong></td>
                    <td className="border border-gray-300 px-4 py-3">4× faster article creation</td>
                    <td className="border border-gray-300 px-4 py-3">Yes—fact‑check & compliance review</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Compliance Log Triage</strong></td>
                    <td className="border border-gray-300 px-4 py-3">60% alert auto‑resolution</td>
                    <td className="border border-gray-300 px-4 py-3">Yes—final sign‑off on high‑risk cases</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>API Regression Testing</strong></td>
                    <td className="border border-gray-300 px-4 py-3">35% faster release cycles</td>
                    <td className="border border-gray-300 px-4 py-3">Minimal—spot‑check failing tests</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">3. Four Principles for Growth‑Focused Agent Design</h2>
            
            <h3 className="text-2xl font-semibold text-[#041122] mb-4">Principle 1 – Automation, <em>Not</em> Replacement</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Agents thrive on <strong>repeatable, low‑value busywork</strong>: pulling data, formatting content, posting updates. That labour shift frees humans for strategy and creative problem‑solving—echoed by NYU's study on "human‑in‑the‑loop" translation where accuracy rose 22%.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Cloud Awards similarly emphasises that oversight prevents brand, legal, and cultural misfires.
            </p>

            <blockquote className="border-l-4 border-[#8B5CF6] bg-purple-50 p-6 my-8 rounded">
              <p className="text-lg font-medium text-gray-800 mb-0">
                <strong>Tweetable:</strong> "Use agents to claw back <em>time</em>, not to delete <em>headcount</em>. #HITL #AIProductivity"
              </p>
            </blockquote>

            <h3 className="text-2xl font-semibold text-[#041122] mb-4">Principle 2 – Customisation Beats Generic</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Plug‑and‑pray fails because every org's data, APIs, and success metrics differ. Apideck's 2025 market scan found 70% of agent buyers requested <em>workflow‑specific</em> templates during trial. Ben AI tackles this via pre‑built modules that slot into existing CRM or help‑desk flows without heavy engineering.
            </p>

            <h3 className="text-2xl font-semibold text-[#041122] mb-4">Principle 3 – Governance & Oversight</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The IAPP/FTI 2024 report lists <strong>model drift, hallucinations, and data leakage</strong> as top‑three risks. Sardine AI's <em>Agentic Oversight Framework</em> proposes audit logs, approval thresholds, and automated rollback paths for financial workflows.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              AWS's new <strong>Bedrock AgentCore</strong> echoes these controls with secure API gateways and memory isolation.
            </p>

            <h3 className="text-2xl font-semibold text-[#041122] mb-4">Principle 4 – Scale = API + Data Readiness</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Tyk's "Agentifying your APIs" whitepaper stresses schema consistency and authentication abstraction before unleashing agents at scale. API reliability directly correlates with agent uptime; loosely coupled contracts reduce breakage. Ramp notes that <strong>61% of agent incidents are API failure cascades</strong>.
            </p>

            {/* Section 4 - Implementation Roadmap */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">4. Implementation Roadmap</h2>

            <ol className="list-decimal list-inside space-y-4 text-lg text-gray-700 mb-8">
              <li><strong>Content & Data Audit</strong> – Label PII, flag stale docs, map API coverage.</li>
              <li><strong>Pick a High‑Leverage Pilot</strong> – SDR outreach, ticket triage, or financial reconciliations show quick wins.</li>
              <li><strong>Define Guardrails</strong> – Approval flows, rate limits, and rollback triggers.</li>
              <li><strong>Embed Human Review</strong> – Use Slack bot checklists or code‑owner reviews.</li>
              <li><strong>Monitor & Iterate</strong> – Track precision, recall, and business KPIs weekly.</li>
              <li><strong>Scale with Modular APIs</strong> – Refactor endpoints, add vector search, expose events.</li>
              <li><strong>Expand to Cross‑Team Playbooks</strong> – Marketing, finance, CS, and beyond.</li>
            </ol>

            {/* Section 5 - Governance Toolkit */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">5. Governance Toolkit</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Control</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Purpose</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Example Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Audit Logs</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Trace decisions, debug errors</td>
                    <td className="border border-gray-300 px-4 py-3">Sardine AOF</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>Prompt Vault</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Version and test prompts</td>
                    <td className="border border-gray-300 px-4 py-3">AWS Bedrock AgentCore</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Shadow Mode</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Run agent outputs side‑by‑side with human baseline</td>
                    <td className="border border-gray-300 px-4 py-3">Ben AI sandbox</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>PII Redaction</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Protect sensitive data</td>
                    <td className="border border-gray-300 px-4 py-3">RapidInnovation compliance agents</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Drift Detection</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Alert on performance changes</td>
                    <td className="border border-gray-300 px-4 py-3">IAPP/FTI governance tooling</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 6 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">6. API & Data Readiness Checklist</h2>
            <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 mb-6">
              <li>REST/GraphQL endpoints documented and paginated</li>
              <li>Authentication via OAuth or signed JWT for service accounts</li>
              <li>Webhooks or event bus for real‑time triggers</li>
              <li>Vector or RAG layer for unstructured knowledge</li>
              <li>Data catalog tagging sensitivity levels</li>
              <li>Contract tests to flag breaking changes</li>
            </ul>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              "Companies that harden API governance before deploying agents see <strong>34% fewer outages</strong>," notes a Tyk customer study.
            </p>

            {/* Section 7 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">7. Human‑in‑the‑Loop Patterns</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Pattern</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">When to Apply</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Tools</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Gatekeeper</strong></td>
                    <td className="border border-gray-300 px-4 py-3">High‑risk content release (legal, brand)</td>
                    <td className="border border-gray-300 px-4 py-3">Jira approvals</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>Reviewer</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Medium‑risk tasks like drafts</td>
                    <td className="border border-gray-300 px-4 py-3">Google Docs suggestions</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Observer</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Low‑risk logs for spot audits</td>
                    <td className="border border-gray-300 px-4 py-3">Datadog, Kibana</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>Teacher</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Continuous improvement loop</td>
                    <td className="border border-gray-300 px-4 py-3">Feedback datasets</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              A recent arXiv paper found workers prefer offloading <strong>mundane</strong> tasks but want final say on strategic output.
            </p>

            {/* Section 8 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">8. Metrics That Matter</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Metric</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Why It Matters</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Busywork Hours Saved</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Quantifies reclaimed time</td>
                    <td className="border border-gray-300 px-4 py-3">+5 h/employee/week</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>Task‑Success Rate</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Measures precision & recall</td>
                    <td className="border border-gray-300 px-4 py-3">≥90%</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Cost per Task</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Tracks efficiency</td>
                    <td className="border border-gray-300 px-4 py-3">↓ 30% YoY</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3"><strong>Revenue Lift</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Connect to bottom line</td>
                    <td className="border border-gray-300 px-4 py-3">+5–10% in piloted function</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3"><strong>Mean Time to Detect Drift (MTDD)</strong></td>
                    <td className="border border-gray-300 px-4 py-3">Governance health</td>
                    <td className="border border-gray-300 px-4 py-3">≤1 day</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              McKinsey's latest "State of AI" shows firms tracking business‑aligned metrics are <strong>twice as likely</strong> to scale AI successfully.
            </p>

            {/* Section 9 */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">9. Future Trends to Watch (2026–2027)</h2>
            <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700 mb-8">
              <li><strong>Multimodal Agents</strong> – Vision + voice enable "screen‑watcher" sales coaches.</li>
              <li><strong>Agent Marketplaces</strong> – AWS, Azure, and GCP curating vetted agent plug‑ins.</li>
              <li><strong>Domain‑Specific LLMs</strong> – Finance, legal, healthcare fine‑tunes reduce hallucinations.</li>
              <li><strong>On‑device Agent Cores</strong> – ARM‑based edge chips slash latency and protect data.</li>
              <li><strong>Agentic Governance Standards</strong> – ISO & NIST working groups drafting controls.</li>
            </ol>

            {/* Key Takeaways */}
            <h2 className="text-3xl font-bold text-[#041122] mb-6 mt-12">Key Takeaways</h2>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 mb-8">
              <li><strong>Think delegation, not replacement;</strong> pair agents with humans for oversight.</li>
              <li><strong>Customise agents around your data and APIs</strong>—generic stacks underperform.</li>
              <li><strong>Bake in governance</strong>: logs, drift detection, approvals.</li>
              <li><strong>Prep your APIs</strong> for scale; integration pain is the #1 bottleneck.</li>
              <li><strong>Track outcome metrics</strong> tied to revenue, not just usage stats.</li>
            </ul>

            <blockquote className="border-l-4 border-[#8B5CF6] bg-purple-50 p-6 my-8 rounded">
              <p className="text-lg font-medium text-gray-800 mb-0">
                <strong>Tweetable:</strong> "Governance isn't optional—logs, drift alerts, and approval gates turn agent chaos into compound growth. #AIOversight"
              </p>
            </blockquote>

          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#8B5CF6] to-[#0EA5E9] py-20 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Build Your AI Agent Strategy?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how to implement these principles in your organization and turn AI agents into revenue drivers.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-[#041122] hover:bg-gray-100 text-lg px-8 py-4 h-auto"
              onClick={handleGetStarted}
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIAgentsPracticalPlaybook;