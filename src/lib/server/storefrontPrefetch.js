import { filterAllowedBrands } from "@/utils/filterAllowedBrands";

const API_BASE = "https://sgi-dy1p.onrender.com/api/v1";

const fetchOptions = (revalidateSeconds) => ({
  next: { revalidate: revalidateSeconds },
  headers: {
    "Content-Type": "application/json",
    "accept-language": "en",
  },
});

function normalizePagination(result, productsLength) {
  let pagination = {
    currentPage: 1,
    totalPages: 1,
    totalProducts: productsLength,
  };
  if (result.pagination) {
    pagination = {
      currentPage:
        result.pagination.currentPage ||
        result.pagination.page ||
        pagination.currentPage,
      totalPages:
        result.pagination.totalPages ||
        result.pagination.pages ||
        pagination.totalPages,
      totalProducts:
        result.pagination.totalProducts ||
        result.pagination.total ||
        result.pagination.count ||
        productsLength,
    };
  } else {
    pagination = {
      currentPage: result.currentPage || result.page || 1,
      totalPages: result.totalPages || result.pages || 1,
      totalProducts:
        result.totalProducts ||
        result.total ||
        result.count ||
        productsLength,
    };
  }
  return pagination;
}

export function filterFeaturedProducts(products) {
  if (!Array.isArray(products)) return [];
  return products.filter((product) => {
    const productType = product.type || product.Type || "";
    return productType.toLowerCase() === "featured";
  });
}

export async function fetchFeaturedForHome() {
  try {
    const res = await fetch(
      `${API_BASE}/product/get?page=1&type=featured`,
      fetchOptions(120),
    );
    if (!res.ok) return [];
    const data = await res.json();
    return filterFeaturedProducts(data.products || []);
  } catch {
    return [];
  }
}

export async function fetchProductsPageForHome() {
  try {
    const res = await fetch(
      `${API_BASE}/product/get?page=1`,
      fetchOptions(120),
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

export async function fetchCategoriesForStorefront() {
  try {
    const base = fetchOptions(300);
    const res = await fetch(`${API_BASE}/category/getAll`, {
      ...base,
      headers: {
        ...base.headers,
        "x-is-dashboard": "true",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export async function fetchBrandsForStorefront() {
  try {
    const res = await fetch(
      `${API_BASE}/brand/getAll?page=1`,
      fetchOptions(300),
    );
    if (!res.ok) return [];
    const data = await res.json();
    const brands = Array.isArray(data.brands)
      ? data.brands
      : Array.isArray(data.data)
        ? data.data
        : [];
    return filterAllowedBrands(brands);
  } catch {
    return [];
  }
}

export async function fetchHomePageData() {
  const [featured, products, categories, brands] = await Promise.all([
    fetchFeaturedForHome(),
    fetchProductsPageForHome(),
    fetchCategoriesForStorefront(),
    fetchBrandsForStorefront(),
  ]);
  return { featured, products, categories, brands };
}

export async function fetchShopInitialData() {
  try {
    const [productsRes, categories, brands] = await Promise.all([
      fetch(`${API_BASE}/product/get?page=1`, fetchOptions(120)),
      fetchCategoriesForStorefront(),
      fetchBrandsForStorefront(),
    ]);

    let products = [];
    let pagination = {
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
    };

    if (productsRes.ok) {
      const result = await productsRes.json();
      products = result.products || [];
      pagination = normalizePagination(result, products.length);
    }

    return { products, categories, brands, pagination };
  } catch {
    return {
      products: [],
      categories: [],
      brands: [],
      pagination: { currentPage: 1, totalPages: 0, totalProducts: 0 },
    };
  }
}

export async function fetchProductDetailsById(id) {
  if (!id) return null;
  try {
    const res = await fetch(`${API_BASE}/product/details/${id}`, {
      ...fetchOptions(120),
      headers: {
        "Content-Type": "application/json",
        "accept-language": "en",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product ?? null;
  } catch {
    return null;
  }
}
