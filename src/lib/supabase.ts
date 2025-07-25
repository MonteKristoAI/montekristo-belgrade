import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hfpvnsbiewudpqbtlvte.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHZuc2JpZXd1ZHBxYnRsdnRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1NTEwMjAsImV4cCI6MjAyOTEyNzAyMH0.KqhU6L1xqx9AYK6Qr8sL1GRUPMJQwZOXnHUHKKOoMVU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getStorageUrl = (assetId: string): string => {
  return `${supabaseUrl}/storage/v1/object/public/montekristo.website/${assetId}`;
};