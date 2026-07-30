import { createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SectionReveal } from "@/components/SectionReveal";
import { ProjectLightbox } from "@/components/works/ProjectLightbox";
import { ProjectYouTubeCard } from "@/components/works/ProjectYouTubeCard";
import { ProjectVideoCard } from "@/components/works/ProjectVideoCard";
import { getCategory, getClient } from "@/lib/portfolio-works";
import { useLocalizedClient } from "@/hooks/use-localized-works";
import type { WorkProject } from "@/types/portfolio-works";
import { pageHead, siteMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/works/$category/$client")({
  loader: ({ params }) => {
    const category = getCategory(params.category);
    if (!category) throw notFound();

    const client = getClient(params.category, params.client);
    // Allow CMS-only clients: stub so the page can hydrate from live data
    return {
      category,
      client:
        client ??
        ({
          slug: params.client,
          name: params.client,
          industry: "",
          description: "",
          projectCount: 0,
          logo: "",
          banner: "",
          services: [],
          timeline: "",
          tools: [],
          projects: [],
        } satisfies typeof category.clients[number]),
    };
  },
  head: ({ loaderData }) =>
    pageHead({
      title: `${loaderData?.client.name ?? "Client"} | ${loaderData?.category.title ?? ""} | ${siteMeta.siteName}`,
      description: loaderData?.client.description || siteMeta.portfolio.description,
    }),
  component: ClientProjectsPage,
});

function ClientProjectsPage() {
  const { t } = useTranslation();
  const { category: staticCategory, client: staticClient } = Route.useLoaderData();
  const client = useLocalizedClient(staticCategory.slug, staticClient.slug) ?? staticClient;
  const [lightboxProject, setLightboxProject] = useState<WorkProject | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <ProjectLightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />

      <SectionReveal as="section" className="mx-auto max-w-7xl px-6 pb-20 pt-28 md:px-14 md:pt-32">
        <p className="font-script text-2xl text-neon-green">{client.name}</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{t("works.projectsTitle")}</h1>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {client.projects.map((project, i) => (
            <motion.button
              key={project.id}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setLightboxProject(project)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-card/30 transition hover:border-neon-green/60 hover:shadow-[0_0_24px_-10px_rgba(76,255,61,0.45)]"
            >
              {project.mediaType === "youtube" || project.mediaType === "vimeo" ? (
                <ProjectYouTubeCard videoId={project.id} poster={project.thumbnail} />
              ) : project.mediaType === "video" ? (
                <ProjectVideoCard src={project.mediaSrc} poster={project.thumbnail} />
              ) : (
                <img
                  src={project.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent px-3 pb-3 pt-12">
                <p className="font-display text-xs uppercase tracking-[0.18em] text-foreground md:text-sm">
                  {project.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
        {client.projects.length === 0 && (
          <p className="mt-8 text-sm text-muted-foreground">
            {t("works.noProjects", { defaultValue: "No projects yet." })}
          </p>
        )}
      </SectionReveal>

      <SiteFooter />
    </div>
  );
}
