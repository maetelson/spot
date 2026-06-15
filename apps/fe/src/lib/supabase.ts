import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Don't hard-crash on boot before .env is filled in — log loudly instead.
  console.warn(
    '[spot] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing. ' +
      'Copy .env.example → .env and fill them in. Auth/data calls will fail until then.',
  );
}

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key',
);
