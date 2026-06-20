import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// These two values come from your Supabase project (Settings > API).
// In production they are set as Environment Variables in Vercel:
//   VITE_SUPABASE_URL       -> Project URL
//   VITE_SUPABASE_ANON_KEY  -> anon public key
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// When the keys are not configured yet, the site keeps working in "demo mode"
// (local browser storage). As soon as the keys are present, every read/write
// goes to the real database and is shared with all visitors.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!)
  : null;

export const PROPERTY_IMAGES_BUCKET = 'property-images';
