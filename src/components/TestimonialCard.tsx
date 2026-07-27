import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staggerItem } from "@/components/SectionReveal";
import { cn } from "@/lib/utils";

export type TextTestimonial = {
  headline: string;
  quote: string;
  name: string;
  company: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  rating?: number;
  verified?: boolean;
};

/** Matches the shorter mock quotes so cards stay even in the carousel. */
const QUOTE_PREVIEW_CHARS = 145;

function avatarSrc(testimonial: TextTestimonial) {
  if (testimonial.avatarUrl) return testimonial.avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.initials)}&background=141414&color=9dff57&size=128&bold=true&format=png`;
}

type TestimonialCardProps = {
  testimonial: TextTestimonial;
  className?: string;
  onExpandChange?: (expanded: boolean) => void;
};

export function TestimonialCard({
  testimonial,
  className,
  onExpandChange,
}: TestimonialCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const rating = testimonial.rating ?? 5;
  const verified = testimonial.verified ?? true;

  const needsTruncate = testimonial.quote.length > QUOTE_PREVIEW_CHARS;
  const displayQuote =
    expanded || !needsTruncate
      ? testimonial.quote
      : `${testimonial.quote.slice(0, QUOTE_PREVIEW_CHARS).trimEnd()}…`;

  function toggleExpand() {
    setExpanded((prev) => {
      const next = !prev;
      onExpandChange?.(next);
      return next;
    });
  }

  return (
    <motion.figure
      variants={staggerItem}
      whileHover={{ y: -8, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "group flex h-full origin-center flex-col rounded-xl border border-white/[0.08] bg-[oklch(0.11_0_0)] p-6 md:p-8",
        "transition-[border-color,box-shadow,z-index] duration-400",
        "hover:z-20 hover:border-neon-green/40 hover:shadow-[0_24px_70px_-20px_oklch(0.88_0.27_142/0.35)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="inline-flex gap-0.5 rounded-md bg-background px-2.5 py-1.5"
          aria-label={t("testimonials.starsAria", { rating })}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3 w-3",
                i < rating ? "fill-neon-green text-neon-green" : "text-muted-foreground/25",
              )}
            />
          ))}
        </div>

        {verified && (
          <div className="flex shrink-0 items-center gap-1.5 font-display text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-neon-green" aria-hidden />
            <span>{t("testimonials.verifiedClient")}</span>
          </div>
        )}
      </div>

      <h3 className="mt-6 font-display text-base uppercase leading-snug tracking-tight text-foreground md:text-lg">
        {testimonial.headline}
      </h3>

      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
        <p>{displayQuote}</p>
        {needsTruncate && (
          <button
            type="button"
            onClick={toggleExpand}
            className="mt-2 font-display text-[11px] uppercase tracking-[0.14em] text-neon-green transition-opacity hover:opacity-80"
          >
            {expanded ? t("testimonials.seeLess") : t("testimonials.seeMore")}
          </button>
        )}
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-4 border-t border-white/[0.08] pt-6">
        <Avatar className="h-14 w-14 shrink-0 rounded-md border border-white/10">
          <AvatarImage
            src={avatarSrc(testimonial)}
            alt={testimonial.name}
            className="rounded-md object-cover"
          />
          <AvatarFallback className="rounded-md bg-card font-display text-sm text-neon-green">
            {testimonial.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-display text-sm uppercase tracking-wide text-foreground">
            {testimonial.name}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {testimonial.role}, {testimonial.company}
          </p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
