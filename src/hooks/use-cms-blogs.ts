import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { blogPosts as staticEnglishPosts, type BlogPost, type BlogPostSection } from "@/data/blog-posts";
import { useLocalizedBlogPosts } from "@/hooks/use-localized-blog";
import { resolveBlogImage } from "@/lib/resolve-blog-image";
import {
  getSupabase,
  isSupabaseConfigured,
  type BlogPostRow,
} from "@/lib/supabase";
import {
  ensureCmsTranslationsBatchFn,
  type BlogTranslationFields,
  type CmsTranslationFields,
} from "@/server/cms-translations";

export type CmsBlogPost = BlogPost & { id?: string; featured: boolean };

function formatPublishedDate(value: string | null, locale: string): string {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  try {
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

function normalizeSections(raw: unknown): BlogPostSection[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((section) => {
    const item = section as Partial<BlogPostSection>;
    return {
      heading: typeof item.heading === "string" ? item.heading : undefined,
      paragraphs: Array.isArray(item.paragraphs)
        ? item.paragraphs.filter((p): p is string => typeof p === "string")
        : [],
    };
  });
}

export function mapBlogRowToPost(row: BlogPostRow, locale = "en"): CmsBlogPost {
  const mapped: CmsBlogPost = {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "General",
    date: formatPublishedDate(row.published_at, locale),
    readTime: row.read_time || "5 min read",
    image: "",
    author: row.author || "Starlights Visuals",
    sections: normalizeSections(row.sections),
    featured: Boolean(row.featured),
  };
  mapped.image = resolveBlogImage({
    slug: mapped.slug,
    image: row.image_url || "",
    image_url: row.image_url,
  });
  return mapped;
}

function applyBlogTranslation(
  post: CmsBlogPost,
  fields: Partial<BlogTranslationFields> | CmsTranslationFields | null | undefined,
): CmsBlogPost {
  if (!fields) return post;
  const sections = normalizeSections(fields.sections ?? post.sections);
  return {
    ...post,
    title: typeof fields.title === "string" ? fields.title : post.title,
    excerpt: typeof fields.excerpt === "string" ? fields.excerpt : post.excerpt,
    category: typeof fields.category === "string" ? fields.category : post.category,
    readTime: typeof fields.read_time === "string" ? fields.read_time : post.readTime,
    sections,
  };
}

/** Prefer curated locale JSON when CMS English still matches the static post. */
function applyStaticLocaleFallback(
  post: CmsBlogPost,
  localizedStatic: BlogPost[],
): CmsBlogPost {
  const english = staticEnglishPosts.find((p) => p.slug === post.slug);
  if (!english || english.title !== post.title) return post;
  const localized = localizedStatic.find((p) => p.slug === post.slug);
  if (!localized) return post;
  return {
    ...post,
    title: localized.title,
    excerpt: localized.excerpt,
    category: localized.category,
    readTime: localized.readTime,
    sections: localized.sections,
  };
}

export function useCmsBlogs() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0] ?? "de";
  const localizedStatic = useLocalizedBlogPosts();

  const [cmsPosts, setCmsPosts] = useState<CmsBlogPost[] | null>(null);
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
        const { data, error: queryError } = await getSupabase()
          .from("blog_posts")
          .select(
            "id,slug,title,excerpt,category,published_at,read_time,image_url,author,sections,featured,published,sort_order,created_at,updated_at",
          )
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .order("published_at", { ascending: false });

        if (queryError) throw queryError;
        if (cancelled) return;

        if (!data || data.length === 0) {
          setCmsPosts(null);
          setError(null);
          setLoading(false);
          return;
        }

        const rows = data as BlogPostRow[];
        const mapped = rows.map((row) => {
          const post = mapBlogRowToPost(row, locale);
          return locale === "en" ? post : applyStaticLocaleFallback(post, localizedStatic);
        });

        if (!cancelled) {
          setCmsPosts(mapped);
          setError(null);
          setLoading(false);
        }

        if (locale !== "en") {
          const ids = rows.map((row) => row.id).filter(Boolean);
          try {
            const { fieldsById } = await ensureCmsTranslationsBatchFn({
              data: {
                entityType: "blog_post",
                entityIds: ids,
                locale,
              },
            });
            if (!cancelled) {
              setCmsPosts(
                rows.map((row) => {
                  const base = mapBlogRowToPost(row, locale);
                  const translated = applyBlogTranslation(base, fieldsById[row.id]);
                  // Prefer live CMS translation; fall back to curated static locale copy.
                  if (fieldsById[row.id]) return translated;
                  return applyStaticLocaleFallback(base, localizedStatic);
                }),
              );
            }
          } catch (translateError) {
            console.error("Failed to translate CMS blogs", translateError);
          }
        }
      } catch (err) {
        console.error("Failed to load CMS blogs", err);
        if (!cancelled) {
          setCmsPosts(null);
          setError(err instanceof Error ? err.message : "Failed to load blogs");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const posts = useMemo(() => {
    if (cmsPosts && cmsPosts.length > 0) return cmsPosts;
    return localizedStatic.map((post) => ({ ...post, featured: true }));
  }, [cmsPosts, localizedStatic]);

  const source = cmsPosts && cmsPosts.length > 0 ? ("cms" as const) : ("static" as const);

  return { posts, loading, error, source };
}

export function useCmsBlogPost(slug: string) {
  const { posts, loading, error, source } = useCmsBlogs();
  const post = useMemo(() => posts.find((p) => p.slug === slug), [posts, slug]);
  return { post, loading, error, source };
}

export function useFeaturedCmsBlogs(limit = 3) {
  const { posts, loading, error, source } = useCmsBlogs();
  const featured = useMemo(() => {
    const featuredOnly = posts.filter((p) => p.featured);
    const pool = featuredOnly.length > 0 ? featuredOnly : posts;
    return pool.slice(0, limit);
  }, [posts, limit]);

  return { posts: featured, loading, error, source };
}
