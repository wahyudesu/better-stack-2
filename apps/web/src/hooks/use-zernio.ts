/**
 * React hook to provide Zernio SDK instance
 */
"use client";

import { useUser } from "@clerk/nextjs";
import type Zernio from "@zernio/node";
import { useEffect, useState } from "react";
import { clearZernioCache, createZernioClient } from "@/lib/zernio-client";

export function useZernio() {
	const { user, isLoaded } = useUser();
	const [zernio, setZernio] = useState<InstanceType<typeof Zernio> | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoaded) return;

		if (!user) {
			setZernio(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		clearZernioCache();

		createZernioClient(user.id)
			.then(setZernio)
			.catch((err) =>
				setError(
					err instanceof Error ? err.message : "Failed to initialize Zernio",
				),
			)
			.finally(() => setLoading(false));
	}, [user, isLoaded]);

	return { zernio, loading, error };
}
