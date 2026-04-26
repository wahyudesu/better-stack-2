import { getAds } from "@/lib/api/ads";
import { AdRow } from "./AdRow";

interface AdsListProps {
	platform: string;
	status: string;
}

export async function AdsList({ platform, status }: AdsListProps) {
	const params: Record<string, string | number> = { limit: 50 };
	if (platform !== "all") params.platform = platform;
	if (status !== "all") params.status = status;

	const ads = await getAds(params);

	return (
		<div className="space-y-4">
			<div className="text-sm text-muted-foreground">
				{ads.length} ad{ads.length !== 1 ? "s" : ""}
			</div>

			<div className="space-y-3">
				{ads.map((ad) => (
					<AdRow key={ad._id} ad={ad} />
				))}
			</div>

			{ads.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No ads found matching your filters.
				</div>
			)}
		</div>
	);
}