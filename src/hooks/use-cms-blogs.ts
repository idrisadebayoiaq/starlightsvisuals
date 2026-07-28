import { useEffect, useMemo, useState } from "react";

import {
  blogPosts as staticPosts,
  type BlogPost,
  type BlogPostSection,
} from "@/data/blog-posts";
import { resolveBlogImage } from "@/lib/resolve-blog-image";
import {
  getSupabase,
  isSupabaseConfigured,
  type BlogPostRow,
} from "@/lib/supabase";

export type CmsBlogPost = BlogPost & { featured: boolean };

function formatPublishedDate(value: string | null): string {
  if (!value) return "";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

export function mapBlogRowToPost(row: BlogPostRow): CmsBlogPost {
  const mapped: CmsBlogPost = {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "General",
    date: formatPublishedDate(row.published_at),
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

function staticAsCms(): CmsBlogPost[] {
  return staticPosts.map((post) => ({ ...post, featured: true }));
}

export function useCmsBlogs() {
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
        } else {
          setCmsPosts((data as BlogPostRow[]).map(mapBlogRowToPost));
        }
        setError(null);
      } catch (err) {
        console.error("Failed to load CMS blogs", err);
        if (!cancelled) {
          setCmsPosts(null);
          setError(err instanceof Error ? err.message : "Failed to load blogs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const posts = useMemo(() => {
    if (cmsPosts && cmsPosts.length > 0) return cmsPosts;
    return staticAsCms();
  }, [cmsPosts]);

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
