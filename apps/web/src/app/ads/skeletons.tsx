"use client";

// Skeleton components for ads page cards

export function StatCardSkeleton() {
	return (
		<div className="py-4">
			<div className="h-3 w-16 animate-pulse bg-muted rounded mb-2" />
			<div className="h-8 w-20 animate-pulse bg-muted rounded" />
		</div>
	);
}

export function PlatformBreakdownCardSkeleton() {
	return (
		<div className="space-y-3">
			{[...Array(3)].map((_, i) => (
				<div key={i} className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="h-5 w-12 animate-pulse bg-muted rounded" />
						<div className="h-4 w-24 animate-pulse bg-muted rounded" />
					</div>
					<div className="h-4 w-20 animate-pulse bg-muted rounded" />
				</div>
			)
	)
}
</div>
)
}

export function RecentCampaignsCardSkeleton() {
	return (
		<div className="space-y-3">
			{[...Array(5)].map((_, i) => (
				<div key={i} className="flex items-center justify-between">
					<div className="flex items-center gap-2 min-w-0">
						<div className="h-5 w-12 animate-pulse bg-muted rounded" />
						<div className="h-4 w-32 animate-pulse bg-muted rounded" />
					</div>
					<div className="flex items-center gap-3 shrink-0">
						<div className="h-5 w-16 animate-pulse bg-muted rounded" />
						<div className="h-4 w-12 animate-pulse bg-muted rounded" />
					</div>
				</div>
			)
	)
}
</div>
)
}

export function CampaignRowSkeleton() {
	return (
		<div className="p-4 space-y-3">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0 flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<div className="h-5 w-40 animate-pulse bg-muted rounded" />
						<div className="h-5 w-16 animate-pulse bg-muted rounded" />
					</div>
					<div
	className="flex items-center gap-3">
						<div className="h-4 w-12 animate-pulse bg-muted rounded" />
						<div className="h-4 w-20 animate-pulse bg-muted rounded" />
						<div className="h-4 w-12 animate-pulse bg-muted rounded" />
						<div className="h-4 w-24 animate-pulse bg-muted rounded" />
					</div>
				</div>
				<div
	className="flex items-center gap-6 shrink-0">
					<div className="grid grid-cols-4 gap-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="space-y-1 text-center">
								<div className="h-3 w-8 animate-pulse bg-muted rounded mx-auto" />
								<div className="h-4 w-10 animate-pulse bg-muted rounded mx-auto" />
							</div>
	))
}
</div>
					<div
className="h-8 w-8 animate-pulse bg-muted rounded" />
				</div>
			</div>
		</div>
)
}

export function AdCardSkeleton() {
	return (
		<div className="p-3">
			<div className="flex items-start gap-3">
				<div className="w-12 h-12 animate-pulse bg-muted rounded-md shrink-0" />
				<div className="min-w-0 flex-1 space-y-2">
					<div className="flex items-center gap-2">
						<div className="h-4 w-28 animate-pulse bg-muted rounded" />
						<div className="h-5 w-16 animate-pulse bg-muted rounded" />
					</div>
					<div
	className="h-3 w-48 animate-pulse bg-muted rounded" />
					<div className="flex items-center gap-2">
						<div className="h-3 w-12 animate-pulse bg-muted rounded" />
						<div className="h-3 w-16 animate-pulse bg-muted rounded" />
						<div className="h-3 w-12 animate-pulse bg-muted rounded" />
					</div>
				</div>
			</div>
		</div>
	)
}

export function AudienceCardSkeleton() {
	return (
		<div className="space-y-3">
			<div className="flex items-start justify-between">
				<div className="flex items-center gap-2">
					<div className="h-4 w-4 animate-pulse bg-muted rounded" />
					<div className="h-4 w-24 animate-pulse bg-muted rounded" />
				</div>
				<div
	className="h-7 w-7 animate-pulse bg-muted rounded" />
			</div>
			<div
	className="h-8 w-20 animate-pulse bg-muted rounded" />
			<div className="h-3 w-32 animate-pulse bg-muted rounded" />
			<div className="flex items-center gap-2">
				<div className="h-5 w-16 animate-pulse bg-muted rounded" />
				<div className="h-5 w-20 animate-pulse bg-muted rounded" />
			</div>
		</div>
	)
}
