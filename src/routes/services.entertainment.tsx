import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Clapperboard,
  Film,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TextTestimonialsSection } from "@/components/TextTestimonialsSection";
import { pageHead } from "@/lib/site-meta";
import en from "@/locales/en/common.json";

export const Route = createFileRoute("/services/entertainment")({
  head: () =>
    pageHead({
      title: en.entertainmentServicesPage.metaTitle,
      description: en.entertainmentServicesPage.metaDescription,
    }),
  component: EntertainmentServicesPage,
});

function EntertainmentServicesPage() {
  const { t } = useTranslation();

  const services = useMemo(
    () => [
      { icon: Film, key: "2d" },
      { icon: Box, key: "3d" },
      { icon: Palette, key: "character" },
      { icon: Wand2, key: "motion" },
      { icon: Sparkles, key: "vfx" },
      { icon: Clapperboard, key: "trailer" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-blue">
            {t("entertainmentServicesPage.label")}
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-balance">
            <span className="neon-text text-glow">{t("entertainmentServicesPage.title")}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("entertainmentServicesPage.subtitle")}
          </p>
          <Link
            to="/services"
            className="mt-8 inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-neon-green"
          >
            <ArrowLeft className="h-4 w-4" /> {t("entertainmentServicesPage.backToIndustrial")}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.key}
              className="rounded-xl border border-border bg-card/40 p-8 transition hover:border-neon-blue"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg neon-gradient text-background">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl tracking-wider">
                {t(`entertainmentServicesPage.items.${s.key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`entertainmentServicesPage.items.${s.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <TextTestimonialsSection entertainmentOnly />

      <section className="relative border-t border-border/40">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md neon-gradient px-8 py-4 font-display text-sm uppercase tracking-widest text-background"
          >
            {t("entertainmentServicesPage.ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
