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
	clerkToken: string | null;
	usageStats: UsageStats | null;
	isValidating: boolean;
	error: string | null;
	hasHydrated: boolean;
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
			clerkToken: null,
			usageStats: null,
			isValidating: false,
			error: null,
			hasHydrated: false,
			setClerkToken: (token) => set({ clerkToken: token, error: null }),
			setUsageStats: (stats) => set({ usageStats: stats }),
			setIsValidating: (validating) => set({ isValidating: validating }),
			setError: (error) => set({ error }),
			setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
			logout: () =>
				set({
					clerkToken: null,
					usageStats: null,
					error: null,
				}),
		}),
		{
			name: "betterstack-auth",
			partialize: (state) => ({
				// Don't persist clerkToken - should only be in memory
				usageStats: state.usageStats,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);