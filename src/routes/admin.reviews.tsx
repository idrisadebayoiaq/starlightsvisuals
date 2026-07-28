import { createFileRoute } from "@tanstack/react-router";
import { Check, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getErrorMessage } from "@/lib/error-message";
import { getSupabase, type ClientTestimonialRow } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviewsPage,
});

function AdminReviewsPage() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<ClientTestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let query = getSupabase()
        .from("client_testimonials")
        .select("id,name,role,company,headline,quote,rating,verified,status,created_at")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error: queryError } = await query;
      if (queryError) throw queryError;
      setReviews((data as ClientTestimonialRow[]) ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(getErrorMessage(err, t("admin.reviews.loadError")));
    } finally {
      setLoading(false);
    }
  }, [filter, t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: "approved" | "rejected") {
    try {
      const { error: updateError } = await getSupabase()
        .from("client_testimonials")
        .update({ status, verified: status === "approved" })
        .eq("id", id);
      if (updateError) throw updateError;
      await load();
    } catch (err) {
      setError(getErrorMessage(err, t("admin.reviews.updateError")));
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm(t("admin.reviews.deleteConfirm"))) return;
    try {
      const { error: deleteError } = await getSupabase()
        .from("client_testimonials")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      await load();
    } catch (err) {
      setError(getErrorMessage(err, t("admin.reviews.deleteError")));
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">{t("admin.reviews.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("admin.reviews.subtitle")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs uppercase tracking-wider transition",
              filter === status
                ? "border-neon-green bg-neon-green/15 text-neon-green"
                : "border-border text-muted-foreground hover:border-neon-green/50",
            )}
          >
            {t(`admin.reviews.filter.${status}`)}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">{t("admin.loading")}</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("admin.reviews.empty")}</p>
        ) : (
          reviews.map((review) => (
            <article
              key={review.id}
              className="border border-border/60 bg-card/40 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg tracking-tight">{review.headline}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.name}
                    {review.role ? ` · ${review.role}` : ""}
                    {review.company ? ` · ${review.company}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-widest",
                    review.status === "approved" && "text-neon-green",
                    review.status === "pending" && "text-amber-400",
                    review.status === "rejected" && "text-destructive",
                  )}
                >
                  {review.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{review.quote}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("admin.reviews.rating", { rating: review.rating })} ·{" "}
                {new Date(review.created_at).toLocaleString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {review.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => void setStatus(review.id, "approved")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-neon-green/40 px-3 py-1.5 text-xs text-neon-green hover:bg-neon-green/10"
                  >
                    <Check className="h-3.5 w-3.5" /> {t("admin.reviews.approve")}
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => void setStatus(review.id, "rejected")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-amber-400 hover:text-amber-400"
                  >
                    <X className="h-3.5 w-3.5" /> {t("admin.reviews.reject")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void onDelete(review.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {t("admin.delete")}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
