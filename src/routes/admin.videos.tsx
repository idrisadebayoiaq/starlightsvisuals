import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { WorkCategorySlug } from "@/data/portfolio-works";
import { uploadMediaFile } from "@/lib/cms-media";
import { getSupabase, type PortfolioVideoRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/videos")({
  component: AdminVideosPage,
});

const CATEGORY_OPTIONS: WorkCategorySlug[] = [
  "2d-animation",
  "3d-animation",
  "motion-graphics",
  "video-editing",
  "vfx",
  "branding",
];

type VideoFormState = {
  project_key: string;
  category_slug: WorkCategorySlug;
  client_slug: string;
  client_name: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  year: number;
  tags: string;
  sort_order: number;
  featured: boolean;
  published: boolean;
};

const emptyForm = (): VideoFormState => ({
  project_key: "",
  category_slug: "2d-animation",
  client_slug: "",
  client_name: "",
  title: "",
  description: "",
  video_url: "",
  thumbnail_url: "",
  year: new Date().getFullYear(),
  tags: "",
  sort_order: 0,
  featured: false,
  published: true,
});

function rowToForm(row: PortfolioVideoRow): VideoFormState {
  return {
    project_key: row.project_key ?? "",
    category_slug: (CATEGORY_OPTIONS.includes(row.category_slug as WorkCategorySlug)
      ? row.category_slug
      : "2d-animation") as WorkCategorySlug,
    client_slug: row.client_slug ?? "",
    client_name: row.client_name ?? "",
    title: row.title,
    description: row.description ?? "",
    video_url: row.video_url,
    thumbnail_url: row.thumbnail_url ?? "",
    year: row.year ?? new Date().getFullYear(),
    tags: (row.tags ?? []).join(", "),
    sort_order: row.sort_order ?? 0,
    featured: row.featured,
    published: row.published,
  };
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green";

function AdminVideosPage() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<PortfolioVideoRow[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VideoFormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await getSupabase()
        .from("portfolio_videos")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (queryError) throw queryError;
      setVideos((data as PortfolioVideoRow[]) ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t("admin.videos.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => (filter === "all" ? videos : videos.filter((v) => v.category_slug === filter)),
    [videos, filter],
  );

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setOpen(true);
  }

  function openEdit(row: PortfolioVideoRow) {
    setEditingId(row.id);
    setForm(rowToForm(row));
    setError(null);
    setOpen(true);
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadMediaFile(file, "portfolio");
      setForm((f) => ({ ...f, thumbnail_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.videos.uploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      project_key: form.project_key.trim() || null,
      category_slug: form.category_slug,
      client_slug: form.client_slug.trim(),
      client_name: form.client_name.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      video_url: form.video_url.trim(),
      thumbnail_url: form.thumbnail_url.trim(),
      year: Number(form.year) || new Date().getFullYear(),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      sort_order: Number(form.sort_order) || 0,
      featured: form.featured,
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { error: updateError } = await getSupabase()
          .from("portfolio_videos")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await getSupabase()
          .from("portfolio_videos")
          .insert(payload);
        if (insertError) throw insertError;
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.videos.saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm(t("admin.videos.deleteConfirm"))) return;
    try {
      const { error: deleteError } = await getSupabase()
        .from("portfolio_videos")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.videos.deleteError"));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{t("admin.videos.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.videos.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-neon-green px-4 py-2 text-sm font-display uppercase tracking-widest text-background"
        >
          <Plus className="h-4 w-4" /> {t("admin.videos.create")}
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {t("admin.videos.allCategories")}
        </FilterChip>
        {CATEGORY_OPTIONS.map((slug) => (
          <FilterChip key={slug} active={filter === slug} onClick={() => setFilter(slug)}>
            {slug}
          </FilterChip>
        ))}
      </div>

      {error && !open && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-border/60">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-border/60 bg-card/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("admin.videos.colTitle")}</th>
              <th className="px-4 py-3">{t("admin.videos.colCategory")}</th>
              <th className="px-4 py-3">{t("admin.videos.colProjectKey")}</th>
              <th className="px-4 py-3">{t("admin.videos.colOrder")}</th>
              <th className="px-4 py-3">{t("admin.videos.colStatus")}</th>
              <th className="px-4 py-3 text-right">{t("admin.videos.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-muted-foreground">
                  {t("admin.loading")}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-muted-foreground">
                  {t("admin.videos.empty")}
                </td>
              </tr>
            ) : (
              filtered.map((video) => (
                <tr key={video.id} className="border-b border-border/40">
                  <td className="px-4 py-3">
                    <p className="font-medium">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.client_name}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{video.category_slug}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {video.project_key || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{video.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs uppercase tracking-wider",
                        video.published ? "text-neon-green" : "text-muted-foreground",
                      )}
                    >
                      {video.published ? t("admin.published") : t("admin.draft")}
                      {video.featured ? ` · ${t("admin.featured")}` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(video)}
                        className="rounded border border-border p-1.5 text-muted-foreground hover:border-neon-green hover:text-neon-green"
                        aria-label={t("admin.edit")}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(video.id)}
                        className="rounded border border-border p-1.5 text-muted-foreground hover:border-destructive hover:text-destructive"
                        aria-label={t("admin.delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm">
          <form
            onSubmit={onSave}
            className="my-8 w-full max-w-2xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl">
                {editingId ? t("admin.videos.editTitle") : t("admin.videos.createTitle")}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("admin.close")}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("admin.videos.fieldTitle")} className="sm:col-span-2">
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.videos.projectKey")}>
                <input
                  value={form.project_key}
                  onChange={(e) => setForm((f) => ({ ...f, project_key: e.target.value }))}
                  className={inputClass}
                  placeholder="category-client-p1"
                />
              </Field>
              <Field label={t("admin.videos.category")}>
                <select
                  value={form.category_slug}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      category_slug: e.target.value as WorkCategorySlug,
                    }))
                  }
                  className={inputClass}
                >
                  {CATEGORY_OPTIONS.map((slug) => (
                    <option key={slug} value={slug}>
                      {slug}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("admin.videos.clientSlug")}>
                <input
                  value={form.client_slug}
                  onChange={(e) => setForm((f) => ({ ...f, client_slug: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.videos.clientName")}>
                <input
                  required
                  value={form.client_name}
                  onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.videos.videoUrl")} className="sm:col-span-2">
                <input
                  required
                  value={form.video_url}
                  onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                  className={inputClass}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </Field>
              <Field label={t("admin.videos.thumbnailUrl")} className="sm:col-span-2">
                <input
                  value={form.thumbnail_url}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-muted-foreground"
                  onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                />
                {uploading && (
                  <p className="mt-1 text-xs text-muted-foreground">{t("admin.videos.uploading")}</p>
                )}
              </Field>
              <Field label={t("admin.videos.description")} className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.videos.year")}>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) || 0 }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.videos.sortOrder")}>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.videos.tags")} className="sm:col-span-2">
                <input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  className={inputClass}
                  placeholder="animation, trailer, 3d"
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                {t("admin.featured")}
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                {t("admin.published")}
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                {t("admin.cancel")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-neon-green px-4 py-2 text-sm font-display uppercase tracking-widest text-background disabled:opacity-60"
              >
                {saving ? t("admin.saving") : t("admin.save")}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider transition",
        active
          ? "border-neon-green bg-neon-green/15 text-neon-green"
          : "border-border text-muted-foreground hover:border-neon-green/50",
      )}
    >
      {children}
    </button>
  );
}
