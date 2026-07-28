const DELAY_MS = 120;
const lastCall = { at: 0 };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function throttle() {
  const wait = DELAY_MS - (Date.now() - lastCall.at);
  if (wait > 0) await sleep(wait);
  lastCall.at = Date.now();
}

/** Unofficial Google Translate endpoint (dev/build scripts only). */
export async function translateText(text, targetLang, sourceLang = "en") {
  const trimmed = text?.trim();
  if (!trimmed || targetLang === sourceLang) return text;

  await throttle();

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", sourceLang);
  url.searchParams.set("tl", targetLang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", trimmed);

  let lastError;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    if (attempt > 0) await sleep(500 * attempt);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        lastError = new Error(
          `Translate failed (${res.status}) for ${targetLang}: ${trimmed.slice(0, 40)}…`,
        );
        continue;
      }

      const data = await res.json();
      return data[0]?.map((part) => part[0]).join("") ?? trimmed;
    } catch (error) {
      lastError = error;
      // DNS / transient network blips — keep retrying
      if (attempt < 7) continue;
    }
  }

  throw lastError ?? new Error(`Translate failed for ${targetLang}`);
}
