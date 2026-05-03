import { Suspense } from "react";
import { InboxSkeleton } from "@/components/ui/InboxSkeleton";
import { InboxAutomation } from "./InboxAutomation";

export default function InboxAutomationPage() {
	return (
		<Suspense fallback={<InboxSkeleton />}>
			<InboxAutomation />
		</Suspense>
	);
}
