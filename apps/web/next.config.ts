import "@better-stack-2/env/web";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	turbopack: {
		root: "/home/wahyudesu/Workspace/startup/better-stack-2",
	},
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
