import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { CATEGORY_COVER_IMAGE } from "@/lib/category-cover";
import { uploadMediaFile } from "@/lib/cms-media";
import { getErrorMessage } from "@/lib/error-message";
import { getSupabase, type PortfolioCategoryRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { syncCategoryTranslationsFn } from "@/server/cms-translations";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
});

type CategoryFormState = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  cover_image_url: string;
  showcase_tag: string;
  sort_order: number;
  published: boolean;
};

const emptyForm = (): CategoryFormState => ({
  slug: "",
  title: "",
  tagline: "",
  description: "",
  cover_image_url: "",
  showcase_tag: "",
  sort_order: 0,
  published: true,
});

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rowToForm(row: PortfolioCategoryRow): CategoryFormState {
  return {
    slug: row.slug,
    title: row.title,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    cover_image_url: row.cover_image_url ?? "",
    showcase_tag: row.showcase_tag ?? "",
    sort_order: row.sort_order ?? 0,
    published: row.published,
  };
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-neon-green";

function Field({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function AdminCategoriesPage() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<PortfolioCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await getSupabase()
        .from("portfolio_categories")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (queryError) throw queryError;
      setRows((data as PortfolioCategoryRow[]) ?? []);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.categories.loadError")));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setOpen(true);
  }

  function openEdit(row: PortfolioCategoryRow) {
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
      const url = await uploadMediaFile(file, "categories");
      setForm((f) => ({ ...f, cover_image_url: url }));
    } catch (err) {
      setError(getErrorMessage(err, t("admin.categories.uploadError")));
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const title = form.title.trim();
    const slug = (form.slug.trim() || slugify(title)).toLowerCase();
    if (!title || !slug) {
      setError(t("admin.categories.titleRequired"));
      setSaving(false);
      return;
    }

    const payload = {
      slug,
      title,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      cover_image_url: form.cover_image_url.trim(),
      showcase_tag: form.showcase_tag.trim() || title,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    try {
      let categoryId = editingId;
      if (editingId) {
        const { error: updateError } = await getSupabase()
          .from("portfolio_categories")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { data: inserted, error: insertError } = await getSupabase()
          .from("portfolio_categories")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        categoryId = inserted?.id ?? null;
      }

      setOpen(false);
      await load();

      if (categoryId) {
        void syncCategoryTranslationsFn({ data: { categoryId } }).catch((err) => {
          console.error("Failed to sync category translations", err);
        });
      }
    } catch (err) {
      setError(getErrorMessage(err, t("admin.categories.saveError")));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm(t("admin.categories.deleteConfirm"))) return;
    try {
      const { error: deleteError } = await getSupabase()
        .from("portfolio_categories")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      await load();
    } catch (err) {
      setError(getErrorMessage(err, t("admin.categories.deleteError")));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{t("admin.categories.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.categories.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-neon-green px-4 py-2 text-sm font-display uppercase tracking-widest text-background"
        >
          <Plus className="h-4 w-4" /> {t("admin.categories.create")}
        </button>
      </div>

      {error && !open && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-border/60">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border/60 bg-card/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("admin.categories.colThumb")}</th>
              <th className="px-4 py-3">{t("admin.categories.colTitle")}</th>
              <th className="px-4 py-3">{t("admin.categories.colStatus")}</th>
              <th className="px-4 py-3">{t("admin.categories.colOrder")}</th>
              <th className="px-4 py-3 text-right">{t("admin.categories.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  {t("admin.loading")}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  {t("admin.categories.empty")}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border/40">
                  <td className="px-4 py-3">
                    {row.cover_image_url ? (
                      <img
                        src={row.cover_image_url}
                        alt=""
                        className="h-14 w-11 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-11 items-center justify-center rounded bg-muted/40 text-[9px] text-muted-foreground">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{row.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs uppercase tracking-wider",
                        row.published ? "text-neon-green" : "text-muted-foreground",
                      )}
                    >
                      {row.published ? t("admin.published") : t("admin.draft")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded border border-border p-1.5 text-muted-foreground hover:border-neon-green hover:text-neon-green"
                        aria-label={t("admin.edit")}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(row.id)}
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
                {editingId ? t("admin.categories.editTitle") : t("admin.categories.createTitle")}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("admin.close")}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("admin.categories.fieldTitle")} className="sm:col-span-2">
                <input
                  required
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: f.slug || slugify(title),
                    }));
                  }}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.categories.slug")} hint={t("admin.categories.slugHint")}>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  onBlur={() =>
                    setForm((f) => ({
                      ...f,
                      slug: slugify(f.slug || f.title),
                    }))
                  }
                  className={inputClass}
                  disabled={Boolean(editingId)}
                />
              </Field>
              <Field label={t("admin.categories.showcaseTag")} hint={t("admin.categories.showcaseTagHint")}>
                <input
                  value={form.showcase_tag}
                  onChange={(e) => setForm((f) => ({ ...f, showcase_tag: e.target.value }))}
                  className={inputClass}
                  placeholder={form.title || "3D"}
                />
              </Field>
              <Field label={t("admin.categories.tagline")} className="sm:col-span-2">
                <input
                  value={form.tagline}
                  onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.categories.description")} className="sm:col-span-2">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field
                label={t("admin.categories.coverImage")}
                className="sm:col-span-2"
                hint={t("admin.categories.coverHint", {
                  size: CATEGORY_COVER_IMAGE.sizeLabel,
                  width: CATEGORY_COVER_IMAGE.width,
                  height: CATEGORY_COVER_IMAGE.height,
                })}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                  <div className="flex-1 space-y-2">
                    <input
                      value={form.cover_image_url}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, cover_image_url: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="https://…"
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-neon-green">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                      />
                      {uploading
                        ? t("admin.categories.uploading")
                        : t("admin.categories.uploadButton")}
                    </label>
                    <p className="rounded-md border border-neon-green/30 bg-neon-green/5 px-3 py-2 text-xs text-foreground/90">
                      {t("admin.categories.coverSizeBadge", {
                        size: CATEGORY_COVER_IMAGE.sizeLabel,
                      })}
                    </p>
                  </div>
                  {form.cover_image_url ? (
                    <img
                      src={form.cover_image_url}
                      alt=""
                      className="h-40 w-32 rounded border border-border object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-32 items-center justify-center rounded border border-dashed border-border text-center text-[10px] text-muted-foreground">
                      {CATEGORY_COVER_IMAGE.width}×{CATEGORY_COVER_IMAGE.height}
                    </div>
                  )}
                </div>
              </Field>
              <Field label={t("admin.categories.sortOrder")}>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
                  }
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 pt-6 text-sm">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
                {t("admin.published")}
              </label>
            </div>

            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                {t("admin.cancel")}
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
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
