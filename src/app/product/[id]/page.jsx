import React from "react";
import ClientProduct from "./ClientProduct";

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

    // Return array of params objects with the dynamic segment (id)
    return allProducts.map((product) => ({
      id: product._id?.toString() || product.id?.toString(),
    })).filter((param) => param.id); // Filter out any invalid IDs
  } catch (error) {
    console.warn("Error generating static params:", error);
    // Return empty array if fetch fails (allows build to continue)
    return [];
  }
}

const page = () => {
  return <ClientProduct />;
};

export default page;
