"use client";

import { ClerkProvider as ClerkProviderBase, useAuth } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { convex } from "@/lib/convex-client";

/**
 * ClerkProvider with shadcn theme + Convex integration.
 * ConvexProviderWithClerk bridges Clerk auth to Convex.
 * Must wrap the entire app so Convex functions can use auth.
 */
export default function ClerkProvider({
	children,
	...props
}: React.ComponentProps<typeof ClerkProviderBase>) {
	return (
		<ClerkProviderBase {...props} appearance={{ theme: shadcn }}>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				{children}
			</ConvexProviderWithClerk>
		</ClerkProviderBase>
	);
}
