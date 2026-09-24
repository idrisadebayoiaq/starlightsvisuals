/**
 * Translate only industrial-pivot UI strings that are still English in non-EN locales.
 * Faster than full translate:missing for industries / case studies / about / services / trust.
 *
 * Run: node scripts/translate-industrial-i18n.mjs [lang]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { translateText } from "./lib/translate-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const localesDir = path.join(root, "src", "locales");
const cachePath = path.join(__dirname, "translation-cache.json");

const PREFIXES = [
  "aboutPage.",
  "trust.",
  "industries.",
  "industriesPage.",
  "caseStudies.",
  "caseStudiesPage.",
  "entertainmentServicesPage.",
  "servicesPage.",
  "nav.industries",
  "nav.caseStudies",
  "home.services",
  "home.trust",
  "home.industries",
  "home.caseStudies",
  "portfolioPage.",
];

const googleLang = { zh: "zh-CN", he: "iw" };

const SKIP_EXACT = new Set([
  "Starlights Visuals",
  "Starlight Visuals",
  "Starlight Visual Studio",
  "VFX",
  "2D",
  "3D",
  "FAQ",
  "CGI",
  "CAD",
  "NDA",
  "EN",
  "OK",
  "www.starlightvisualstudio.com",
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
    return target === undefined ? structuredClone(source) : target;
  }
  const out = { ...(target && typeof target === "object" && !Array.isArray(target) ? target : {}) };
  for (const key of Object.keys(source)) {
    if (!(key in out) || out[key] === undefined) {
      out[key] = structuredClone(source[key]);
    } else if (Array.isArray(source[key])) {
      // Prefer longer EN arrays when locale array is shorter/missing items
      if (!Array.isArray(out[key]) || out[key].length < source[key].length) {
        out[key] = structuredClone(source[key]);
      }
    } else {
      out[key] = deepMergeMissing(out[key], source[key]);
    }
  }
  return out;
}

function shouldSkip(fullPath, key, value) {
  if (!value?.trim()) return true;
  if (SKIP_EXACT.has(value.trim())) return true;
  if (/^[\d+.%€$£¥]+$/.test(value.trim())) return true;
  if (value.includes("@") && value.includes(".")) return true;
  if (/^https?:\/\//i.test(value)) return true;
  if (/^www\./i.test(value.trim())) return true;
  if (key === "website") return true;
  return false;
}

function matchesPrefix(fullPath) {
  return PREFIXES.some((p) => fullPath === p.replace(/\.$/, "") || fullPath.startsWith(p));
}

function collectLeaves(node, englishNode, pathParts, out) {
  if (typeof node === "string") {
    const enValue = typeof englishNode === "string" ? englishNode : node;
    const fullPath = pathParts.join(".");
    const key = pathParts[pathParts.length - 1] ?? "";
    out.push({ pathParts: [...pathParts], fullPath, key, value: node, enValue });
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((item, i) => {
      collectLeaves(item, Array.isArray(englishNode) ? englishNode[i] : undefined, [...pathParts, String(i)], out);
    });
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const key of Object.keys(node)) {
    collectLeaves(node[key], englishNode?.[key], [...pathParts, key], out);
  }
}

function setAtPath(rootObj, pathParts, value) {
  let cur = rootObj;
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const part = pathParts[i];
    const next = pathParts[i + 1];
    const nextIsIndex = /^\d+$/.test(next);
    if (cur[part] == null) cur[part] = nextIsIndex ? [] : {};
    cur = cur[part];
  }
  cur[pathParts[pathParts.length - 1]] = value;
}

async function translateWithFallback(text, lang) {
  const tl = googleLang[lang] ?? lang;
  // Prefer MyMemory first — Google often returns 429 under bulk load.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 1500 * attempt));
      const url = new URL("https://api.mymemory.translated.net/get");
      url.searchParams.set("q", text.slice(0, 450));
      url.searchParams.set("langpair", `en|${tl === "zh-CN" ? "zh-CN" : tl}`);
      const res = await Promise.race([
        fetch(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error("mymemory timeout")), 10000)),
      ]);
      if (!res.ok) continue;
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && !/MYMEMORY WARNING/i.test(translated)) {
        await new Promise((r) => setTimeout(r, 200));
        return translated;
      }
    } catch {
      /* retry / fall through */
    }
  }

  return translateText(text, tl, "en");
}

const en = JSON.parse(fs.readFileSync(path.join(localesDir, "en", "common.json"), "utf8"));
const cache = loadCache();
const onlyLang = process.argv[2];
const TARGET_LANGS = fs.readdirSync(localesDir).filter((code) => code !== "en");
let hardFailures = 0;

for (const lang of TARGET_LANGS) {
  if (onlyLang && lang !== onlyLang) continue;

  const filePath = path.join(localesDir, lang, "common.json");
  const locale = deepMergeMissing(JSON.parse(fs.readFileSync(filePath, "utf8")), en);
  const leaves = [];
  collectLeaves(locale, en, [], leaves);

  const todo = leaves.filter(
    (leaf) =>
      matchesPrefix(leaf.fullPath) &&
      leaf.value === leaf.enValue &&
      !shouldSkip(leaf.fullPath, leaf.key, leaf.enValue),
  );

  console.log(`Industrial i18n → ${lang}: ${todo.length} strings…`);
  const stats = { translated: 0, fromCache: 0, skippedFail: 0 };

  try {
    for (const leaf of todo) {
      const cacheKey = `${lang}::${leaf.enValue}`;
      let translated = cache[cacheKey];
      if (translated) {
        stats.fromCache += 1;
      } else {
        try {
          translated = await translateWithFallback(leaf.enValue, lang);
          cache[cacheKey] = translated;
          stats.translated += 1;
        } catch (leafError) {
          stats.skippedFail += 1;
          process.stdout.write(`  ! ${lang} skip ${leaf.fullPath}\n`);
          continue;
        }
      }
      setAtPath(locale, leaf.pathParts, translated);
      if ((stats.translated + stats.fromCache) % 20 === 0) {
        saveCache(cache);
        fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
        process.stdout.write(`  … ${lang}: ${stats.translated} new / ${stats.fromCache} cache\n`);
      }
    }
    fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
    saveCache(cache);
    console.log(
      `  ✓ ${lang}: +${stats.translated} translated, ${stats.fromCache} cache, ${stats.skippedFail} failed`,
    );
  } catch (error) {
    hardFailures += 1;
    fs.writeFileSync(filePath, `${JSON.stringify(locale, null, 2)}\n`, "utf8");
    saveCache(cache);
    console.error(`  ✗ ${lang}:`, error?.message ?? error);
  }
}

console.log(
  hardFailures
    ? `Done with ${hardFailures} failure(s). Re-run to resume.`
    : "Done translating industrial locale strings.",
);
process.exitCode = hardFailures ? 1 : 0;
