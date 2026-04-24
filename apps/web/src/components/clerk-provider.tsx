"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";
import type { ClerkProviderProps } from "@clerk/nextjs";

export default function ClerkProvider({ children, ...props }: ClerkProviderProps) {
	return <ClerkProviderBase {...props}>{children}</ClerkProviderBase>;
}