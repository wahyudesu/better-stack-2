"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import type { ChartMarker } from "@/components/charts/line-chart";
import { AudienceCard } from "@/components/dashboard/audience-card";
import { DemographicsCard } from "@/components/dashboard/demographics-card";
import { FilterBar } from "@/components/dashboard/filter-bar";
import {
	AreaChartCard,
	type ChartDataPoint,
} from "@/components/dashboard/line-chart-card";
import { RecentPostsCard } from "@/components/dashboard/recent-posts-card";
import { SentimentCard } from "@/components/dashboard/sentiment-card";
import { ViewerCard } from "@/components/dashboard/viewer-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Skeleton fallbacks for dynamic cards using new Date()
function ViewerCardSkeleton() {
	return (
		<Card className="h-36 flex flex-col pb-0">
			<CardHeader className="flex items-center justify-between gap-2 py-2 h-fit">
				<CardTitle className="w-full h-full leading-none font-medium animate-pulse bg-muted rounded-md">
					&nbsp;
				</CardTitle>
			</CardHeader>
			<CardContent className="pb-0 flex-1 flex items-center px-4 sm:px-6 animate-pulse bg-muted rounded-md" />
		</Card>
	);
}

function SentimentCardSkeleton() {
	return (
		<Card className="h-36 flex flex-col pb-0">
			<CardHeader className="flex items-center justify-between gap-2 py-2 h-fit">
				<CardTitle className="w-full h-full leading-none font-medium animate-pulse bg-muted rounded-md">
					&nbsp;
				</CardTitle>
			</CardHeader>
			<CardContent className="pb-0 flex-1 flex items-center px-4 sm:px-6 animate-pulse bg-muted rounded-md" />
		</Card>
	);
}

import {
	COUNTRY_DATA,
	DAYS_MAP,
	PLATFORM_MULTIPLIERS,
	PLATFORMS,
	POST_CONTENTS,
	REGION_DATA,
	TYPE_MULTIPLIERS,
} from "@/lib/constants/dashboard";
import type { DemographicDataItem } from "@/lib/data/demographics";
import { useMetricPreference } from "@/lib/hooks/use-metric-pref";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { calculateTrend, formatMetricValue } from "@/lib/metrics";
import type {
	DemoView,
	GeoView,
	ReportType,
	SocialMediaPlatform,
	TimeRange,
} from "@/lib/types/dashboard";

// ============================================================
// DYNAMIC STATS CONSTANTS (Hybrid approach)
// ============================================================

/** Realistic value pools per metric to keep numbers grounded */
const STATS_POOL = {
	impressions: { base: 40000, variance: 0.4 },
	engagements: { base: 15000, variance: 0.5 },
	likes: { base: 8000, variance: 0.45 },
	replies: { base: 800, variance: 0.5 },
	shares: { base: 400, variance: 0.5 },
	saves: { base: 200, variance: 0.55 },
} as const;

/** Day-of-week multipliers — weekends higher engagement */
const DAY_OF_WEEK_MULT: Record<number, number> = {
	0: 1.35, // Sunday
	1: 0.85, // Monday
	2: 0.88, // Tuesday
	3: 0.92, // Wednesday
	4: 0.95, // Thursday
	5: 1.0, // Friday
	6: 1.28, // Saturday
};

/** Spike chance per day (15%) and multiplier range */
const SPIKE_CHANCE = 0.15;
const SPIKE_RANGE = { min: 2.0, max: 4.0 };

/** Gaussian noise using Box-Muller transform */
function gaussianNoise(
	mean: number,
	stdDev: number,
	rand: () => number,
): number {
	const u1 = rand();
	const u2 = rand();
	const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
	return mean + z * stdDev;
}

// Seeded random for consistent SSR/CSR values
function seededRandom(seed: number): number {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function generateData(
	socialMedia: SocialMediaPlatform,
	type: ReportType,
	timeRange: TimeRange,
	dayOfMonthOverride?: number,
): {
	stats: Array<{
		label: string;
		value: string;
		change: string;
		metricKey: string;
	}>;
	chartData: ChartDataPoint[];
	markers: ChartMarker[];
	countryData: DemographicDataItem[];
	regionData: DemographicDataItem[];
} {
	// Create seed — includes day-of-month for daily variation
	const dayOfMonth = dayOfMonthOverride ?? 1;
	const seedString = `${socialMedia}-${type}-${timeRange}-${dayOfMonth}`;
	let seed = 0;
	for (let i = 0; i < seedString.length; i++) {
		seed = (seed + seedString.charCodeAt(i)) | 0;
	}
	// Store original seed for previous period calculation
	const baseSeed = seed;
	const random = () => seededRandom(seed++);

	const days = DAYS_MAP[timeRange] ?? 7;
	const platformMult =
		PLATFORM_MULTIPLIERS[socialMedia] ?? PLATFORM_MULTIPLIERS.all;
	const typeMult = TYPE_MULTIPLIERS[type] ?? TYPE_MULTIPLIERS.overview;

	// Track spike days for stats calculation
	const spikeDays = new Set<number>();

	// Generate chart data with all metrics
	const chartData: ChartDataPoint[] = Array.from({ length: days }, (_, i) => {
		// Use stable reference date + day-of-week patterns
		const date = new Date(2024, 0, 1);
		date.setDate(date.getDate() + i);

		// Day-of-week multiplier
		const dayOfWeek = date.getDay();
		const dayMult = DAY_OF_WEEK_MULT[dayOfWeek] ?? 1.0;

		// Spike check (15% chance)
		let spikeMult = 1.0;
		if (random() < SPIKE_CHANCE) {
			spikeDays.add(i);
			const spikeMin = SPIKE_RANGE.min;
			const spikeMax = SPIKE_RANGE.max;
			spikeMult = spikeMin + random() * (spikeMax - spikeMin);
		}

		// Combined multiplier
		const combinedMult = dayMult * spikeMult;

		// Trend bias: slight upward slope across period
		const trendMult = 1 + (i / days) * 0.08;

		// Pool-based base value + Gaussian noise
		const baseEngagements = gaussianNoise(
			STATS_POOL.engagements.base,
			STATS_POOL.engagements.base * STATS_POOL.engagements.variance * 0.3,
			random,
		);

		const engagements = Math.max(
			100,
			Math.floor(
				baseEngagements *
					platformMult.engagements *
					typeMult.engagements *
					combinedMult *
					trendMult,
			),
		);

		const baseFollowers = gaussianNoise(
			45000 + days * 120, // grows with time range
			8000,
			random,
		);
		const followers = Math.max(
			1000,
			Math.floor(baseFollowers * platformMult.followers * typeMult.followers),
		);

		const views = Math.max(
			engagements *
				platformMult.impressions *
				typeMult.impressions *
				(2 + random() * 2),
		);
		const comments = Math.max(
			10,
			Math.floor(
				engagements *
					platformMult.replies *
					typeMult.replies *
					(0.1 + random() * 0.1),
			),
		);
		const impression = Math.max(
			engagements *
				platformMult.impressions *
				typeMult.impressions *
				(3 + random() * 2),
		);
		const share = Math.max(
			5,
			Math.floor(
				engagements *
					platformMult.shares *
					typeMult.shares *
					(0.05 + random() * 0.1),
			),
		);

		return { date, engagements, followers, views, comments, impression, share };
	});

	// Calculate stats from chart data
	const totalEngagements = chartData.reduce((sum, d) => sum + d.engagements, 0);
	const totalFollowers = chartData[chartData.length - 1]?.followers || 0;
	const avgEngagements = totalEngagements / days;

	// Previous period (first half vs second half)
	const midpoint = Math.floor(days / 2);
	const firstHalfEngagements = chartData
		.slice(0, midpoint)
		.reduce((sum, d) => sum + d.engagements, 0);
	const secondHalfEngagements = chartData
		.slice(midpoint)
		.reduce((sum, d) => sum + d.engagements, 0);
	const previousEngagements = firstHalfEngagements;

	// Derived metrics from pool values + platform/type multipliers
	const totalLikes = Math.max(
		100,
		Math.floor(
			gaussianNoise(
				STATS_POOL.likes.base,
				STATS_POOL.likes.base * STATS_POOL.likes.variance,
				random,
			) *
				platformMult.likes *
				typeMult.likes,
		),
	);
	const totalComments = Math.max(
		50,
		Math.floor(
			gaussianNoise(
				STATS_POOL.replies.base,
				STATS_POOL.replies.base * STATS_POOL.replies.variance,
				random,
			) *
				platformMult.replies *
				typeMult.replies,
		),
	);
	const totalShares = Math.max(
		20,
		Math.floor(
			gaussianNoise(
				STATS_POOL.shares.base,
				STATS_POOL.shares.base * STATS_POOL.shares.variance,
				random,
			) *
				platformMult.shares *
				typeMult.shares,
		),
	);
	const totalSaves = Math.max(
		10,
		Math.floor(
			gaussianNoise(
				STATS_POOL.saves.base,
				STATS_POOL.saves.base * STATS_POOL.saves.variance,
				random,
			) *
				platformMult.shares *
				typeMult.shares *
				0.5,
		),
	);
	const totalImpressions = Math.max(
		5000,
		Math.floor(
			gaussianNoise(
				STATS_POOL.impressions.base,
				STATS_POOL.impressions.base * STATS_POOL.impressions.variance,
				random,
			) *
				platformMult.impressions *
				typeMult.impressions,
		),
	);

	// Calculate percent change
	const calcPercentChange = (current: number, previous: number) => {
		if (previous === 0) return current > 0 ? 100 : 0;
		return ((current - previous) / previous) * 100;
	};

	const formatChange = (pct: number) => {
		const sign = pct >= 0 ? "+" : "";
		return `${sign}${pct.toFixed(1)}%`;
	};

	const stats = [
		{
			label: "Impressions",
			value: formatMetricValue(totalImpressions),
			change: formatChange(
				calcPercentChange(
					totalImpressions,
					totalImpressions * (0.82 + random() * 0.15),
				),
			),
			metricKey: "impression",
		},
		{
			label: "Engagements",
			value: formatMetricValue(Math.floor(totalEngagements)),
			change: formatChange(
				calcPercentChange(totalEngagements, previousEngagements),
			),
			metricKey: "engagement",
		},
		{
			label: "Likes",
			value: formatMetricValue(totalLikes),
			change: formatChange(
				calcPercentChange(totalLikes, totalLikes * (0.8 + random() * 0.2)),
			),
			metricKey: "followers",
		},
		{
			label: "Replies",
			value: formatMetricValue(Math.floor(totalComments)),
			change: formatChange(
				calcPercentChange(
					totalComments,
					totalComments * (0.65 + random() * 0.25),
				),
			),
			metricKey: "comments",
		},
		{
			label: "Shares",
			value: formatMetricValue(Math.floor(totalShares)),
			change: formatChange(
				calcPercentChange(totalShares, totalShares * (0.82 + random() * 0.18)),
			),
			metricKey: "share",
		},
		{
			label: "Saves",
			value: formatMetricValue(totalSaves),
			change: formatChange(
				calcPercentChange(totalSaves, totalSaves * (0.75 + random() * 0.2)),
			),
			metricKey: "saves",
		},
	];

	// Generate markers based on time range with social media posts
	const markerCount = Math.max(2, Math.floor(days / 5));

	const markers: ChartMarker[] = Array.from({ length: markerCount }, (_, i) => {
		const dayOffset = Math.floor((days / (markerCount + 1)) * (i + 1));
		const platform = PLATFORMS[i % PLATFORMS.length];
		const content = POST_CONTENTS[i % POST_CONTENTS.length];
		const isMultiple = random() > 0.6;

		if (isMultiple && i > 0) {
			const prevDayOffset = Math.floor((days / (markerCount + 1)) * i);
			return {
				date: new Date(
					new Date(2024, 0, 1).getTime() - prevDayOffset * 24 * 60 * 60 * 1000,
				),
				network: platform.network,
				title: `${platform.name} Post`,
				description: content.description,
				color: platform.color,
				href: `#${platform.name.toLowerCase()}-${i}`,
				target: "_self" as const,
			};
		}

		return {
			date: new Date(
				new Date(2024, 0, 1).getTime() - dayOffset * 24 * 60 * 60 * 1000,
			),
			network: platform.network,
			title: `${platform.name} Post`,
			description: content.description,
			color: platform.color,
			href: `#${platform.name.toLowerCase()}-${i}`,
			target: "_self" as const,
		};
	});

	return {
		stats,
		chartData,
		markers,
		countryData: [...COUNTRY_DATA],
		regionData: [...REGION_DATA],
	};
}

export default function DashboardPage() {
	const [selectedSocial, setSelectedSocial] =
		useState<SocialMediaPlatform>("all");
	const [selectedType, setSelectedType] = useState<ReportType>("overview");
	const [selectedTime, setSelectedTime] = useState<TimeRange>("7d");
	const [geoView, setGeoView] = useState<GeoView>("country");
	const [demoView, setDemoView] = useState<DemoView>("follower");
	const { metric: selectedMetric, setMetric: setSelectedMetric } =
		useMetricPreference();
	// Client-side day-of-month for dynamic seed variation
	const [dayOfMonth, setDayOfMonth] = useState(1);

	// Set actual day-of-month on client mount only
	useEffect(() => {
		setDayOfMonth(new Date().getDate());
	}, []);

	// Generate default data (not affected by filters)
	const defaultData = useMemo(
		() => generateData("all", "overview", "7d", dayOfMonth),
		[dayOfMonth],
	);

	// Generate filtered data for line chart
	const filteredData = useMemo(
		() => generateData(selectedSocial, selectedType, selectedTime, dayOfMonth),
		[selectedSocial, selectedType, selectedTime, dayOfMonth],
	);

	return (
		<div className={`${pageContainerClassName}`} style={pageMaxWidth}>
			{/* Filters */}
			<FilterBar
				selectedSocial={selectedSocial}
				onSocialChange={(v) => setSelectedSocial(v as SocialMediaPlatform)}
				selectedType={selectedType}
				onTypeChange={(v) => setSelectedType(v as ReportType)}
				selectedTime={selectedTime}
				onTimeChange={(v) => setSelectedTime(v as TimeRange)}
			/>

			{/* Line Chart with Stats - Affected by filters */}
			<AreaChartCard
				chartData={filteredData.chartData}
				markers={filteredData.markers}
				formatMetricValue={formatMetricValue}
				keyProp={`chart-${selectedSocial}-${selectedType}-${selectedTime}`}
				stats={filteredData.stats}
				primaryMetric={selectedMetric}
				onMetricChange={setSelectedMetric}
			/>

			{/* Sentiment & Viewer Cards - Not affected by filters */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
				<Suspense fallback={<ViewerCardSkeleton />}>
					<ViewerCard />
				</Suspense>
				<Suspense fallback={<SentimentCardSkeleton />}>
					<SentimentCard />
				</Suspense>
			</div>

			{/* 2 Kotak Bawah - Lebih Panjang */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
				<DemographicsCard
					geoView={geoView}
					onGeoViewChange={setGeoView}
					data={
						geoView === "country"
							? defaultData.countryData
							: defaultData.regionData
					}
				/>
				<AudienceCard demoView={demoView} onDemoViewChange={setDemoView} />
			</div>

			{/* Recent Posts */}
			<RecentPostsCard />
		</div>
	);
}
