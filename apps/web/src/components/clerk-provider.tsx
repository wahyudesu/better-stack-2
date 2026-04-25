"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export default function ClerkProvider({
	children,
	...props
}: React.ComponentProps<typeof ClerkProviderBase>) {
	return <ClerkProviderBase {...props}>{children}</ClerkProviderBase>;
}
