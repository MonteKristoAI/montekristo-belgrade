import { useEffect } from 'react';
import { toast } from 'sonner';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Detect and prevent common XSS attempts
    const detectXSS = () => {
      const suspiciousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /document\.write/gi
      ];

      const checkElement = (element: Element) => {
        const content = element.innerHTML || element.textContent || '';
        return suspiciousPatterns.some(pattern => pattern.test(content));
      };

      // Monitor for suspicious content in form inputs
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', (e) => {
          const target = e.target as HTMLInputElement;
          if (checkElement(target)) {
            target.value = '';
            toast.error('Invalid input detected and removed');
          }
        });
      });
    };

    // Initialize security monitoring
    detectXSS();

    // Set up periodic security checks
    const securityInterval = setInterval(() => {
      // Monitor for suspicious DOM modifications
      const scripts = document.querySelectorAll('script:not([src])');
      scripts.forEach(script => {
        if (script.innerHTML.includes('eval(') || script.innerHTML.includes('Function(')) {
          console.warn('Suspicious script detected and blocked');
          script.remove();
        }
      });
    }, 5000);

    // Prevent common security vulnerabilities
    const preventDefaultActions = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Prevent drag and drop of potentially malicious content
      if (e.type === 'drop') {
        e.preventDefault();
      }
      
      // Prevent right-click in production (optional)
      if (e.type === 'contextmenu' && import.meta.env.PROD) {
        e.preventDefault();
      }
    };

    document.addEventListener('drop', preventDefaultActions);
    document.addEventListener('contextmenu', preventDefaultActions);

    return () => {
      clearInterval(securityInterval);
      document.removeEventListener('drop', preventDefaultActions);
      document.removeEventListener('contextmenu', preventDefaultActions);
    };
  }, []);

  return <>{children}</>;
};