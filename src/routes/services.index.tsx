import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TrustSignalsSection } from "@/components/TrustSignalsSection";
import { industrialServices, serviceItemKey } from "@/data/industrial-services";
import { pageHead, siteMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/services/")({
  head: () => pageHead(siteMeta.services),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-blue">
            {t("servicesPage.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold text-balance">
            <span className="neon-text text-glow">{t("servicesPage.title")}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("servicesPage.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industrialServices.map((s, i) => {
            const itemKey = serviceItemKey(s.slug);
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/40 transition hover:border-neon-blue hover:-translate-y-1 hover:glow-blue"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={s.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-lg neon-gradient text-background">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="absolute right-4 top-4 font-display text-xs text-white/80">
                    0{i + 1}
                  </span>
                </div>
                <div className="p-6 pt-4">
                  <h3 className="font-display text-2xl tracking-wider group-hover:text-neon-blue">
                    {t(`servicesPage.items.${itemKey}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {t(`servicesPage.items.${itemKey}.desc`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-neon-green">
                    {t("servicesPage.detailsNav.readMore")} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <TrustSignalsSection />

      <section className="border-t border-border/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-muted-foreground">{t("servicesPage.entertainmentCta")}</p>
          <Link
            to="/services/entertainment"
            className="mt-4 inline-flex items-center gap-2 font-display text-sm uppercase tracking-widest text-neon-green hover:text-glow"
          >
            {t("servicesPage.entertainmentLink")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="relative border-t border-border/40">
        <div className="absolute inset-0 -z-10 neon-gradient opacity-20" />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl md:text-6xl font-bold text-balance">
            {t("servicesPage.ctaTitle1")}{" "}
            <span className="neon-text">{t("servicesPage.ctaTitle2")}</span>{" "}
            {t("servicesPage.ctaTitle3")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("servicesPage.ctaDesc")}</p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-md neon-gradient px-8 py-4 font-display text-sm uppercase tracking-widest text-background hover:glow-purple"
          >
            {t("servicesPage.ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
