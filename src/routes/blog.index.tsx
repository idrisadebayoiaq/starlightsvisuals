import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCmsBlogs } from "@/hooks/use-cms-blogs";
import { pageHead, siteMeta } from "@/lib/site-meta";

export const Route = createFileRoute("/blog/")({
  head: () => pageHead(siteMeta.blog),
  component: BlogPage,
});

function BlogPage() {
  const { t } = useTranslation();
  const { posts: blogPosts, loading } = useCmsBlogs();
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="relative isolate border-b border-border/40">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
          <p className="font-script text-2xl text-neon-green">{t("blogPage.label")}</p>
          <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">
            <span className="text-outline">{t("blogPage.title1")}</span> {t("blogPage.title2")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("blogPage.subtitle")}
          </p>
        </div>
      </section>

      {loading && !featured ? (
        <section className="mx-auto max-w-7xl px-6 py-20 md:px-14">
          <p className="text-sm text-muted-foreground">{t("blogPage.loading", { defaultValue: "Loading…" })}</p>
        </section>
      ) : null}

      {featured && (
        <section className="border-b border-border/40">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-14">
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="group grid overflow-hidden border border-border bg-card transition hover:border-neon-green lg:grid-cols-2"
            >
              <div className="aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[360px]">
                <img
                  src={featured.image}
                  alt=""
                  width={1280}
                  height={800}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="font-display text-[10px] uppercase tracking-widest text-neon-green">
                  {t("blogPage.featured", { category: featured.category })}
                </p>
                <h2 className="mt-4 font-display text-3xl tracking-tight transition group-hover:text-neon-green md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
                  {featured.date} · {featured.readTime}
                </p>
              </div>
            </Link>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden border border-border bg-card transition hover:border-neon-green"
            >
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    width={800}
                    height={500}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-display text-[10px] uppercase tracking-widest text-neon-green">
                    {post.category}
                  </p>
                  <h3 className="mt-3 font-display text-xl tracking-tight transition group-hover:text-neon-green">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {post.date}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition group-hover:text-neon-green group-hover:rotate-45" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
