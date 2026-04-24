import { Skeleton } from "@zenpost/ui/components/skeleton";
import { Card } from "@/components/ui/card";

export function InboxSkeleton() {
	return (
		<div className="mx-auto max-w-6xl h-[calc(100vh-8rem)]">
			{/* Header */}
			<div className="mb-4">
				<Skeleton className="h-8 w-20 mb-2" />
				<Skeleton className="h-4 w-48" />
			</div>

			{/* Tabs */}
			<div className="mb-6">
				<div className="flex gap-4">
					<Skeleton className="h-10 w-24" />
					<Skeleton className="h-10 w-32" />
				</div>
			</div>

			{/* Filters */}
			<div className="flex gap-2 mb-4">
				<Skeleton className="h-10 w-40" />
				<Skeleton className="h-10 w-32" />
			</div>

			{/* Main Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100%-6rem)]">
				{/* Conversation List */}
				<Card className="lg:col-span-1 border-border/50 overflow-hidden">
					<div className="p-3 space-y-2">
						<Skeleton className="h-9 w-full" />
					</div>
					<div className="p-2 space-y-2">
						{[...Array(6)].map((_, i) => (
							<div key={i} className="p-3 rounded-xl bg-muted/30">
								<div className="flex gap-3">
									<Skeleton className="h-12 w-12 rounded-full" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-full" />
										<Skeleton className="h-3 w-3/4" />
									</div>
								</div>
							</div>
						))}
					</div>
				</Card>

				{/* Chat View */}
				<Card className="hidden lg:flex lg:col-span-2 border-border/50 items-center justify-center">
					<div className="text-center">
						<Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
						<Skeleton className="h-4 w-48 mx-auto" />
					</div>
				</Card>
			</div>
		</div>
	);
}
