import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { BlogPostSection } from "@/data/blog-posts";

/**
 * Publishable Supabase credentials (anon / publishable key).
 * Safe for the browser — RLS protects data. Prefer VITE_* env vars in hosting;
 * these fallbacks keep production working when the host build has no env set.
 */
const PUBLIC_SUPABASE_URL = "https://ufcitlcaowlqizfkpfnp.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmY2l0bGNhb3dscWl6ZmtwZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDIxNjAsImV4cCI6MjA5NTMxODE2MH0.C_AmpLGz6-CzDjRnjBEwmt_Q4rjy-zeNnnMMSWwiVWY";

function readEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string | undefined {
  const raw = import.meta.env[name];
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (!value) return undefined;
  if (/^your-|changeme|example\.com/i.test(value)) return undefined;
  return value;
}

const supabaseUrl = readEnv("VITE_SUPABASE_URL") ?? PUBLIC_SUPABASE_URL;
const supabaseAnonKey = readEnv("VITE_SUPABASE_ANON_KEY") ?? PUBLIC_SUPABASE_ANON_KEY;

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

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string | null;
  read_time: string;
  image_url: string;
  author: string;
  sections: BlogPostSection[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PortfolioVideoRow = {
  id: string;
  project_key: string | null;
  category_slug: string;
  client_slug: string;
  client_name: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  year: number;
  tags: string[];
  sort_order: number;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PortfolioClientRow = {
  id: string;
  category_slug: string;
  slug: string;
  name: string;
  industry: string;
  description: string;
  logo_url: string;
  banner_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminRow = {
  email: string;
  created_at: string;
  created_by: string | null;
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
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
