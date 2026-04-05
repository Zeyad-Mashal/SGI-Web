const ALLOWED_BRANDS_EN = ["Cleenol", "INDUQUIM", "SEITZ"];
const ALLOWED_BRANDS_AR = ["كلينول", "إندوكيم", "سيتز"];

/**
 * Same filtering as the Brands / Shop UI: only allowed brand names, or full list if none match.
 * @param {unknown} brands
 * @returns {unknown[]}
 */
export function filterAllowedBrands(brands) {
  if (!Array.isArray(brands)) return [];
  const allowedSet = new Set([
    ...ALLOWED_BRANDS_EN.map((n) => n.trim().toUpperCase()),
    ...ALLOWED_BRANDS_AR.map((n) => n.trim()),
  ]);
  const filteredBrands = brands.filter((brand) => {
    if (!brand.name) return false;
    const names = [
      typeof brand.name === "string" ? brand.name : null,
      brand.name?.en,
      brand.name?.ar,
    ].filter(Boolean);
    return names.some((n) => {
      const normalized = String(n).trim();
      const upper = normalized.toUpperCase();
      return allowedSet.has(upper) || allowedSet.has(normalized);
    });
  });
  return filteredBrands.length > 0 ? filteredBrands : brands;
}
