"use client";

import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const sentimentScore = 98;

const chartData = [{ sentiment: sentimentScore, fill: "var(--color-safari)" }];

const chartConfig = {
	sentiment: {
		label: "Sentiment",
	},
	safari: {
		label: "Safari",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

// Get health status based on sentiment score
function getHealthStatus(score: number): {
	label: string;
	color: string;
	description: string;
} {
	if (score >= 80) {
		return {
			label: "Excellent",
			color: "",
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

export function SentimentCard() {
	const healthStatus = getHealthStatus(sentimentScore);

	return (
		<Card className="h-36 flex flex-col dark:bg-card/50 py-2 gap-0">
			<CardHeader className="flex items-center justify-between gap-2 py-2 h-fit">
				<CardTitle className="w-full h-full leading-none font-medium flex items-center gap-1">
					Sentiment Score
				</CardTitle>
				<CardAction>
					<Link
						href="/analytics"
						className={buttonVariants({ variant: "secondary", size: "xs" })}
					>
						Sentiment Analytics <ChevronRight className="size-3.5 sm:size-4" />
					</Link>
				</CardAction>
			</CardHeader>

			<CardContent className="flex-1 flex items-start pt-2 pb-0 px-4">
				<div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 w-full">
					{/* Radial chart */}
					<div className="shrink-0">
						<ChartContainer config={chartConfig} className="size-[68px]">
							<RadialBarChart
								data={chartData}
								startAngle={90}
								endAngle={443}
								innerRadius={25}
								outerRadius={35}
							>
								<PolarGrid
									gridType="circle"
									radialLines={false}
									stroke="none"
									polarRadius={[34, 26]}
								/>
								<RadialBar
									dataKey="sentiment"
									style={{ fill: "#22c55e" }}
									cornerRadius={4}
								/>
								<PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
									<Label
										content={({ viewBox }) => {
											if (viewBox && "cx" in viewBox && "cy" in viewBox) {
												return (
													<text
														x={viewBox.cx}
														y={viewBox.cy}
														textAnchor="middle"
														dominantBaseline="middle"
													>
														<tspan
															x={viewBox.cx}
															y={viewBox.cy}
															className="fill-foreground text-lg"
														>
															{chartData[0].sentiment}
														</tspan>
													</text>
												);
											}
										}}
									/>
								</PolarRadiusAxis>
							</RadialBarChart>
						</ChartContainer>
					</div>

					{/* Text */}
					<div className="flex flex-col flex-1 min-w-0 gap-0.5 sm:gap-1">
						<p
							className={cn(
								"text-base sm:text-lg leading-none",
								healthStatus.color,
							)}
						>
							{healthStatus.label}
						</p>
						<p className="text-m text-muted-foreground line-clamp-2 leading-snug">
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
