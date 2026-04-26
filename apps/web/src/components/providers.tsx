"use client";

import { useConvexAuth } from "convex/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@zenpost/ui/components/sonner";
import { useState } from "react";
import { AuthGateProvider } from "./auth/AuthGateContext";
import { ThemeProvider } from "./theme-provider";

function ProvidersWithAuth({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, isLoading } = useConvexAuth();

	// Show children while auth is loading, but use false for isSignedIn until loaded
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
