import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  showcaseCategories as staticShowcase,
  workCategories as staticCategories,
  type WorkCategorySlug,
} from "@/data/portfolio-works";
import { mergeVideoUrlsIntoCategories } from "@/hooks/use-cms-videos";
import { usePortfolioVideoMap } from "@/hooks/use-portfolio-video-map";
import type { WorkCategory, WorkClient, WorkProject } from "@/types/portfolio-works";

function localizeProject(t: (key: string, options?: { defaultValue?: string }) => string, project: WorkProject): WorkProject {
  const base = `works.projects.${project.id}`;
  return {
    ...project,
    title: t(`${base}.title`, { defaultValue: project.title }),
    description: t(`${base}.description`, { defaultValue: project.description }),
    tags: project.tags.map((tag, index) =>
      t(`${base}.tags.${index}`, { defaultValue: tag }),
    ),
  };
}

function localizeClient(
  t: (key: string, options?: { defaultValue?: string }) => string,
  categorySlug: string,
  client: WorkClient,
): WorkClient {
  const base = `works.clients.${categorySlug}.${client.slug}`;
  return {
    ...client,
    name: t(`${base}.name`, { defaultValue: client.name }),
    industry: t(`${base}.industry`, { defaultValue: client.industry }),
    description: t(`${base}.description`, { defaultValue: client.description }),
    testimonial: client.testimonial
      ? t(`${base}.testimonial`, { defaultValue: client.testimonial })
      : undefined,
    timeline: t(`${base}.timeline`, { defaultValue: client.timeline }),
    services: client.services.map((service, index) =>
      t(`${base}.services.${index}`, { defaultValue: service }),
    ),
    tools: client.tools.map((tool, index) =>
      t(`${base}.tools.${index}`, { defaultValue: tool }),
    ),
    projects: client.projects.map((project) => localizeProject(t, project)),
  };
}

function localizeCategory(
  t: (key: string, options?: { defaultValue?: string }) => string,
  category: WorkCategory,
): WorkCategory {
  const base = `works.categories.${category.slug}`;
  return {
    ...category,
    title: t(`${base}.title`, { defaultValue: category.title }),
    tagline: t(`${base}.tagline`, { defaultValue: category.tagline }),
    description: t(`${base}.description`, { defaultValue: category.description }),
    clients: category.clients.map((client) => localizeClient(t, category.slug, client)),
  };
}

export function useLocalizedCategories(): WorkCategory[] {
  const { t, i18n } = useTranslation();
  const { map: videoMap } = usePortfolioVideoMap();

  return useMemo(() => {
    const withCmsVideos = mergeVideoUrlsIntoCategories(staticCategories, videoMap);
    return withCmsVideos.map((category) => localizeCategory(t, category));
  }, [t, i18n.language, videoMap]);
}

export function useLocalizedCategory(slug: string): WorkCategory | undefined {
  const categories = useLocalizedCategories();
  return categories.find((category) => category.slug === slug);
}

export function useLocalizedClient(categorySlug: string, clientSlug: string): WorkClient | undefined {
  const category = useLocalizedCategory(categorySlug);
  return category?.clients.find((client) => client.slug === clientSlug);
}

export function useLocalizedShowcaseCategories() {
  const { t, i18n } = useTranslation();

  return useMemo(
    () =>
      staticShowcase.map((item) => {
        const base = `works.showcase.${item.slug}`;
        return {
          ...item,
          tag: t(`${base}.tag`, { defaultValue: item.tag }),
          title: t(`${base}.title`, { defaultValue: item.title }),
        };
      }),
    [t, i18n.language],
  );
}

export function getLocalizedCategoryTitle(
  t: (key: string, options?: { defaultValue?: string }) => string,
  slug: WorkCategorySlug,
  fallback: string,
): string {
  return t(`works.categories.${slug}.title`, { defaultValue: fallback });
}
