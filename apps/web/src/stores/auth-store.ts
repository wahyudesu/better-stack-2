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
	clerkToken: string | null; // Alias for apiKey (backwards compat)
	apiKey: string | null;
	usageStats: UsageStats | null;
	isValidating: boolean;
	error: string | null;
	hasHydrated: boolean;
	setClerkToken: (token: string | null) => void; // Alias for setApiKey
	setApiKey: (key: string | null) => void;
	setUsageStats: (stats: UsageStats | null) => void;
	setIsValidating: (validating: boolean) => void;
	setError: (error: string | null) => void;
	setHasHydrated: (hydrated: boolean) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			clerkToken: null,
			apiKey: null,
			usageStats: null,
			isValidating: false,
			error: null,
			hasHydrated: false,
			setClerkToken: (token) => set({ clerkToken: token, apiKey: token }),
			setApiKey: (key) => set({ apiKey: key, clerkToken: key }),
			setUsageStats: (stats) => set({ usageStats: stats }),
			setIsValidating: (validating) => set({ isValidating: validating }),
			setError: (error) => set({ error }),
			setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
			logout: () =>
				set({
					clerkToken: null,
					apiKey: null,
					usageStats: null,
					error: null,
				}),
		}),
		{
			name: "betterstack-auth",
			partialize: (state) => ({
				clerkToken: state.clerkToken,
				apiKey: state.apiKey,
				usageStats: state.usageStats,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
