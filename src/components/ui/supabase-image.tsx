import { useState } from 'react';
import { getStorageUrl } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface SupabaseImageProps {
  assetId: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export const SupabaseImage = ({ assetId, alt, className, fallbackSrc }: SupabaseImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && fallbackSrc) {
    return (
      <img 
        src={fallbackSrc}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={cn("absolute inset-0 bg-muted animate-pulse rounded-lg", className)} />
      )}
      <img 
        src={getStorageUrl(assetId)}
        alt={alt}
        className={cn(className, isLoading ? 'opacity-0' : 'opacity-100')}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};