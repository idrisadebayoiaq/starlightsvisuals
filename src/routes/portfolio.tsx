import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionReveal } from "@/components/SectionReveal";
import { CategoryCard } from "@/components/works/CategoryCard";
import { ClientCard } from "@/components/works/ClientCard";
import { WorksCta } from "@/components/works/WorksCta";
import { industries, isIndustrySlug } from "@/data/industries";
import { useClientsByIndustry, useLocalizedCategories } from "@/hooks/use-localized-works";
import { pageHead, siteMeta } from "@/lib/site-meta";

const portfolioSearchSchema = z.object({
  industry: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/portfolio")({
  validateSearch: portfolioSearchSchema,
  head: () => pageHead(siteMeta.portfolio),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { t } = useTranslation();
  const categories = useLocalizedCategories();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const industryFilter =
    search.industry && isIndustrySlug(search.industry) ? search.industry : null;

  const [localIndustry, setLocalIndustry] = useState<string>(industryFilter ?? "");

  const activeIndustry = industryFilter ?? (localIndustry || null);
  const filteredClients = useClientsByIndustry(
    activeIndustry && isIndustrySlug(activeIndustry) ? activeIndustry : null,
  );

  const industryOptions = useMemo(
    () =>
      industries.map((item) => ({
        slug: item.slug,
        label: t(`industries.items.${item.slug}.navLabel`),
      })),
    [t],
  );

  function onIndustryChange(value: string) {
    setLocalIndustry(value);
    void navigate({
      search: (prev) => ({
        ...prev,
        industry: value || undefined,
      }),
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-script text-2xl text-neon-green">{t("portfolioPage.label")}</p>
          <h1 className="mt-4 font-display text-6xl md:text-8xl tracking-tight">
            {t("portfolioPage.title1")}
            {t("portfolioPage.title2") ? (
              <span className="text-outline">{t("portfolioPage.title2")}</span>
            ) : null}
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("portfolioPage.subtitle")}
          </p>

          <label className="mt-10 inline-flex flex-col items-center gap-2">
            <span className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              {t("portfolioPage.filterIndustry")}
            </span>
            <select
              value={activeIndustry ?? ""}
              onChange={(e) => onIndustryChange(e.target.value)}
              className="min-w-[260px] rounded-full border border-border/60 bg-background/60 px-5 py-3 font-display text-xs uppercase tracking-widest backdrop-blur focus:border-neon-green/50 focus:outline-none"
            >
              <option value="">{t("portfolioPage.filterAll")}</option>
              {industryOptions.map((opt) => (
                <option key={opt.slug} value={opt.slug}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {activeIndustry ? (
        <SectionReveal as="section" className="mx-auto max-w-7xl px-6 py-20 md:px-14">
          {filteredClients.length === 0 ? (
            <p className="text-center text-muted-foreground">{t("portfolioPage.emptyIndustry")}</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredClients.map((client, i) => (
                <ClientCard
                  key={`${client.categorySlug}-${client.slug}`}
                  categorySlug={client.categorySlug}
                  client={client}
                  index={i}
                />
              ))}
            </div>
          )}
        </SectionReveal>
      ) : (
        <>
          <SectionReveal as="section" className="mx-auto max-w-7xl px-6 py-12 md:px-14">
            <h2 className="mb-8 font-display text-sm uppercase tracking-[0.25em] text-muted-foreground">
              {t("portfolioPage.byTechnique")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {categories.map((category, i) => (
                <CategoryCard key={category.slug} category={category} index={i} />
              ))}
            </div>
          </SectionReveal>
        </>
      )}

      <WorksCta />
      <SiteFooter />
    </div>
  );
}
