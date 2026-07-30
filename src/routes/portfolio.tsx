import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionReveal } from "@/components/SectionReveal";
import { CategoryCard } from "@/components/works/CategoryCard";
import { WorksCta } from "@/components/works/WorksCta";
import { useLocalizedCategories } from "@/hooks/use-localized-works";
import { pageHead, siteMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/portfolio")({
  head: () => pageHead(siteMeta.portfolio),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { t } = useTranslation();
  const categories = useLocalizedCategories();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32 text-center">
          <p className="font-script text-2xl text-neon-green">{t("portfolioPage.label")}</p>
          <h1 className="mt-4 font-display text-6xl md:text-8xl tracking-tight">
            {t("portfolioPage.title1")}
            <span className="text-outline">{t("portfolioPage.title2")}</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            {t("works.portfolioHubDesc")}
          </p>
        </div>
      </section>

      <SectionReveal as="section" className="mx-auto max-w-7xl px-6 py-20 md:px-14">
        <div className="grid gap-5 sm:grid-cols-2">
          {categories.map((category, i) => (
            <CategoryCard key={category.slug} category={category} index={i} />
          ))}
        </div>
      </SectionReveal>

      <WorksCta />
      <SiteFooter />
    </div>
  );
}
