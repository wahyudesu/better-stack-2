"use client";

import { ChevronDown, Pencil, Plus, Trash2, Users } from "lucide-react";
import { Suspense, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAudiences } from "@/lib/api/ads";
import { formatNumber } from "@/lib/metrics";
import type { AdAudience } from "@/lib/types/ads";

export function AdsAudiences() {
	return (
		<Suspense
			fallback={
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="h-4 w-48 animate-pulse bg-muted rounded" />
						<div className="h-9 w-32 animate-pulse bg-muted rounded" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[...Array(3)].map((_, i) => (
							<AudienceCardSkeleton key={i} />
						))}
					</div>
				</div>
			}
		>
			<AdsAudiencesContent />
		</Suspense>
	);
}

async function AdsAudiencesContent() {
	const audiences = await getAudiences();

	const totalSize = audiences.reduce((sum, a) => sum + a.size, 0);

	return (
		<div className="space-y-4">
			{/* Header row */}
			<div className="flex items-center justify-between">
				<div>
					<div className="text-sm text-muted-foreground">
						{audiences.length} audience{audiences.length !== 1 ? "s" : ""} ·{" "}
						{formatNumber(totalSize)} total users
					</div>
				</div>
				<Button size="sm">
					<Plus className="h-4 w-4 mr-1" /> Create Audience
				</Button>
			</div>

			{/* Audience grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{audiences.map((audience) => (
					<AudienceCard key={audience._id} audience={audience} />
				))}
			</div>

			{audiences.length === 0 && (
				<div className="text-center py-12 text-muted-foreground">
					No audiences found. Create one to get started.
				</div>
			)}
		</div>
	);
}

export function AudienceCardSkeleton() {
	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 animate-pulse bg-muted rounded" />
						<div className="h-4 w-24 animate-pulse bg-muted rounded" />
					</div>
					<div className="h-7 w-7 animate-pulse bg-muted rounded" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-8 w-20 animate-pulse bg-muted rounded mb-1" />
				<div className="h-3 w-32 animate-pulse bg-muted rounded mb-3" />
				<div className="flex items-center gap-2">
					<div className="h-5 w-16 animate-pulse bg-muted rounded" />
					<div className="h-5 w-20 animate-pulse bg-muted rounded" />
				</div>
			</CardContent>
		</Card>
	);
}

const SOURCE_LABELS: Record<string, string> = {
	website: "Website",
	instagram: "Instagram",
	customer_list: "Customer List",
	lookalike: "Lookalike",
	app: "App",
};

function AudienceCard({ audience }: { audience: AdAudience }) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2">
						<Users className="h-4 w-4 text-muted-foreground" />
						<CardTitle className="text-sm font-medium truncate">
							{audience.name}
						</CardTitle>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger className="h-7 w-7 p-0 hover:bg-muted rounded-md transition-colors flex items-center">
							<ChevronDown className="h-4 w-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem>
								<Pencil className="h-4 w-4 mr-2" /> Edit
							</DropdownMenuItem>
							<DropdownMenuItem className="text-red-600">
								<Trash2 className="h-4 w-4 mr-2" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold mb-1">
					{formatNumber(audience.size)}
				</div>
				<div className="text-xs text-muted-foreground mb-3">
					users · {audience.retentionDays}d retention
				</div>

				<div className="flex items-center gap-2">
					<Badge variant="outline" className="text-xs capitalize">
						{audience.platform}
					</Badge>
					<Badge variant="secondary" className="text-xs">
						{SOURCE_LABELS[audience.source] ?? audience.source}
					</Badge>
				</div>

				{audience.description && (
					<p className="text-xs text-muted-foreground mt-2 line-clamp-2">
						{audience.description}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
