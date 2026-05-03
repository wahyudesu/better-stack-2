"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

/**
 * ClerkProvider with shadcn theme configuration.
 * Note: ClerkProvider must be used in a client component boundary.
 * The actual user data (email, name, imageUrl) is available via useUser() hook
 * in child components after authentication completes.
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
