import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { WorkClient } from "@/types/portfolio-works";

type ClientCardProps = {
  categorySlug: string;
  client: WorkClient;
  index?: number;
};

export function ClientCard({ categorySlug, client, index = 0 }: ClientCardProps) {
  const { t } = useTranslation();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group"
    >
      <Link
        to="/works/$category/$client"
        params={{ category: categorySlug, client: client.slug }}
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/60 bg-card/30 backdrop-blur-md transition duration-300 hover:scale-[1.02] hover:border-neon-green/60 hover:shadow-[0_0_28px_-10px_rgba(76,255,61,0.5)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={client.banner}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-lg border border-border/50 bg-background/90 p-2 shadow-lg">
            <img
              src={client.logo}
              alt={client.name}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </div>
          <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-foreground/80 transition group-hover:text-neon-green" />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-2xl tracking-tight">{client.name}</h3>
          <p className="mt-1 font-display text-[10px] uppercase tracking-widest text-neon-green">
            {client.industry}
          </p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {client.description}
          </p>
          <p className="mt-4 font-display text-xs uppercase tracking-widest text-muted-foreground">
            {t("works.projectsCompleted", { count: client.projects.length })}
          </p>
          {client.testimonial && (
            <blockquote className="mt-4 border-l-2 border-neon-green/40 pl-3 text-sm italic text-foreground/80">
              “{client.testimonial}”
            </blockquote>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
