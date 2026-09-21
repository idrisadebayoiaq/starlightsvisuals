import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { industries } from "@/data/industries";
import { pageHead } from "@/lib/site-meta";
import en from "@/locales/en/common.json";

export const Route = createFileRoute("/industries/")({
  head: () =>
    pageHead({
      title: en.industries.metaTitle,
      description: en.industries.metaDescription,
    }),
  component: IndustriesHubPage,
});

function IndustriesHubPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-script text-2xl text-neon-green">{t("industries.label")}</p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl tracking-tight">
            {t("industries.title")}
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("industries.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-14">
        <div className="grid gap-5 sm:grid-cols-2">
          {industries.map((industry) => (
            <Link
              key={industry.slug}
              to="/industries/$slug"
              params={{ slug: industry.slug }}
              className="group rounded-xl border border-border/60 bg-card/30 p-8 transition hover:border-neon-green hover:-translate-y-0.5"
            >
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {industry.priority === "priority" ? "Priority" : "Vertical"}
              </p>
              <h2 className="mt-3 font-display text-2xl tracking-wide transition group-hover:text-neon-green md:text-3xl">
                {t(`industries.items.${industry.slug}.navLabel`)}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                {t(`industries.items.${industry.slug}.intro`)}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-neon-green">
                {t(`industries.items.${industry.slug}.headline`)}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
