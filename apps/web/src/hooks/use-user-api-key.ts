import { useQuery } from "convex/react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { api } from "../../convex/_generated/api";

export function useUserApiKey() {
	const apiKey = useQuery((api as any).users.getApiKey);
	const isLoading = apiKey === undefined;
	const isError = false;

	// Auto-sync to auth-store for synchronous read sites (lib/client.ts, API routes)
	useEffect(() => {
		if (!isLoading && apiKey !== undefined) {
			useAuthStore.getState().setApiKey(apiKey);
		}
	}, [apiKey, isLoading]);

	return { apiKey, isLoading, isError };
}
