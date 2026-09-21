import type { LucideIcon } from "lucide-react";
import { Box, Clapperboard, Cog, Layers, ScanSearch, Sparkles } from "lucide-react";

import portfolio3d from "@/assets/portfolio-3d.jpg";
import portfolioIndustrial from "@/assets/portfolio-industrial.jpg";
import portfolioMotion from "@/assets/portfolio-motion.jpg";
import portfolioProduct from "@/assets/portfolio-product.jpg";
import portfolioTrailer from "@/assets/portfolio-trailer.jpg";

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

export const industrialServices: IndustrialServiceDef[] = [
  {
    slug: "technical",
    icon: Cog,
    image: portfolioIndustrial,
  },
  {
    slug: "exploded",
    icon: Layers,
    image: portfolioProduct,
  },
  {
    slug: "trade-show",
    icon: Clapperboard,
    image: portfolioTrailer,
  },
  {
    slug: "robotics",
    icon: Box,
    image: portfolio3d,
  },
  {
    slug: "explainer",
    icon: Sparkles,
    image: portfolioMotion,
  },
  {
    slug: "cad",
    icon: ScanSearch,
    image: portfolioProduct,
  },
];

export const INDUSTRIAL_SERVICE_SLUGS = industrialServices.map((s) => s.slug);

export function getIndustrialService(slug: string): IndustrialServiceDef | undefined {
  return industrialServices.find((s) => s.slug === slug);
}

export function isIndustrialServiceSlug(slug: string): slug is IndustrialServiceSlug {
  return INDUSTRIAL_SERVICE_SLUGS.includes(slug as IndustrialServiceSlug);
}
