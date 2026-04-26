/**
 * Convex client wrapper for frontend usage
 * Provides query/mutation access to Convex backend
 */
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";

export const convex = new ConvexReactClient(convexUrl);