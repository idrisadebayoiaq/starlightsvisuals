import { useEffect, useState } from "react";

import { PROJECT_PLACEHOLDER } from "@/data/portfolio-placeholder";
import {
  getSupabase,
  isSupabaseConfigured,
  type PortfolioClientRow,
  type PortfolioVideoRow,
} from "@/lib/supabase";
import { resolveVideoEmbed } from "@/lib/youtube";
import type { WorkCategory, WorkClient, WorkProject } from "@/types/portfolio-works";

export function useCmsVideos(categorySlug?: string) {
  const [videos, setVideos] = useState<PortfolioVideoRow[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        let query = getSupabase()
          .from("portfolio_videos")
          .select(
            "id,project_key,category_slug,client_slug,client_name,title,description,video_url,thumbnail_url,year,tags,sort_order,featured,published,created_at,updated_at",
          )
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (categorySlug) {
          query = query.eq("category_slug", categorySlug);
        }

        const { data, error: queryError } = await query;
        if (queryError) throw queryError;
        if (!cancelled) {
          setVideos((data as PortfolioVideoRow[]) ?? []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load CMS portfolio videos", err);
        if (!cancelled) {
          setVideos([]);
          setError(err instanceof Error ? err.message : "Failed to load videos");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return { videos, loading, error };
}

export function useCmsClients(categorySlug?: string) {
  const [clients, setClients] = useState<PortfolioClientRow[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        let query = getSupabase()
          .from("portfolio_clients")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true });

        if (categorySlug) {
          query = query.eq("category_slug", categorySlug);
        }

        const { data, error: queryError } = await query;
        if (queryError) throw queryError;
        if (!cancelled) {
          setClients((data as PortfolioClientRow[]) ?? []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load CMS portfolio clients", err);
        if (!cancelled) {
          setClients([]);
          setError(err instanceof Error ? err.message : "Failed to load clients");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return { clients, loading, error, setClients };
}

/** Map project_key → video_url for published portfolio videos. */
export function buildProjectVideoUrlMap(videos: PortfolioVideoRow[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const video of videos) {
    if (video.project_key && video.video_url) {
      map[video.project_key] = video.video_url;
    }
  }
  return map;
}

export function mergeVideoUrlsIntoCategories(
  categories: WorkCategory[],
  videoMap: Record<string, string>,
): WorkCategory[] {
  if (Object.keys(videoMap).length === 0) return categories;

  return categories.map((category) => ({
    ...category,
    clients: category.clients.map((client) => mergeClientVideos(client, videoMap)),
  }));
}

/**
 * Merge CMS clients + videos into static portfolio categories so new
 * clients/projects created in admin appear on the public site.
 */
export function mergeCmsPortfolioIntoCategories(
  categories: WorkCategory[],
  cmsClients: PortfolioClientRow[],
  cmsVideos: PortfolioVideoRow[],
): WorkCategory[] {
  const videoMap = buildProjectVideoUrlMap(cmsVideos);

  return categories.map((category) => {
    const withUrlOverrides = {
      ...category,
      clients: category.clients.map((client) => mergeClientVideos(client, videoMap)),
    };

    const categoryCmsClients = cmsClients.filter((c) => c.category_slug === category.slug);
    const categoryVideos = cmsVideos.filter((v) => v.category_slug === category.slug);

    const existingSlugs = new Set(withUrlOverrides.clients.map((c) => c.slug));
    const mergedClients = [...withUrlOverrides.clients];

    for (const cmsClient of categoryCmsClients) {
      const clientVideos = categoryVideos.filter(
        (v) => (v.client_slug || slugify(v.client_name)) === cmsClient.slug,
      );

      if (existingSlugs.has(cmsClient.slug)) {
        const index = mergedClients.findIndex((c) => c.slug === cmsClient.slug);
        if (index >= 0) {
          mergedClients[index] = attachCmsProjects(mergedClients[index], clientVideos);
        }
        continue;
      }

      mergedClients.push(cmsClientToWorkClient(cmsClient, clientVideos));
      existingSlugs.add(cmsClient.slug);
    }

    // Videos whose client isn't in portfolio_clients yet (legacy rows)
    const orphansByClient = new Map<string, PortfolioVideoRow[]>();
    for (const video of categoryVideos) {
      const slug = video.client_slug || slugify(video.client_name);
      if (!slug || existingSlugs.has(slug)) continue;
      const list = orphansByClient.get(slug) ?? [];
      list.push(video);
      orphansByClient.set(slug, list);
    }

    for (const [slug, videos] of orphansByClient) {
      const name = videos[0]?.client_name || slug;
      mergedClients.push(
        cmsClientToWorkClient(
          {
            id: slug,
            category_slug: category.slug,
            slug,
            name,
            industry: "",
            description: "",
            logo_url: "",
            banner_url: "",
            sort_order: 999,
            published: true,
            created_at: "",
            updated_at: "",
          },
          videos,
        ),
      );
    }

    return { ...withUrlOverrides, clients: mergedClients };
  });
}

function attachCmsProjects(client: WorkClient, videos: PortfolioVideoRow[]): WorkClient {
  const existingIds = new Set(client.projects.map((p) => p.id));
  const extras = videos
    .map(videoToProject)
    .filter((project) => !existingIds.has(project.id));

  if (extras.length === 0) return client;

  const projects = [...client.projects, ...extras];
  const hero =
    projects.find((p) => p.mediaType === "youtube" || p.mediaType === "vimeo") ?? projects[0];

  return {
    ...client,
    projectCount: projects.length,
    logo: client.logo || hero?.thumbnail || client.logo,
    banner: client.banner || hero?.thumbnail || client.banner,
    projects,
  };
}

function cmsClientToWorkClient(
  cmsClient: PortfolioClientRow,
  videos: PortfolioVideoRow[],
): WorkClient {
  const projects = videos.map(videoToProject);
  const hero =
    projects.find((p) => p.mediaType === "youtube" || p.mediaType === "vimeo") ?? projects[0];

  return {
    slug: cmsClient.slug,
    name: cmsClient.name,
    industry: cmsClient.industry || "Animation",
    description: cmsClient.description || `${cmsClient.name} projects by Starlights Visuals.`,
    projectCount: projects.length,
    logo: cmsClient.logo_url || hero?.thumbnail || PROJECT_PLACEHOLDER,
    banner: cmsClient.banner_url || hero?.thumbnail || PROJECT_PLACEHOLDER,
    services: [],
    timeline: "",
    tools: [],
    projects,
  };
}

function videoToProject(video: PortfolioVideoRow): WorkProject {
  const resolved = resolveVideoEmbed(video.video_url);
  return {
    id: video.project_key || video.id,
    title: video.title,
    description: video.description || "",
    thumbnail: video.thumbnail_url || resolved?.thumbnail || PROJECT_PLACEHOLDER,
    mediaType: resolved?.provider ?? "video",
    mediaSrc: resolved?.watchUrl ?? video.video_url,
    tags: video.tags ?? [],
    year: video.year || new Date().getFullYear(),
  };
}

function mergeClientVideos(client: WorkClient, videoMap: Record<string, string>): WorkClient {
  const projects = client.projects.map((project) => mergeProjectVideo(project, videoMap));
  const hero =
    projects.find((p) => p.mediaType === "youtube" || p.mediaType === "vimeo") ?? projects[0];

  return {
    ...client,
    logo: hero?.thumbnail ?? client.logo,
    banner: hero?.thumbnail ?? client.banner,
    projects,
  };
}

function mergeProjectVideo(project: WorkProject, videoMap: Record<string, string>): WorkProject {
  const override = videoMap[project.id];
  if (!override) return project;

  const resolved = resolveVideoEmbed(override);
  if (resolved) {
    return {
      ...project,
      mediaType: resolved.provider,
      mediaSrc: resolved.watchUrl,
      thumbnail: resolved.thumbnail || project.thumbnail,
    };
  }

  return {
    ...project,
    mediaType: "video",
    mediaSrc: override,
  };
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}
