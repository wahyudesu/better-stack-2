import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useZernio } from "@/hooks/use-zernio";
import { getZernioErrorMessage } from "@/lib/zernio-error";

export const brandKeys = {
	all: ["brands"] as const,
	list: () => ["brands", "list"] as const,
};

export function useBrands() {
	const { zernio, loading, error } = useZernio();

	const query = useQuery({
		queryKey: brandKeys.list(),
		queryFn: async () => {
			if (!zernio) return [];
			const res = await zernio.profiles.listProfiles();
			if (!res.data) throw new Error(getZernioErrorMessage(res.error));
			// Response is ProfilesListResponse with profiles array inside
			const profiles = (res.data as any).profiles ?? [];
			return profiles as Array<{
				_id: string;
				name: string;
				is_default?: boolean;
			}>;
		},
		enabled: !loading && !!zernio,
	});

	return {
		data: query.data ?? [],
		isLoading: loading || query.isFetching,
		error: error || query.error,
	};
}

export function useBrandMutations() {
	const queryClient = useQueryClient();
	const { zernio } = useZernio();

	return {
		async createBrand(name: string) {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.profiles.createProfile({ body: { name } });
			if (!res.data) throw new Error(getZernioErrorMessage(res.error));
			queryClient.invalidateQueries({ queryKey: brandKeys.all });
			return res.data;
		},

		async updateBrand(
			id: string,
			data: { name?: string; is_default?: boolean },
		) {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.profiles.updateProfile({
				path: { profileId: id },
				body: data,
			});
			if (!res.data) throw new Error(getZernioErrorMessage(res.error));
			queryClient.invalidateQueries({ queryKey: brandKeys.all });
			return res.data;
		},

		async deleteBrand(id: string) {
			if (!zernio) throw new Error("Zernio not initialized");
			const res = await zernio.profiles.deleteProfile({
				path: { profileId: id },
			});
			if (!res.data && res.error)
				throw new Error(getZernioErrorMessage(res.error));
			queryClient.invalidateQueries({ queryKey: brandKeys.all });
			return res.data;
		},
	};
}
