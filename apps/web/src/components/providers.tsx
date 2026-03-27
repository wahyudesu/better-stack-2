"use client";

import { Toaster } from "@better-stack-2/ui/components/sonner";
import { useAuth } from "@clerk/nextjs";
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
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			enableSystem={false}
			disableTransitionOnChange
		>
			<ProvidersWithAuth>{children}</ProvidersWithAuth>
			<Toaster richColors />
		</ThemeProvider>
	);
}
