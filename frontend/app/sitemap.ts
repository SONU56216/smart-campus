import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://metrouni.edu.in";
  
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/virtual-tour`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/social`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "daily",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/emergency`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date("2026-06-11"),
      changeFrequency: "weekly",
      priority: 0.8,
    }
  ];
}
