import type { MetadataRoute } from "next";

const baseUrl = "https://zenpost.in";

export default function sitemap(): MetadataRoute.Sitemap {
	const routes = [
		"",
		"/about",
		"/contact",
		"/privacy",
		"/terms",
		"/tools",
		"/tools/branding",
		"/tools/script-engine",
		"/blog",
		"/blog/ai-dalam-social-media-management",
		"/blog/memulai-social-media-untuk-bisnis",
		"/blog/meningkatkan-engagement-instagram",
	].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: route === "" ? 1 : 0.8,
	}));

	return routes;
}