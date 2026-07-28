import { useEffect, useMemo, useState } from "react";

import {
  getSupabase,
  isSupabaseConfigured,
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
