"use client";

import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PieCenter } from "@/components/charts/pie-center";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { statusBadgeStyles } from "@/lib/constants/ui";

const pieData = [
	{ label: "Positive", value: 78, color: statusBadgeStyles.published.text },
	{ label: "Negative", value: 22, color: "#d4d4d8" },
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

// Pie Chart with center value
function SentimentPieChart({ score }: { score: number }) {
	return (
		<PieChart
			data={pieData}
			size={80}
			innerRadius={75}
			hoverOffset={0}
			cornerRadius={50}
		>
			{/* Background gray circle - radius matches innerRadius (30px) */}
			<circle cx={0} cy={0} r={30} fill="none" stroke="#e4e4e7" strokeWidth={10} />
			<PieSlice index={0} key={0} hoverOffset={0} />
			<PieCenter
				value={pieData[0].value}
				defaultLabel=""
				suffix="%"
				className="text-md"
				valueClassName="font-semibold text-foreground"
				labelClassName="hidden"
			/>
		</PieChart>
	);
}

export function SentimentCard() {
	const sentimentScore = pieData[0].value; // 78
	const healthStatus = getHealthStatus(sentimentScore);

	return (
		<div className="bg-white border rounded-xl p-3 sm:p-4 relative">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<p className="text-base font-semibold">Sentiment Score</p>
					<SimpleTooltip content="Analisis sentimen berdasarkan engagement dan komentar dari postingan">
						<Info className="size-4 text-muted-foreground cursor-help" />
					</SimpleTooltip>
				</div>
				<Button asChild variant="secondary" className="">
					<Link href="/analytics" className="flex items-center gap-1.5">
						Read more <ChevronRight className="size-4" />
					</Link>
				</Button>
			</div>
			<div className="flex items-center justify-start gap-4">
				{/* Smaller pie chart on the left */}
				<SentimentPieChart score={sentimentScore} />

				{/* Text on the right */}
				<div className="flex flex-col flex-1 min-w-0 pr-8">
					<p className={`text-xl sm:text-2xl font-bold ${healthStatus.color}`}>
						{healthStatus.label}
					</p>
					<p className="text-xs sm:text-sm text-muted-foreground">
						{healthStatus.description}
					</p>
				</div>
			</div>
		</div>
	);
}

// Placeholder card for future use
export function PlaceholderCard({ title = "Coming Soon" }: { title?: string }) {
	return (
		<div className="bg-white border rounded-xl p-3 sm:p-4 min-h-48 flex items-center justify-center">
			<div className="text-center">
				<p className="text-base font-semibold text-muted-foreground">{title}</p>
				<p className="text-sm text-muted-foreground/70 mt-1">
					More insights coming soon
				</p>
			</div>
		</div>
	);
}
