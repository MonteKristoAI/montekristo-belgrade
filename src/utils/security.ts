/**
 * Security utilities for CSRF protection and input sanitization
 */

// Generate CSRF token
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Store CSRF token securely
export const setCSRFToken = (token: string): void => {
  sessionStorage.setItem('csrf_token', token);
};

// Retrieve CSRF token
export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};

// Validate CSRF token
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = getCSRFToken();
  return storedToken === token && token.length === 64;
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/[\"']/g, '') // Remove quotes
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

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

// Rate limiting utility
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

// Initialize CSRF token on app start
export const initializeCSRF = (): void => {
  if (!getCSRFToken()) {
    const token = generateCSRFToken();
    setCSRFToken(token);
  }
};