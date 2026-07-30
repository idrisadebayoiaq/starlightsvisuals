/** Public studio identity used in outbound mail (no secrets). */
export const RESEND_FROM = "Starlight Visual Studio <info@starlightvisualstudio.de>";
export const RESEND_FROM_ADDRESS = "info@starlightvisualstudio.de";

export const BRAND_NAME = "Starlights Visuals";
export const BRAND_STUDIO_NAME = "Starlight Visual Studio";
export const BRAND_TAGLINE = "Animation & VFX Studio";

/** Neon dark theme — hex values for email-client compatibility. */
export const EMAIL_THEME = {
  bg: "#050505",
  card: "#0f0f0f",
  cardBorder: "#1f1f1f",
  accent: "#4cff3d",
  accentSoft: "rgba(76, 255, 61, 0.16)",
  text: "#f5f5f5",
  muted: "#a3a3a3",
  line: "#262626",
  white: "#ffffff",
} as const;

/**
 * Absolute public site origin for logo/assets in emails.
 * Prefer SITE_URL on Vercel (e.g. https://starlightvisualstudio.de).
 */
export function getSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/^https?:\/\//, "")}`;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "")}`;

  return "https://starlightsvisuals.vercel.app";
}

export function getEmailLogoUrl(): string {
  return `${getSiteUrl()}/email/logo.png`;
}

export function getEmailIconUrl(): string {
  return `${getSiteUrl()}/email/icon.png`;
}

export function getEmailMarkUrl(): string {
  return `${getSiteUrl()}/email/mark.png`;
}
