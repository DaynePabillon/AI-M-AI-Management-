import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://oqcczdtekzxevldbtfbb.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xY2N6ZHRla3p4ZXZsZGJ0ZmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNjQzMDYsImV4cCI6MjA3NTY0MDMwNn0.wypBQuQHrEDR8Be9hfGHIate62mkhgnYPINLoCpyj-c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
