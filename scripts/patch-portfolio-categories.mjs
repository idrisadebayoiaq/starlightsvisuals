import fs from "node:fs";

const p = "c:/Users/DELL/Desktop/starlightsvisuals-main/src/data/portfolio-works.ts";
let t = fs.readFileSync(p, "utf8");

function removeCategory(slug) {
  const start = t.indexOf(`slug: "${slug}"`);
  if (start < 0) {
    console.log("missing", slug);
    return;
  }
  // find opening brace before slug
  let braceStart = t.lastIndexOf("{", start);
  let depth = 0;
  let i = braceStart;
  for (; i < t.length; i++) {
    if (t[i] === "{") depth++;
    else if (t[i] === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  // include trailing comma
  while (i < t.length && /\s/.test(t[i])) i++;
  if (t[i] === ",") i++;
  // also remove preceding whitespace/newline carefully
  let from = braceStart;
  while (from > 0 && (t[from - 1] === " " || t[from - 1] === "\t")) from--;
  if (t[from - 1] === "\n") from--;
  t = t.slice(0, from) + t.slice(i);
  console.log("removed", slug);
}

removeCategory("motion-graphics");
removeCategory("vfx");

t = t.replace(
  /export type WorkCategorySlug =\s*\| "2d-animation"\s*\|\s*"3d-animation"\s*\|\s*"motion-graphics"\s*\|\s*"video-editing"\s*\|\s*"vfx"\s*\|\s*"branding";/,
  `export type WorkCategorySlug =
  | "2d-animation"
  | "3d-animation"
  | "video-editing"
  | "branding";`,
);

t = t.replace(/\s*"motion-graphics": \{ tag: "[^"]+", title: "[^"]+" \},/, "");
t = t.replace(/\s*vfx: \{ tag: "[^"]+", title: "[^"]+" \},/, "");

// Insert ijockey client after ronix block inside branding clients
const ijockey = `
      client(
        {
          slug: "ijockey",
          name: "IJOCKEY",
          industry: "Brand & Industrial CGI",
          industries: ["industrial-machinery", "brand-entertainment"],
          description:
            "iJockey CGI product renders and trade show style films combining branded storytelling with industrial product visualization.",
          projectCount: 1,
          logo: PROJECT_PLACEHOLDER,
          banner: PROJECT_PLACEHOLDER,
          services: ["CGI Product Renders", "Trade Show Films", "Brand CGI"],
          timeline: "2025",
          tools: ["Cinema 4D", "Blender", "After Effects"],
          projects: [
            {
              title: "iJockey CGI Product Film",
              description:
                "CGI product render and motion film for iJockey, built for trade show and brand presentation use.",
              thumbnail: PROJECT_PLACEHOLDER,
              mediaType: "video",
              mediaSrc: "/services/trade-show/ijockey.mp4",
              tags: ["iJockey", "CGI", "Trade Show"],
              year: 2025,
            },
          ],
        },
        "ijockey",
      ),`;

if (!t.includes('slug: "ijockey"')) {
  const marker = '        "ronix",\n      ),';
  const idx = t.indexOf(marker);
  if (idx < 0) throw new Error("ronix insert point missing");
  t = t.slice(0, idx + marker.length) + "\n" + ijockey + t.slice(idx + marker.length);
  console.log("added ijockey");
}

fs.writeFileSync(p, t);
console.log("done", /slug: "motion-graphics"|slug: "vfx"/.test(t) ? "STILL HAS" : "cats removed");
