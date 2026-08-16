import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { TextTestimonial } from "@/components/TestimonialCard";
import { getSupabase, isSupabaseConfigured, type ClientTestimonialRow } from "@/lib/supabase";
import { ensureCmsTranslationsBatchFn } from "@/server/cms-translations";

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
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "en";
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
        if (!data || cancelled) return;

        let mapped = data.map(mapRow);

        if (locale !== "en" && data.length > 0) {
          try {
            const result = await ensureCmsTranslationsBatchFn({
              data: {
                entityType: "testimonial",
                entityIds: data.map((row) => row.id),
                locale,
              },
            });
            mapped = mapped.map((item) => {
              const fields = result.fieldsById[item.id];
              if (!fields) return item;
              return {
                ...item,
                headline: fields.headline || item.headline,
                quote: fields.quote || item.quote,
                name: fields.name || item.name,
                role: fields.role || item.role,
                company: fields.company || item.company,
              };
            });
          } catch (err) {
            console.error("Failed to translate testimonials", err);
          }
        }

        if (!cancelled) setItems(mapped);
      } catch (err) {
        console.error("Failed to load client testimonials", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return items;
}
