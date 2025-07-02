import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://kuralis.homes";
	const staticPaths = ["/", "/about", "/contact", "/contact/thanks", "/privacy", "/terms"];

	return staticPaths.map((path) => ({
		url: `${baseUrl}${path}`,
		lastModified: new Date(),
	}));
}
