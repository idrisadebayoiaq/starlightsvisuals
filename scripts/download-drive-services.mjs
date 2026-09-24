import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outRoot = path.join(root, "tools", "drive-services");

const FOLDERS = {
  cad: "1RY8AB_AkaC4NuvUv5N2h9ZYbs2_4s_C8",
  "trade-show": "1uN4PaeAFRqhsHdEZKNG7DMJUJg8mFdhu",
  exploded: "1VoVN7hbQQulY3tZIgsUDlswzJ0POx50K",
  robotics: "1dOCgaeaB5aaAzZeFugG9QU8PHcWj6sF5",
  explainer: "1ndB_4l3v7vTqOid28pwCGF8loQEejXaU",
  technical: "1JKI6KxzAPERHtdaBlLyIWidYH7TgU3kJ",
};

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    },
    redirect: "follow",
  });
  return { res, text: await res.text() };
}

function extractFilesFromFolderHtml(html) {
  const files = new Map();
  // data-id + nearby filename patterns
  const re =
    /\["(.*?)",\["application\/(?:vnd\.google-apps\.)?([^"]+)"[^\]]*?\],\["([^"]+)"/g;
  // Broader: file ids next to filenames in embedded JSON
  const idName = /\[\["([a-zA-Z0-9_-]{25,})",\d+,\["([^"]+\.(?:jpe?g|png|webp|gif|mp4|mov|webm|JPG|PNG|MP4))"\]/g;
  let m;
  while ((m = idName.exec(html))) {
    files.set(m[1], m[2]);
  }
  // Fallback aria labels style from DOM dumps aren't here; try another pattern
  const alt =
    /null,"([a-zA-Z0-9_-]{25,})",\["[^"]*?",\d+,\["(?:image|video|application)\/[^"]*?"\],"[^"]*?",\d+,\d+,\d+,null,\d+,null,"([^"]+)"/g;
  while ((m = alt.exec(html))) {
    if (/\.(jpe?g|png|webp|gif|mp4|mov|webm)$/i.test(m[2]) || /video|IMG_|ijockey/i.test(m[2])) {
      files.set(m[1], m[2]);
    }
  }
  // Simple: "FILENAME.ext" near id
  const loose =
    /"(IMG_[^"]+\.(?:jpe?g|png|JPG|PNG)|[^"]+\.(?:mp4|mov|webm|MP4))"/g;
  const names = [];
  while ((m = loose.exec(html))) names.push(m[1]);
  const ids = [...html.matchAll(/data-id=\\"([a-zA-Z0-9_-]{25,})\\"/g)].map((x) => x[1]);
  const uniqueIds = [...new Set(ids)];
  // From earlier browser knowledge for trade-show we already have ids; keep HTML parsing best-effort
  for (const id of uniqueIds) {
    if (!files.has(id)) files.set(id, `file-${id.slice(0, 8)}`);
  }
  return files;
}

async function downloadFile(id, destPath) {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const url = `https://drive.google.com/uc?export=download&id=${id}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    },
    redirect: "follow",
  });
  const ctype = res.headers.get("content-type") || "";
  if (ctype.includes("text/html")) {
    const html = await res.text();
    let confirm = null;
    const m1 = html.match(/confirm=([0-9A-Za-z_-]+)/);
    const m2 = html.match(/name="confirm"\s+value="([^"]+)"/);
    confirm = m1?.[1] || m2?.[1];
    const cookie = res.headers.getSetCookie?.()?.join("; ") || "";
    if (!confirm) {
      // take uuid download link
      const m3 = html.match(/href="(\/uc\?export=download[^"]+)"/);
      if (m3) {
        const abs = new URL(m3[1].replace(/&amp;/g, "&"), "https://drive.google.com").toString();
        const r2 = await fetch(abs, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            Cookie: cookie,
          },
        });
        const buf = Buffer.from(await r2.arrayBuffer());
        fs.writeFileSync(destPath, buf);
        return buf.length;
      }
      throw new Error(`No confirm token for ${id}`);
    }
    const r2 = await fetch(
      `https://drive.google.com/uc?export=download&confirm=${confirm}&id=${id}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
          Cookie: cookie,
        },
      },
    );
    const buf = Buffer.from(await r2.arrayBuffer());
    fs.writeFileSync(destPath, buf);
    return buf.length;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
  return buf.length;
}

// Known files from browser inspection + we'll fill others from folder HTML
const KNOWN = {
  "trade-show": [
    { id: "1A_j1mNpFvuE-UDrCFb3JrwQ__jJJyhxK", name: "ijockey-video.mp4" },
    { id: "1rpHfk19oNEgKMp_EUMvnmlZ2FUFEp3Cp", name: "IMG_0253.jpeg" },
    { id: "1Kljy8OTpYZA5SYbTNSKakLN_c4KVogoi", name: "IMG_0254.jpeg" },
    { id: "1HnE1OfhnnXaglkTGzJEf_LFWYaC4lq-e", name: "IMG_0257.jpeg" },
  ],
};

async function listFolder(folderId) {
  const { text } = await fetchText(`https://drive.google.com/drive/folders/${folderId}`);
  return extractFilesFromFolderHtml(text);
}

async function main() {
  fs.mkdirSync(outRoot, { recursive: true });
  const only = process.argv[2];

  for (const [slug, folderId] of Object.entries(FOLDERS)) {
    if (only && only !== slug) continue;
    const dir = path.join(outRoot, slug);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n=== ${slug} (${folderId}) ===`);

    let files = KNOWN[slug] ? [...KNOWN[slug]] : [];
    try {
      const mapped = await listFolder(folderId);
      for (const [id, name] of mapped.entries()) {
        if (!files.some((f) => f.id === id)) {
          files.push({ id, name });
        }
      }
      console.log(`Found ${files.length} candidates`);
    } catch (e) {
      console.warn(`List failed for ${slug}:`, e.message);
    }

    for (const file of files) {
      const safe = file.name.replace(/[<>:"/\\|?*]/g, "_");
      const dest = path.join(dir, safe);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 10_000) {
        console.log(`skip existing ${safe}`);
        continue;
      }
      try {
        const size = await downloadFile(file.id, dest);
        console.log(`saved ${safe} (${(size / 1024).toFixed(1)} KB)`);
        // Drop tiny HTML error pages
        if (size < 2000) {
          const head = fs.readFileSync(dest, "utf8").slice(0, 200);
          if (head.includes("<!DOCTYPE") || head.includes("<html")) {
            fs.unlinkSync(dest);
            console.warn(`removed HTML stub for ${safe}`);
          }
        }
      } catch (e) {
        console.warn(`fail ${safe}:`, e.message);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
