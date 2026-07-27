import { motion } from "framer-motion";
import { BadgeCheck, Star, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staggerItem } from "@/components/SectionReveal";
import { cn } from "@/lib/utils";

export type TextTestimonial = {
  id: string;
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

const QUOTE_PREVIEW_CHARS = 130;

function avatarSrc(testimonial: TextTestimonial) {
  if (testimonial.avatarUrl) return testimonial.avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.initials)}&background=1a1a1a&color=9dff57&size=128&bold=true&format=png`;
}

type TestimonialCardProps = {
  testimonial: TextTestimonial;
  className?: string;
  expanded?: boolean;
  onToggle?: () => void;
};

export function TestimonialCard({
  testimonial,
  className,
  expanded = false,
  onToggle,
}: TestimonialCardProps) {
  const { t } = useTranslation();
  const rating = testimonial.rating ?? 5;
  const verified = testimonial.verified ?? true;

  const needsTruncate = testimonial.quote.length > QUOTE_PREVIEW_CHARS;
  const displayQuote =
    expanded || !needsTruncate
      ? testimonial.quote
      : `${testimonial.quote.slice(0, QUOTE_PREVIEW_CHARS).trimEnd()}…`;

  return (
    <motion.figure
      variants={staggerItem}
      layout
      onClick={onToggle}
      role={onToggle ? "button" : undefined}
      tabIndex={onToggle ? 0 : undefined}
      onKeyDown={
        onToggle
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onToggle();
              }
            }
          : undefined
      }
      aria-expanded={onToggle ? expanded : undefined}
      animate={{
        scale: expanded ? 1.08 : 1,
        y: expanded ? -12 : 0,
        zIndex: expanded ? 30 : 1,
      }}
      whileHover={!expanded ? { y: -6, scale: 1.03 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "group relative flex h-full origin-center cursor-pointer flex-col rounded-xl border border-border bg-card p-6 md:p-8",
        "shadow-sm outline-none transition-[border-color,box-shadow] duration-300",
        "hover:border-neon-green/40 hover:shadow-[0_24px_70px_-24px_oklch(0.88_0.27_142/0.28)]",
        "focus-visible:border-neon-green focus-visible:ring-2 focus-visible:ring-neon-green/40",
        expanded && "border-neon-green/50 shadow-[0_28px_80px_-20px_oklch(0.88_0.27_142/0.35)]",
        className,
      )}
    >
      {expanded && (
        <button
          type="button"
          aria-label={t("testimonials.seeLess")}
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className="absolute right-3 top-3 rounded border border-border bg-background p-1.5 text-muted-foreground transition hover:border-neon-green hover:text-neon-green"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div
          className="inline-flex gap-0.5 rounded-md bg-secondary px-2.5 py-1.5"
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
        {needsTruncate && !expanded && (
          <span className="mt-2 inline-block font-display text-[11px] uppercase tracking-[0.14em] text-neon-green">
            {t("testimonials.tapToRead")}
          </span>
        )}
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
        <Avatar className="h-14 w-14 shrink-0 rounded-md border border-border">
          <AvatarImage
            src={avatarSrc(testimonial)}
            alt={testimonial.name}
            className="rounded-md object-cover"
          />
          <AvatarFallback className="rounded-md bg-secondary font-display text-sm text-neon-green">
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
