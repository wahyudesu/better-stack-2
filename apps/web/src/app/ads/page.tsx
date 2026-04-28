import { Suspense } from "react";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { AdsContent } from "./AdsContent";

export default function AdsPage() {
	return (
		<Suspense fallback={<AdsPageSkeleton />}>
			<AdsContent />
		</Suspense>
	);
}

function AdsPageSkeleton() {
	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="space-y-4">
				<div className="h-8 w-48 animate-pulse bg-muted rounded-md" />
				<div className="h-4 w-72 animate-pulse bg-muted rounded-md" />
				<div className="h-10 w-96 animate-pulse bg-muted rounded-md mt-6" />
				<div className="h-12 animate-pulse bg-muted rounded-md mt-4" />
				<div className="h-96 animate-pulse bg-muted rounded-md mt-4" />
			</div>
		</div>
	);
}
