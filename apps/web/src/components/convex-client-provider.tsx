"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type ReactNode, Suspense, useState } from "react";

let convexClient: ConvexReactClient | null = null;

function getConvexClient() {
	const url = process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!url) return null;
	if (!convexClient) {
		convexClient = new ConvexReactClient(url);
	}
	return convexClient;
}

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [convex] = useState(() => getConvexClient());
	if (!convex) {
		return <div className="flex size-full items-center justify-center"><div className="animate-spin size-8 rounded-full border-2 border-muted border-t-foreground" /></div>;
	}
	return (
		<Suspense fallback={<div className="flex size-full items-center justify-center"><div className="animate-spin size-8 rounded-full border-2 border-muted border-t-foreground" /></div>}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				{children}
			</ConvexProviderWithClerk>
		</Suspense>
	);
}
