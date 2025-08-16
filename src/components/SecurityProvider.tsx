import React from 'react';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  // Simplified security provider - rely on server-side validation as primary defense
  // Client-side security is supplementary only
  
  return <>{children}</>;
};