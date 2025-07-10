import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { label: "Use Cases", href: "#use-cases" },
    { label: "AI Agents", href: "#ai-agents" },
    { label: "Protocol", href: "#protocol" },
    { label: "Blog", href: "#blog" },
    { label: "Resources", href: "#resources" },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled 
          ? "bg-montekristo-dark/95 backdrop-blur-md border-b border-white/10" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo 
              size="md" 
              variant="default" 
              withEffect={true}
              className="cursor-pointer"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white hover:text-montekristo-coral font-medium transition-colors duration-300 ease-in-out"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            {/* CTA Button */}
            <Button
              className={cn(
                "hidden sm:inline-flex",
                "bg-montekristo-coral hover:bg-montekristo-coral/90",
                "text-white font-medium px-6 py-2 rounded-full",
                "transition-all duration-300 ease-in-out",
                "hover:shadow-md hover:brightness-110",
                "hover:shadow-montekristo-coral/25"
              )}
            >
              Book AI Strategy Session
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-montekristo-coral transition-colors duration-300"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-montekristo-dark/95 backdrop-blur-md">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-white hover:text-montekristo-coral hover:bg-white/5 font-medium transition-all duration-300 ease-in-out rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile CTA Button */}
              <div className="px-4 pt-4">
                <Button
                  className={cn(
                    "w-full",
                    "bg-montekristo-coral hover:bg-montekristo-coral/90",
                    "text-white font-medium py-3 rounded-full",
                    "transition-all duration-300 ease-in-out"
                  )}
                >
                  Book AI Strategy Session
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;