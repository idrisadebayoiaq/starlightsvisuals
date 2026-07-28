import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useFeaturedCmsBlogs } from "@/hooks/use-cms-blogs";

export function HomeBlogSection() {
  const { t } = useTranslation();
  const { posts, loading } = useFeaturedCmsBlogs(3);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="border-b border-border/40">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-14">
        <div className="mb-12 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-script text-2xl text-neon-green">{t("home.blogLabel")}</p>
            <h2 className="mt-2 font-display text-5xl tracking-tight md:text-7xl">
              {t("home.blogTitle")}
            </h2>
          </div>
          <Link
            to="/blog"
            className="font-display text-xs uppercase tracking-widest text-muted-foreground hover:text-neon-green inline-flex items-center gap-2"
          >
            {t("home.blogViewAll")} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[16/10] bg-muted/40" />
                  <div className="h-3 w-20 bg-muted/40" />
                  <div className="h-6 w-full bg-muted/40" />
                  <div className="h-4 w-4/5 bg-muted/40" />
                </div>
              ))
            : posts.map((post, index) => (
                <article
                  key={post.slug}
                  className={`group ${index === 0 ? "md:col-span-1" : ""}`}
                >
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="block">
                    <div className="aspect-[16/10] overflow-hidden border-b border-border/40">
                      <img
                        src={post.image}
                        alt=""
                        width={800}
                        height={500}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-5 font-display text-[10px] uppercase tracking-widest text-neon-green">
                      {post.category}
                    </p>
                    <h3 className="mt-3 font-display text-2xl tracking-tight transition group-hover:text-neon-green md:text-3xl">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>
                        {post.date}
                        {post.readTime ? ` · ${post.readTime}` : ""}
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45 group-hover:text-neon-green" />
                    </div>
                  </Link>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
}
