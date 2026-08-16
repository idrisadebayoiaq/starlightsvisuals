import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_PREFERENCE_KEY,
  LEGACY_LANGUAGE_PREFERENCE_KEY,
  normalizeLanguageCode,
  supportedLanguageCodes,
} from "@/i18n/languages";
import { deepMerge } from "@/lib/translation-utils";
import { getPublicSiteCopyFn } from "@/server/cms-translations";

import de from "@/locales/de/common.json";
import en from "@/locales/en/common.json";

const localeLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  fr: () => import("@/locales/fr/common.json"),
  es: () => import("@/locales/es/common.json"),
  ar: () => import("@/locales/ar/common.json"),
  ko: () => import("@/locales/ko/common.json"),
  pt: () => import("@/locales/pt/common.json"),
  it: () => import("@/locales/it/common.json"),
  ja: () => import("@/locales/ja/common.json"),
  zh: () => import("@/locales/zh/common.json"),
  ru: () => import("@/locales/ru/common.json"),
  nl: () => import("@/locales/nl/common.json"),
  pl: () => import("@/locales/pl/common.json"),
  tr: () => import("@/locales/tr/common.json"),
  hi: () => import("@/locales/hi/common.json"),
  sv: () => import("@/locales/sv/common.json"),
  da: () => import("@/locales/da/common.json"),
  no: () => import("@/locales/no/common.json"),
  fi: () => import("@/locales/fi/common.json"),
  id: () => import("@/locales/id/common.json"),
  th: () => import("@/locales/th/common.json"),
  vi: () => import("@/locales/vi/common.json"),
  he: () => import("@/locales/he/common.json"),
  uk: () => import("@/locales/uk/common.json"),
  cs: () => import("@/locales/cs/common.json"),
};

/** German (default) + English (admin UI / fallback) ship in the main bundle. */
const loadedLocales = new Set<string>(["de", "en"]);
const siteCopyApplied = new Set<string>();

async function applySiteCopyOverride(code: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (siteCopyApplied.has(code)) return;

  try {
    const result = await getPublicSiteCopyFn({ data: { locale: code } });
    if (result.copy && typeof result.copy === "object") {
      const current = (i18n.getResourceBundle(code, "common") ?? {}) as Record<string, unknown>;
      const merged = deepMerge(current, result.copy);
      i18n.addResourceBundle(code, "common", merged, true, true);
    }
    siteCopyApplied.add(code);
  } catch (err) {
    console.error("[i18n] site copy override failed", code, err);
    // Still mark applied to avoid hammering a failing endpoint on every nav.
    siteCopyApplied.add(code);
  }
}

/** Force re-fetch of curated site copy (e.g. after admin save on another tab). */
export function invalidateSiteCopyOverride(code?: string) {
  if (code) siteCopyApplied.delete(code.split("-")[0]!);
  else siteCopyApplied.clear();
}

export async function loadLocale(lang: string): Promise<void> {
  const code = lang.split("-")[0]!;
  if (!loadedLocales.has(code)) {
    const loader = localeLoaders[code];
    if (loader) {
      const module = await loader();
      i18n.addResourceBundle(code, "common", module.default as typeof en, true, true);
      loadedLocales.add(code);
    }
  }
  await applySiteCopyOverride(code);
}

/** Resolve the visitor's public language (stored preference or German default). */
export function getPreferredPublicLanguage(): string {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const modern = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    if (modern) return normalizeLanguageCode(modern);

    const legacy = localStorage.getItem(LEGACY_LANGUAGE_PREFERENCE_KEY);
    if (!legacy) return DEFAULT_LANGUAGE;

    // Older builds defaulted to English and wrote `i18nextLng=en` automatically.
    // Treat that legacy default as unset so the new German default can apply.
    // Explicit English after this update is stored in `starlights_lng`.
    if (normalizeLanguageCode(legacy) === "en") {
      return DEFAULT_LANGUAGE;
    }

    return normalizeLanguageCode(legacy);
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function persistPublicLanguage(code: string): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeLanguageCode(code);
  try {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, normalized);
    // Keep legacy key in sync so old readers don't resurrect English.
    localStorage.setItem(LEGACY_LANGUAGE_PREFERENCE_KEY, normalized);
  } catch {
    /* storage blocked */
  }
}

/** Apply the visitor's public language (not used on admin routes). */
export async function applyPublicLanguage(): Promise<void> {
  const code = getPreferredPublicLanguage();
  await loadLocale(code);
  if (i18n.language?.split("-")[0] !== code) {
    await i18n.changeLanguage(code);
  }
}

/** Explicitly switch the public site language and persist the choice. */
export async function setPublicLanguage(code: string): Promise<void> {
  const normalized = normalizeLanguageCode(code);
  persistPublicLanguage(normalized);
  await loadLocale(normalized);
  await i18n.changeLanguage(normalized);
}

/** @deprecated Prefer applyPublicLanguage — kept for existing imports. */
export async function applyStoredLanguage(): Promise<void> {
  await applyPublicLanguage();
}

void i18n.use(initReactI18next).init({
  resources: {
    de: { common: de },
    en: { common: en },
  },
  lng: DEFAULT_LANGUAGE,
  supportedLngs: supportedLanguageCodes,
  nonExplicitSupportedLngs: true,
  load: "languageOnly",
  // Missing German keys fall back to English (source of truth for new CMS copy).
  fallbackLng: ["en"],
  returnNull: false,
  ns: ["common"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  partialBundledLanguages: true,
});

export default i18n;

/** Future-ready locale path helper for SEO routing e.g. /fr/services */
export function localePath(locale: string, path: string): string {
  if (locale === DEFAULT_LANGUAGE) return path;
  return `/${locale}${path === "/" ? "" : path}`;
}

export type LocaleResource = typeof en;
