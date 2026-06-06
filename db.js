import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function testSupabaseConnection(tableName) {
  const { data, error } = await supabase.from(tableName).select("*").limit(1);

  if (error) {
    console.error("Connection error:", error);
    return { data: null, error };
  }

  console.log("Connected:", data);
  return { data, error: null };
}

export default supabase;
