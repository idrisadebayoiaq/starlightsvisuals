import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { BlogPostSection } from "@/data/blog-posts";

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
    client = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return client;
}
