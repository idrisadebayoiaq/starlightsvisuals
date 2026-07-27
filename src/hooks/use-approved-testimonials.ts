import { useEffect, useState } from "react";

import type { TextTestimonial } from "@/components/TestimonialCard";
import {
  getSupabase,
  isSupabaseConfigured,
  type ClientTestimonialRow,
} from "@/lib/supabase";

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function mapRow(row: ClientTestimonialRow): TextTestimonial {
  return {
    id: row.id,
    headline: row.headline,
    quote: row.quote,
    name: row.name,
    company: row.company,
    role: row.role,
    initials: initialsFromName(row.name),
    rating: row.rating,
    verified: row.verified,
  };
}

export function useApprovedTestimonials() {
  const [items, setItems] = useState<TextTestimonial[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("client_testimonials")
          .select("id,name,role,company,headline,quote,rating,verified,status,created_at")
          .eq("status", "approved")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (!cancelled && data) {
          setItems(data.map(mapRow));
        }
      } catch (err) {
        console.error("Failed to load client testimonials", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return items;
}
