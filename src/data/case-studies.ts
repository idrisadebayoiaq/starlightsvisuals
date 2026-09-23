import type { IndustrySlug } from "@/data/industries";

export type CaseStudySlug =
  | "smaract"
  | "novatorq"
  | "mintec"
  | "integra-pw"
  | "ijockey"
  | "autoz-crave"
  | "credex";

export type CaseStudyDef = {
  slug: CaseStudySlug;
  company: string;
  industrySlugs: IndustrySlug[];
  /** Portfolio path if a work client exists */
  workHref?: string;
  /** Optional YouTube id for final video */
  youtubeId?: string;
};

export const caseStudies: CaseStudyDef[] = [
  {
    slug: "smaract",
    company: "SmarAct",
    industrySlugs: ["robotics-automation"],
    workHref: "/works/branding/smaract",
  },
  {
    slug: "novatorq",
    company: "Novatorq",
    industrySlugs: ["automotive-components"],
    workHref: "/works/branding/phr-1",
  },
  {
    slug: "mintec",
    company: "Mintec",
    industrySlugs: ["industrial-machinery", "industrial-electronics"],
    workHref: "/works/branding/mintec",
  },
  {
    slug: "integra-pw",
    company: "INTEGRA-pw",
    industrySlugs: ["industrial-machinery"],
    workHref: "/works/branding/integra-pw",
  },
  {
    slug: "ijockey",
    company: "iJockey",
    industrySlugs: ["industrial-machinery", "brand-entertainment"],
    workHref: "/works/branding/ijockey",
    youtubeId: undefined,
  },
  {
    slug: "autoz-crave",
    company: "Autocraze",
    industrySlugs: ["automotive-components"],
    workHref: "/works/branding/autoz-crave",
    youtubeId: "Au_RJh88iSQ",
  },
  {
    slug: "credex",
    company: "Credex",
    industrySlugs: ["industrial-machinery"],
    workHref: "/works/branding/credex",
    youtubeId: "jCvKcYOZN6Y",
  },
];

export function getCaseStudy(slug: string): CaseStudyDef | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
