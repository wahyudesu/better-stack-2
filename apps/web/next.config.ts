import "@zenpost/env/web";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: false,
	reactCompiler: true,
	cacheComponents: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
		],
	},
};

export default nextConfig;

initOpenNextCloudflareForDev();
