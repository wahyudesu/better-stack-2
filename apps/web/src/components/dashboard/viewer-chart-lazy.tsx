"use client";

import { Bar, BarChart, Cell, Tooltip, XAxis } from "recharts";

interface ViewerChartProps {
	data: Array<{ month: string; viewers: number }>;
	barColor: string;
	maxViewers: number;
	onMouseEnter: (viewers: number) => void;
	onMouseLeave: () => void;
}

function calculateOpacity(value: number, maxValue: number): number {
	const minOpacity = 0.1;
	const maxOpacity = 1.0;
	const normalized = value / maxValue;
	return minOpacity + normalized * (maxOpacity - minOpacity);
}

export function ViewerChart({
	data,
	barColor,
	maxViewers,
	onMouseEnter,
	onMouseLeave,
}: ViewerChartProps) {
	return (
		<BarChart
			accessibilityLayer
			data={data}
			margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
			barCategoryGap={2}
		>
			<XAxis hide axisLine={false} tickLine={false} />
			<Tooltip
				content={() => null}
				cursor={false}
				allowEscapeViewBox={{ x: false, y: false }}
			/>
			<Bar
				dataKey="viewers"
				radius={[20, 20, 0, 0]}
				fill="none"
				onMouseEnter={(d) => {
					if (d?.payload?.viewers !== undefined) {
						onMouseEnter(d.payload.viewers);
					}
				}}
				onMouseLeave={onMouseLeave}
			>
				{data.map((entry, index) => (
					<Cell
						key={`cell-${index}`}
						fill={barColor}
						fillOpacity={calculateOpacity(entry.viewers, maxViewers)}
						style={{ cursor: "pointer" }}
					/>
				))}
			</Bar>
		</BarChart>
	);
}
