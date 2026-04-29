"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

/**
 * Ensures user record exists in Convex DB on authentication.
 * Creates/updates user record with Clerk identity info.
 */
export function useEnsureUser() {
	const { isAuthenticated, isLoading } = useConvexAuth();
	const ensureUser = useMutation(api.users.ensureUser);

	console.log("[DEBUG useEnsureUser] isAuthenticated:", isAuthenticated, "isLoading:", isLoading);

	useEffect(() => {
		console.log("[DEBUG useEnsureUser] useEffect firing", { isAuthenticated, isLoading });
		if (!isAuthenticated) {
			console.log("[DEBUG useEnsureUser] skipping - not authenticated");
			return;
		}

		console.log("[DEBUG useEnsureUser] calling ensureUser mutation...");
		ensureUser({}).then(() => console.log("[DEBUG ensureUser] mutation success"))
			.catch((err) => console.error("[ensureUser] Failed:", err));
	}, [isAuthenticated, isLoading, ensureUser]);
}

// Component version for use in providers
export function EnsureUserEffect({ children }: { children?: React.ReactNode }) {
	const { isAuthenticated } = useConvexAuth();
	const ensureUser = useMutation(api.users.ensureUser);

	useEffect(() => {
		if (!isAuthenticated) return;
		ensureUser({}).catch((err) => {
			console.error("[ensureUser] Failed:", err);
		});
	}, [isAuthenticated, ensureUser]);

	return <>{children}</>;
}
