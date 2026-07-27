import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Sparkles, Target, Zap, Heart } from "lucide-react";
import heroImg from "@/assets/portfolio-character.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Starlights Visuals" },
      {
        name: "description",
        content:
          "Starlight Visuals is a world-class animation studio creating exceptional visual experiences across industrial product animation, product visualization, and 2D & 3D character animation.",
      },
      { property: "og:title", content: "About Starlights Visuals" },
      {
        property: "og:description",
        content: "World-class animation that captivates, educates, and inspires.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();

  const values = useMemo(
    () => [
      { icon: Sparkles, title: t("aboutPage.values.imagination.title"), desc: t("aboutPage.values.imagination.desc") },
      { icon: Target, title: t("aboutPage.values.craft.title"), desc: t("aboutPage.values.craft.desc") },
      { icon: Zap, title: t("aboutPage.values.energy.title"), desc: t("aboutPage.values.energy.desc") },
      { icon: Heart, title: t("aboutPage.values.story.title"), desc: t("aboutPage.values.story.desc") },
    ],
    [t],
  );

  const stats = useMemo(
    () => [
      { k: "120+", l: t("aboutPage.stats.projects") },
      { k: "40+", l: t("aboutPage.stats.clients") },
      { k: "15", l: t("aboutPage.stats.awards") },
      { k: "4", l: t("aboutPage.stats.years") },
    ],
    [t],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate overflow-hidden border-b border-border/40">
        <img src={heroImg} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-background/70" />
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-28 md:py-40 text-center">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-blue">
            {t("aboutPage.label")}
          </p>
          <h1 className="mt-4 font-display text-5xl md:text-7xl font-bold text-balance">
            {t("aboutPage.title1")}
            <br />
            <span className="neon-text text-glow">{t("aboutPage.title2")}</span>
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 space-y-6 text-lg leading-relaxed text-muted-foreground">
        <p>{t("aboutPage.p1")}</p>
        <p>{t("aboutPage.p2")}</p>
        <p>{t("aboutPage.p3")}</p>
      </section>

      <section className="border-t border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-14">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-purple">
              {t("aboutPage.valuesLabel")}
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold">
              {t("aboutPage.valuesTitle")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border bg-background/60 p-8 hover:border-neon-blue hover:glow-blue transition"
              >
                <v.icon className="h-8 w-8 text-neon-blue" />
                <h3 className="mt-4 font-display text-xl tracking-wider">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.l}>
            <p className="font-display text-5xl md:text-6xl font-black neon-text">{s.k}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>

      <SiteFooter />
    </div>
  );
}
