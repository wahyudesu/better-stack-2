import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: false,
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
		],
	},
	skipTrailingSlashRedirect: true,
	compress: true,
	productionBrowserSourceMaps: false,
};

export default nextConfig;

initOpenNextCloudflareForDev();
