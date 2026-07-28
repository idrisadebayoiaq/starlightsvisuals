import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeBlogSection } from "@/components/HomeBlogSection";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { TextTestimonialsSection } from "@/components/TextTestimonialsSection";
import { TrustedBySection } from "@/components/TrustedBySection";
import { VideoTestimonialsSection } from "@/components/VideoTestimonialsSection";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import { SelectedWorkCard } from "@/components/works/SelectedWorkCard";
import { useLocalizedShowcaseCategories } from "@/hooks/use-localized-works";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Starlights Visuals | Animation & VFX Studio" },
      {
        name: "description",
        content:
          "A creative studio for 2D and 3D animation, VFX, and cinematic storytelling. We bring worlds, characters and films to life.",
      },
      { property: "og:title", content: "Starlights Visuals | Animation & VFX Studio" },
      {
        property: "og:description",
        content: "Animation, VFX, and cinematic storytelling. Worlds, characters, cinematics.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, i18n } = useTranslation();
  const showcaseCategories = useLocalizedShowcaseCategories();

  const services = useMemo(
    () => [
      { num: "01", title: t("home.services.01.title"), desc: t("home.services.01.desc") },
      { num: "02", title: t("home.services.02.title"), desc: t("home.services.02.desc") },
      { num: "03", title: t("home.services.03.title"), desc: t("home.services.03.desc") },
      { num: "04", title: t("home.services.04.title"), desc: t("home.services.04.desc") },
    ],
    [t, i18n.language],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="hero-cinematic relative isolate min-h-[88vh] overflow-hidden border-b border-border/40">
        <HeroBackgroundVideo />

        <div className="relative z-10 flex min-h-[88vh] flex-col justify-center px-6 pt-20 pb-16 text-white md:px-14 md:pt-28 md:pb-20 lg:max-w-4xl">
          <div className="pointer-events-none absolute -inset-x-4 -inset-y-6 -z-10 max-w-3xl rounded-3xl bg-black/50 blur-3xl md:-inset-x-8" />
          <p className="font-script text-3xl text-neon-green drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {t("home.heroScript")}
          </p>

          <h1 className="mt-6 font-display text-[14vw] leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.85)] md:text-[7.5rem] lg:text-[9rem]">
            <span className="block">{t("home.heroTitle1")}</span>
            <span className="block text-outline-hero">{t("home.heroTitle2")}</span>
          </h1>

          <svg
            viewBox="0 0 600 80"
            className="draw-squiggle mt-6 h-12 w-72 text-neon-green"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M5 50 C 80 5, 150 90, 230 40 S 380 10, 460 55 S 580 30, 595 45" />
          </svg>

          <p className="mt-10 max-w-lg text-base leading-relaxed text-white/90 drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] md:text-lg">
            {t("home.heroBody")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-3 rounded-full bg-neon-green px-7 py-3.5 font-display text-sm uppercase tracking-widest text-background transition hover:glow-blue"
            >
              {t("home.seePortfolio")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/55 px-7 py-3.5 font-display text-sm uppercase tracking-widest text-white transition hover:border-neon-green hover:text-neon-green"
            >
              {t("home.startProject")}
            </Link>
          </div>
        </div>
      </section>

      <TrustedBySection />

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-14">
          <div className="mb-16 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="font-script text-2xl text-neon-green">{t("home.servicesLabel")}</p>
              <h2 className="mt-2 font-display text-5xl tracking-tight md:text-7xl">
                {t("home.servicesTitle")}
              </h2>
            </div>
            <Link
              to="/services"
              className="font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-neon-green inline-flex items-center gap-2"
            >
              {t("home.allServices")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-border/60 border-y border-border/60">
            {services.map((s) => (
              <Link
                key={s.num}
                to="/services"
                className="group grid grid-cols-1 items-center gap-4 py-8 md:grid-cols-[80px_1fr_1fr_40px] md:gap-10"
              >
                <span className="font-display text-xs text-muted-foreground">{s.num}</span>
                <h3 className="font-display text-3xl tracking-tight transition group-hover:text-neon-green md:text-5xl">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground md:text-base">{s.desc}</p>
                <ArrowUpRight className="h-6 w-6 text-muted-foreground transition group-hover:text-neon-green group-hover:rotate-45" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-14">
          <div className="mb-12 flex items-end justify-between gap-4 flex-wrap">
            <div>
              <p className="font-script text-2xl text-neon-green">{t("home.showcaseLabel")}</p>
              <h2 className="mt-2 font-display text-5xl tracking-tight md:text-7xl">
                <span className="text-outline">{t("home.showcaseTitle1")}</span>{" "}
                {t("home.showcaseTitle2")}
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-neon-green inline-flex items-center gap-2"
            >
              {t("home.fullPortfolio")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseCategories.map((item, index) => (
              <SelectedWorkCard
                key={item.slug}
                slug={item.slug}
                tag={item.tag}
                title={item.title}
                coverImage={item.coverImage}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <HomeBlogSection />
      <TextTestimonialsSection />
      <VideoTestimonialsSection />
      <HomeFaqSection />

      <section className="relative isolate overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
          <p className="font-script text-3xl text-neon-green">{t("home.ctaScript")}</p>
          <h2 className="mt-4 font-display text-5xl tracking-tight md:text-8xl">
            <span className="block">{t("home.ctaTitle1")}</span>
            <span className="block text-outline-green">{t("home.ctaTitle2")}</span>
          </h2>
          <Link
            to="/contact"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-neon-green px-9 py-4 font-display text-sm uppercase tracking-widest text-background hover:glow-blue"
          >
            {t("home.startProject")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
