import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { caseStudies } from "@/data/case-studies";
import { pageHead } from "@/lib/site-meta";
import en from "@/locales/en/common.json";

export const Route = createFileRoute("/case-studies/")({
  head: () =>
    pageHead({
      title: en.caseStudies.metaTitle,
      description: en.caseStudies.metaDescription,
    }),
  component: CaseStudiesIndexPage,
});

function CaseStudiesIndexPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-script text-2xl text-neon-green">{t("caseStudies.label")}</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-tight">
            {t("caseStudies.title")}
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("caseStudies.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-14">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              to="/case-studies/$slug"
              params={{ slug: study.slug }}
              className="group rounded-xl border border-border/60 bg-card/30 p-8 transition hover:border-neon-green"
            >
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {study.company}
              </p>
              <h2 className="mt-3 font-display text-2xl tracking-wide group-hover:text-neon-green">
                {t(`caseStudies.items.${study.slug}.title`)}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {t(`caseStudies.items.${study.slug}.summary`)}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-neon-green">
                {t("caseStudies.readCase")} <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
