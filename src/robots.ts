import { env } from "@/env";
import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    env.NEXT_PUBLIC_SITE_URL && "https://storysync-delta.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/private/", "/admin/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
