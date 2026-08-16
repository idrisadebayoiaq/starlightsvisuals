import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { BlogPostSection } from "@/data/blog-posts";
import { DEFAULT_LANGUAGE, supportedLanguageCodes } from "@/i18n/languages";
import {
  assertAdminFromAccessToken,
  getAuthedSupabase,
  getServerSupabaseAnon,
} from "@/lib/supabase-admin.server";
import { isManualTranslation, SITE_COPY_ENTITY_ID, withManualFlag } from "@/lib/translation-utils";
import { translateText } from "@/lib/translate.server";

export type CmsEntityType =
  | "blog_post"
  | "portfolio_video"
  | "portfolio_client"
  | "portfolio_category"
  | "testimonial"
  | "site_copy";

/** JSON-safe translation payload for TanStack Start server functions. */
export type CmsTranslationFields = {
  title?: string;
  excerpt?: string;
  category?: string;
  read_time?: string;
  description?: string;
  industry?: string;
  tagline?: string;
  showcase_tag?: string;
  sections?: BlogPostSection[];
  /** Testimonial fields */
  headline?: string;
  quote?: string;
  name?: string;
  role?: string;
  company?: string;
  /** Full nested i18n override for site chrome / legal / marketing copy */
  copy?: Record<string, unknown>;
  __manual?: boolean;
  __manualAt?: string;
};

export type BlogTranslationFields = {
  title: string;
  excerpt: string;
  category: string;
  read_time: string;
  sections: BlogPostSection[];
};

export type VideoTranslationFields = {
  title: string;
  description: string;
};

export type ClientTranslationFields = {
  industry: string;
  description: string;
};

export type CategoryTranslationFields = {
  title: string;
  tagline: string;
  description: string;
  showcase_tag: string;
};

export type TestimonialTranslationFields = {
  headline: string;
  quote: string;
  name: string;
  role: string;
  company: string;
};

async function upsertTranslation(
  entityType: CmsEntityType,
  entityId: string,
  locale: string,
  fields: CmsTranslationFields,
) {
  const { error } = await getServerSupabaseAnon().rpc("upsert_cms_translation", {
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_locale: locale,
    p_fields: fields,
  });
  if (error) {
    console.error("[cms-translations] upsert failed", error);
    throw new Error(error.message || "Failed to store translation");
  }
}

async function getTranslation(
  entityType: CmsEntityType,
  entityId: string,
  locale: string,
): Promise<CmsTranslationFields | null> {
  const { data, error } = await getServerSupabaseAnon()
    .from("cms_translations")
    .select("fields")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("locale", locale)
    .maybeSingle();

  if (error) {
    console.error("[cms-translations] load failed", error);
    return null;
  }
  return (data?.fields as CmsTranslationFields | undefined) ?? null;
}

async function deleteTranslation(
  accessToken: string,
  entityType: CmsEntityType,
  entityId: string,
  locale: string,
) {
  const { error } = await getAuthedSupabase(accessToken)
    .from("cms_translations")
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("locale", locale);

  if (error) {
    console.error("[cms-translations] delete failed", error);
    throw new Error(error.message || "Failed to clear translation");
  }
}

/** Skip machine overwrite when an admin has curated this locale. */
async function upsertUnlessManual(
  entityType: CmsEntityType,
  entityId: string,
  locale: string,
  fields: CmsTranslationFields,
) {
  const existing = await getTranslation(entityType, entityId, locale);
  if (isManualTranslation(existing)) {
    return { skipped: true as const };
  }
  await upsertTranslation(entityType, entityId, locale, fields);
  return { skipped: false as const };
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

async function translateBlogFields(
  source: BlogTranslationFields,
  locale: string,
): Promise<BlogTranslationFields> {
  const title = await translateText(source.title, locale);
  const excerpt = await translateText(source.excerpt, locale);
  const category = await translateText(source.category, locale);
  const read_time = await translateText(source.read_time, locale);

  const sections: BlogPostSection[] = [];
  for (const section of source.sections) {
    const heading = section.heading ? await translateText(section.heading, locale) : undefined;
    const paragraphs: string[] = [];
    for (const paragraph of section.paragraphs) {
      paragraphs.push(await translateText(paragraph, locale));
    }
    sections.push({ heading, paragraphs });
  }

  return { title, excerpt, category, read_time, sections };
}

async function translateVideoFields(
  source: VideoTranslationFields,
  locale: string,
): Promise<VideoTranslationFields> {
  return {
    title: await translateText(source.title, locale),
    description: await translateText(source.description, locale),
  };
}

async function translateClientFields(
  source: ClientTranslationFields,
  locale: string,
): Promise<ClientTranslationFields> {
  return {
    industry: await translateText(source.industry, locale),
    description: await translateText(source.description, locale),
  };
}

async function translateCategoryFields(
  source: CategoryTranslationFields,
  locale: string,
): Promise<CategoryTranslationFields> {
  return {
    title: await translateText(source.title, locale),
    tagline: await translateText(source.tagline, locale),
    description: await translateText(source.description, locale),
    showcase_tag: await translateText(source.showcase_tag, locale),
  };
}

async function translateTestimonialFields(
  source: TestimonialTranslationFields,
  locale: string,
): Promise<TestimonialTranslationFields> {
  return {
    headline: await translateText(source.headline, locale),
    quote: await translateText(source.quote, locale),
    name: source.name,
    role: await translateText(source.role, locale),
    company: source.company,
  };
}

function priorityLocales(requested?: string[]): string[] {
  const base = requested?.length
    ? requested
    : [DEFAULT_LANGUAGE, "fr", "es", "it", "nl", "pl", "pt", "tr", "ar", "ja", "zh", "ru"];
  return [...new Set(base.map((l) => l.split("-")[0]!.toLowerCase()))].filter(
    (l) => l !== "en" && supportedLanguageCodes.includes(l),
  );
}

async function ensureOne(
  entityType:
    | "blog_post"
    | "portfolio_video"
    | "portfolio_client"
    | "portfolio_category"
    | "testimonial",
  entityId: string,
  localeRaw: string,
): Promise<{ cached: boolean; fields: CmsTranslationFields | null }> {
  const locale = localeRaw.split("-")[0]!.toLowerCase();
  if (locale === "en") {
    return { cached: true, fields: null };
  }

  const existing = await getTranslation(entityType, entityId, locale);
  if (existing) {
    return { cached: true, fields: existing };
  }

  const supabase = getServerSupabaseAnon();

  if (entityType === "blog_post") {
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("id,title,excerpt,category,read_time,sections")
      .eq("id", entityId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Blog post not found");

    const source: BlogTranslationFields = {
      title: row.title,
      excerpt: row.excerpt ?? "",
      category: row.category ?? "General",
      read_time: row.read_time || "5 min read",
      sections: normalizeSections(row.sections),
    };
    const fields = await translateBlogFields(source, locale);
    await upsertTranslation("blog_post", row.id, locale, fields);
    return { cached: false, fields };
  }

  if (entityType === "portfolio_video") {
    const { data: row, error } = await supabase
      .from("portfolio_videos")
      .select("id,title,description")
      .eq("id", entityId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Video not found");

    const fields = await translateVideoFields(
      { title: row.title, description: row.description ?? "" },
      locale,
    );
    await upsertTranslation("portfolio_video", row.id, locale, fields);
    return { cached: false, fields };
  }

  if (entityType === "portfolio_category") {
    const { data: row, error } = await supabase
      .from("portfolio_categories")
      .select("id,title,tagline,description,showcase_tag")
      .eq("id", entityId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Category not found");

    const fields = await translateCategoryFields(
      {
        title: row.title,
        tagline: row.tagline ?? "",
        description: row.description ?? "",
        showcase_tag: row.showcase_tag || row.title,
      },
      locale,
    );
    await upsertTranslation("portfolio_category", row.id, locale, fields);
    return { cached: false, fields };
  }

  if (entityType === "testimonial") {
    const { data: row, error } = await supabase
      .from("client_testimonials")
      .select("id,headline,quote,name,role,company")
      .eq("id", entityId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Testimonial not found");

    const fields = await translateTestimonialFields(
      {
        headline: row.headline ?? "",
        quote: row.quote ?? "",
        name: row.name ?? "",
        role: row.role ?? "",
        company: row.company ?? "",
      },
      locale,
    );
    await upsertTranslation("testimonial", row.id, locale, fields);
    return { cached: false, fields };
  }

  const { data: row, error } = await supabase
    .from("portfolio_clients")
    .select("id,industry,description")
    .eq("id", entityId)
    .maybeSingle();
  if (error || !row) throw new Error(error?.message || "Client not found");

  const fields = await translateClientFields(
    { industry: row.industry ?? "", description: row.description ?? "" },
    locale,
  );
  await upsertTranslation("portfolio_client", row.id, locale, fields);
  return { cached: false, fields };
}

export const syncBlogTranslationsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        postId: z.string().uuid(),
        locales: z.array(z.string()).optional(),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const supabase = getServerSupabaseAnon();
    const { data: row, error } = await supabase
      .from("blog_posts")
      .select("id,title,excerpt,category,read_time,sections")
      .eq("id", data.postId)
      .maybeSingle();

    if (error || !row) {
      console.error("[cms-translations] blog load failed", error);
      throw new Error(error?.message || "Blog post not found");
    }

    const source: BlogTranslationFields = {
      title: row.title,
      excerpt: row.excerpt ?? "",
      category: row.category ?? "General",
      read_time: row.read_time || "5 min read",
      sections: normalizeSections(row.sections),
    };

    await upsertTranslation("blog_post", row.id, "en", source);

    const locales = priorityLocales(data.locales);
    let translated = 0;
    let skipped = 0;
    for (const locale of locales) {
      try {
        const fields = await translateBlogFields(source, locale);
        const result = await upsertUnlessManual("blog_post", row.id, locale, fields);
        if (result.skipped) skipped += 1;
        else translated += 1;
      } catch (err) {
        console.error("[cms-translations] blog locale failed", locale, err);
      }
    }

    return { ok: true as const, translated, skipped, locales: locales.length };
  });

export const ensureCmsTranslationFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        entityType: z.enum([
          "blog_post",
          "portfolio_video",
          "portfolio_client",
          "portfolio_category",
          "testimonial",
        ]),
        entityId: z.string().uuid(),
        locale: z.string().min(2).max(8),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const result = await ensureOne(data.entityType, data.entityId, data.locale);
    return { ok: true as const, ...result };
  });

export const ensureCmsTranslationsBatchFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        entityType: z.enum([
          "blog_post",
          "portfolio_video",
          "portfolio_client",
          "portfolio_category",
          "testimonial",
        ]),
        entityIds: z.array(z.string().uuid()).max(40),
        locale: z.string().min(2).max(8),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const locale = data.locale.split("-")[0]!.toLowerCase();
    if (locale === "en" || data.entityIds.length === 0) {
      return { ok: true as const, fieldsById: {} as Record<string, CmsTranslationFields> };
    }

    const supabase = getServerSupabaseAnon();
    const { data: existingRows, error } = await supabase
      .from("cms_translations")
      .select("entity_id,fields")
      .eq("entity_type", data.entityType)
      .eq("locale", locale)
      .in("entity_id", data.entityIds);

    if (error) {
      console.error("[cms-translations] batch load failed", error);
    }

    const fieldsById: Record<string, CmsTranslationFields> = {};
    for (const row of existingRows ?? []) {
      fieldsById[row.entity_id as string] = row.fields as CmsTranslationFields;
    }

    const missing = data.entityIds.filter((id) => !fieldsById[id]);
    for (const entityId of missing) {
      try {
        const result = await ensureOne(data.entityType, entityId, locale);
        if (result.fields) fieldsById[entityId] = result.fields;
      } catch (err) {
        console.error("[cms-translations] batch ensure failed", entityId, err);
      }
    }

    return { ok: true as const, fieldsById };
  });

export const syncVideoTranslationsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        videoId: z.string().uuid(),
        locales: z.array(z.string()).optional(),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const supabase = getServerSupabaseAnon();
    const { data: row, error } = await supabase
      .from("portfolio_videos")
      .select("id,title,description")
      .eq("id", data.videoId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Video not found");

    const source: VideoTranslationFields = {
      title: row.title,
      description: row.description ?? "",
    };
    await upsertTranslation("portfolio_video", row.id, "en", source);

    let translated = 0;
    let skipped = 0;
    for (const locale of priorityLocales(data.locales)) {
      try {
        const fields = await translateVideoFields(source, locale);
        const result = await upsertUnlessManual("portfolio_video", row.id, locale, fields);
        if (result.skipped) skipped += 1;
        else translated += 1;
      } catch (err) {
        console.error("[cms-translations] video locale failed", locale, err);
      }
    }
    return { ok: true as const, translated, skipped };
  });

export const syncClientTranslationsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        clientId: z.string().uuid(),
        locales: z.array(z.string()).optional(),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const supabase = getServerSupabaseAnon();
    const { data: row, error } = await supabase
      .from("portfolio_clients")
      .select("id,industry,description")
      .eq("id", data.clientId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Client not found");

    const source: ClientTranslationFields = {
      industry: row.industry ?? "",
      description: row.description ?? "",
    };
    await upsertTranslation("portfolio_client", row.id, "en", source);

    let translated = 0;
    let skipped = 0;
    for (const locale of priorityLocales(data.locales)) {
      try {
        const fields = await translateClientFields(source, locale);
        const result = await upsertUnlessManual("portfolio_client", row.id, locale, fields);
        if (result.skipped) skipped += 1;
        else translated += 1;
      } catch (err) {
        console.error("[cms-translations] client locale failed", locale, err);
      }
    }
    return { ok: true as const, translated, skipped };
  });

export const syncCategoryTranslationsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        categoryId: z.string().uuid(),
        locales: z.array(z.string()).optional(),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const supabase = getServerSupabaseAnon();
    const { data: row, error } = await supabase
      .from("portfolio_categories")
      .select("id,title,tagline,description,showcase_tag")
      .eq("id", data.categoryId)
      .maybeSingle();
    if (error || !row) throw new Error(error?.message || "Category not found");

    const source: CategoryTranslationFields = {
      title: row.title,
      tagline: row.tagline ?? "",
      description: row.description ?? "",
      showcase_tag: row.showcase_tag || row.title,
    };
    await upsertTranslation("portfolio_category", row.id, "en", source);

    let translated = 0;
    let skipped = 0;
    for (const locale of priorityLocales(data.locales)) {
      try {
        const fields = await translateCategoryFields(source, locale);
        const result = await upsertUnlessManual("portfolio_category", row.id, locale, fields);
        if (result.skipped) skipped += 1;
        else translated += 1;
      } catch (err) {
        console.error("[cms-translations] category locale failed", locale, err);
      }
    }
    return { ok: true as const, translated, skipped };
  });

const entityTypeSchema = z.enum([
  "blog_post",
  "portfolio_video",
  "portfolio_client",
  "portfolio_category",
  "testimonial",
  "site_copy",
]);

/** Public read of saved site-copy overrides for a locale (anon-safe). */
export const getPublicSiteCopyFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z.object({ locale: z.string().min(2).max(8) }).safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    const locale = data.locale.split("-")[0]!.toLowerCase();
    const fields = await getTranslation("site_copy", SITE_COPY_ENTITY_ID, locale);
    const copy =
      fields?.copy && typeof fields.copy === "object"
        ? (fields.copy as Record<string, unknown>)
        : null;
    return {
      ok: true as const,
      manual: isManualTranslation(fields),
      copy,
    };
  });

/** Admin: load a translation row (manual or machine). */
export const getAdminTranslationFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        accessToken: z.string().min(1),
        entityType: entityTypeSchema,
        entityId: z.string().uuid(),
        locale: z.string().min(2).max(8),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    await assertAdminFromAccessToken(data.accessToken);
    const locale = data.locale.split("-")[0]!.toLowerCase();
    const entityId = data.entityType === "site_copy" ? SITE_COPY_ENTITY_ID : data.entityId;
    const fields = await getTranslation(data.entityType, entityId, locale);
    return {
      ok: true as const,
      fields,
      manual: isManualTranslation(fields),
    };
  });

/** Admin: save curated translation and mark it so sync will not overwrite. */
export const saveAdminTranslationFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        accessToken: z.string().min(1),
        entityType: entityTypeSchema,
        entityId: z.string().uuid(),
        locale: z.string().min(2).max(8),
        fields: z.record(z.unknown()),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    await assertAdminFromAccessToken(data.accessToken);
    const locale = data.locale.split("-")[0]!.toLowerCase();
    if (!supportedLanguageCodes.includes(locale)) {
      throw new Error("Unsupported language");
    }
    const entityId = data.entityType === "site_copy" ? SITE_COPY_ENTITY_ID : data.entityId;
    const payload = withManualFlag(data.fields as Record<string, unknown>) as CmsTranslationFields;
    await upsertTranslation(data.entityType, entityId, locale, payload);
    return { ok: true as const, manual: true as const };
  });

/** Admin: clear curated override so bundled / machine copy can take over again. */
export const clearAdminTranslationFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const parsed = z
      .object({
        accessToken: z.string().min(1),
        entityType: entityTypeSchema,
        entityId: z.string().uuid(),
        locale: z.string().min(2).max(8),
      })
      .safeParse(data);
    if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid request");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    await assertAdminFromAccessToken(data.accessToken);
    const locale = data.locale.split("-")[0]!.toLowerCase();
    const entityId = data.entityType === "site_copy" ? SITE_COPY_ENTITY_ID : data.entityId;
    await deleteTranslation(data.accessToken, data.entityType, entityId, locale);
    return { ok: true as const };
  });
