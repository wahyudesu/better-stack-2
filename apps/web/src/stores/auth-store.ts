import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UsageStats {
	planName: string;
	limits: {
		uploads: number;
		profiles: number;
	};
	usage: {
		uploads: number;
		profiles: number;
	};
}

interface AuthState {
	apiKey: string | null;
	usageStats: UsageStats | null;
	isValidating: boolean;
	error: string | null;
	hasHydrated: boolean;
	setApiKey: (key: string | null) => void;
	setUsageStats: (stats: UsageStats | null) => void;
	setIsValidating: (validating: boolean) => void;
	setError: (error: string | null) => void;
	setHasHydrated: (hydrated: boolean) => void;
	logout: () => void;
}

const getInitialApiKey = () => {
	if (typeof window === "undefined") return null;
	// If user previously set a key in localStorage, it takes precedence
	// Otherwise fall back to env var
	return (process.env.NEXT_PUBLIC_ZERNIO_API_KEY as string) || null;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			apiKey: getInitialApiKey(),
			usageStats: null,
			isValidating: false,
			error: null,
			hasHydrated: false,
			setApiKey: (key) => set({ apiKey: key, error: null }),
			setUsageStats: (stats) => set({ usageStats: stats }),
			setIsValidating: (validating) => set({ isValidating: validating }),
			setError: (error) => set({ error }),
			setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
			logout: () =>
				set({
					apiKey: getInitialApiKey(), // reset to env default on logout
					usageStats: null,
					error: null,
				}),
		}),
		{
			name: "betterstack-auth",
			partialize: (state) => ({
				// Only persist apiKey if it's non-null (user-set key)
				// This prevents localStorage null from overwriting env default
				apiKey: state.apiKey ?? undefined,
				usageStats: state.usageStats,
			}),
			onRehydrateStorage: () => (state) => {
				// After rehydration, if apiKey is null/undefined, set to env default
				if (!state?.apiKey) {
					state?.setApiKey(getInitialApiKey());
				}
				state?.setHasHydrated(true);
			},
		},
	),
);
