import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageHead, siteMeta } from "@/lib/site-meta";

const SECTION_IDS = ["operator", "contact", "responsibility", "links", "copyright"] as const;

export const Route = createFileRoute("/imprint")({
  head: () => pageHead(siteMeta.imprint),
  component: ImprintPage,
});

function ImprintPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-green">
            {t("imprintPage.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">
            {t("imprintPage.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("imprintPage.subtitle")}
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="space-y-12">
          {SECTION_IDS.map((id) => (
            <section key={id} className="rounded-xl border border-border/60 bg-card/30 p-6 md:p-8">
              <h2 className="font-display text-xl uppercase tracking-wide text-neon-green md:text-2xl">
                {t(`imprintPage.sections.${id}.title`)}
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
                {t(`imprintPage.sections.${id}.body`)}
              </p>
            </section>
          ))}
          <section className="rounded-xl border border-neon-green/25 bg-card/30 p-6 md:p-8">
            <h2 className="font-display text-xl uppercase tracking-wide text-neon-green md:text-2xl">
              {t("imprintPage.sections.privacy.title")}
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              {t("imprintPage.sections.privacy.body")}
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                to="/privacy"
                className="font-display text-sm uppercase tracking-wider text-neon-green transition hover:text-foreground"
              >
                {t("imprintPage.sections.privacy.privacyLink")}
              </Link>
              <Link
                to="/eu-gdpr"
                className="font-display text-sm uppercase tracking-wider text-neon-green transition hover:text-foreground"
              >
                {t("imprintPage.sections.privacy.gdprLink")}
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
