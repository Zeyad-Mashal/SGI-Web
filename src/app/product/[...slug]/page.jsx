import ClientProduct from "./ClientProduct";
import { fetchProductDetailsById } from "@/lib/server/storefrontPrefetch";
import { redirect } from "next/navigation";
import { slugify } from "@/utils/slugify";

// This function generates static params for all products at build time
// Required for static export with dynamic routes
export async function generateStaticParams() {
  try {
    const lang = "en"; // Default language for build time
    const allProducts = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages of products
    while (hasMore) {
      const response = await fetch(
        `https://sgi-dy1p.onrender.com/api/v1/product/get?page=${page}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "accept-language": lang,
          },
        }
      );

      if (!response.ok) {
        console.warn(`Failed to fetch products page ${page} for static generation`);
        break;
      }

      const result = await response.json();
      const products = result.products || [];

      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts.push(...products);
        page++;
        // Safety limit to prevent infinite loops
        if (page > 100) {
          console.warn("Reached maximum page limit for product fetching");
          break;
        }
      }
    }

    // Return array of params objects with the dynamic segment (slug)
    // For a catch-all route [...slug], the parameter value must be an array of path segments.
    return allProducts.map((product) => {
      const id = product._id?.toString() || product.id?.toString();
      const slugName = encodeURIComponent(slugify(product.name));
      return {
        slug: [slugName, id],
      };
    }).filter((param) => param.slug[1]); // Filter out any invalid IDs
  } catch (error) {
    console.warn("Error generating static params:", error);
    // Return empty array if fetch fails (allows build to continue)
    return [];
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    redirect("/");
  }

  // If there's only one segment (the old /product/[id] URL), it's the ID
  if (slug.length === 1) {
    const id = slug[0];
    const product = await fetchProductDetailsById(id);
    if (product) {
      const expectedSlug = encodeURIComponent(slugify(product.name));
      redirect(`/product/${expectedSlug}/${id}`);
    } else {
      redirect("/");
    }
  }

  // If there are two or more segments (e.g., /product/[slug]/[id])
  const id = slug[slug.length - 1];
  const urlSlug = slug[slug.length - 2];

  const initialProduct = await fetchProductDetailsById(id);

  if (!initialProduct) {
    redirect("/");
  }

  const expectedSlug = encodeURIComponent(slugify(initialProduct.name));

  // Redirect to canonical URL if the slug in the path is incorrect
  if (urlSlug !== expectedSlug) {
    redirect(`/product/${expectedSlug}/${id}`);
  }

  return (
    <ClientProduct key={id} initialProduct={initialProduct} />
  );
}
