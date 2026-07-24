import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionReveal } from "@/components/SectionReveal";
import { ClientCard } from "@/components/works/ClientCard";
import { WorksBreadcrumb } from "@/components/works/WorksBreadcrumb";
import { WorksCta } from "@/components/works/WorksCta";
import type { WorkCategorySlug } from "@/data/portfolio-works";
import { getCategory } from "@/lib/portfolio-works";
import { useLocalizedCategory } from "@/hooks/use-localized-works";

export const Route = createFileRoute("/works/$category/")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.category.title ?? "Work"} | Clients | Starlights Visuals`,
      },
      {
        name: "description",
        content: loaderData?.category.description ?? "",
      },
    ],
  }),
  component: CategoryClientsPage,
});

function CategoryClientsPage() {
  const { t } = useTranslation();
  const { category: staticCategory } = Route.useLoaderData();
  const category = useLocalizedCategory(staticCategory.slug) ?? staticCategory;
  const slug = category.slug as WorkCategorySlug;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative isolate border-b border-border/40"
      >
        <div className="absolute inset-0 -z-10">
          <img
            src={category.coverImage}
            alt=""
            className={
              slug === "2d-animation"
                ? "h-full w-full object-cover object-[center_22%] opacity-25"
                : slug === "branding"
                  ? "h-full w-full object-cover object-[center_35%] opacity-25"
                  : "h-full w-full object-cover opacity-25"
            }
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background to-background" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-14 md:pt-32">
          <WorksBreadcrumb
            items={[
              { label: t("works.breadcrumbWorks"), to: "/portfolio" },
              { label: category.title },
            ]}
          />
          <p className="mt-8 font-script text-2xl text-neon-green">{category.tagline}</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight md:text-7xl">{t("works.clientsTitle")}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{category.description}</p>
        </div>
      </motion.section>

      <SectionReveal as="section" className="mx-auto max-w-7xl px-6 py-16 md:px-14 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.clients.map((c, i) => (
            <ClientCard key={c.slug} categorySlug={slug} client={c} index={i} />
          ))}
        </div>
        {category.clients.length === 0 && (
          <p className="text-center text-muted-foreground">{t("works.noClients")}</p>
        )}
      </SectionReveal>

      <WorksCta />
      <SiteFooter />
    </div>
  );
}
