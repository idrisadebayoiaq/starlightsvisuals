import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/portfolio-industrial.jpg";
import { pageHead, siteMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/about")({
  head: () => pageHead(siteMeta.about),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();

  const who = t("aboutPage.whoItems", { returnObjects: true });
  const what = t("aboutPage.whatItems", { returnObjects: true });
  const whoItems = Array.isArray(who) ? (who as string[]) : [];
  const whatItems = Array.isArray(what) ? (what as string[]) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-border/40">
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/40 to-background" />
        <div className="absolute inset-0 -z-10 grid-bg opacity-40" />
        <div className="mx-auto max-w-5xl px-6 py-28 md:py-40">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-green drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
            {t("aboutPage.label")}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-bold leading-tight text-balance text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] md:text-5xl lg:text-6xl">
            {t("aboutPage.title")}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white/85 md:text-xl">
            {t("aboutPage.lead")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-lg leading-relaxed text-muted-foreground md:py-20">
        <p>{t("aboutPage.p1")}</p>
      </section>

      <section className="border-t border-border/40 bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:px-14 md:py-20">
          <div>
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">
              {t("aboutPage.whoTitle")}
            </h2>
            <ul className="mt-6 space-y-3">
              {whoItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl tracking-tight md:text-3xl">
              {t("aboutPage.whatTitle")}
            </h2>
            <ul className="mt-6 space-y-3">
              {whatItems.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-green" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl space-y-6 px-6 py-16 text-lg leading-relaxed text-muted-foreground md:py-20">
        <p>{t("aboutPage.p2")}</p>
        <p>{t("aboutPage.p3")}</p>
        <div className="pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-neon-green px-7 py-3.5 font-display text-sm uppercase tracking-widest text-background"
          >
            {t("aboutPage.cta")} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            <a
              href="https://www.starlightvisualstudio.com"
              className="text-neon-green transition hover:text-glow"
              target="_blank"
              rel="noreferrer"
            >
              {t("aboutPage.website")}
            </a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
