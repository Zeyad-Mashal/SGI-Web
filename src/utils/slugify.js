/**
 * Generates a clean, SEO-friendly slug from a product name.
 * Safe for Windows/Linux folder generation (removes special characters like *, ?, :, etc.).
 * Supports multi-language names (like Arabic) using Unicode property escapes.
 */
export function slugify(name) {
  if (!name) return "product";
  
  return name
    .replace(/[^\p{L}\p{N}\s-]/gu, "-") // replace non-alphanumeric/non-space/non-dash with dash
    .replace(/\s+/g, "-")               // replace spaces with dashes
    .replace(/-+/g, "-")                // collapse multiple dashes
    .trim()                             // trim surrounding whitespace
    .replace(/^-+|-+$/g, "");           // trim surrounding dashes
}
