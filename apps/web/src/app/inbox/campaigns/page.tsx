import { Suspense } from "react";
import { InboxSkeleton } from "@/components/ui/InboxSkeleton";
import { InboxCampaigns } from "./InboxCampaigns";

export default function InboxCampaignsPage() {
	return (
		<Suspense fallback={<InboxSkeleton />}>
			<InboxCampaigns />
		</Suspense>
	);
}
