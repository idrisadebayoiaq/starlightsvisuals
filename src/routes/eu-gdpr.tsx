import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageHead, siteMeta } from "@/lib/site-meta";

const SECTION_IDS = [
  "scope",
  "controller",
  "data",
  "purposes",
  "legalBases",
  "recipients",
  "transfers",
  "governmentRequests",
  "retention",
  "rights",
  "complaints",
  "decisions",
  "contact",
] as const;

export const Route = createFileRoute("/eu-gdpr")({
  head: () => pageHead(siteMeta.euGdpr),
  component: EuGdprPage,
});

function EuGdprPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-green">
            {t("euGdprPage.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
            {t("euGdprPage.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("euGdprPage.subtitle")}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{t("euGdprPage.updated")}</p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="rounded-xl border border-neon-green/25 bg-card/40 p-6 md:p-8">
          <p className="whitespace-pre-line text-base leading-8 text-foreground">
            {t("euGdprPage.summary")}
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {SECTION_IDS.map((id) => (
            <section key={id}>
              <h2 className="font-display text-xl uppercase tracking-wide text-neon-green md:text-2xl">
                {t(`euGdprPage.sections.${id}.title`)}
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
                {t(`euGdprPage.sections.${id}.body`)}
              </p>
            </section>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
