import { SITE_URL } from "@/constants/site";

const API_PRODUCTS = "https://sgi-dy1p.onrender.com/api/v1/product/get";

async function fetchAllProductIds() {
  const ids = [];
  let page = 1;
  const maxPages = 100;

  while (page <= maxPages) {
    const res = await fetch(`${API_PRODUCTS}?page=${page}`, {
      headers: {
        "Content-Type": "application/json",
        "accept-language": "en",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) break;

    const result = await res.json();
    const products = result.products || [];
    if (products.length === 0) break;

    for (const product of products) {
      const id = product._id?.toString() || product.id?.toString();
      if (id) ids.push(id);
    }
    page += 1;
  }

  return ids;
}

/** @returns {Promise<import('next').MetadataRoute.Sitemap>} */
export default async function sitemap() {
  const lastModified = new Date();

  /** @type {import('next').MetadataRoute.Sitemap} */
  const staticRoutes = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/Privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/returns`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  let productIds = [];
  try {
    productIds = await fetchAllProductIds();
  } catch {
    // If the API is unreachable, still serve static URLs.
  }

  const productRoutes = productIds.map((id) => ({
    url: `${SITE_URL}/product/${id}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
