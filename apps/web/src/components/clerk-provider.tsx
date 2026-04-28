"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

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
