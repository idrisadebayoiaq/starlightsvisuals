import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { workCategories as staticCategories } from "@/data/portfolio-works";
import { PROJECT_PLACEHOLDER } from "@/data/portfolio-placeholder";
import {
  getSupabase,
  isSupabaseConfigured,
  type PortfolioCategoryRow,
} from "@/lib/supabase";
import { ensureCmsTranslationsBatchFn, type CmsTranslationFields } from "@/server/cms-translations";
import type { WorkCategory } from "@/types/portfolio-works";

const BATCH_SIZE = 40;

function applyCategoryTranslation(
  row: PortfolioCategoryRow,
  fields: CmsTranslationFields | null | undefined,
): PortfolioCategoryRow {
  if (!fields) return row;
  return {
    ...row,
    title: typeof fields.title === "string" ? fields.title : row.title,
    tagline: typeof fields.tagline === "string" ? fields.tagline : row.tagline,
    description: typeof fields.description === "string" ? fields.description : row.description,
    showcase_tag:
      typeof fields.showcase_tag === "string" ? fields.showcase_tag : row.showcase_tag,
  };
}

async function translateCategoryRows(
  rows: PortfolioCategoryRow[],
  locale: string,
): Promise<PortfolioCategoryRow[]> {
  if (locale === "en" || rows.length === 0) return rows;
  const fieldsById: Record<string, CmsTranslationFields> = {};
  try {
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE).map((r) => r.id);
      const { fieldsById: chunkFields } = await ensureCmsTranslationsBatchFn({
        data: { entityType: "portfolio_category", entityIds: chunk, locale },
      });
      Object.assign(fieldsById, chunkFields);
    }
    return rows.map((row) => applyCategoryTranslation(row, fieldsById[row.id]));
  } catch (err) {
    console.error("Failed to translate CMS categories", err);
    return rows;
  }
}

/**
 * Overlay CMS category metadata onto the static catalog (and append new CMS-only categories).
 * When CMS has published rows, CMS order/title/cover win; static clients stay attached by slug.
 */
export function mergeCmsCategoryCatalog(
  staticCats: WorkCategory[],
  cmsCategories: PortfolioCategoryRow[],
): WorkCategory[] {
  if (cmsCategories.length === 0) return staticCats;

  const staticBySlug = new Map(staticCats.map((c) => [c.slug, c]));
  return cmsCategories.map((cms) => {
    const base = staticBySlug.get(cms.slug);
    return {
      slug: cms.slug,
      title: cms.title || base?.title || cms.slug,
      tagline: cms.tagline || base?.tagline || "",
      description: cms.description || base?.description || "",
      coverImage: cms.cover_image_url || base?.coverImage || PROJECT_PLACEHOLDER,
      clients: base?.clients ?? [],
    };
  });
}

export function useCmsCategories(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "de";
  const [categories, setCategories] = useState<PortfolioCategoryRow[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        let query = getSupabase()
          .from("portfolio_categories")
          .select(
            "id,slug,title,tagline,description,cover_image_url,showcase_tag,sort_order,published,created_at,updated_at",
          )
          .order("sort_order", { ascending: true })
          .order("title", { ascending: true });

        if (!includeDrafts) {
          query = query.eq("published", true);
        }

        const { data, error: queryError } = await query;
        if (queryError) throw queryError;
        const rows = (data as PortfolioCategoryRow[]) ?? [];

        if (!cancelled) {
          setCategories(rows);
          setError(null);
          setLoading(false);
        }

        if (!includeDrafts && locale !== "en" && rows.length > 0) {
          const localized = await translateCategoryRows(rows, locale);
          if (!cancelled) setCategories(localized);
        }
      } catch (err) {
        console.error("Failed to load CMS categories", err);
        if (!cancelled) {
          setCategories([]);
          setError(err instanceof Error ? err.message : "Failed to load categories");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [includeDrafts, locale]);

  return { categories, loading, error };
}

export async function fetchPublishedCategoryBySlug(
  slug: string,
): Promise<WorkCategory | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  try {
    const { data, error } = await getSupabase()
      .from("portfolio_categories")
      .select(
        "id,slug,title,tagline,description,cover_image_url,showcase_tag,sort_order,published,created_at,updated_at",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return undefined;
    const row = data as PortfolioCategoryRow;
    const base = staticCategories.find((c) => c.slug === row.slug);
    return {
      slug: row.slug,
      title: row.title,
      tagline: row.tagline,
      description: row.description,
      coverImage: row.cover_image_url || base?.coverImage || PROJECT_PLACEHOLDER,
      clients: base?.clients ?? [],
    };
  } catch {
    return undefined;
  }
}
