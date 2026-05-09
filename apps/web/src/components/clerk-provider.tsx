"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

/**
 * ClerkProvider with shadcn theme.
 * No Convex wrapper - Supabase replaces Convex backend.
 */
export default function ClerkProvider({
	children,
	...props
}: React.ComponentProps<typeof ClerkProviderBase>) {
	return (
		<ClerkProviderBase {...props} appearance={{ theme: shadcn }}>
			{children}
		</ClerkProviderBase>
	);
}
