/**
 * HyperPay (OPPWA) — paymentWidgets.js lives under /v1/ on a region host.
 *
 * If NEXT_PUBLIC_OPPWA_WIDGET_HOST is set, it always wins (no trailing slash).
 * Otherwise UAT checkout IDs (e.g. containing ".uat01-vm-tx02") use the test widget host.
 */
const PROD_HOST = "https://eu-prod.oppwa.com";
const EU_TEST_HOST = "https://eu-test.oppwa.com";

/** UAT / test checkout ids from HyperPay often include ".uat" before the VM suffix */
function looksLikeUatCheckoutId(checkoutId) {
  if (!checkoutId || typeof checkoutId !== "string") return false;
  return /\.uat[0-9]/i.test(checkoutId) || /\.uat-/i.test(checkoutId);
}

/**
 * Resolves which OPPWA host should load paymentWidgets.js for this checkoutId.
 * @param {string} [checkoutId]
 */
export function resolveOppwaWidgetHost(checkoutId) {
  const fromEnv =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_OPPWA_WIDGET_HOST?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (looksLikeUatCheckoutId(checkoutId)) return EU_TEST_HOST;
  return PROD_HOST;
}
