
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer id="footer" className="py-16 bg-[#041122] text-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-white">
              Montekristo AI
            </div>
            <p className="text-white/70 leading-relaxed">
              Precision AI Agents for SaaS Growth
            </p>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="About page"
              >
                About
              </a>
              <a 
                href="#blog" 
                className="block text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="Blog page"
              >
                Blog
              </a>
            </div>
          </div>
          
          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="Privacy Policy"
              >
                Privacy
              </a>
              <a 
                href="#" 
                className="block text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="Terms of Service"
              >
                Terms
              </a>
            </div>
          </div>
          
          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-6 h-6 text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="LinkedIn profile"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-6 h-6 text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="X (Twitter) profile"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-6 h-6 text-white/70 hover:text-[#FF5C5C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] rounded"
                aria-label="YouTube channel"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <Separator className="bg-white/20 mb-8" />
        
        <div className="text-center text-white/60">
          <p>© 2025 Montekristo AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
