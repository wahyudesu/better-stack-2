"use client";

import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@zenpost/ui/components/sonner";
import { useState } from "react";

import { useClerkTokenSync } from "@/hooks/use-clerk-token-sync";
import { AuthGateProvider } from "./auth/AuthGateContext";
import { ThemeProvider } from "./theme-provider";

function ProvidersWithAuth({ children }: { children: React.ReactNode }) {
	const { isLoaded, isSignedIn } = useAuth();
	useClerkTokenSync();

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
