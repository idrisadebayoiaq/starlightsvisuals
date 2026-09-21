import type { IndustrySlug } from "@/data/industries";

export type CaseStudySlug = "smaract" | "novatorq" | "mintec" | "integra-pw";

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
];

export function getCaseStudy(slug: string): CaseStudyDef | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
