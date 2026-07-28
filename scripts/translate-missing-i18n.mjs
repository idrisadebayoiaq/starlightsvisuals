import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { translateText } from "./lib/translate-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "src", "locales");
const cachePath = path.join(__dirname, "translation-cache.json");

const TARGET_LANGS = fs.readdirSync(localesDir).filter((code) => code !== "en");

const googleLang = {
  zh: "zh-CN",
  he: "iw",
};

const SKIP_EXACT = new Set([
  "Starlights Visuals",
  "Starlight Visuals",
  "VFX",
  "2D",
  "3D",
  "FAQ",
  "EN",
  "OK",
]);

function loadCache() {
  if (!fs.existsSync(cachePath)) return {};
  return JSON.parse(fs.readFileSync(cachePath, "utf8"));
}

function saveCache(cache) {
  fs.writeFileSync(cachePath, `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

function deepMergeMissing(target, source) {
  if (typeof source !== "object" || source === null || Array.isArray(source)) {
    return target === undefined ? source : target;
  }
  const out = { ...(target && typeof target === "object" ? target : {}) };
  for (const key of Object.keys(source)) {
    if (!(key in out) || out[key] === undefined) {
      out[key] = structuredClone(source[key]);
    } else {
      out[key] = deepMergeMissing(out[key], source[key]);
    }
  }
  return out;
}

function shouldSkipKey(fullPath, key, value) {
  if (!value?.trim()) return true;
  if (SKIP_EXACT.has(value.trim())) return true;
  if (/^[\d+.%€$£¥]+$/.test(value.trim())) return true;
  if (value.includes("@") && value.includes(".")) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (key === "name" && fullPath.includes("clients.")) return true;
  if (key === "author" && fullPath.includes("blogPage.")) return true;
  return false;
}

function collectLeaves(node, englishNode, pathParts, out) {
  if (typeof node === "string") {
    const enValue = typeof englishNode === "string" ? englishNode : node;
    const fullPath = pathParts.join(".");
    const key = pathParts[pathParts.length - 1] ?? "";
    out.push({ pathParts: [...pathParts], fullPath, key, value: node, enValue });
    return;
  }
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  for (const key of Object.keys(node)) {
    collectLeaves(node[key], englishNode?.[key], [...pathParts, key], out);
  }
}

function setAtPath(root, pathParts, value) {
  let cur = root;
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    cur = cur[pathParts[i]];
  }
  cur[pathParts[pathParts.length - 1]] = value;
}

async function translateWithFallback(text, lang) {
  const tl = googleLang[lang] ?? lang;
  try {
    return await translateText(text, tl, "en");
  } catch (primaryError) {
    // MyMemory fallback when Google DNS/network fails
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", text.slice(0, 450));
    url.searchParams.set("langpair", `en|${tl === "zh-CN" ? "zh-CN" : tl}`);
    const res = await fetch(url);
    if (!res.ok) throw primaryError;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (!translated || /MYMEMORY WARNING/i.test(translated)) throw primaryError;
    return translated;
  }
}

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en", "common.json"), "utf8"));
const cache = loadCache();
const onlyLang = process.argv[2];
let hardFailures = 0;

for (const lang of TARGET_LANGS) {
  if (onlyLang && lang !== onlyLang) continue;

  const filePath = path.join(localesDir, lang, "common.json");
  const locale = deepMergeMissing(JSON.parse(fs.readFileSync(filePath, "utf8")), en);
  const leaves = [];
  collectLeaves(locale, en, [], leaves);

  const stats = { translated: 0, fromCache: 0, already: 0, skipped: 0 };
  console.log(`Translating missing UI copy → ${lang} (${leaves.length} leaves)…`);

  try {
    for (const leaf of leaves) {
      if (shouldSkipKey(leaf.fullPath, leaf.key, leaf.enValue)) {
        stats.skipped += 1;
        continue;
      }
      if (leaf.value !== leaf.enValue) {
        stats.already += 1;
        continue;
      }

      const cacheKey = `${lang}::${leaf.enValue}`;
      let translated = cache[cacheKey];
      let wasNew = false;
      if (translated) {
        stats.fromCache += 1;
      } else {
        translated = await translateWithFallback(leaf.enValue, lang);
        cache[cacheKey] = translated;
        stats.translated += 1;
        wasNew = true;
      }
      setAtPath(locale, leaf.pathParts, translated);
      if (wasNew && stats.translated % 25 === 0) {
        console.log(`  … ${lang}: ${stats.translated} new strings`);
        saveCache(cache);
        fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
      }
    }

    fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
    saveCache(cache);
    console.log(
      `  ✓ ${lang}: +${stats.translated} translated, ${stats.fromCache} cache hits, ${stats.already} already localized, ${stats.skipped} skipped`,
    );
  } catch (error) {
    hardFailures += 1;
    fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
    saveCache(cache);
    console.error(`  ✗ ${lang} failed (partial saved):`, error?.message ?? error);
  }
}

console.log(
  hardFailures
    ? `Done with ${hardFailures} language failure(s). Re-run npm run translate:missing to resume.`
    : "Done translating missing locale strings.",
);
process.exitCode = hardFailures ? 1 : 0;
