import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const MonteKristoFooter = () => {
  const navigationLinks = {
    column1: [
      { label: "Use Cases", href: "#use-cases" },
      { label: "AI Agent Catalog", href: "#ai-agents" },
      { label: "Blog", href: "#blog" },
    ],
    column2: [
      { label: "Careers", href: "#careers" },
      { label: "FAQ", href: "#faq" },
    ],
  };

  return (
    <footer className="bg-montekristo-darker py-12 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Block - Logo & Mission */}
          <div className="space-y-4">
            <Logo 
              size="sm" 
              variant="light" 
              className="mb-6"
            />
            <p className="text-montekristo-text-muted text-base leading-relaxed max-w-sm">
              Precision AI agents tailored to your sales & ops stack.
            </p>
          </div>

          {/* Middle Block - Navigation */}
          <div className="grid grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-4">
              {navigationLinks.column1.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-montekristo-text-muted hover:text-white transition-colors duration-300 ease-in-out font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="space-y-4">
              {navigationLinks.column2.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-montekristo-text-muted hover:text-white transition-colors duration-300 ease-in-out font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Block - Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg mb-4">
              Stay Updated
            </h3>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your work email"
                className={cn(
                  "bg-montekristo-dark border-white/20 text-white",
                  "placeholder:text-montekristo-text-muted",
                  "focus:border-montekristo-coral focus:ring-montekristo-coral/20",
                  "transition-all duration-300"
                )}
              />
              <Button
                className={cn(
                  "w-full sm:w-auto",
                  "bg-montekristo-coral hover:bg-montekristo-coral/90",
                  "text-white font-medium px-6 py-2 rounded-md",
                  "transition-all duration-300 ease-in-out"
                )}
              >
                Subscribe
              </Button>
            </div>
            
            {/* Optional Social Media Icons */}
            <div className="flex space-x-4 pt-4">
              <a 
                href="#" 
                className="text-montekristo-text-muted hover:text-white transition-colors duration-300"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-montekristo-text-muted hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-montekristo-text-muted hover:text-white transition-colors duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Border & Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-montekristo-text-muted text-sm">
            <p>© 2024 MonteKristo AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#privacy" className="hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MonteKristoFooter;