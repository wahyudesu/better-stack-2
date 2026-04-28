"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";

/**
 * Ensures user record exists in Convex DB on authentication.
 * Creates/updates user record with Clerk identity info.
 */
export function useEnsureUser() {
	const { isAuthenticated } = useConvexAuth();
	const ensureUser = useMutation(api.users.ensureUser);

	useEffect(() => {
		if (!isAuthenticated) return;

		// Call ensureUser mutation to create/update user record
		ensureUser({}).catch((err) => {
			console.error("[ensureUser] Failed:", err);
		});
	}, [isAuthenticated, ensureUser]);
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
