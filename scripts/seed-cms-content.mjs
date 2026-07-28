/**
 * Seed blog posts + portfolio videos into Supabase (via MCP execute or service role).
 * Run: node scripts/seed-cms-content.mjs
 * Or use the generated SQL with Supabase SQL editor.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Minimal blog seed (3 featured for homepage + rest published)
const blogs = [
  {
    slug: "cinematic-trailers-that-convert",
    title: "Why cinematic trailers convert better than product demos",
    excerpt:
      "Story first launch films build emotional stakes before the CTA. Here is how we structure hooks, pacing, and grade for maximum retention.",
    category: "Strategy",
    published_at: "2026-05-12",
    read_time: "6 min read",
    image_url: "",
    author: "Starlights Visuals",
    featured: true,
    sort_order: 1,
    sections: [
      {
        paragraphs: [
          "Product demos explain features. Cinematic trailers create desire. The difference is narrative architecture how quickly you establish stakes, who the audience is rooting for, and when the payoff lands relative to your call to action.",
          "We see this consistently in paid social and landing page tests: story first launch films hold attention longer, improve thumb stop rates, and lift downstream conversion when the CTA arrives after emotional investment rather than before it.",
        ],
      },
      {
        heading: "Hook structure that holds attention",
        paragraphs: [
          "The first three seconds should answer one question: why should I care? That can be a visual surprise, a human moment, or a tension the product resolves but it cannot be a logo sting followed by a spec sheet.",
          "We map hooks on a simple grid: problem, escalation, reveal, proof, CTA. Each beat gets a time budget before we ever open a timeline.",
        ],
      },
    ],
  },
  {
    slug: "character-design-for-ip",
    title: "Character design that anchors your IP across every channel",
    excerpt:
      "From silhouette readability to merch ready turnarounds the checklist we use before a hero goes into production.",
    category: "Craft",
    published_at: "2026-05-03",
    read_time: "5 min read",
    image_url: "",
    author: "Starlights Visuals",
    featured: true,
    sort_order: 2,
    sections: [
      {
        paragraphs: [
          "A strong character is readable at a glance in an app icon, on a billboard, and on a hoodie. Before we animate or rig anything, we pressure test silhouette, expression range, and costume storytelling so the design survives every downstream format.",
        ],
      },
      {
        heading: "Silhouette and expression",
        paragraphs: [
          "We thumbnail dozens of shapes before color. If you cannot identify the character in pure black fill at 48 pixels, the design is not ready for production.",
          "Expression sheets come early. Campaign characters need to sell joy, frustration, and triumph without dialogue.",
        ],
      },
    ],
  },
  {
    slug: "production-pipelines-that-ship",
    title: "Production pipelines that ship: concept to final delivery",
    excerpt:
      "How we align art direction, technical constraints, and milestone reviews so teams ship on time without sacrificing polish.",
    category: "Production",
    published_at: "2026-04-21",
    read_time: "8 min read",
    image_url: "",
    author: "Starlights Visuals",
    featured: true,
    sort_order: 3,
    sections: [
      {
        paragraphs: [
          "Projects slip when creative direction and delivery constraints meet for the first time at the end of a milestone. Our pipeline front loads technical limits, establishes a single approval path, and keeps work in progress visible so producers can de risk schedules early.",
        ],
      },
      {
        heading: "Pre production alignment",
        paragraphs: [
          "We start with a visual target board and a technical brief: resolution, format, lighting model, and animation requirements.",
          "Milestone reviews are structured as gate checks with clear deliverable lists at each stage.",
        ],
      },
    ],
  },
];

function sqlString(value) {
  if (value == null) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function blogSql() {
  const rows = blogs.map((b) => {
    return `(${sqlString(b.slug)}, ${sqlString(b.title)}, ${sqlString(b.excerpt)}, ${sqlString(b.category)}, ${sqlString(b.published_at)}::date, ${sqlString(b.read_time)}, ${sqlString(b.image_url)}, ${sqlString(b.author)}, ${sqlString(JSON.stringify(b.sections))}::jsonb, ${b.featured}, true, ${b.sort_order})`;
  });
  return `
insert into public.blog_posts
  (slug, title, excerpt, category, published_at, read_time, image_url, author, sections, featured, published, sort_order)
values
  ${rows.join(",\n  ")}
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  category = excluded.category,
  published_at = excluded.published_at,
  read_time = excluded.read_time,
  sections = excluded.sections,
  featured = excluded.featured,
  published = excluded.published,
  sort_order = excluded.sort_order;
`;
}

// Portfolio video seeds from youtube map + inferred metadata
const youtubePath = path.join(root, "src", "data", "portfolio-youtube.ts");
const ytRaw = fs.readFileSync(youtubePath, "utf8");
const ytEntries = [...ytRaw.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => ({
  key: m[1],
  url: m[2],
}));

const categoryHints = {
  chibi: "2d-animation",
  vtuber: "2d-animation",
  live2d: "2d-animation",
  "2d-anime": "2d-animation",
  watch: "3d-animation",
  ryse: "video-editing",
  perfume: "video-editing",
  kids: "3d-animation",
  gadget: "video-editing",
  cartoon: "3d-animation",
  vape: "video-editing",
  explainer: "3d-animation",
  ronix: "branding",
  mintec: "branding",
  integra: "branding",
  credex: "branding",
  phr: "branding",
  atx: "branding",
  "prov-gap": "branding",
  autoz: "video-editing",
  bag: "video-editing",
  drop: "video-editing",
  medical: "3d-animation",
  bed: "3d-animation",
  "3d-anime": "3d-animation",
};

function inferCategory(key) {
  for (const [hint, slug] of Object.entries(categoryHints)) {
    if (key.includes(hint)) return slug;
  }
  return "3d-animation";
}

function inferClient(key) {
  const base = key.replace(/-p\d+$/, "");
  const name = base
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return { slug: base, name };
}

function videosSql() {
  const rows = ytEntries.map((e, i) => {
    const cat = inferCategory(e.key);
    const client = inferClient(e.key);
    const title = `${client.name} — Project ${e.key.match(/p(\d+)$/)?.[1] ?? "1"}`;
    return `(${sqlString(e.key)}, ${sqlString(cat)}, ${sqlString(client.slug)}, ${sqlString(client.name)}, ${sqlString(title)}, '', ${sqlString(e.url)}, '', 2026, '{}', ${i}, false, true)`;
  });
  return `
insert into public.portfolio_videos
  (project_key, category_slug, client_slug, client_name, title, description, video_url, thumbnail_url, year, tags, sort_order, featured, published)
values
  ${rows.join(",\n  ")}
on conflict (project_key) do update set
  category_slug = excluded.category_slug,
  client_slug = excluded.client_slug,
  client_name = excluded.client_name,
  title = excluded.title,
  video_url = excluded.video_url,
  sort_order = excluded.sort_order,
  published = excluded.published;
`;
}

const out = `${blogSql()}\n${videosSql()}\n`;
const outPath = path.join(__dirname, "seed-cms-content.sql");
fs.writeFileSync(outPath, out);
console.log(`Wrote ${outPath} (${blogs.length} blogs, ${ytEntries.length} videos)`);
