import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://solimouv.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/a-propos", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/programme", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/partenaires", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
    { url: "/carte", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/soutenir", priority: 0.7, changeFrequency: "monthly" as const },
  ];

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
