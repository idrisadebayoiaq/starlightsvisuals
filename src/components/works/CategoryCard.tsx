import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { WorkCategory } from "@/types/portfolio-works";
import { cn } from "@/lib/utils";

type CategoryCardProps = {
  category: WorkCategory;
  index?: number;
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-border/80 bg-card/30"
    >
      <Link
        to="/works/$category"
        params={{ category: category.slug }}
        className="block cursor-pointer transition duration-300 hover:scale-[1.01] hover:border-neon-green hover:shadow-[0_0_32px_-8px_rgba(76,255,61,0.4)]"
      >
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={category.coverImage}
            alt={category.title}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
              category.slug === "2d-animation" && "object-[center_22%]",
              category.slug === "branding" && "object-[center_35%]",
            )}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
          <div>
            <p className="font-display text-[10px] uppercase tracking-widest text-neon-green">
              {t("works.clientsCount", { count: category.clients.length })}
            </p>
            <h3 className="mt-1 font-display text-3xl tracking-tight md:text-4xl">{category.title}</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{category.tagline}</p>
          </div>
          <ArrowUpRight className="h-6 w-6 shrink-0 transition group-hover:text-neon-green" />
        </div>
      </Link>
    </motion.article>
  );
}
