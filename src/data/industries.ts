export type IndustrySlug =
  | "industrial-machinery"
  | "robotics-automation"
  | "medical-devices"
  | "automotive-components"
  | "packaging-machines"
  | "cnc-machines"
  | "industrial-pumps"
  | "industrial-electronics";

export type IndustryPriority = "priority" | "secondary";

export type IndustryDef = {
  slug: IndustrySlug;
  /** i18n key under industries.items.<slug> */
  priority: IndustryPriority;
  /** Client slugs that map to this industry */
  clientSlugs: string[];
  /** Static testimonial ids shown on this niche page */
  testimonialIds: string[];
  /** Related case study slugs */
  caseStudySlugs: string[];
};

export const INDUSTRY_SLUGS: IndustrySlug[] = [
  "industrial-machinery",
  "robotics-automation",
  "medical-devices",
  "automotive-components",
  "packaging-machines",
  "cnc-machines",
  "industrial-pumps",
  "industrial-electronics",
];

export const industries: IndustryDef[] = [
  {
    slug: "industrial-machinery",
    priority: "priority",
    clientSlugs: ["mintec", "integra-pw", "ronix", "credex", "atx", "prov-gap"],
    testimonialIds: ["luigi", "burkhard"],
    caseStudySlugs: ["mintec", "integra-pw"],
  },
  {
    slug: "robotics-automation",
    priority: "priority",
    clientSlugs: ["smaract"],
    testimonialIds: ["hauke"],
    caseStudySlugs: ["smaract"],
  },
  {
    slug: "medical-devices",
    priority: "priority",
    clientSlugs: ["3d-medical-animation"],
    testimonialIds: [],
    caseStudySlugs: [],
  },
  {
    slug: "automotive-components",
    priority: "priority",
    clientSlugs: ["phr-1", "autoz-crave", "novatorq"],
    testimonialIds: ["ilija"],
    caseStudySlugs: ["novatorq"],
  },
  {
    slug: "packaging-machines",
    priority: "secondary",
    clientSlugs: [],
    testimonialIds: [],
    caseStudySlugs: [],
  },
  {
    slug: "cnc-machines",
    priority: "secondary",
    clientSlugs: [],
    testimonialIds: [],
    caseStudySlugs: [],
  },
  {
    slug: "industrial-pumps",
    priority: "secondary",
    clientSlugs: [],
    testimonialIds: [],
    caseStudySlugs: [],
  },
  {
    slug: "industrial-electronics",
    priority: "secondary",
    clientSlugs: ["mintec", "3d-gadget-animation"],
    testimonialIds: ["luigi"],
    caseStudySlugs: ["mintec"],
  },
];

/** Static seed: client slug → industry slugs (for merge + backfill) */
export const CLIENT_INDUSTRY_MAP: Record<string, IndustrySlug[]> = {
  smaract: ["robotics-automation"],
  novatorq: ["automotive-components"],
  "phr-1": ["automotive-components"],
  "autoz-crave": ["automotive-components"],
  mintec: ["industrial-machinery", "industrial-electronics"],
  "integra-pw": ["industrial-machinery"],
  ronix: ["industrial-machinery"],
  credex: ["industrial-machinery"],
  atx: ["industrial-machinery"],
  "prov-gap": ["industrial-machinery"],
  "3d-medical-animation": ["medical-devices"],
  "3d-gadget-animation": ["industrial-electronics"],
  "3d-explainer-video": ["industrial-machinery"],
};

export function getIndustry(slug: string): IndustryDef | undefined {
  return industries.find((i) => i.slug === slug);
}

export function isIndustrySlug(slug: string): slug is IndustrySlug {
  return INDUSTRY_SLUGS.includes(slug as IndustrySlug);
}

export function industriesForClient(clientSlug: string): IndustrySlug[] {
  return CLIENT_INDUSTRY_MAP[clientSlug] ?? [];
}
