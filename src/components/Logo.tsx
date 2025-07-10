import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withEffect?: boolean;
  variant?: 'light' | 'default';
};

const Logo = ({ 
  className, 
  size = 'md', 
  withEffect = false,
  variant = 'default'
}: LogoProps) => {
  // Size classes for the icon
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10 md:h-12',
    lg: 'h-12 md:h-16',
    xl: 'h-14 md:h-20'
  };

  // Text size classes to match the icon proportions
  const textSizeClasses = {
    sm: 'text-lg ml-2',
    md: 'text-xl md:text-2xl ml-3',
    lg: 'text-2xl md:text-3xl ml-3',
    xl: 'text-3xl md:text-4xl ml-4'
  };

  const variantClasses = {
    default: "text-current",
    light: "text-current brightness-125"
  };

  return (
    <div className={cn(
      "relative inline-flex items-center",
      className
    )}>
      
      <svg 
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          withEffect && "hover:brightness-125 hover:scale-105 transition-all duration-300",
          "w-auto"
        )}
        // Adjusted viewBox to focus only on the icon portion
        viewBox="0 0 300 200" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon grid */}
        <g stroke="currentColor" strokeWidth="2">
          <polygon points="150,20 200,50 200,110 150,140 100,110 100,50" fill="none"/>
          <polygon points="200,50 250,80 250,140 200,170 150,140 150,80" fill="none"/>
          <polygon points="100,50 150,80 150,140 100,170 50,140 50,80" fill="none"/>
        </g>

        {/* M shape */}
        <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
          <line x1="75" y1="140" x2="75" y2="60"/>
          <line x1="75" y1="60" x2="150" y2="110"/>
          <line x1="150" y1="110" x2="225" y2="60"/>
          <line x1="225" y1="60" x2="225" y2="140"/>
        </g>

        {/* Circle nodes */}
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
      
      {/* MONTEKRISTO text to the right of the icon */}
      <span 
        className={cn(
          "font-serif font-medium tracking-wider",
          textSizeClasses[size],
          variantClasses[variant],
          withEffect && "transition-all duration-300 group-hover:brightness-125"
        )}
      >
        MONTEKRISTO
      </span>
    </div>
  );
};

export default Logo;