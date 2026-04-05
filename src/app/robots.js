import { SITE_URL } from "@/constants/site";

/** @returns {import('next').MetadataRoute.Robots} */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/cart",
        "/profile",
        "/fav",
        "/login",
        "/register",
        "/forget-password",
        "/payment/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: new URL(SITE_URL).host,
  };
}
