import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useAuthStore } from "@/stores";

export function useUserApiKey() {
	const apiKey = useQuery(api.users.getApiKey);
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
