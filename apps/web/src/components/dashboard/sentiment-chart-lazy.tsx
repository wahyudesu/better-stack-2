"use client";

import {
	Label,
	PolarGrid,
	PolarRadiusAxis,
	RadialBar,
	RadialBarChart,
} from "recharts";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

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

export function SentimentChart() {
	return (
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
	);
}
