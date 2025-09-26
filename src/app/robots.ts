import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.SITE_URL ?? "https://www.susanmohrart.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
