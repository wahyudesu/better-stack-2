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
			size={70}
			strokeWidth={8}
			ringGap={8}
			baseInnerRadius={30}
		>
			<Ring index={0} showGlow={false} />
			<RingCenter
				defaultLabel=""
				suffix=""
				className="text-xs sm:text-sm tabular-nums"
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
		<Card className="h-full flex flex-col gap-0 pb-0 touch-[action:manipulation]">
			<CardHeader className="pb-3 sm:pb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
					<div className="flex items-center gap-2 min-w-0">
						<CardTitle className="text-base sm:text-lg text-wrap:balance">
							Sentiment Score
						</CardTitle>
						<SimpleTooltip content="Analisis sentimen berdasarkan engagement dan komentar dari postingan">
							<Info
								className="size-3.5 sm:size-4 text-muted-foreground cursor-help shrink-0"
								aria-label="Sentiment info"
							/>
						</SimpleTooltip>
					</div>
					<Link
						href="/analytics"
						className="flex items-center gap-1.5 self-start sm:self-auto shrink-0"
					>
						<Button variant="secondary" size="xs">
							<span className="truncate">Sentiment Analysis</span>
							<ChevronRight className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
						</Button>
					</Link>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex items-center px-4 sm:px-6">
				<div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full">
					{/* Ring chart */}
					<div className="shrink-0">
						<SentimentRingChart score={sentimentScore} />
					</div>

					{/* Text */}
					<div className="flex flex-col flex-1 min-w-0 gap-1 sm:gap-1.5 py-1">
						<p
							className={cn(
								"text-lg sm:text-xl lg:text-2xl font-bold",
								healthStatus.color,
							)}
						>
							{healthStatus.label}
						</p>
						<p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
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
		<Card className="min-h-36 sm:min-h-40 flex items-center justify-center touch-[action:manipulation]">
			<div className="text-center px-4">
				<p className="text-base font-semibold text-muted-foreground">{title}</p>
				<p className="text-sm text-muted-foreground/70 mt-1">
					More insights coming soon…
				</p>
			</div>
		</Card>
	);
}
