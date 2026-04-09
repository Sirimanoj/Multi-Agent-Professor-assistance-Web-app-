import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL1;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY1;

// Only initialize if we have the credentials. 
// Otherwise, we export a "dead" client that doesn't crash the JS engine on load.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as any; 

if (!supabase) {
  console.warn('Supabase client initialized as null due to missing environment variables.');
}
