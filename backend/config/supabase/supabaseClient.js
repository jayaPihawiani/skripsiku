import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

const supabase = createClient(process.env.PROJECT_URL, process.env.ANON_KEY);

export default supabase;
