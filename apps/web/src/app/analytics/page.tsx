"use client";

import {
	ArrowLeft,
	Calendar,
	ChevronDown,
	Info,
	Share2,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { formatMetricValue } from "@/lib/metrics";

// Seeded random for consistent SSR/CSR values
function seededRandom(seed: number): number {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import {
	ChartTooltip,
	Line,
	LineChart,
	SegmentBackground,
	SegmentLineFrom,
	SegmentLineTo,
	XAxis,
} from "@/components/charts/line-chart";
import { ChartMarkers } from "@/components/charts/markers";
import { PieChart } from "@/components/charts/pie-chart";
import {
	Legend,
	LegendItemComponent,
	LegendLabel,
	LegendMarker,
} from "@/components/charts/pie-legend";
import { PieSlice } from "@/components/charts/pie-slice";
import {
	ageData,
	contentTypeData,
	genderData,
	platformData,
	recentPosts,
	socialMediaOptions,
	timeOptions,
	topPosts,
} from "@/lib/data/analytics-data";
import { STAT_DEFINITIONS } from "@/lib/types/analytics";

// Colors for pie chart
const pieColors = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
];

// Pie Chart with Legend wrapper
function PieChartWithLegend({
	data,
	size,
}: {
	data: { label: string; value: number }[];
	size: number;
}) {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const legendItems = data.map((item, index) => ({
		...item,
		color: pieColors[index % pieColors.length],
	}));

	return (
		<>
			<PieChart
				data={data}
				size={size}
				innerRadius={55}
				hoveredIndex={hoveredIndex}
				onHoverChange={setHoveredIndex}
			>
				{data.map((item, index) => (
					<PieSlice index={index} key={item.label} />
				))}
			</PieChart>
			<Legend
				items={legendItems}
				hoveredIndex={hoveredIndex}
				onHoverChange={setHoveredIndex}
				className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2"
			>
				<LegendItemComponent>
					<LegendMarker className="size-2.5 sm:size-3 rounded-full" />
					<LegendLabel showValue valueSuffix="%" />
				</LegendItemComponent>
			</Legend>
		</>
	);
}

// Generate detailed analytics data
function generateDetailedData(timeRange: string, platform: string) {
	// Create seed from parameters for deterministic results
	const seedString = `${timeRange}-${platform}`;
	let seed = 0;
	for (let i = 0; i < seedString.length; i++) {
		seed = (seed + seedString.charCodeAt(i)) | 0;
	}
	const random = () => seededRandom(seed++);

	const daysMap: Record<string, number> = {
		"7d": 7,
		"14d": 14,
		"30d": 30,
		"90d": 90,
	};
	const days = daysMap[timeRange] || 30;

	const platformMult = platform === "all" ? 1 : 0.7 + random() * 0.6;

	const chartData = Array.from({ length: days }, (_, i) => {
		return {
			day: i,
			engagements: Math.floor(
				(12000 + Math.sin(i / 4) * 4000 + ((i * 200) % 6000)) * platformMult,
			),
			impressions: Math.floor(
				(45000 + Math.sin(i / 3) * 15000 + ((i * 500) % 20000)) * platformMult,
			),
			followers: Math.floor(
				(80000 + i * 150 + Math.cos(i / 3) * 3000 + ((i * 100) % 5000)) *
					platformMult,
			),
			clicks: Math.floor(
				(3500 + Math.sin(i / 2) * 1200 + ((i * 80) % 2000)) * platformMult,
			),
			shares: Math.floor(
				(800 + Math.sin(i / 5) * 300 + ((i * 30) % 500)) * platformMult,
			),
			saves: Math.floor(
				(1200 + Math.cos(i / 4) * 400 + ((i * 50) % 800)) * platformMult,
			),
		};
	});

	const markers = Array.from({ length: Math.floor(days / 7) }, (_, i) => {
		// Use stable reference date for prerender compatibility
		const baseDate = new Date(2024, 0, 1); // Jan 1, 2024 as stable reference
		baseDate.setDate(baseDate.getDate() + (days - (i + 1) * 7));
		return {
			date: baseDate,
			network: ["instagram", "facebook", "x", "tiktok", "linkedin", "youtube"][
				i % 6
			],
			color: ["#E1306C", "#1877F2", "#000000", "#000000", "#0077B5", "#FF0000"][
				i % 6
			],
			title: [
				"Product Launch",
				"Campaign Start",
				"Viral Content",
				"Announcement",
				"Tips",
				"New Feature",
			][i % 6],
		};
	});

	return { chartData, markers, days };
}

// Generate hourly engagement data
function generateHourlyData() {
	let seed = 12345;
	const random = () => seededRandom(seed++);
	return Array.from({ length: 24 }, (_, i) => ({
		hour: i,
		engagement: Math.floor(500 + Math.sin((i - 10) / 4) * 400 + random() * 200),
	}));
}

// Generate weekly data
function generateWeeklyData() {
	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	let seed = 54321;
	const random = () => seededRandom(seed++);
	return days.map((day) => ({
		day,
		engagement: Math.floor(8000 + random() * 4000),
		reach: Math.floor(25000 + random() * 10000),
	}));
}

export default function AnalyticsPage() {
	const [selectedPlatform, setSelectedPlatform] = useState("all");
	const [selectedTime, setSelectedTime] = useState("30d");
	const [activeMetric, setActiveMetric] = useState("engagements");
	const [compareMetric, _setCompareMetric] = useState<string | null>(null);

	const {
		chartData,
		markers,
		days: _unusedDays,
	} = useMemo(
		() => generateDetailedData(selectedTime, selectedPlatform),
		[selectedTime, selectedPlatform],
	);

	const hourlyData = useMemo(() => generateHourlyData(), []);
	const weeklyData = useMemo(() => generateWeeklyData(), []);

	// Calculate totals
	const totals = useMemo(() => {
		const totalEngagements = chartData.reduce(
			(sum, d) => sum + d.engagements,
			0,
		);
		const totalImpressions = chartData.reduce(
			(sum, d) => sum + d.impressions,
			0,
		);
		const totalClicks = chartData.reduce((sum, d) => sum + d.clicks, 0);
		const totalShares = chartData.reduce((sum, d) => sum + d.shares, 0);
		const totalSaves = chartData.reduce((sum, d) => sum + d.saves, 0);
		const followerGrowth =
			chartData[chartData.length - 1]?.followers - chartData[0]?.followers || 0;

		return {
			engagements: totalEngagements,
			impressions: totalImpressions,
			clicks: totalClicks,
			shares: totalShares,
			saves: totalSaves,
			followerGrowth,
		};
	}, [chartData]);

	const metricOptions = [
		{
			value: "engagements",
			label: "Engagements",
			color: "var(--chart-line-primary)",
		},
		{ value: "impressions", label: "Impressions", color: "var(--chart-2)" },
		{ value: "followers", label: "Followers", color: "var(--chart-3)" },
		{ value: "clicks", label: "Clicks", color: "var(--chart-4)" },
	];

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="space-y-6">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Link href="/dashboard">
							<span className="inline-flex items-center justify-center size-10 rounded-md hover:bg-muted transition-colors cursor-pointer">
								<ArrowLeft className="size-5" />
							</span>
						</Link>
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
							<p className="text-sm text-muted-foreground">
								Detailed insights and performance metrics
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm transition-colors cursor-pointer">
							<Calendar className="size-4 mr-2" />
							Export Report
						</span>
						<span className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-md text-sm transition-colors cursor-pointer">
							<Share2 className="size-4 mr-2" />
							Share
						</span>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-3">
					<Select
						value={selectedPlatform}
						onValueChange={(v) => setSelectedPlatform(v ?? "all")}
					>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select platform" />
						</SelectTrigger>
						<SelectContent>
							{socialMediaOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={selectedTime}
						onValueChange={(v) => setSelectedTime(v ?? "30d")}
					>
						<SelectTrigger className="w-[160px]">
							<SelectValue placeholder="Time range" />
						</SelectTrigger>
						<SelectContent>
							{timeOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Overview Stats */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{STAT_DEFINITIONS.map((stat) => (
						<div key={stat.label} className="border rounded-lg p-4">
							<p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
							<p className="text-xl font-bold">
								{formatMetricValue(
									(totals[stat.key as keyof typeof totals] ?? 0) as number,
								)}
							</p>
							<div className="flex items-center gap-0.5 text-xs text-success mt-1">
								<TrendingUp className="size-3" />
								{stat.change}
							</div>
						</div>
					))}
				</div>

				{/* Main Chart */}
				<div className="border rounded-lg p-4">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
						<DropdownMenu>
							<DropdownMenuTrigger className="text-lg font-semibold hover:bg-muted px-3 py-2 rounded-md transition-colors flex items-center cursor-pointer">
								{metricOptions.find((m) => m.value === activeMetric)?.label}{" "}
								Performance
								<ChevronDown className="ml-1.5" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="min-w-[160px]">
								{metricOptions.map((option) => (
									<DropdownMenuItem
										key={option.value}
										onClick={() => setActiveMetric(option.value)}
									>
										<span className="flex-1">{option.label}</span>
										{activeMetric === option.value && (
											<svg
												className="size-4 text-primary"
												fill="currentColor"
												viewBox="0 0 20 20"
												aria-hidden="true"
											>
												<title>Selected</title>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										)}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<LineChart
						data={chartData}
						aspectRatio="3 / 1"
						margin={{ top: 70, right: 10, bottom: 50, left: 10 }}
					>
						<Line
							dataKey={activeMetric}
							stroke="var(--chart-line-primary)"
							strokeWidth={2.5}
						/>
						{compareMetric && (
							<Line
								dataKey={compareMetric}
								stroke="var(--chart-line-secondary)"
								strokeWidth={2.5}
							/>
						)}
						<XAxis numTicks={8} />
						<ChartMarkers items={markers} />
						<ChartTooltip
							rows={(point) =>
								[
									{
										color: "var(--chart-line-primary)",
										label:
											metricOptions.find((m) => m.value === activeMetric)
												?.label || "Value",
										value: formatMetricValue(point[activeMetric] as number),
									},
									compareMetric
										? {
												color: "var(--chart-line-secondary)",
												label:
													metricOptions.find((m) => m.value === compareMetric)
														?.label || "Compare",
												value: formatMetricValue(
													point[compareMetric] as number,
												),
											}
										: null,
								].filter(Boolean) as {
									color: string;
									label: string;
									value: string;
								}[]
							}
						/>
						<SegmentBackground />
						<SegmentLineFrom variant="dashed" />
						<SegmentLineTo variant="dashed" />
					</LineChart>
				</div>

				{/* Two Column Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Hourly Engagement */}
					<div className="border rounded-lg p-4">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<p className="font-semibold">Hourly Engagement</p>
								<SimpleTooltip content="Best times to post based on engagement">
									<Info className="size-4 text-muted-foreground cursor-help" />
								</SimpleTooltip>
							</div>
						</div>
						<BarChart
							data={hourlyData}
							xDataKey="hour"
							orientation="horizontal"
							margin={{ left: 40 }}
							aspectRatio="4 / 3"
						>
							<Bar dataKey="engagement" lineCap={4} />
							<ChartTooltip showCrosshair={false} />
						</BarChart>
					</div>

					{/* Weekly Performance */}
					<div className="border rounded-lg p-4">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<p className="font-semibold">Weekly Performance</p>
								<SimpleTooltip content="Engagement and reach by day of week">
									<Info className="size-4 text-muted-foreground cursor-help" />
								</SimpleTooltip>
							</div>
						</div>
						<BarChart
							data={weeklyData}
							xDataKey="day"
							orientation="horizontal"
							margin={{ left: 50 }}
							aspectRatio="4 / 3"
						>
							<Bar dataKey="engagement" lineCap={4} />
							<ChartTooltip showCrosshair={false} />
						</BarChart>
					</div>
				</div>

				{/* Platform Performance Table */}
				<div className="border rounded-lg p-4">
					<h3 className="font-semibold mb-4">Platform Performance</h3>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b">
									<th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
										Platform
									</th>
									<th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
										Followers
									</th>
									<th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
										Engagement Rate
									</th>
									<th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
										Posts
									</th>
									<th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">
										Growth
									</th>
								</tr>
							</thead>
							<tbody>
								{platformData.map((platform) => (
									<tr
										key={platform.platform}
										className="border-b last:border-0"
									>
										<td className="py-3 px-2 font-medium">
											{platform.platform}
										</td>
										<td className="py-3 px-2 text-right">
											{formatMetricValue(platform.followers)}
										</td>
										<td className="py-3 px-2 text-right">
											{platform.engagement}%
										</td>
										<td className="py-3 px-2 text-right">{platform.posts}</td>
										<td className="py-3 px-2 text-right text-success">
											+{platform.growth}%
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Content Performance & Demographics */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Content Type Performance */}
					<div className="border rounded-lg p-4">
						<h3 className="font-semibold mb-4">Content Type Performance</h3>
						<div className="space-y-4">
							{contentTypeData.map((content) => (
								<div
									key={content.type}
									className="flex items-center justify-between"
								>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
											{content.type === "Video" && "🎬"}
											{content.type === "Image" && "📷"}
											{content.type === "Carousel" && "🖼️"}
											{content.type === "Text" && "📝"}
											{content.type === "Story" && "⏱️"}
										</div>
										<div>
											<p className="font-medium">{content.type}</p>
											<p className="text-sm text-muted-foreground">
												{content.count} posts
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-medium">{content.engagement}% eng.</p>
										<p className="text-sm text-muted-foreground">
											{formatMetricValue(content.reach)} reach
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Demographics */}
					<div className="border rounded-lg p-4">
						<h3 className="font-semibold mb-4">Audience Demographics</h3>
						<div className="grid grid-cols-2 gap-6">
							<div>
								<p className="text-sm text-muted-foreground mb-3">
									Age Distribution
								</p>
								<div className="flex flex-col items-center">
									<PieChartWithLegend
										data={ageData.map((item) => ({
											label: item.dimension,
											value: item.value,
										}))}
										size={140}
									/>
								</div>
							</div>
							<div>
								<p className="text-sm text-muted-foreground mb-3">
									Gender Distribution
								</p>
								<div className="flex flex-col items-center">
									<PieChartWithLegend
										data={genderData.map((item) => ({
											label: item.dimension,
											value: item.value,
										}))}
										size={140}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Recent Posts */}
				<div className="border rounded-lg p-4">
					<h3 className="font-semibold mb-4">Recent Posts</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{recentPosts.map((post) => (
							<div key={post.id} className="border rounded-lg p-4">
								<div className="flex items-start justify-between mb-2">
									<div className="flex items-center gap-2">
										<div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
											{post.platform === "tiktok" && "🎵"}
											{post.platform === "instagram" && "📷"}
											{post.platform === "twitter" && "𝕏"}
											{post.platform === "linkedin" && "in"}
											{post.platform === "youtube" && "▶️"}
											{post.platform === "facebook" && "👥"}
										</div>
										<div>
											<p className="font-medium text-sm capitalize">
												{post.platform}
											</p>
											<p className="text-xs text-muted-foreground">
												{post.date.toLocaleDateString()}
											</p>
										</div>
									</div>
								</div>
								<p className="text-sm mb-3 line-clamp-2">{post.content}</p>
								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									<span>❤️ {formatMetricValue(post.likes)}</span>
									<span>💬 {formatMetricValue(post.comments)}</span>
									<span>🔄 {formatMetricValue(post.shares)}</span>
									<span>👁️ {formatMetricValue(post.views)}</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
