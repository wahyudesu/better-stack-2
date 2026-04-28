"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@zenpost/ui/components/sonner";
import { useConvexAuth } from "convex/react";
import { useState } from "react";

import { useClerkTokenSync } from "@/hooks/use-clerk-token-sync";
import { useEnsureUser } from "@/hooks/use-ensure-user";
import { useUserApiKey } from "@/hooks/use-user-api-key";
import { AuthGateProvider } from "./auth/AuthGateContext";
import { ThemeProvider } from "./theme-provider";

function ProvidersWithAuth({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useConvexAuth();
	useEnsureUser();
	useClerkTokenSync();
	useUserApiKey(); // Sync API key from Convex to auth store for all consumers

	return (
		<AuthGateProvider isSignedIn={!!isAuthenticated && !isLoading}>
			{children}
		</AuthGateProvider>
	);
}

export default function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Global query defaults
						staleTime: 60 * 1000, // 1 minute
						retry: 1,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="light"
				enableSystem={false}
				disableTransitionOnChange
			>
				<ProvidersWithAuth>{children}</ProvidersWithAuth>
				<Toaster richColors />
			</ThemeProvider>
		</QueryClientProvider>
	);
}
