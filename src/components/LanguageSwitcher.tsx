import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { setPublicLanguage } from "@/i18n";

import {
  DEFAULT_LANGUAGE,
  supportedLanguages,
  type SupportedLanguage,
} from "@/i18n/languages";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  variant?: "compact" | "dropdown";
  className?: string;
  menuPlacement?: "top" | "bottom";
  theme?: "dark" | "light";
};

function LanguageSwitcherInner({
  variant = "dropdown",
  className,
  menuPlacement = "bottom",
  theme = "dark",
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentCode = i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE;
  const current =
    supportedLanguages.find((l) => l.code === currentCode) ??
    supportedLanguages[0];

  const changeLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      await setPublicLanguage(lang.code);
      setOpen(false);
    },
    [],
  );

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "compact") {
    return (
      <div
        ref={rootRef}
        className={cn("flex flex-wrap items-center gap-1", className)}
        role="group"
        aria-label={t("languageSwitcher.label")}
      >
        {supportedLanguages.slice(0, 6).map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => changeLanguage(lang)}
            className={cn(
              "rounded-md px-2 py-1 font-display text-[10px] uppercase tracking-widest transition",
              currentCode === lang.code
                ? "bg-neon-green/15 text-neon-green"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={currentCode === lang.code ? "true" : undefined}
            aria-label={`${lang.nativeLabel}`}
          >
            {lang.code.toUpperCase()}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border px-2 py-1 font-display text-[10px] uppercase tracking-widest text-muted-foreground transition hover:border-neon-green hover:text-neon-green"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          ···
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute right-0 top-full z-[70] mt-2 max-h-64 w-48 overflow-y-auto rounded-xl border border-white/10 bg-[oklch(0.11_0_0/0.96)] p-1 shadow-xl backdrop-blur-xl"
              role="listbox"
            >
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={currentCode === lang.code}
                  onClick={() => changeLanguage(lang)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/5"
                >
                  <span>{lang.nativeLabel}</span>
                  {currentCode === lang.code && (
                    <Check className="h-3.5 w-3.5 text-neon-green" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const isLight = theme === "light";
  const opensUp = menuPlacement === "top";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-2",
          "font-display text-[10px] uppercase tracking-widest transition",
          isLight && "w-full",
          isLight
            ? "border-black/15 bg-white text-black hover:border-neon-green/50 hover:text-neon-green"
            : "border-white/10 bg-background/60 text-foreground backdrop-blur-sm hover:border-neon-green/50 hover:text-neon-green",
          open && "border-neon-green/40 text-neon-green",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("languageSwitcher.selectLanguage")}
      >
        <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className={cn(isLight && "flex-1 text-left")}>{current.code.toUpperCase()}</span>
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: opensUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: opensUp ? 4 : -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute z-[70] overflow-hidden rounded-xl",
              opensUp ? "bottom-full left-0 mb-2 w-full" : "top-full right-0 mt-2 w-56",
              isLight
                ? "border border-black/10 bg-white shadow-[0_16px_40px_-12px_rgba(0,0,0,0.25)]"
                : "border border-white/10 bg-[oklch(0.11_0_0/0.96)] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl",
            )}
            role="listbox"
            aria-label={t("languageSwitcher.label")}
          >
            <div className="max-h-56 overflow-y-auto p-1.5">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={currentCode === lang.code}
                  onClick={() => changeLanguage(lang)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition",
                    currentCode === lang.code
                      ? "bg-neon-green/10 text-neon-green"
                      : isLight
                        ? "text-black/85 hover:bg-black/5"
                        : "text-foreground/90 hover:bg-white/5",
                  )}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{lang.nativeLabel}</span>
                    <span
                      className={cn(
                        "truncate text-[10px] uppercase tracking-wider",
                        isLight ? "text-black/45" : "text-muted-foreground",
                      )}
                    >
                      {lang.label}
                    </span>
                  </span>
                  {currentCode === lang.code && (
                    <Check className="h-4 w-4 shrink-0 text-neon-green" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const LanguageSwitcher = memo(LanguageSwitcherInner);
