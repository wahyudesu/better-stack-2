/**
 * Convex client wrapper for frontend usage
 * Provides query/mutation access to Convex backend
 */
import { ConvexReactClient } from "convex/react";
import { api } from "convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

export const convex = new ConvexReactClient(convexUrl);
export { api };
export { useQuery } from "convex/react";
