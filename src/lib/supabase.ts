import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export type ClientTestimonialRow = {
  id: string;
  name: string;
  role: string;
  company: string;
  headline: string;
  quote: string;
  rating: number;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type ClientTestimonialInsert = {
  name: string;
  role: string;
  company: string;
  headline: string;
  quote: string;
  rating: number;
  email?: string | null;
  verified: false;
  status: "pending";
};

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  if (!client) {
    client = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return client;
}
