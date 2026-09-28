const YOUTUBE_ID_PATTERN =
  /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const VIMEO_ID_PATTERN =
  /(?:https?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/[^/]+\/|groups\/[^/]+\/videos\/|video\/|showcase\/[^/]+\/video\/)?(\d+)/i;

export function extractYouTubeId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(YOUTUBE_ID_PATTERN);
  return match?.[1] ?? null;
}

export function extractVimeoId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim().replace(/\\/g, "");
  if (!trimmed) return null;
  if (/^\d{6,12}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(VIMEO_ID_PATTERN);
  return match?.[1] ?? null;
}

export function youTubeWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youTubeEmbedUrl(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
}

/** Local stills cropped to the picture, without YouTube letterboxing or a white mat. */
const LOCAL_YOUTUBE_THUMBS: Record<string, string> = {
  _49zfG03G1U: "/blog-covers/medical-device-cgi-without-regulatory-risk.jpg",
  "yfGZMp-JKnY": "/blog-covers/medical-animation-sample.jpg",
};

export function youTubeThumbnail(id: string): string {
  return LOCAL_YOUTUBE_THUMBS[id] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function vimeoWatchUrl(id: string): string {
  return `https://vimeo.com/${id}`;
}

export function vimeoEmbedUrl(id: string): string {
  return `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`;
}

export function vimeoThumbnail(id: string): string {
  return `https://vumbnail.com/${id}.jpg`;
}

export function isYouTubeMedia(src: string): boolean {
  return extractYouTubeId(src) !== null;
}

export function isVimeoMedia(src: string): boolean {
  return extractVimeoId(src) !== null;
}

export type ResolvedVideoEmbed =
  | { provider: "youtube"; id: string; watchUrl: string; embedUrl: string; thumbnail: string }
  | { provider: "vimeo"; id: string; watchUrl: string; embedUrl: string; thumbnail: string };

export function resolveVideoEmbed(urlOrId: string): ResolvedVideoEmbed | null {
  const youtubeId = extractYouTubeId(urlOrId);
  if (youtubeId) {
    return {
      provider: "youtube",
      id: youtubeId,
      watchUrl: youTubeWatchUrl(youtubeId),
      embedUrl: youTubeEmbedUrl(youtubeId),
      thumbnail: youTubeThumbnail(youtubeId),
    };
  }

  const vimeoId = extractVimeoId(urlOrId);
  if (vimeoId) {
    return {
      provider: "vimeo",
      id: vimeoId,
      watchUrl: vimeoWatchUrl(vimeoId),
      embedUrl: vimeoEmbedUrl(vimeoId),
      thumbnail: vimeoThumbnail(vimeoId),
    };
  }

  return null;
}
