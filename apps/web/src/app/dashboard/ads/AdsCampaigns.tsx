import { getCampaigns } from "@/lib/api/ads";
import { CampaignRow } from "./CampaignRow";

interface AdsCampaignsProps {
	platform: string;
	status: string;
}

export async function AdsCampaigns({ platform, status }: AdsCampaignsProps) {
	const params: Record<string, string | number> = { limit: 50 };
	if (platform !== "all") params.platform = platform;
	if (status !== "all") params.status = status;

	const campaigns = await getCampaigns(params);

	return (
		<div className="space-y-4">
			{/* Campaign count */}
			<div className="text-sm text-muted-foreground">
				{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}
			</div>

			{/* Campaign list */}
			<div className="space-y-3">
				{campaigns.map((campaign) => (
					<CampaignRow key={campaign._id} campaign={campaign} />
				))}
			</div>

			{campaigns.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No campaigns found matching your filters.
				</div>
			)}
		</div>
	);
}