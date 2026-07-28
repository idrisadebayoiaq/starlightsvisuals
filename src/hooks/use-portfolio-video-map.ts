import { useEffect, useState } from "react";

import { buildProjectVideoUrlMap } from "@/hooks/use-cms-videos";
import { getSupabase, isSupabaseConfigured, type PortfolioVideoRow } from "@/lib/supabase";

/** Fetches published portfolio video URLs keyed by project_key. */
export function usePortfolioVideoMap() {
  const [map, setMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("portfolio_videos")
          .select("project_key,video_url,published")
          .eq("published", true)
          .not("project_key", "is", null);

        if (error) throw error;
        if (!cancelled) {
          setMap(buildProjectVideoUrlMap((data as PortfolioVideoRow[]) ?? []));
        }
      } catch (err) {
        console.error("Failed to load portfolio video map", err);
        if (!cancelled) setMap({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { map, loading };
}
