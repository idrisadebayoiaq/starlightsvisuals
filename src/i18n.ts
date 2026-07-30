import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_PREFERENCE_KEY,
  normalizeLanguageCode,
  supportedLanguageCodes,
} from "@/i18n/languages";

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

export async function loadLocale(lang: string): Promise<void> {
  const code = lang.split("-")[0];
  if (loadedLocales.has(code)) return;

  const loader = localeLoaders[code];
  if (!loader) return;

  const module = await loader();
  i18n.addResourceBundle(code, "common", module.default as typeof en, true, true);
  loadedLocales.add(code);
}

function readStoredLanguage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
  } catch {
    return null;
  }
}

/** Resolve the public-site language (stored preference or German default). */
export function getPreferredPublicLanguage(): string {
  const stored = readStoredLanguage();
  if (!stored) return DEFAULT_LANGUAGE;
  return normalizeLanguageCode(stored);
}

/** Apply the visitor's public language (not used on admin routes). */
export async function applyPublicLanguage(): Promise<void> {
  const code = getPreferredPublicLanguage();
  await loadLocale(code);
  if (i18n.language?.split("-")[0] !== code) {
    await i18n.changeLanguage(code);
  }
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
  // Missing German keys fall back to English (source of truth for new CMS copy).
  fallbackLng: { default: ["en"] },
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
