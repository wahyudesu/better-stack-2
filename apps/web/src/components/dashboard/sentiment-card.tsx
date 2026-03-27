"use client";

import { Info } from "lucide-react";
import { useState } from "react";
import { PieCenter } from "@/components/charts/pie-center";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { statusBadgeStyles } from "@/lib/constants/ui";

const pieData = [
	{ label: "Positive", value: 78, color: statusBadgeStyles.published.text },
	{ label: "Negative", value: 22, color: statusBadgeStyles.failed.text },
];

// Pie Chart with center value
function SentimentPieChart() {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<PieChart
			data={pieData}
			size={75}
			innerRadius={80}
			hoveredIndex={hoveredIndex}
			onHoverChange={setHoveredIndex}
		>
			{pieData.map((_, i) => (
				<PieSlice index={i} key={i} />
			))}
			<PieCenter>
				{({ value, label, isHovered, data }) => (
					<div className="text-center">
						<div
							className="text-xl font-bold"
							style={{ color: isHovered ? data.color : undefined }}
						>
							{value}%
						</div>
						<div className="text-xs text-muted-foreground">{label}</div>
					</div>
				)}
			</PieCenter>
		</PieChart>
	);
}

export function SentimentCard() {
	return (
		<div className="bg-white border rounded-xl p-3 sm:p-4 min-h-48">
			<div className="flex items-center gap-2 mb-3">
				<p className="text-base font-semibold">Sentiment Score</p>
				<SimpleTooltip content="Analisis sentimen berdasarkan engagement dan komentar dari postingan">
					<Info className="size-4 text-muted-foreground cursor-help" />
				</SimpleTooltip>
			</div>
			<div className="flex items-center justify-start gap-2">
				{/* Smaller pie chart on the left */}
				<SentimentPieChart />

				{/* Text on the right */}
				<div className="flex flex-col">
					<p className="text-2xl sm:text-3xl font-bold text-green-600">
						Excellent
					</p>
					<p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-[180px]">
						Great work. Most of your visitors had an excellent experience.
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
