import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/_next/",
        "/api/",
        "/wallet/transactions/"
      ],
    },
    sitemap: "https://metrouni.edu.in/sitemap.xml",
  };
}
