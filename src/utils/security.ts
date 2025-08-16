/**
 * Security utilities for input validation and rate limiting
 */

// Validate email format with additional security checks
export const validateSecureEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Additional security checks
  const hasValidLength = email.length <= 254 && email.length >= 5;
  const hasValidFormat = emailRegex.test(email);
  const noSuspiciousChars = !/[<>\"'\\]/.test(email);
  const noScriptTags = !/script|javascript|vbscript/i.test(email);
  
  return hasValidLength && hasValidFormat && noSuspiciousChars && noScriptTags;
};

// Rate limiting utility (client-side only - server enforces real limits)
export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Remove old attempts outside the window
  const validAttempts = attempts.filter((timestamp: number) => now - timestamp < windowMs);
  
  if (validAttempts.length >= limit) {
    return false;
  }
  
  // Add current attempt
  validAttempts.push(now);
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validAttempts));
  
  return true;
};