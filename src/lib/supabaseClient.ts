import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env.local file (or the matching NEXT_PUBLIC_ aliases), then restart the dev server.'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);