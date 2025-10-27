
import { Separator } from "@/components/ui/separator";
import Logo from "./Logo";

export const Footer = () => {
  const paymentLogos = [
    {
      name: "Mastercard",
      src: "https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/public/OTP%20Logos/mc_vrt_opt_rev_73_1x.png",
      url: "http://www.mastercard.com/rs/consumer/credit-cards.html",
      alt: "Mastercard"
    },
    {
      name: "Maestro",
      src: "https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/public/OTP%20Logos/ms_vrt_opt_rev_73_1x.png",
      url: "http://www.mastercard.com/rs/consumer/credit-cards.html",
      alt: "Maestro"
    },
    {
      name: "Visa Secure",
      src: "https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/public/OTP%20Logos/Visa_Brandmark_White_Transp.png",
      url: "https://rs.visa.com/pay-with-visa/security-and-assistance/protected-everywhere.html",
      alt: "Visa Secure"
    },
    {
      name: "DinaCard",
      src: "https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/public/OTP%20Logos/DinaCard%20novi%20znak.jpg",
      url: "https://www.nbs.rs/sr_RS/drugi-nbs-servisi/dina-card/",
      alt: "DinaCard"
    },
    {
      name: "OTP Banka",
      src: "https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/public/OTP%20Logos/OPT%20logo%20za%20dokumenta%20PRINT%20COLOR.jpg",
      url: "https://www.otpbanka.rs/",
      alt: "OTP Banka"
    },
    {
      name: "Mastercard ID Check",
      src: "https://hfpvnsbiewudpqbtlvte.supabase.co/storage/v1/object/public/OTP%20Logos/mc_idcheck_hrz_rgb_rev.png",
      url: "http://www.mastercard.com/rs/consumer/credit-cards.html",
      alt: "Mastercard ID Check"
    }
  ];

  return (
    <footer className="bg-[#081228] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="sm" variant="light" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Precision AI agents tailored to your sales & ops stack.
            </p>
          </div>
          
          {/* Navigation Column 1 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Solutions</h4>
            <div className="space-y-2">
              <a 
                href="#agents" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                Use Cases
              </a>
              <a 
                href="#protocol" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                AI Agent Catalog
              </a>
              <a 
                href="#insights" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                Blog
              </a>
            </div>
          </div>
          
          {/* Navigation Column 2 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <div className="space-y-2">
              <a 
                href="#" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                Careers
              </a>
              <a 
                href="#faq" 
                className="block text-gray-400 hover:text-[#ff5b5b] transition-colors duration-200 text-sm"
              >
                FAQ
              </a>
            </div>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Stay Updated</h4>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your work email"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff5b5b] focus:border-transparent"
              />
              <button className="w-full bg-[#ff5b5b] hover:bg-[#ff4747] text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <Separator className="bg-gray-700 mb-6" />
        
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            © 2025 Montekristo AI — All rights reserved.
          </p>
        </div>

        {/* Payment Security & Bank Branding */}
        <Separator className="bg-gray-700 mb-6" />
        
        <div className="flex flex-nowrap justify-center items-center gap-3 md:gap-5 py-6">
          {paymentLogos.map((logo) => (
            <a
              key={logo.name}
              href={logo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity duration-200 hover:opacity-80"
              aria-label={logo.alt}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
                loading="lazy"
                width="auto"
                height="56"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
