import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseSecureFormOptions {
  rateLimitMs?: number;
  maxAttempts?: number;
}

export const useSecureForm = (options: UseSecureFormOptions = {}) => {
  const { rateLimitMs = 60000, maxAttempts = 5 } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkRateLimit = useCallback((formId: string): boolean => {
    const lastSubmissionKey = `lastSubmission_${formId}`;
    const attemptsKey = `attempts_${formId}`;
    const lastResetKey = `lastReset_${formId}`;
    
    const now = Date.now();
    const lastSubmission = localStorage.getItem(lastSubmissionKey);
    const attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
    const lastReset = parseInt(localStorage.getItem(lastResetKey) || '0');

    // Reset attempts counter every hour
    if (now - lastReset > 3600000) {
      localStorage.setItem(attemptsKey, '0');
      localStorage.setItem(lastResetKey, now.toString());
      return true;
    }

    // Check rate limit
    if (lastSubmission && now - parseInt(lastSubmission) < rateLimitMs) {
      toast.error(`Please wait ${Math.ceil((rateLimitMs - (now - parseInt(lastSubmission))) / 1000)} seconds before submitting again`);
      return false;
    }

    // Check max attempts
    if (attempts >= maxAttempts) {
      toast.error('Too many attempts. Please try again later.');
      return false;
    }

    return true;
  }, [rateLimitMs, maxAttempts]);

  const recordSubmission = useCallback((formId: string) => {
    const now = Date.now();
    const attemptsKey = `attempts_${formId}`;
    const attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
    
    localStorage.setItem(`lastSubmission_${formId}`, now.toString());
    localStorage.setItem(attemptsKey, (attempts + 1).toString());
  }, []);

  const sanitizeInput = useCallback((input: string): string => {
    return input
      .trim()
      .replace(/[<>\"']/g, '') // Remove potential XSS characters
      .substring(0, 1000); // Limit length
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }, []);

  return {
    isSubmitting,
    setIsSubmitting,
    checkRateLimit,
    recordSubmission,
    sanitizeInput,
    validateEmail
  };
};