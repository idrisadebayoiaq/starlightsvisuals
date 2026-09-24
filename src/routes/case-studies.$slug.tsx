import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { caseStudies, getCaseStudy, type CaseStudySlug } from "@/data/case-studies";
import { pageHead } from "@/lib/site-meta";
import en from "@/locales/en/common.json";

const SLUGS = new Set(caseStudies.map((c) => c.slug));

export const Route = createFileRoute("/case-studies/$slug")({
  beforeLoad: ({ params }) => {
    if (!SLUGS.has(params.slug as CaseStudySlug)) throw notFound();
  },
  head: ({ params }) => {
    const item = (en.caseStudies.items as Record<string, { title?: string; summary?: string }>)[
      params.slug
    ];
    return pageHead({
      title: item?.title ? `${item.title} | Starlights Visuals` : en.caseStudies.metaTitle,
      description: item?.summary ?? en.caseStudies.metaDescription,
    });
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const study = getCaseStudy(slug as CaseStudySlug)!;

  const sections = [
    { key: "problem", label: t("caseStudies.problem") },
    { key: "process", label: t("caseStudies.process") },
    { key: "constraints", label: t("caseStudies.constraints") },
    { key: "result", label: t("caseStudies.result") },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <article>
        <section className="relative isolate border-b border-border/40">
          <div className="absolute inset-0 -z-10 grid-bg" />
          <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-neon-green"
            >
              <ArrowLeft className="h-4 w-4" /> {t("caseStudies.backToIndex")}
            </Link>
            <p className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-neon-green">
              {study.company}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl text-balance">
              {t(`caseStudies.items.${slug}.title`)}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {t(`caseStudies.items.${slug}.summary`)}
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-12 px-6 py-16 md:py-20">
          {sections.map((section) => (
            <div key={section.key}>
              <h2 className="font-display text-2xl tracking-wide text-neon-green">
                {section.label}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t(`caseStudies.items.${slug}.${section.key}`)}
              </p>
            </div>
          ))}

          {study.workHref && (
            <a
              href={study.workHref}
              className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-widest text-neon-green"
            >
              {t("caseStudies.watchFilm")} <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </section>

        <section className="border-t border-border/40">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-neon-green px-8 py-4 font-display text-sm uppercase tracking-widest text-background"
            >
              {t("caseStudies.cta")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </article>

      <SiteFooter />
    </div>
  );
}
