export type IndustrySlug =
  | "industrial-machinery"
  | "robotics-automation"
  | "medical-devices"
  | "automotive-components"
  | "packaging-machines"
  | "cnc-machines"
  | "industrial-pumps"
  | "industrial-electronics"
  | "brand-entertainment"
  | "commercial-product";

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
  "brand-entertainment",
  "commercial-product",
  "packaging-machines",
  "cnc-machines",
  "industrial-pumps",
  "industrial-electronics",
];

export const industries: IndustryDef[] = [
  {
    slug: "industrial-machinery",
    priority: "priority",
    clientSlugs: ["mintec", "integra-pw", "ronix", "credex", "atx", "prov-gap", "ijockey"],
    testimonialIds: ["luigi", "burkhard", "jeremy"],
    caseStudySlugs: ["mintec", "integra-pw", "credex", "ijockey"],
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
    caseStudySlugs: ["novatorq", "autoz-crave"],
  },
  {
    slug: "brand-entertainment",
    priority: "priority",
    clientSlugs: [
      "chibi-art",
      "vtuber-animation",
      "live2d-animation",
      "2d-anime-animation",
      "kids-learning-animation",
      "3d-cartoon-animation",
      "3d-anime-character",
    ],
    testimonialIds: ["jeremy", "raiv", "jason"],
    caseStudySlugs: ["ijockey"],
  },
  {
    slug: "commercial-product",
    priority: "priority",
    clientSlugs: [
      "watch-animation",
      "ryse-drink-3d-product-animation",
      "3d-perfume-animation",
      "3d-gadget-animation",
      "vape-animation",
      "bag-suitcase-animation",
      "drop-band-animation",
      "3d-bed-animation",
    ],
    testimonialIds: ["robert", "jason"],
    caseStudySlugs: [],
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
  ijockey: ["industrial-machinery", "brand-entertainment"],
  "3d-medical-animation": ["medical-devices"],
  "3d-gadget-animation": ["commercial-product", "industrial-electronics"],
  "3d-explainer-video": ["industrial-machinery"],
  "chibi-art": ["brand-entertainment"],
  "vtuber-animation": ["brand-entertainment"],
  "live2d-animation": ["brand-entertainment"],
  "2d-anime-animation": ["brand-entertainment"],
  "kids-learning-animation": ["brand-entertainment"],
  "3d-cartoon-animation": ["brand-entertainment"],
  "3d-anime-character": ["brand-entertainment"],
  "watch-animation": ["commercial-product"],
  "ryse-drink-3d-product-animation": ["commercial-product"],
  "3d-perfume-animation": ["commercial-product"],
  "vape-animation": ["commercial-product"],
  "bag-suitcase-animation": ["commercial-product"],
  "drop-band-animation": ["commercial-product"],
  "3d-bed-animation": ["commercial-product"],
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
