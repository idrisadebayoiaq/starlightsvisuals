import { createFileRoute, Link } from "@tanstack/react-router";
import { Clapperboard, FileText, Mail, MessageSquareQuote } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

type Counts = {
  blogs: number;
  videos: number;
  pendingReviews: number;
  contacts: number;
};

function AdminDashboard() {
  const { t } = useTranslation();
  const [counts, setCounts] = useState<Counts>({
    blogs: 0,
    videos: 0,
    pendingReviews: 0,
    contacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const supabase = getSupabase();

    (async () => {
      try {
        const [blogsRes, videosRes, reviewsRes, contactsRes] = await Promise.all([
          supabase.from("blog_posts").select("id", { count: "exact", head: true }),
          supabase.from("portfolio_videos").select("id", { count: "exact", head: true }),
          supabase
            .from("client_testimonials")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        ]);

        if (!cancelled) {
          setCounts({
            blogs: blogsRes.count ?? 0,
            videos: videosRes.count ?? 0,
            pendingReviews: reviewsRes.count ?? 0,
            contacts: contactsRes.count ?? 0,
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard counts", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      to: "/admin/blogs" as const,
      label: t("admin.dashboard.blogs"),
      value: counts.blogs,
      icon: FileText,
    },
    {
      to: "/admin/videos" as const,
      label: t("admin.dashboard.videos"),
      value: counts.videos,
      icon: Clapperboard,
    },
    {
      to: "/admin/reviews" as const,
      label: t("admin.dashboard.pendingReviews"),
      value: counts.pendingReviews,
      icon: MessageSquareQuote,
    },
    {
      to: "/admin/contacts" as const,
      label: t("admin.dashboard.contacts"),
      value: counts.contacts,
      icon: Mail,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">{t("admin.dashboard.title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("admin.dashboard.subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.to}
              to={card.to}
              className="border border-border/60 bg-card/50 p-5 transition hover:border-neon-green"
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-[10px] uppercase tracking-widest text-muted-foreground">
                  {card.label}
                </p>
                <Icon className="h-4 w-4 text-neon-green" />
              </div>
              <p className="mt-4 font-display text-4xl tracking-tight">
                {loading ? "—" : card.value}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
