/** Shared helpers for CMS + site-copy translation payloads. */

export const SITE_COPY_ENTITY_ID = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";

export const MANUAL_FLAG = "__manual" as const;
export const MANUAL_AT = "__manualAt" as const;

export type TranslationMeta = {
  [MANUAL_FLAG]?: boolean;
  [MANUAL_AT]?: string;
};

export function isManualTranslation(fields: unknown): boolean {
  if (!fields || typeof fields !== "object") return false;
  return (fields as TranslationMeta)[MANUAL_FLAG] === true;
}

export function withManualFlag<T extends Record<string, unknown>>(fields: T): T & TranslationMeta {
  return {
    ...fields,
    [MANUAL_FLAG]: true,
    [MANUAL_AT]: new Date().toISOString(),
  };
}

export function stripManualMeta<T extends Record<string, unknown>>(
  fields: T,
): Omit<T, typeof MANUAL_FLAG | typeof MANUAL_AT> {
  const next = { ...fields };
  delete next[MANUAL_FLAG];
  delete next[MANUAL_AT];
  return next;
}

/** Deep-merge source into target (objects only; arrays replaced). */
export function deepMerge<T>(target: T, source: unknown): T {
  if (!source || typeof source !== "object" || Array.isArray(source)) {
    return (source as T) ?? target;
  }
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    return structuredClone(source) as T;
  }

  const out: Record<string, unknown> = { ...(target as Record<string, unknown>) };
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    if (key === MANUAL_FLAG || key === MANUAL_AT) continue;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      out[key] = deepMerge(out[key], value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

export type FlatEntry = { path: string; value: string };

/** Flatten nested locale JSON into dotted paths for the admin editor. */
export function flattenLocale(node: unknown, prefix = "", out: FlatEntry[] = []): FlatEntry[] {
  if (typeof node === "string") {
    if (prefix) out.push({ path: prefix, value: node });
    return out;
  }
  if (Array.isArray(node)) {
    node.forEach((item, index) => {
      flattenLocale(item, prefix ? `${prefix}.${index}` : String(index), out);
    });
    return out;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      flattenLocale(value, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

/** Rebuild nested object from dotted paths. */
export function unflattenLocale(entries: FlatEntry[]): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const { path, value } of entries) {
    const parts = path.split(".");
    let cursor: Record<string, unknown> = root;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i]!;
      const isLast = i === parts.length - 1;
      const nextIsIndex = !isLast && /^\d+$/.test(parts[i + 1] ?? "");
      if (isLast) {
        cursor[part] = value;
      } else {
        if (cursor[part] == null) {
          cursor[part] = nextIsIndex ? [] : {};
        }
        const child = cursor[part];
        if (typeof child !== "object" || child === null) {
          cursor[part] = nextIsIndex ? [] : {};
        }
        cursor = cursor[part] as Record<string, unknown>;
      }
    }
  }
  return root;
}

export function setPathValue(root: Record<string, unknown>, path: string, value: string) {
  const parts = path.split(".");
  let cursor: Record<string, unknown> = root;
  for (let i = 0; i < parts.length; i += 1) {
    const part = parts[i]!;
    const isLast = i === parts.length - 1;
    if (isLast) {
      cursor[part] = value;
      return;
    }
    const nextIsIndex = /^\d+$/.test(parts[i + 1] ?? "");
    if (cursor[part] == null || typeof cursor[part] !== "object") {
      cursor[part] = nextIsIndex ? [] : {};
    }
    cursor = cursor[part] as Record<string, unknown>;
  }
}
