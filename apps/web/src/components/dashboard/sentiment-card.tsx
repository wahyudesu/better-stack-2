"use client";

import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import { RingChart } from "@/components/charts/ring-chart";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { statusBadgeStyles } from "@/lib/constants/ui";
import { cn } from "@/lib/utils";

const ringData = [
	{
		label: "Sentiment",
		value: 78,
		maxValue: 100,
		color: statusBadgeStyles.published.text,
	},
];

// Get health status based on sentiment score
function getHealthStatus(score: number): {
	label: string;
	color: string;
	description: string;
} {
	if (score >= 80) {
		return {
			label: "Excellent",
			color: "text-green-600 dark:text-green-500",
			description:
				"Great work. Most of your visitors had an excellent experience.",
		};
	}
	if (score >= 60) {
		return {
			label: "Good",
			color: "text-green-600 dark:text-green-500",
			description: "Your audience engagement is positive with room to grow.",
		};
	}
	if (score >= 40) {
		return {
			label: "Fair",
			color: "text-green-600 dark:text-green-500",
			description: "Mixed sentiment. Consider reviewing your content strategy.",
		};
	}
	return {
		label: "Poor",
		color: "text-green-600 dark:text-green-500",
		description: "Low sentiment detected. Action needed to improve engagement.",
	};
}

// Ring Chart with center value
function SentimentRingChart({ score }: { score: number }) {
	return (
		<RingChart
			data={ringData}
			size={80}
			strokeWidth={6}
			ringGap={10}
			baseInnerRadius={24}
		>
			<Ring index={0} showGlow={false} />
			<RingCenter
				defaultLabel=""
				suffix="%"
				className="text-sm"
				valueClassName="font-semibold text-foreground"
				labelClassName="hidden"
			/>
		</RingChart>
	);
}

export function SentimentCard() {
	const sentimentScore = ringData[0].value; // 78
	const healthStatus = getHealthStatus(sentimentScore);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center gap-2">
					<CardTitle>Sentiment Score</CardTitle>
					<SimpleTooltip content="Analisis sentimen berdasarkan engagement dan komentar dari postingan">
						<Info className="size-4 text-muted-foreground cursor-help" />
					</SimpleTooltip>
				</div>
				<CardAction>
					<Link href="/analytics" className="flex items-center gap-1.5">
						<Button variant="secondary" size="xs">
							Sentiment Analysis <ChevronRight className="size-3.5 sm:size-4" />
						</Button>
					</Link>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-start gap-2">
					{/* Smaller ring chart on the left */}
					<SentimentRingChart score={sentimentScore} />

					{/* Text on the right */}
					<div className="flex flex-col flex-1 min-w-0 pr-4 sm:pr-8">
						<p
							className={cn("text-lg sm:text-2xl font-bold", healthStatus.color)}
						>
							{healthStatus.label}
						</p>
						<p className="text-xs text-muted-foreground line-clamp-2">
							{healthStatus.description}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Placeholder card for future use
export function PlaceholderCard({ title = "Coming Soon" }: { title?: string }) {
	return (
		<Card className="min-h-40 sm:min-h-48 flex items-center justify-center">
			<div className="text-center">
				<p className="text-base font-semibold text-muted-foreground">{title}</p>
				<p className="text-sm text-muted-foreground/70 mt-1">
					More insights coming soon
				</p>
			</div>
		</Card>
	);
}
