import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores";

export const brandKeys = {
	all: ["brands"] as const,
	list: () => ["brands", "list"] as const,
};

export function useBrands() {
	const apiKey = useAuthStore((s) => s.apiKey);

	return useQuery({
		queryKey: brandKeys.list(),
		enabled: !!apiKey,
		queryFn: async () => {
			const res = await fetch("/api/profiles");
			if (!res.ok) throw new Error("Failed to fetch brands");
			return res.json() as Promise<
				Array<{
					id: string;
					name: string;
					description: string | null;
					is_default: boolean;
					zernio_profile_id: string | null;
				}>
			>;
		},
	});
}

export function useBrandMutations() {
	const queryClient = useQueryClient();

	return {
		async createBrand(name: string) {
			const res = await fetch("/api/profiles", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name }),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error((err as any).error || "Failed to create brand");
			}
			queryClient.invalidateQueries({ queryKey: brandKeys.all });
			return res.json();
		},

		async updateBrand(
			id: string,
			data: { name?: string; is_default?: boolean },
		) {
			const res = await fetch(`/api/profiles/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error((err as any).error || "Failed to update brand");
			}
			queryClient.invalidateQueries({ queryKey: brandKeys.all });
			return res.json();
		},

		async deleteBrand(id: string) {
			const res = await fetch(`/api/profiles/${id}`, {
				method: "DELETE",
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error((err as any).error || "Failed to delete brand");
			}
			queryClient.invalidateQueries({ queryKey: brandKeys.all });
			return res.json();
		},
	};
}
