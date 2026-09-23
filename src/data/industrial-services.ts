import type { LucideIcon } from "lucide-react";
import { Box, Clapperboard, Cog, Layers, ScanSearch, Sparkles } from "lucide-react";

import { getServiceMedia } from "@/data/service-media";

export type IndustrialServiceSlug =
  | "technical"
  | "exploded"
  | "trade-show"
  | "robotics"
  | "explainer"
  | "cad";

/** Maps home teaser numbers (01–06) to service slugs */
export const HOME_SERVICE_SLUGS: IndustrialServiceSlug[] = [
  "technical",
  "exploded",
  "trade-show",
  "cad",
  "robotics",
  "explainer",
];

/** i18n key under servicesPage.items.* (camelCase for trade-show → tradeShow) */
export function serviceItemKey(slug: IndustrialServiceSlug): string {
  if (slug === "trade-show") return "tradeShow";
  return slug;
}

export type IndustrialServiceDef = {
  slug: IndustrialServiceSlug;
  icon: LucideIcon;
  image: string;
};

function serviceHero(slug: IndustrialServiceSlug): string {
  return getServiceMedia(slug)?.hero ?? `/services/${slug}/hero.jpg`;
}

export const industrialServices: IndustrialServiceDef[] = [
  {
    slug: "technical",
    icon: Cog,
    image: serviceHero("technical"),
  },
  {
    slug: "exploded",
    icon: Layers,
    image: serviceHero("exploded"),
  },
  {
    slug: "trade-show",
    icon: Clapperboard,
    image: serviceHero("trade-show"),
  },
  {
    slug: "robotics",
    icon: Box,
    image: serviceHero("robotics"),
  },
  {
    slug: "explainer",
    icon: Sparkles,
    image: serviceHero("explainer"),
  },
  {
    slug: "cad",
    icon: ScanSearch,
    image: serviceHero("cad"),
  },
];

export const INDUSTRIAL_SERVICE_SLUGS = industrialServices.map((s) => s.slug);

export function getIndustrialService(slug: string): IndustrialServiceDef | undefined {
  return industrialServices.find((s) => s.slug === slug);
}

export function isIndustrialServiceSlug(slug: string): slug is IndustrialServiceSlug {
  return INDUSTRIAL_SERVICE_SLUGS.includes(slug as IndustrialServiceSlug);
}
