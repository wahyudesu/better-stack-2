import { Suspense } from "react";
import { InboxSkeleton } from "@/components/ui/InboxSkeleton";
import { InboxContent } from "./InboxContent";

export default function InboxPage() {
	return (
		<Suspense fallback={<InboxSkeleton />}>
			<InboxContent />
		</Suspense>
	);
}
