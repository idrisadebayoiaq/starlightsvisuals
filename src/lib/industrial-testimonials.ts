import type { TextTestimonial } from "@/components/TestimonialCard";
import type { IndustrySlug } from "@/data/industries";
import { getIndustry } from "@/data/industries";

/** Static industrial testimonial ids used on home + niche pages */
export const INDUSTRIAL_TESTIMONIAL_IDS = ["hauke", "ilija", "luigi", "burkhard"] as const;

export const ENTERTAINMENT_TESTIMONIAL_IDS = ["jeremy", "raiv", "jason", "robert"] as const;

export function filterTestimonialsByIds(
  all: TextTestimonial[],
  ids: readonly string[],
): TextTestimonial[] {
  const set = new Set(ids);
  return all.filter((item) => set.has(item.id));
}

export function filterTestimonialsForIndustry(
  all: TextTestimonial[],
  industrySlug: IndustrySlug,
): TextTestimonial[] {
  const industry = getIndustry(industrySlug);
  if (!industry || industry.testimonialIds.length === 0) {
    return filterTestimonialsByIds(all, INDUSTRIAL_TESTIMONIAL_IDS);
  }
  const matched = filterTestimonialsByIds(all, industry.testimonialIds);
  return matched.length > 0 ? matched : filterTestimonialsByIds(all, INDUSTRIAL_TESTIMONIAL_IDS);
}
