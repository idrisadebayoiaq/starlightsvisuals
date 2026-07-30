import {
  BRAND_NAME,
  BRAND_STUDIO_NAME,
  BRAND_TAGLINE,
  EMAIL_THEME as T,
  getEmailLogoUrl,
  getEmailMarkUrl,
  getSiteUrl,
  RESEND_FROM_ADDRESS,
} from "@/lib/email-config";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
}

type ShellOptions = {
  preheader: string;
  title: string;
  eyebrow?: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
};

/** Shared branded HTML shell — dark neon look matching the website. */
export function renderEmailShell(options: ShellOptions): string {
  const siteUrl = getSiteUrl();
  const logoUrl = getEmailLogoUrl();
  const markUrl = getEmailMarkUrl();
  const year = new Date().getFullYear();
  const eyebrow = options.eyebrow
    ? `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:${T.accent};">${escapeHtml(options.eyebrow)}</p>`
    : "";
  const cta = options.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0;">
        <tr>
          <td style="border-radius:6px;background:${T.accent};">
            <a href="${escapeHtml(options.cta.href)}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;color:#050505;">
              ${escapeHtml(options.cta.label)}
            </a>
          </td>
        </tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escapeHtml(options.title)}</title>
  <!--[if mso]>
  <style type="text/css">body, table, td { font-family: Arial, Helvetica, sans-serif !important; }</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:${T.bg};color:${T.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${escapeHtml(options.preheader)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${T.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${T.card};border:1px solid ${T.cardBorder};border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 18px;border-bottom:1px solid ${T.line};background:linear-gradient(180deg, #101810 0%, ${T.card} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
                      <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(BRAND_NAME)}" width="148" style="display:block;width:148px;max-width:100%;height:auto;border:0;" />
                    </a>
                  </td>
                  <td valign="middle" align="right">
                    <img src="${escapeHtml(markUrl)}" alt="" width="44" height="44" style="display:block;width:44px;height:44px;border-radius:10px;border:1px solid ${T.line};background:#0a0a0a;" />
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${T.muted};">
                ${escapeHtml(BRAND_TAGLINE)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="height:3px;background:${T.accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:32px 28px 8px;">
              ${eyebrow}
              <h1 style="margin:0 0 18px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;font-weight:700;letter-spacing:0.04em;color:${T.white};">
                ${escapeHtml(options.title)}
              </h1>
              ${options.bodyHtml}
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${T.line};">
                <tr>
                  <td style="padding-top:22px;">
                    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${T.text};">
                      ${escapeHtml(BRAND_STUDIO_NAME)}
                    </p>
                    <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${T.muted};">
                      Cinematic 2D &amp; 3D animation, motion graphics, and VFX.
                    </p>
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
                      <a href="mailto:${RESEND_FROM_ADDRESS}" style="color:${T.accent};text-decoration:none;">${RESEND_FROM_ADDRESS}</a>
                      &nbsp;·&nbsp;
                      <a href="${escapeHtml(siteUrl)}" style="color:${T.accent};text-decoration:none;">Visit website</a>
                    </p>
                    <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#666666;">
                      © ${year} ${escapeHtml(BRAND_NAME)}. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderDetailRows(
  rows: Array<{ label: string; value: string; href?: string }>,
): string {
  const items = rows
    .filter((row) => row.value.trim())
    .map((row) => {
      const valueHtml = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${T.accent};text-decoration:none;word-break:break-word;">${escapeHtml(row.value)}</a>`
        : `<span style="color:${T.text};word-break:break-word;">${nl2br(row.value)}</span>`;

      return `<tr>
        <td style="padding:14px 0;border-bottom:1px solid ${T.line};">
          <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${T.accent};">${escapeHtml(row.label)}</p>
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;">${valueHtml}</p>
        </td>
      </tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">${items}</table>`;
}

export function renderParagraphs(paragraphs: string[]): string {
  return paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${T.muted};">${nl2br(p)}</p>`,
    )
    .join("");
}

export function renderMessageCard(message: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
    <tr>
      <td style="padding:18px 18px;border:1px solid ${T.line};border-left:3px solid ${T.accent};border-radius:8px;background:${T.accentSoft};">
        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${T.text};">${nl2br(message)}</p>
      </td>
    </tr>
  </table>`;
}
