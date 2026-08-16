import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/auth-context";
import { supportedLanguages } from "@/i18n/languages";
import { getErrorMessage } from "@/lib/error-message";
import {
  getSupabase,
  isSupabaseConfigured,
  type BlogPostRow,
  type ClientTestimonialRow,
} from "@/lib/supabase";
import {
  deepMerge,
  flattenLocale,
  SITE_COPY_ENTITY_ID,
  unflattenLocale,
  type FlatEntry,
} from "@/lib/translation-utils";
import { cn } from "@/lib/utils";
import {
  clearAdminTranslationFn,
  getAdminTranslationFn,
  saveAdminTranslationFn,
  type CmsEntityType,
} from "@/server/cms-translations";

export const Route = createFileRoute("/admin/translations")({
  component: AdminTranslationsPage,
});

type ContentType =
  | "site_copy"
  | "blog_post"
  | "portfolio_category"
  | "portfolio_video"
  | "portfolio_client"
  | "testimonial";

type SelectItem = { id: string; label: string };

const CONTENT_TYPES: ContentType[] = [
  "site_copy",
  "blog_post",
  "portfolio_category",
  "portfolio_video",
  "portfolio_client",
  "testimonial",
];

const localeLoaders: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  de: () => import("@/locales/de/common.json"),
  en: () => import("@/locales/en/common.json"),
  fr: () => import("@/locales/fr/common.json"),
  es: () => import("@/locales/es/common.json"),
  ar: () => import("@/locales/ar/common.json"),
  ko: () => import("@/locales/ko/common.json"),
  pt: () => import("@/locales/pt/common.json"),
  it: () => import("@/locales/it/common.json"),
  ja: () => import("@/locales/ja/common.json"),
  zh: () => import("@/locales/zh/common.json"),
  ru: () => import("@/locales/ru/common.json"),
  nl: () => import("@/locales/nl/common.json"),
  pl: () => import("@/locales/pl/common.json"),
  tr: () => import("@/locales/tr/common.json"),
  hi: () => import("@/locales/hi/common.json"),
  sv: () => import("@/locales/sv/common.json"),
  da: () => import("@/locales/da/common.json"),
  no: () => import("@/locales/no/common.json"),
  fi: () => import("@/locales/fi/common.json"),
  id: () => import("@/locales/id/common.json"),
  th: () => import("@/locales/th/common.json"),
  vi: () => import("@/locales/vi/common.json"),
  he: () => import("@/locales/he/common.json"),
  uk: () => import("@/locales/uk/common.json"),
  cs: () => import("@/locales/cs/common.json"),
};

async function loadBundledLocale(code: string): Promise<Record<string, unknown>> {
  const loader = localeLoaders[code];
  if (!loader) return {};
  const mod = await loader();
  return (mod.default ?? mod) as Record<string, unknown>;
}

function AdminTranslationsPage() {
  const { t } = useTranslation();
  const { session } = useAuth();
  const accessToken = session?.access_token ?? "";

  const [locale, setLocale] = useState("de");
  const [contentType, setContentType] = useState<ContentType>("site_copy");
  const [items, setItems] = useState<SelectItem[]>([]);
  const [itemId, setItemId] = useState(SITE_COPY_ENTITY_ID);
  const [entries, setEntries] = useState<FlatEntry[]>([]);
  const [search, setSearch] = useState("");
  const [manual, setManual] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingFields, setLoadingFields] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (entry) => entry.path.toLowerCase().includes(q) || entry.value.toLowerCase().includes(q),
    );
  }, [entries, search]);

  const loadItems = useCallback(async () => {
    if (contentType === "site_copy") {
      setItems([{ id: SITE_COPY_ENTITY_ID, label: t("admin.translations.types.site_copy") }]);
      setItemId(SITE_COPY_ENTITY_ID);
      return;
    }

    if (!isSupabaseConfigured()) {
      setItems([]);
      return;
    }

    setLoadingItems(true);
    setError(null);
    try {
      const supabase = getSupabase();
      let next: SelectItem[] = [];

      if (contentType === "blog_post") {
        const { data, error: queryError } = await supabase
          .from("blog_posts")
          .select("id,title,slug")
          .order("sort_order", { ascending: true });
        if (queryError) throw queryError;
        next = ((data as BlogPostRow[]) ?? []).map((row) => ({
          id: row.id,
          label: row.title || row.slug,
        }));
      } else if (contentType === "portfolio_category") {
        const { data, error: queryError } = await supabase
          .from("portfolio_categories")
          .select("id,title,slug")
          .order("sort_order", { ascending: true });
        if (queryError) throw queryError;
        next = (data ?? []).map((row: { id: string; title: string; slug: string }) => ({
          id: row.id,
          label: row.title || row.slug,
        }));
      } else if (contentType === "portfolio_video") {
        const { data, error: queryError } = await supabase
          .from("portfolio_videos")
          .select("id,title")
          .order("sort_order", { ascending: true });
        if (queryError) throw queryError;
        next = (data ?? []).map((row: { id: string; title: string }) => ({
          id: row.id,
          label: row.title,
        }));
      } else if (contentType === "portfolio_client") {
        const { data, error: queryError } = await supabase
          .from("portfolio_clients")
          .select("id,name")
          .order("name", { ascending: true });
        if (queryError) throw queryError;
        next = (data ?? []).map((row: { id: string; name: string }) => ({
          id: row.id,
          label: row.name,
        }));
      } else {
        const { data, error: queryError } = await supabase
          .from("client_testimonials")
          .select("id,name,headline,status")
          .order("created_at", { ascending: false });
        if (queryError) throw queryError;
        next = ((data as ClientTestimonialRow[]) ?? []).map((row) => ({
          id: row.id,
          label: `${row.name} — ${row.headline || row.status}`,
        }));
      }

      setItems(next);
      setItemId(next[0]?.id ?? "");
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.translations.loadError")));
      setItems([]);
      setItemId("");
    } finally {
      setLoadingItems(false);
    }
  }, [contentType, t]);

  const loadFields = useCallback(async () => {
    if (!itemId) {
      setEntries([]);
      return;
    }

    setLoadingFields(true);
    setError(null);
    setMessage(null);

    try {
      if (contentType === "site_copy") {
        const bundled = await loadBundledLocale(locale);
        let override: Record<string, unknown> | null = null;
        let isManual = false;

        if (accessToken) {
          const result = await getAdminTranslationFn({
            data: {
              accessToken,
              entityType: "site_copy",
              entityId: SITE_COPY_ENTITY_ID,
              locale,
            },
          });
          isManual = Boolean(result.manual);
          if (result.fields?.copy && typeof result.fields.copy === "object") {
            override = result.fields.copy as Record<string, unknown>;
          }
        }

        const merged = override ? deepMerge(bundled, override) : bundled;
        setEntries(flattenLocale(merged));
        setManual(isManual);
        return;
      }

      if (!accessToken) {
        setError(t("admin.translations.authRequired"));
        setEntries([]);
        return;
      }

      const supabase = getSupabase();
      let englishDefaults: Record<string, unknown> = {};

      if (contentType === "blog_post") {
        const { data, error: queryError } = await supabase
          .from("blog_posts")
          .select("title,excerpt,category,read_time,sections")
          .eq("id", itemId)
          .maybeSingle();
        if (queryError) throw queryError;
        englishDefaults = {
          title: data?.title ?? "",
          excerpt: data?.excerpt ?? "",
          category: data?.category ?? "",
          read_time: data?.read_time ?? "",
          sections: data?.sections ?? [],
        };
      } else if (contentType === "portfolio_category") {
        const { data, error: queryError } = await supabase
          .from("portfolio_categories")
          .select("title,tagline,description,showcase_tag")
          .eq("id", itemId)
          .maybeSingle();
        if (queryError) throw queryError;
        englishDefaults = {
          title: data?.title ?? "",
          tagline: data?.tagline ?? "",
          description: data?.description ?? "",
          showcase_tag: data?.showcase_tag ?? "",
        };
      } else if (contentType === "portfolio_video") {
        const { data, error: queryError } = await supabase
          .from("portfolio_videos")
          .select("title,description")
          .eq("id", itemId)
          .maybeSingle();
        if (queryError) throw queryError;
        englishDefaults = {
          title: data?.title ?? "",
          description: data?.description ?? "",
        };
      } else if (contentType === "portfolio_client") {
        const { data, error: queryError } = await supabase
          .from("portfolio_clients")
          .select("industry,description")
          .eq("id", itemId)
          .maybeSingle();
        if (queryError) throw queryError;
        englishDefaults = {
          industry: data?.industry ?? "",
          description: data?.description ?? "",
        };
      } else {
        const { data, error: queryError } = await supabase
          .from("client_testimonials")
          .select("headline,quote,name,role,company")
          .eq("id", itemId)
          .maybeSingle();
        if (queryError) throw queryError;
        englishDefaults = {
          headline: data?.headline ?? "",
          quote: data?.quote ?? "",
          name: data?.name ?? "",
          role: data?.role ?? "",
          company: data?.company ?? "",
        };
      }

      const result = await getAdminTranslationFn({
        data: {
          accessToken,
          entityType: contentType as CmsEntityType,
          entityId: itemId,
          locale,
        },
      });

      const saved = result.fields
        ? Object.fromEntries(
            Object.entries(result.fields).filter(
              ([key]) => key !== "__manual" && key !== "__manualAt" && key !== "copy",
            ),
          )
        : null;

      const merged = saved ? deepMerge(englishDefaults, saved) : englishDefaults;
      setEntries(flattenLocale(merged));
      setManual(Boolean(result.manual));
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.translations.loadError")));
      setEntries([]);
    } finally {
      setLoadingFields(false);
    }
  }, [accessToken, contentType, itemId, locale, t]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    void loadFields();
  }, [loadFields]);

  function updateEntry(path: string, value: string) {
    setEntries((prev) => prev.map((entry) => (entry.path === path ? { ...entry, value } : entry)));
  }

  async function onSave() {
    if (!accessToken) {
      setError(t("admin.translations.authRequired"));
      return;
    }

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const nested = unflattenLocale(entries);
      const fields =
        contentType === "site_copy" ? { copy: nested } : (nested as Record<string, unknown>);

      await saveAdminTranslationFn({
        data: {
          accessToken,
          entityType: contentType as CmsEntityType,
          entityId: contentType === "site_copy" ? SITE_COPY_ENTITY_ID : itemId,
          locale,
          fields,
        },
      });

      setManual(true);
      setMessage(t("admin.translations.saved"));
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.translations.saveError")));
    } finally {
      setSaving(false);
    }
  }

  async function onReset() {
    if (!accessToken) {
      setError(t("admin.translations.authRequired"));
      return;
    }
    if (!window.confirm(t("admin.translations.resetConfirm"))) return;

    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await clearAdminTranslationFn({
        data: {
          accessToken,
          entityType: contentType as CmsEntityType,
          entityId: contentType === "site_copy" ? SITE_COPY_ENTITY_ID : itemId,
          locale,
        },
      });
      setManual(false);
      await loadFields();
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.translations.clearError")));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
          {t("admin.translations.title")}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {t("admin.translations.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 rounded-xl border border-border/60 bg-card/40 p-4 md:grid-cols-2 lg:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            {t("admin.translations.language")}
          </span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeLabel} ({lang.label})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            {t("admin.translations.contentType")}
          </span>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2"
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`admin.translations.types.${type}`)}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
            {t("admin.translations.selectItem")}
          </span>
          <select
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            disabled={loadingItems || contentType === "site_copy" || items.length === 0}
            className="w-full rounded-md border border-border/60 bg-background px-3 py-2 disabled:opacity-60"
          >
            {items.length === 0 ? (
              <option value="">{t("admin.translations.noItems")}</option>
            ) : (
              items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))
            )}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            manual ? "bg-neon-green/15 text-neon-green" : "bg-muted/50 text-muted-foreground",
          )}
        >
          {manual ? t("admin.translations.manualBadge") : t("admin.translations.autoBadge")}
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("admin.translations.search")}
          className="min-w-[220px] flex-1 rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => void onReset()}
          disabled={saving || !manual}
          className="rounded-md border border-border/60 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-40"
        >
          {t("admin.translations.reset")}
        </button>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving || entries.length === 0}
          className="rounded-md bg-neon-green px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40"
        >
          {saving ? t("admin.translations.saving") : t("admin.translations.save")}
        </button>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-neon-green">{message}</p> : null}
      <p className="text-xs text-muted-foreground">{t("admin.translations.fieldsHint")}</p>

      {loadingItems || loadingFields ? (
        <p className="text-sm text-muted-foreground">
          {loadingItems
            ? t("admin.translations.loadingItems")
            : t("admin.translations.loadingFields")}
        </p>
      ) : (
        <div className="max-h-[70vh] space-y-4 overflow-y-auto rounded-xl border border-border/60 bg-card/30 p-4">
          {filteredEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("admin.translations.noItems")}</p>
          ) : (
            filteredEntries.map((entry) => {
              const long = entry.value.length > 120 || entry.value.includes("\n");
              return (
                <label key={entry.path} className="block space-y-1.5">
                  <span className="font-mono text-[11px] text-neon-green/90">{entry.path}</span>
                  {long ? (
                    <textarea
                      value={entry.value}
                      onChange={(e) => updateEntry(entry.path, e.target.value)}
                      rows={Math.min(10, Math.max(3, entry.value.split("\n").length + 1))}
                      className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm leading-6"
                    />
                  ) : (
                    <input
                      type="text"
                      value={entry.value}
                      onChange={(e) => updateEntry(entry.path, e.target.value)}
                      className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm"
                    />
                  )}
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
