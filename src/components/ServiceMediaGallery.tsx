import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export type ServiceGalleryItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt?: string;
};

type ServiceMediaGalleryProps = {
  items: ServiceGalleryItem[];
  className?: string;
};

export function ServiceMediaGallery({ items, className }: ServiceMediaGalleryProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  if (!items.length) return null;

  const current = items[Math.min(index, items.length - 1)]!;
  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + items.length) % items.length);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-black">
        {current.type === "video" ? (
          <video
            key={current.src}
            src={current.src}
            poster={current.poster}
            controls
            playsInline
            className="aspect-[16/10] w-full object-cover"
          />
        ) : (
          <img
            key={current.src}
            src={current.src}
            alt={current.alt ?? ""}
            className="aspect-[16/10] w-full object-cover"
          />
        )}

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t("servicesPage.detailsNav.prev", { defaultValue: "Previous" })}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:border-neon-green hover:text-neon-green"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t("servicesPage.detailsNav.next", { defaultValue: "Next" })}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:border-neon-green hover:text-neon-green"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={`${item.src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition",
                i === index ? "border-neon-green" : "border-border/50 opacity-70 hover:opacity-100",
              )}
            >
              {item.type === "video" ? (
                <>
                  <img
                    src={item.poster || item.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-[10px] font-display uppercase tracking-widest text-white">
                    ▶
                  </span>
                </>
              ) : (
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
