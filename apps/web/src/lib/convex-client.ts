import { ConvexReactClient } from "convex/react";

// const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convexUrl =
	process.env.NEXT_PUBLIC_CONVEX_URL || "https://dev-convex-url.convex.cloud";

if (!convexUrl) {
	throw new Error("NEXT_PUBLIC_CONVEX_URL is not set bjir");
}

export const convex = new ConvexReactClient(convexUrl);
