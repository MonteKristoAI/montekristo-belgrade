
import { cn } from '@/lib/utils';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useActiveSection } from '@/hooks/useActiveSection';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToSection } = useSmoothScroll();
  const activeSection = useActiveSection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const navigationItems = [
    { name: 'Use Cases', href: 'use-cases', isSection: true },
    { name: 'AI Agents', href: 'agents', isSection: true },
    { name: 'Protocol', href: 'protocol', isSection: true },
    { name: 'Blog', href: '/blog', isSection: false }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (item: typeof navigationItems[0]) => {
    if (item.isSection && location.pathname === '/') {
      scrollToSection(item.href);
    } else if (item.isSection) {
      navigate('/');
      setTimeout(() => scrollToSection(item.href), 100);
    } else {
      navigate(item.href);
      // Ensure we scroll to top for page navigation
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
    setIsMobileMenuOpen(false);
  };

  const handleBookStrategy = () => {
    if (location.pathname === '/') {
      scrollToSection('contact');
    } else {
      navigate('/');
      setTimeout(() => scrollToSection('contact'), 100);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className={cn(
        "bg-white sticky top-0 z-[999] py-3 border-b border-[#0d1b34]/5 transition-all duration-[400ms] ease-out",
        isScrolled && "shadow-sm"
      )}>
        <div className="max-w-[1440px] mx-auto px-[clamp(1rem,4vw,3rem)] flex items-center justify-between gap-8">
          
          {/* Logo */}
          <button onClick={handleLogoClick} className="flex items-center text-[#0d1b34] no-underline font-serif font-bold text-2xl tracking-[0.02em] bg-transparent border-none cursor-pointer" aria-label="Montekristo Home">
            <svg 
              className="h-11 mr-[0.85rem] text-[#ff5b5b]" 
              viewBox="0 0 300 200" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <g stroke="currentColor" strokeWidth="2" fill="none">
                <polygon points="150,20 200,50 200,110 150,140 100,110 100,50"/>
                <polygon points="200,50 250,80 250,140 200,170 150,140 150,80"/>
                <polygon points="100,50 150,80 150,140 100,170 50,140 50,80"/>
              </g>
              <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
                <line x1="75" y1="140" x2="75" y2="60"/>
                <line x1="75" y1="60" x2="150" y2="110"/>
                <line x1="150" y1="110" x2="225" y2="60"/>
                <line x1="225" y1="60" x2="225" y2="140"/>
              </g>
              <g fill="currentColor">
                <circle cx="150" cy="20" r="7"/>
                <circle cx="200" cy="50" r="7"/>
                <circle cx="200" cy="110" r="7"/>
                <circle cx="150" cy="140" r="7"/>
                <circle cx="100" cy="110" r="7"/>
                <circle cx="100" cy="50" r="7"/>
                <circle cx="250" cy="80" r="7"/>
                <circle cx="250" cy="140" r="7"/>
                <circle cx="50" cy="80" r="7"/>
                <circle cx="50" cy="140" r="7"/>
              </g>
            </svg>
            <span className="transition-opacity duration-300 ease-out">MONTEKRISTO</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block" aria-label="Main navigation">
            <ul className="flex items-center gap-[3.2rem] m-0 p-0 list-none">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item)}
                    className={cn(
                      "text-[#0d1b34] no-underline font-medium text-[1.075rem] relative transition-colors duration-300 ease-out",
                      "hover:text-[#ff5b5b] cursor-pointer bg-transparent border-none",
                      "after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[1.5px] after:bg-[#ff5b5b]",
                      "after:scale-x-0 after:origin-right after:transition-transform after:duration-300 after:ease-out",
                      "hover:after:scale-x-100 hover:after:origin-left",
                      item.isSection && activeSection === item.href && "text-[#ff5b5b] after:scale-x-100"
                    )}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <button
              onClick={handleBookStrategy}
              className={cn(
                "bg-[#ff5b5b] text-white py-[0.65rem] px-[1.65rem] font-semibold text-base rounded-full",
                "shadow-[0_6px_24px_rgba(255,91,91,0.25)] transition-all duration-300 ease-out",
                "hover:bg-[#e94e4e] hover:-translate-y-[1px]"
              )}
            >
              Book AI Strategy
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#0d1b34] hover:text-[#ff5b5b] transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[998] bg-black/50 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-[80px] right-0 bg-white w-full max-w-sm h-fit shadow-xl animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="p-6" aria-label="Mobile navigation">
              <ul className="space-y-4">
                {navigationItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => handleNavigation(item)}
                      className={cn(
                        "block w-full text-left text-[#0d1b34] font-medium text-lg py-3 px-4 rounded-lg transition-colors duration-300",
                        "hover:bg-[#ff5b5b]/10 hover:text-[#ff5b5b]",
                        item.isSection && activeSection === item.href && "text-[#ff5b5b] bg-[#ff5b5b]/10"
                      )}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
                <li className="pt-4 border-t border-[#0d1b34]/10">
                  <button
                    onClick={handleBookStrategy}
                    className="w-full bg-[#ff5b5b] text-white py-3 px-6 font-semibold text-base rounded-full hover:bg-[#e94e4e] transition-colors duration-300"
                  >
                    Book AI Strategy
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
