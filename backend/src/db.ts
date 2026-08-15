import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const posterBucket = process.env.SUPABASE_POSTER_BUCKET || "posters";

let supabase: any = null;
if (supabaseUrl && supabaseServiceRoleKey) {
  supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
} else {
  // Allow the backend to start without Supabase configured. Endpoints
  // that depend on Supabase will return appropriate errors.
  // This is useful for local development when a Supabase project is not present.
  // Do not use this mode in production.
  // eslint-disable-next-line no-console
  console.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — supabase client not initialized.");
}

export { posterBucket };
export default supabase;
