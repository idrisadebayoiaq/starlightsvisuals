/** Server-only translation helper (same unofficial Google endpoint used by build scripts). */

const DELAY_MS = 100;
let lastCallAt = 0;

const GOOGLE_LANG: Record<string, string> = {
  zh: "zh-CN",
  he: "iw",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function throttle() {
  const wait = DELAY_MS - (Date.now() - lastCallAt);
  if (wait > 0) await sleep(wait);
  lastCallAt = Date.now();
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang = "en",
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text;
  if (targetLang === sourceLang) return text;

  const tl = GOOGLE_LANG[targetLang] ?? targetLang;
  const sl = GOOGLE_LANG[sourceLang] ?? sourceLang;

  await throttle();

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", sl);
  url.searchParams.set("tl", tl);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", trimmed);

  let lastError: unknown;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    if (attempt > 0) await sleep(400 * attempt);
    try {
      const res = await fetch(url.toString());
      if (!res.ok) {
        lastError = new Error(`Translate failed (${res.status})`);
        continue;
      }
      const data = (await res.json()) as Array<Array<[string]> | undefined>;
      const translated = data[0]?.map((part) => part[0]).join("") ?? trimmed;
      return translated;
    } catch (error) {
      lastError = error;
    }
  }

  console.error("[translate] failed", { targetLang, preview: trimmed.slice(0, 40) }, lastError);
  return trimmed;
}

export async function translateMany(
  values: string[],
  targetLang: string,
  sourceLang = "en",
): Promise<string[]> {
  const out: string[] = [];
  for (const value of values) {
    out.push(await translateText(value, targetLang, sourceLang));
  }
  return out;
}
