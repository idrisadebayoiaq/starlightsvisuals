import { AnimatePresence, motion } from "framer-motion";
import { Globe, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_PREFERENCE_KEY,
  POPUP_DISMISSED_KEY,
  getLanguage,
  normalizeLanguageCode,
} from "@/i18n/languages";
import { setPublicLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

function getDetectedLanguage(): string {
  if (typeof navigator === "undefined") return DEFAULT_LANGUAGE;
  const nav = navigator.language || (navigator.languages?.[0] ?? DEFAULT_LANGUAGE);
  return normalizeLanguageCode(nav);
}

export function TranslationPopup() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [detectedCode, setDetectedCode] = useState(DEFAULT_LANGUAGE);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let dismissed: string | null = null;
    let modern: string | null = null;
    try {
      dismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
      modern = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    } catch {
      return;
    }

    if (dismissed === "true") return;

    // Only skip the popup when the visitor explicitly chose a non-default language
    // via the new preference key (not the legacy i18nextLng default).
    if (modern && normalizeLanguageCode(modern) !== DEFAULT_LANGUAGE) return;

    const detected = getDetectedLanguage();
    setDetectedCode(detected);

    if (detected !== DEFAULT_LANGUAGE) {
      const timer = window.setTimeout(() => setVisible(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(POPUP_DISMISSED_KEY, "true");
    } catch {
      /* storage blocked */
    }
    setVisible(false);
  }, []);

  const handleTranslate = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      await setPublicLanguage(detectedCode);
      dismiss();
    } finally {
      setBusy(false);
    }
  }, [busy, detectedCode, dismiss]);

  const handleStayDefault = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Persist + apply German before closing so nothing can race back to English.
      await setPublicLanguage(DEFAULT_LANGUAGE);
      dismiss();
    } finally {
      setBusy(false);
    }
  }, [busy, dismiss]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible, dismiss]);

  const lang = getLanguage(detectedCode);
  const defaultLang = getLanguage(DEFAULT_LANGUAGE);
  if (!lang) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="translation-popup-title"
          aria-describedby="translation-popup-desc"
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            type="button"
            aria-label={t("popup.close")}
            className="absolute inset-0 bg-background/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              void handleStayDefault();
            }}
          />

          <motion.div
            className={cn(
              "relative z-10 w-full max-w-md overflow-hidden rounded-2xl",
              "border border-white/10 bg-[oklch(0.11_0_0/0.92)] shadow-[0_32px_100px_-24px_oklch(0.88_0.27_142/0.35)]",
              "backdrop-blur-xl",
            )}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.88_0.27_142/0.12),transparent)]" />

            <button
              type="button"
              onClick={() => {
                void handleStayDefault();
              }}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition hover:border-neon-green hover:text-neon-green"
              aria-label={t("popup.close")}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-6 pt-8 sm:p-8">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-neon-green/30 bg-neon-green/10 text-neon-green shadow-[0_0_24px_-6px_oklch(0.88_0.27_142/0.5)]">
                <Globe className="h-5 w-5" aria-hidden />
              </div>

              <h2
                id="translation-popup-title"
                className="font-display text-lg uppercase tracking-wide text-foreground sm:text-xl"
              >
                {t("popup.title")}
              </h2>

              <p
                id="translation-popup-desc"
                className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {t("popup.message", {
                  country: lang.country,
                  language: lang.nativeLabel,
                })}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    void handleStayDefault();
                  }}
                  className="flex-1 rounded-full bg-neon-green px-5 py-3 font-display text-xs uppercase tracking-widest text-background transition hover:shadow-[0_0_28px_-6px_oklch(0.88_0.27_142/0.65)] disabled:opacity-60"
                >
                  {t("popup.stayDefault", {
                    language: defaultLang?.nativeLabel ?? "Deutsch",
                  })}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    void handleTranslate();
                  }}
                  className="flex-1 rounded-full border border-white/15 px-5 py-3 font-display text-xs uppercase tracking-widest text-foreground transition hover:border-neon-green/50 hover:text-neon-green disabled:opacity-60"
                >
                  {t("popup.translate")} · {lang.nativeLabel}
                </button>
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">
                {t("popup.currentLanguage", {
                  language: getLanguage(i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE)?.nativeLabel ?? "Deutsch",
                })}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
