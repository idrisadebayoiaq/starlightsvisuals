export type SupportedLanguage = {
  code: string;
  label: string;
  nativeLabel: string;
  country: string;
  rtl?: boolean;
  /** Future route prefix e.g. /de */
  routePrefix?: string;
};

export const DEFAULT_LANGUAGE = "de";

/** Admin CMS stays in English regardless of the public site language. */
export const ADMIN_UI_LANGUAGE = "en";

export const POPUP_DISMISSED_KEY = "starlights_i18n_popup_dismissed";
export const LANGUAGE_PREFERENCE_KEY = "i18nextLng";

export const supportedLanguages: SupportedLanguage[] = [
  { code: "de", label: "German", nativeLabel: "Deutsch", country: "Germany" },
  { code: "en", label: "English", nativeLabel: "English", country: "United States" },
  { code: "fr", label: "French", nativeLabel: "Français", country: "France" },
  { code: "es", label: "Spanish", nativeLabel: "Español", country: "Spain" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", country: "Saudi Arabia", rtl: true },
  { code: "ko", label: "Korean", nativeLabel: "한국어", country: "South Korea" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português", country: "Brazil" },
  { code: "it", label: "Italian", nativeLabel: "Italiano", country: "Italy" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語", country: "Japan" },
  { code: "zh", label: "Chinese", nativeLabel: "中文", country: "China" },
  { code: "ru", label: "Russian", nativeLabel: "Русский", country: "Russia" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands", country: "Netherlands" },
  { code: "pl", label: "Polish", nativeLabel: "Polski", country: "Poland" },
  { code: "tr", label: "Turkish", nativeLabel: "Türkçe", country: "Turkey" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी", country: "India" },
  { code: "sv", label: "Swedish", nativeLabel: "Svenska", country: "Sweden" },
  { code: "da", label: "Danish", nativeLabel: "Dansk", country: "Denmark" },
  { code: "no", label: "Norwegian", nativeLabel: "Norsk", country: "Norway" },
  { code: "fi", label: "Finnish", nativeLabel: "Suomi", country: "Finland" },
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", country: "Indonesia" },
  { code: "th", label: "Thai", nativeLabel: "ไทย", country: "Thailand" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", country: "Vietnam" },
  { code: "he", label: "Hebrew", nativeLabel: "עברית", country: "Israel", rtl: true },
  { code: "uk", label: "Ukrainian", nativeLabel: "Українська", country: "Ukraine" },
  { code: "cs", label: "Czech", nativeLabel: "Čeština", country: "Czech Republic" },
];

export const supportedLanguageCodes = supportedLanguages.map((l) => l.code);

export function getLanguage(code: string): SupportedLanguage | undefined {
  return supportedLanguages.find((l) => l.code === code.split("-")[0]);
}

export function normalizeLanguageCode(code: string): string {
  const base = code.split("-")[0]?.toLowerCase() ?? DEFAULT_LANGUAGE;
  return supportedLanguageCodes.includes(base) ? base : DEFAULT_LANGUAGE;
}

export function isRtlLanguage(code: string): boolean {
  return getLanguage(code)?.rtl ?? false;
}
