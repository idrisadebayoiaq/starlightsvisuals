import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { WorkCategorySlug } from "@/data/portfolio-works";
import { workCategories } from "@/data/portfolio-works";
import { slugify } from "@/hooks/use-cms-videos";
import { uploadMediaFile } from "@/lib/cms-media";
import { getErrorMessage } from "@/lib/error-message";
import {
  getSupabase,
  type PortfolioClientRow,
  type PortfolioVideoRow,
} from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/videos")({
  component: AdminVideosPage,
});

const CATEGORY_OPTIONS: { slug: WorkCategorySlug; label: string }[] = workCategories.map((c) => ({
  slug: c.slug as WorkCategorySlug,
  label: c.title,
}));

const NEW_CLIENT = "__new__";

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

type NewClientForm = {
  name: string;
  slug: string;
  industry: string;
  description: string;
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

const emptyNewClient = (): NewClientForm => ({
  name: "",
  slug: "",
  industry: "",
  description: "",
});

function rowToForm(row: PortfolioVideoRow): VideoFormState {
  return {
    project_key: row.project_key ?? "",
    category_slug: (CATEGORY_OPTIONS.some((c) => c.slug === row.category_slug)
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
  const [clients, setClients] = useState<PortfolioClientRow[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VideoFormState>(emptyForm);
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing");
  const [newClient, setNewClient] = useState<NewClientForm>(emptyNewClient());
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [videosRes, clientsRes] = await Promise.all([
        getSupabase()
          .from("portfolio_videos")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false }),
        getSupabase()
          .from("portfolio_clients")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
      ]);
      if (videosRes.error) throw videosRes.error;
      if (clientsRes.error) throw clientsRes.error;
      setVideos((videosRes.data as PortfolioVideoRow[]) ?? []);
      setClients((clientsRes.data as PortfolioClientRow[]) ?? []);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.videos.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const clientsForCategory = useMemo(
    () => clients.filter((c) => c.category_slug === form.category_slug),
    [clients, form.category_slug],
  );

  const filtered = useMemo(
    () => (filter === "all" ? videos : videos.filter((v) => v.category_slug === filter)),
    [videos, filter],
  );

  function openCreate() {
    setEditingId(null);
    const next = emptyForm();
    setForm(next);
    setClientMode("existing");
    setNewClient(emptyNewClient());
    setError(null);
    setOpen(true);
  }

  function openEdit(row: PortfolioVideoRow) {
    setEditingId(row.id);
    setForm(rowToForm(row));
    setClientMode("existing");
    setNewClient(emptyNewClient());
    setError(null);
    setOpen(true);
  }

  function onCategoryChange(slug: WorkCategorySlug) {
    setForm((f) => ({
      ...f,
      category_slug: slug,
      client_slug: "",
      client_name: "",
    }));
    setClientMode("existing");
    setNewClient(emptyNewClient());
  }

  function onClientSelect(value: string) {
    if (value === NEW_CLIENT) {
      setClientMode("new");
      setForm((f) => ({ ...f, client_slug: "", client_name: "" }));
      setNewClient(emptyNewClient());
      return;
    }

    setClientMode("existing");
    const selected = clientsForCategory.find((c) => c.slug === value);
    setForm((f) => ({
      ...f,
      client_slug: selected?.slug ?? value,
      client_name: selected?.name ?? f.client_name,
    }));
  }

  function onNewClientNameChange(name: string) {
    const slug = slugify(name);
    setNewClient((c) => ({ ...c, name, slug: c.slug && c.slug !== slugify(c.name) ? c.slug : slug }));
    setForm((f) => ({ ...f, client_name: name, client_slug: slug }));
  }

  async function onUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadMediaFile(file, "portfolio");
      setForm((f) => ({ ...f, thumbnail_url: url }));
    } catch (err) {
      setError(getErrorMessage(err, t("admin.videos.uploadError")));
    } finally {
      setUploading(false);
    }
  }

  async function ensureClient(): Promise<{ slug: string; name: string }> {
    if (clientMode === "existing") {
      if (!form.client_slug.trim()) {
        throw new Error(t("admin.videos.clientRequired"));
      }
      const existing = clientsForCategory.find((c) => c.slug === form.client_slug);
      return {
        slug: form.client_slug.trim(),
        name: (existing?.name || form.client_name).trim(),
      };
    }

    const name = newClient.name.trim();
    const slug = (newClient.slug.trim() || slugify(name)).toLowerCase();
    if (!name || !slug) {
      throw new Error(t("admin.videos.newClientRequired"));
    }

    const { error: upsertError } = await getSupabase().from("portfolio_clients").upsert(
      {
        category_slug: form.category_slug,
        slug,
        name,
        industry: newClient.industry.trim(),
        description: newClient.description.trim(),
        published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "category_slug,slug" },
    );
    if (upsertError) throw upsertError;

    return { slug, name };
  }

  function nextProjectKey(clientSlug: string): string {
    const prefix = `${clientSlug}-p`;
    const nums = videos
      .filter((v) => (v.project_key || "").startsWith(prefix) || v.client_slug === clientSlug)
      .map((v) => {
        const match = (v.project_key || "").match(/-p(\d+)$/);
        return match ? Number(match[1]) : 0;
      });
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `${clientSlug}-p${next}`;
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const clientRef = await ensureClient();
      const projectKey = form.project_key.trim() || nextProjectKey(clientRef.slug);

      const payload = {
        project_key: projectKey,
        category_slug: form.category_slug,
        client_slug: clientRef.slug,
        client_name: clientRef.name,
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
      setError(getErrorMessage(err, t("admin.videos.saveError")));
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
      setError(getErrorMessage(err, t("admin.videos.deleteError")));
    }
  }

  const selectedClientValue =
    clientMode === "new" ? NEW_CLIENT : form.client_slug || "";

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
        {CATEGORY_OPTIONS.map((opt) => (
          <FilterChip key={opt.slug} active={filter === opt.slug} onClick={() => setFilter(opt.slug)}>
            {opt.label}
          </FilterChip>
        ))}
      </div>

      {error && !open && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-border/60">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-border/60 bg-card/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("admin.videos.colTitle")}</th>
              <th className="px-4 py-3">{t("admin.videos.colCategory")}</th>
              <th className="px-4 py-3">{t("admin.videos.colClient")}</th>
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
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {video.project_key || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {CATEGORY_OPTIONS.find((c) => c.slug === video.category_slug)?.label ??
                      video.category_slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{video.client_name}</td>
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
              <Field label={t("admin.videos.category")} className="sm:col-span-2">
                <select
                  required
                  value={form.category_slug}
                  onChange={(e) => onCategoryChange(e.target.value as WorkCategorySlug)}
                  className={inputClass}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={t("admin.videos.client")} className="sm:col-span-2">
                <select
                  required={clientMode === "existing"}
                  value={selectedClientValue}
                  onChange={(e) => onClientSelect(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {t("admin.videos.selectClient")}
                  </option>
                  {clientsForCategory.map((client) => (
                    <option key={client.id} value={client.slug}>
                      {client.name}
                    </option>
                  ))}
                  <option value={NEW_CLIENT}>{t("admin.videos.createNewClient")}</option>
                </select>
                {clientsForCategory.length === 0 && clientMode === "existing" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("admin.videos.noClientsHint")}
                  </p>
                )}
              </Field>

              {clientMode === "new" && (
                <div className="sm:col-span-2 grid gap-4 rounded-md border border-border/60 bg-background/40 p-4 sm:grid-cols-2">
                  <p className="sm:col-span-2 text-[10px] uppercase tracking-widest text-neon-green">
                    {t("admin.videos.newClientHeading")}
                  </p>
                  <Field label={t("admin.videos.clientName")}>
                    <input
                      required
                      value={newClient.name}
                      onChange={(e) => onNewClientNameChange(e.target.value)}
                      className={inputClass}
                      placeholder="Acme Studios"
                    />
                  </Field>
                  <Field label={t("admin.videos.clientSlug")}>
                    <input
                      required
                      value={newClient.slug}
                      onChange={(e) => {
                        const slug = slugify(e.target.value);
                        setNewClient((c) => ({ ...c, slug }));
                        setForm((f) => ({ ...f, client_slug: slug }));
                      }}
                      className={inputClass}
                      placeholder="acme-studios"
                    />
                  </Field>
                  <Field label={t("admin.videos.clientIndustry")}>
                    <input
                      value={newClient.industry}
                      onChange={(e) =>
                        setNewClient((c) => ({ ...c, industry: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Product / Brand"
                    />
                  </Field>
                  <Field label={t("admin.videos.clientDescription")} className="sm:col-span-2">
                    <textarea
                      rows={2}
                      value={newClient.description}
                      onChange={(e) =>
                        setNewClient((c) => ({ ...c, description: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

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
                  placeholder={t("admin.videos.projectKeyHint")}
                />
              </Field>
              <Field label={t("admin.videos.videoUrl")}>
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
