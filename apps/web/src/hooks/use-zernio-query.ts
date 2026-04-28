import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores";

const ZERNIO_BASE = "/api/zernio";

async function fetchZernio<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const clerkToken = useAuthStore.getState().clerkToken;

	if (!clerkToken) {
		throw new Error("Not authenticated");
	}

	const base = ZERNIO_BASE.endsWith("/") ? ZERNIO_BASE : `${ZERNIO_BASE}/`;
	const url = new URL(path, base);

	const response = await fetch(url.toString(), {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	const data = (await response.json()) as { error?: string };

	if (!response.ok) {
		throw new Error(data?.error || `Request failed: ${response.status}`);
	}

	return data as T;
}

export function useZernioQuery<T>(
	path: string,
	options?: {
		enabled?: boolean;
		refetchInterval?: number;
	},
) {
	const clerkToken = useAuthStore((s) => s.clerkToken);

	return useQuery<T>({
		queryKey: ["zernio", path],
		queryFn: () => fetchZernio<T>(path),
		enabled: options?.enabled !== false && !!clerkToken,
		refetchInterval: options?.refetchInterval ?? false,
	});
}

export function useZernioMutation<T, V = unknown>(
	path: string,
	method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
) {
	return useMutation<T, Error, V>({
		mutationFn: (body?: V) =>
			fetchZernio<T>(path, {
				method,
				body: body ? JSON.stringify(body) : undefined,
			}),
	});
}

// Query key factory
export const zernioKeys = {
	all: ["zernio"] as const,
	profiles: () => [...zernioKeys.all, "profiles"] as const,
	profile: (id: string) => [...zernioKeys.all, "profiles", id] as const,
	accounts: () => [...zernioKeys.all, "accounts"] as const,
	account: (id: string) => [...zernioKeys.all, "accounts", id] as const,
	posts: () => [...zernioKeys.all, "posts"] as const,
	post: (id: string) => [...zernioKeys.all, "posts", id] as const,
	analytics: (profileId?: string) =>
		[...zernioKeys.all, "analytics", profileId] as const,
	inbox: () => [...zernioKeys.all, "inbox"] as const,
	queue: (profileId?: string) =>
		[...zernioKeys.all, "queue", profileId] as const,
};
