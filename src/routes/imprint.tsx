import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { pageHead, siteMeta } from "@/lib/site-meta";

const ADDRESS_IDS = ["us", "be", "uk"] as const;
const CONTACT_IDS = ["whatsapp", "phone", "email"] as const;
const TEXT_SECTION_IDS = ["responsibility", "links", "copyright"] as const;

const CONTACT_HREFS: Record<(typeof CONTACT_IDS)[number], (value: string) => string> = {
  phone: (value) => `tel:${value.replace(/[^+\d]/g, "")}`,
  whatsapp: (value) => `https://wa.me/${value.replace(/\D/g, "")}`,
  email: (value) => `mailto:${value}`,
};

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
          <section className="rounded-xl border border-border/60 bg-card/30 p-6 md:p-8">
            <h2 className="font-display text-xl uppercase tracking-wide text-neon-green md:text-2xl">
              {t("imprintPage.sections.operator.title")}
            </h2>

            <div className="mt-6 space-y-1">
              <p className="font-display text-lg tracking-wide text-foreground">
                {t("imprintPage.sections.operator.company")}
              </p>
              <p className="text-base text-muted-foreground">
                {t("imprintPage.sections.operator.tagline")}
              </p>
            </div>

            <dl className="mt-8 space-y-8">
              <div>
                <dt className="font-display text-xs uppercase tracking-[0.2em] text-neon-green">
                  {t("imprintPage.sections.operator.founderLabel")}
                </dt>
                <dd className="mt-2 text-base text-foreground">
                  {t("imprintPage.sections.operator.founderName")}
                </dd>
              </div>

              {ADDRESS_IDS.map((id) => (
                <div key={id}>
                  <dt className="font-display text-xs uppercase tracking-[0.2em] text-neon-green">
                    {t(`imprintPage.sections.operator.addresses.${id}.label`)}
                  </dt>
                  <dd className="mt-2 space-y-1 text-base leading-7 text-muted-foreground">
                    {t(`imprintPage.sections.operator.addresses.${id}.lines`)
                      .split("\n")
                      .map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 border-t border-border/40 pt-6 text-base font-semibold leading-7 text-foreground">
              {t("imprintPage.sections.operator.remote")}
            </p>
          </section>

          <section className="rounded-xl border border-border/60 bg-card/30 p-6 md:p-8">
            <h2 className="font-display text-xl uppercase tracking-wide text-neon-green md:text-2xl">
              {t("imprintPage.sections.contact.title")}
            </h2>

            <dl className="mt-6 space-y-6">
              {CONTACT_IDS.map((id) => {
                const value = t(`imprintPage.sections.contact.items.${id}.value`);
                return (
                  <div key={id} className="sm:flex sm:items-baseline sm:gap-8">
                    <dt className="font-display text-xs uppercase tracking-[0.2em] text-neon-green sm:w-52 sm:shrink-0">
                      {t(`imprintPage.sections.contact.items.${id}.label`)}
                    </dt>
                    <dd className="mt-2 text-base sm:mt-0">
                      <a
                        href={CONTACT_HREFS[id](value)}
                        className="break-all text-foreground transition hover:text-neon-green"
                      >
                        {value}
                      </a>
                    </dd>
                  </div>
                );
              })}
            </dl>

            <p className="mt-8 border-t border-border/40 pt-6 text-base leading-7 text-muted-foreground">
              {t("imprintPage.sections.contact.note")}
            </p>
          </section>

          {TEXT_SECTION_IDS.map((id) => (
            <section key={id} className="rounded-xl border border-border/60 bg-card/30 p-6 md:p-8">
              <h2 className="font-display text-xl uppercase tracking-wide text-neon-green md:text-2xl">
                {t(`imprintPage.sections.${id}.title`)}
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
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
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
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
