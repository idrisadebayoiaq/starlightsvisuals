import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

import type { BlogPostSection } from "@/data/blog-posts";
import { uploadMediaFile } from "@/lib/cms-media";
import { getSupabase, type BlogPostRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogsPage,
});

type BlogFormState = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  published_at: string;
  read_time: string;
  image_url: string;
  author: string;
  sections: BlogPostSection[];
  featured: boolean;
  published: boolean;
  sort_order: number;
};

const emptyForm = (): BlogFormState => ({
  slug: "",
  title: "",
  excerpt: "",
  category: "General",
  published_at: new Date().toISOString().slice(0, 10),
  read_time: "5 min read",
  image_url: "",
  author: "Starlights Visuals",
  sections: [{ paragraphs: [""] }],
  featured: false,
  published: true,
  sort_order: 0,
});

function rowToForm(row: BlogPostRow): BlogFormState {
  const sections = Array.isArray(row.sections) ? row.sections : [];
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "General",
    published_at: row.published_at ?? "",
    read_time: row.read_time ?? "5 min read",
    image_url: row.image_url ?? "",
    author: row.author ?? "Starlights Visuals",
    sections: sections.length > 0 ? sections : [{ paragraphs: [""] }],
    featured: row.featured,
    published: row.published,
    sort_order: row.sort_order ?? 0,
  };
}

function AdminBlogsPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: queryError } = await getSupabase()
        .from("blog_posts")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("published_at", { ascending: false });
      if (queryError) throw queryError;
      setPosts((data as BlogPostRow[]) ?? []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t("admin.blogs.loadError"));
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

  function openEdit(row: BlogPostRow) {
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
      const url = await uploadMediaFile(file, "blog");
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.blogs.uploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      category: form.category.trim() || "General",
      published_at: form.published_at || null,
      read_time: form.read_time.trim() || "5 min read",
      image_url: form.image_url.trim(),
      author: form.author.trim() || "Starlights Visuals",
      sections: form.sections
        .map((s) => ({
          heading: s.heading?.trim() || undefined,
          paragraphs: s.paragraphs.map((p) => p.trim()).filter(Boolean),
        }))
        .filter((s) => s.paragraphs.length > 0 || s.heading),
      featured: form.featured,
      published: form.published,
      sort_order: Number(form.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { error: updateError } = await getSupabase()
          .from("blog_posts")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await getSupabase().from("blog_posts").insert(payload);
        if (insertError) throw insertError;
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.blogs.saveError"));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm(t("admin.blogs.deleteConfirm"))) return;
    try {
      const { error: deleteError } = await getSupabase().from("blog_posts").delete().eq("id", id);
      if (deleteError) throw deleteError;
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("admin.blogs.deleteError"));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{t("admin.blogs.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("admin.blogs.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-md bg-neon-green px-4 py-2 text-sm font-display uppercase tracking-widest text-background"
        >
          <Plus className="h-4 w-4" /> {t("admin.blogs.create")}
        </button>
      </div>

      {error && !open && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 overflow-x-auto border border-border/60">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border/60 bg-card/60 text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("admin.blogs.colTitle")}</th>
              <th className="px-4 py-3">{t("admin.blogs.colCategory")}</th>
              <th className="px-4 py-3">{t("admin.blogs.colStatus")}</th>
              <th className="px-4 py-3">{t("admin.blogs.colOrder")}</th>
              <th className="px-4 py-3 text-right">{t("admin.blogs.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  {t("admin.loading")}
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  {t("admin.blogs.empty")}
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-border/40">
                  <td className="px-4 py-3">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{post.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs uppercase tracking-wider",
                        post.published ? "text-neon-green" : "text-muted-foreground",
                      )}
                    >
                      {post.published ? t("admin.published") : t("admin.draft")}
                      {post.featured ? ` · ${t("admin.featured")}` : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{post.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(post)}
                        className="rounded border border-border p-1.5 text-muted-foreground hover:border-neon-green hover:text-neon-green"
                        aria-label={t("admin.edit")}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void onDelete(post.id)}
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
                {editingId ? t("admin.blogs.editTitle") : t("admin.blogs.createTitle")}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("admin.close")}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("admin.blogs.slug")}>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.category")}>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.postTitle")} className="sm:col-span-2">
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.excerpt")} className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.publishedAt")}>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.readTime")}>
                <input
                  value={form.read_time}
                  onChange={(e) => setForm((f) => ({ ...f, read_time: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.author")}>
                <input
                  value={form.author}
                  onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.sortOrder")}>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label={t("admin.blogs.imageUrl")} className="sm:col-span-2">
                <input
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className={inputClass}
                  placeholder="https://..."
                />
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs text-muted-foreground"
                  onChange={(e) => void onUpload(e.target.files?.[0] ?? null)}
                />
                {uploading && (
                  <p className="mt-1 text-xs text-muted-foreground">{t("admin.blogs.uploading")}</p>
                )}
              </Field>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("admin.blogs.sections")}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      sections: [...f.sections, { heading: "", paragraphs: [""] }],
                    }))
                  }
                  className="text-xs text-neon-green hover:underline"
                >
                  {t("admin.blogs.addSection")}
                </button>
              </div>
              <div className="space-y-4">
                {form.sections.map((section, sIndex) => (
                  <div key={sIndex} className="border border-border/60 p-3">
                    <input
                      value={section.heading ?? ""}
                      onChange={(e) =>
                        setForm((f) => {
                          const sections = [...f.sections];
                          sections[sIndex] = { ...sections[sIndex], heading: e.target.value };
                          return { ...f, sections };
                        })
                      }
                      placeholder={t("admin.blogs.sectionHeading")}
                      className={cn(inputClass, "mb-2")}
                    />
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <textarea
                        key={pIndex}
                        rows={3}
                        value={paragraph}
                        onChange={(e) =>
                          setForm((f) => {
                            const sections = [...f.sections];
                            const paragraphs = [...sections[sIndex].paragraphs];
                            paragraphs[pIndex] = e.target.value;
                            sections[sIndex] = { ...sections[sIndex], paragraphs };
                            return { ...f, sections };
                          })
                        }
                        placeholder={t("admin.blogs.paragraph")}
                        className={cn(inputClass, "mb-2")}
                      />
                    ))}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-neon-green"
                        onClick={() =>
                          setForm((f) => {
                            const sections = [...f.sections];
                            sections[sIndex] = {
                              ...sections[sIndex],
                              paragraphs: [...sections[sIndex].paragraphs, ""],
                            };
                            return { ...f, sections };
                          })
                        }
                      >
                        {t("admin.blogs.addParagraph")}
                      </button>
                      {form.sections.length > 1 && (
                        <button
                          type="button"
                          className="text-xs text-destructive"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              sections: f.sections.filter((_, i) => i !== sIndex),
                            }))
                          }
                        >
                          {t("admin.blogs.removeSection")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green";

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
