"use client";

import { Toaster } from "@better-stack-2/ui/components/sonner";
import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthGateProvider } from "./auth/AuthGateContext";
import { ThemeProvider } from "./theme-provider";

function ProvidersWithAuth({ children }: { children: React.ReactNode }) {
	const { isSignedIn, isLoaded } = useAuth();

	// Show children while auth is loading, but use false for isSignedIn until loaded
	return (
		<AuthGateProvider isSignedIn={!!isSignedIn && isLoaded}>
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
