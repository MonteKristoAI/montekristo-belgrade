
import { cn } from '@/lib/utils';

const Header = () => {
  const navigationItems = [
    { name: 'Use Cases', href: '#use-cases' },
    { name: 'AI Agents', href: '#agents' },
    { name: 'Protocol', href: '#protocol' },
    { name: 'Blog', href: '#blog' },
    { name: 'Resources', href: '#resources' }
  ];

  return (
    <header className="bg-white sticky top-0 z-[999] py-7 border-b border-[#0d1b34]/5 backdrop-blur-[10px] transition-all duration-[400ms] ease-out">
      <div className="max-w-[1440px] mx-auto px-[clamp(1rem,4vw,3rem)] flex items-center justify-between gap-8">
        
        {/* Logo */}
        <a href="/" className="flex items-center text-[#0d1b34] no-underline font-serif font-bold text-2xl tracking-[0.02em]" aria-label="Montekristo Home">
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
        </a>

        {/* Navigation */}
        <nav className="hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center gap-[3.2rem] m-0 p-0 list-none">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={cn(
                    "text-[#0d1b34] no-underline font-medium text-[1.075rem] relative transition-colors duration-300 ease-out",
                    "hover:text-[#ff5b5b]",
                    "after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[1.5px] after:bg-[#ff5b5b]",
                    "after:scale-x-0 after:origin-right after:transition-transform after:duration-300 after:ease-out",
                    "hover:after:scale-x-100 hover:after:origin-left"
                  )}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <a
            href="#strategy"
            className={cn(
              "bg-[#ff5b5b] text-white py-[0.65rem] px-[1.65rem] font-semibold text-base rounded-full no-underline",
              "shadow-[0_6px_24px_rgba(255,91,91,0.25)] transition-all duration-300 ease-out",
              "hover:bg-[#e94e4e] hover:-translate-y-[1px]"
            )}
          >
            Book AI Strategy
          </a>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex flex-col items-stretch gap-6 w-full">
          <div className="w-full">
            <a
              href="#strategy"
              className="bg-[#ff5b5b] text-white py-[0.65rem] px-[1.65rem] font-semibold text-base rounded-full no-underline block text-center w-full hover:bg-[#e94e4e] transition-colors duration-300"
            >
              Book AI Strategy
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
