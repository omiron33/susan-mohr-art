import type { MetadataRoute } from "next";
import { fetchCategories } from "@/lib/cms";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (env.SITE_URL ?? "https://www.susanmohrart.com").replace(/\/$/, "");
  const categories = await fetchCategories();

  const staticPaths = [
    "",
    "/process",
    "/galleries",
    "/prints",
    "/about",
    "/contact",
    "/success",
    "/cancel",
  ];

  const categoryPaths = categories.map((category) => `/galleries/${category.slug}`);
  const entries = [...staticPaths, ...categoryPaths];

  const lastModified = new Date().toISOString();

  return entries.map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified,
  }));
}
