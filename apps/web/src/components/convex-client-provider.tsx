"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { type ReactNode, useState } from "react";

export default function ConvexClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [convex] = useState(
		() => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
	);
	return (
		<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
			{children}
		</ConvexProviderWithClerk>
	);
}
