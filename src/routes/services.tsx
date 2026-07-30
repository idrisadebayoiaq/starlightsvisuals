import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Film, Box, Palette, Wand2, Sparkles, Clapperboard, ArrowRight,
} from "lucide-react";
import { pageHead, siteMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/services")({
  head: () => pageHead(siteMeta.services),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useTranslation();

  const services = useMemo(
    () => [
      { icon: Film, title: t("servicesPage.items.2d.title"), desc: t("servicesPage.items.2d.desc") },
      { icon: Box, title: t("servicesPage.items.3d.title"), desc: t("servicesPage.items.3d.desc") },
      { icon: Palette, title: t("servicesPage.items.character.title"), desc: t("servicesPage.items.character.desc") },
      { icon: Wand2, title: t("servicesPage.items.motion.title"), desc: t("servicesPage.items.motion.desc") },
      { icon: Sparkles, title: t("servicesPage.items.vfx.title"), desc: t("servicesPage.items.vfx.desc") },
      { icon: Clapperboard, title: t("servicesPage.items.trailer.title"), desc: t("servicesPage.items.trailer.desc") },
    ],
    [t],
  );

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
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group relative rounded-xl border border-border bg-card/40 p-8 transition hover:border-neon-blue hover:-translate-y-1 hover:glow-blue"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg neon-gradient text-background">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="font-display text-xs text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl tracking-wider">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
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
