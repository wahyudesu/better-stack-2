"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type ReactNode, Suspense, useState } from "react";

let convexClient: ConvexReactClient | null = null;

function getConvexClient() {
	if (!convexClient) {
		convexClient = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
	}
	return convexClient;
}

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [convex] = useState(() => getConvexClient());
	return (
		<Suspense fallback={<div className="flex size-full items-center justify-center"><div className="animate-spin size-8 rounded-full border-2 border-muted border-t-foreground" /></div>}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				{children}
			</ConvexProviderWithClerk>
		</Suspense>
	);
}
