import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TextTestimonialsSection } from "@/components/TextTestimonialsSection";
import { TrustSignalsSection } from "@/components/TrustSignalsSection";
import { ClientCard } from "@/components/works/ClientCard";
import { caseStudies } from "@/data/case-studies";
import { getIndustry, industries, isIndustrySlug } from "@/data/industries";
import { useClientsByIndustry } from "@/hooks/use-localized-works";
import { pageHead } from "@/lib/site-meta";
import en from "@/locales/en/common.json";

export const Route = createFileRoute("/industries/$slug")({
  beforeLoad: ({ params }) => {
    if (!isIndustrySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const item = (en.industries.items as Record<string, { headline?: string; intro?: string }>)[
      params.slug
    ];
    return pageHead({
      title: item?.headline
        ? `${item.headline} | Starlights Visuals`
        : en.industries.metaTitle,
      description: item?.intro ?? en.industries.metaDescription,
    });
  },
  component: IndustryLandingPage,
});

const DELIVERABLE_KEYS = [
  "technical",
  "exploded",
  "tradeShow",
  "robotics",
  "explainer",
  "cad",
] as const;

function IndustryLandingPage() {
  const { slug } = Route.useParams();
  const { t } = useTranslation();
  const industry = getIndustry(slug)!;
  const clients = useClientsByIndustry(slug);

  const pains = useMemo(() => {
    const raw = t(`industries.items.${slug}.pains`, { returnObjects: true });
    return Array.isArray(raw) ? (raw as string[]) : [];
  }, [t, slug]);

  const relatedCases = caseStudies.filter((c) => industry.caseStudySlugs.includes(c.slug));
  const relatedIndustries = industries.filter((i) => i.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <p className="font-display text-xs uppercase tracking-[0.3em] text-neon-green">
            {t(`industries.items.${slug}.navLabel`)}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-6xl text-balance">
            {t(`industries.items.${slug}.headline`)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {t(`industries.items.${slug}.intro`)}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-neon-green px-7 py-3.5 font-display text-sm uppercase tracking-widest text-background"
            >
              {t("industries.bookCall")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/portfolio"
              search={{ industry: slug }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 font-display text-sm uppercase tracking-widest"
            >
              {t("industries.viewWork")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-14">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            {t("industries.painPoints")}
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {pains.map((pain) => (
              <li
                key={pain}
                className="rounded-xl border border-border/50 bg-card/20 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
              >
                {pain}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-14">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            {t("industries.deliverables")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLE_KEYS.map((key) => {
              const slug =
                key === "tradeShow"
                  ? "trade-show"
                  : (key as "technical" | "exploded" | "robotics" | "explainer" | "cad");
              return (
                <Link
                  key={key}
                  to="/services/$slug"
                  params={{ slug }}
                  className="rounded-xl border border-border/50 p-5 transition hover:border-neon-green"
                >
                  <h3 className="font-display text-lg">{t(`servicesPage.items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`servicesPage.items.${key}.desc`)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-14">
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {t("industries.relatedWork")}
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {clients.slice(0, 6).map((client, index) => (
                <ClientCard
                  key={`${client.categorySlug}-${client.slug}`}
                  categorySlug={client.categorySlug}
                  client={client}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedCases.length > 0 && (
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-20 md:px-14">
            <h2 className="font-display text-3xl tracking-tight md:text-4xl">
              {t("industries.relatedCases")}
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {relatedCases.map((c) => (
                <Link
                  key={c.slug}
                  to="/case-studies/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-xl border border-border/60 p-6 transition hover:border-neon-green"
                >
                  <h3 className="font-display text-xl">
                    {t(`caseStudies.items.${c.slug}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`caseStudies.items.${c.slug}.summary`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {industry.testimonialIds.length > 0 && (
        <TextTestimonialsSection onlyIds={industry.testimonialIds} />
      )}

      <TrustSignalsSection />

      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-14">
          <h2 className="font-display text-2xl tracking-tight">
            {t("industries.relatedIndustries")}
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedIndustries.map((item) => (
              <Link
                key={item.slug}
                to="/industries/$slug"
                params={{ slug: item.slug }}
                className="rounded-full border border-border/60 px-4 py-2 font-display text-xs uppercase tracking-widest text-muted-foreground transition hover:border-neon-green hover:text-neon-green"
              >
                {t(`industries.items.${item.slug}.navLabel`)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-neon-green px-9 py-4 font-display text-sm uppercase tracking-widest text-background"
        >
          {t("industries.bookCall")} <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
