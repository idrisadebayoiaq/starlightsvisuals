import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { WorkCategorySlug } from "@/data/portfolio-works";
import { cn } from "@/lib/utils";

type SelectedWorkCardProps = {
  slug: WorkCategorySlug;
  tag: string;
  title: string;
  coverImage: string;
  index?: number;
  className?: string;
};

export function SelectedWorkCard({
  slug,
  tag,
  title,
  coverImage,
  index = 0,
  className,
}: SelectedWorkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link
        to="/works/$category"
        params={{ category: slug }}
        className={cn(
          "group relative block cursor-pointer overflow-hidden border border-border/80 bg-card/40 backdrop-blur-sm",
          "transition duration-300 hover:scale-[1.02] hover:border-neon-green",
          "hover:shadow-[0_0_32px_-8px_rgba(76,255,61,0.45)]",
        )}
      >
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={coverImage}
            alt={tag === title ? title : `${tag} ${title}`}
            width={800}
            height={1000}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105",
              slug === "2d-animation" && "object-[center_22%]",
              slug === "3d-animation" && "object-[center_35%]",
              slug === "video-editing" && "object-[center_40%]",
              slug === "branding" && "object-[center_35%]",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition group-hover:opacity-80" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <p className="font-display text-[10px] uppercase tracking-widest text-neon-green">{tag}</p>
            <h3 className="mt-1 font-display text-2xl tracking-tight text-foreground">{title}</h3>
          </div>
          <ArrowUpRight className="h-5 w-5 text-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neon-green" />
        </div>
      </Link>
    </motion.div>
  );
}
