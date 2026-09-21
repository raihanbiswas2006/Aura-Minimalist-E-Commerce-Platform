import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/c/", "/p/", "/about", "/contact", "/shipping", "/returns"],
      disallow: ["/cart", "/checkout", "/order/", "/account/", "/wishlist", "/admin"],
    },
    sitemap: "https://aura-living.demo/sitemap.xml",
  };
}
