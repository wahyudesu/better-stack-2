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
	clerkToken: string | null;
	usageStats: UsageStats | null;
	isValidating: boolean;
	error: string | null;
	hasHydrated: boolean;
	setApiKey: (key: string | null) => void;
	setClerkToken: (token: string | null) => void;
	setUsageStats: (stats: UsageStats | null) => void;
	setIsValidating: (validating: boolean) => void;
	setError: (error: string | null) => void;
	setHasHydrated: (hydrated: boolean) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			apiKey: null,
			clerkToken: null,
			usageStats: null,
			isValidating: false,
			error: null,
			hasHydrated: false,
			setApiKey: (key) => set({ apiKey: key, error: null }),
			setClerkToken: (token) => set({ clerkToken: token, error: null }),
			setUsageStats: (stats) => set({ usageStats: stats }),
			setIsValidating: (validating) => set({ isValidating: validating }),
			setError: (error) => set({ error }),
			setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
			logout: () =>
				set({
					apiKey: null,
					clerkToken: null,
					usageStats: null,
					error: null,
				}),
		}),
		{
			name: "betterstack-auth",
			partialize: (state) => ({
				// Don't persist apiKey or clerkToken - they should only be in memory
				usageStats: state.usageStats,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
