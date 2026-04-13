"use client";

import { ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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

// Seeded random for consistent SSR/CSR values
function seededRandom(seed: number): number {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

function generateData(
	socialMedia: SocialMediaPlatform,
	type: ReportType,
	timeRange: TimeRange,
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
	// Create seed from parameters for deterministic results
	const seedString = `${socialMedia}-${type}-${timeRange}`;
	let seed = 0;
	for (let i = 0; i < seedString.length; i++) {
		seed = (seed + seedString.charCodeAt(i)) | 0;
	}
	const random = () => seededRandom(seed++);

	const days = DAYS_MAP[timeRange] ?? 7;
	const platformMult =
		PLATFORM_MULTIPLIERS[socialMedia] ?? PLATFORM_MULTIPLIERS.all;
	const typeMult = TYPE_MULTIPLIERS[type] ?? TYPE_MULTIPLIERS.overview;

	// Generate chart data with all metrics
	const chartData: ChartDataPoint[] = Array.from({ length: days }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (days - 1 - i));
		const baseMultiplier = platformMult.engagements * typeMult.engagements;
		const followerMultiplier = platformMult.followers * typeMult.followers;

		const engagements = Math.floor(
			(8000 + Math.sin(i / 4) * 3000 + ((i * 150) % 5000)) *
				baseMultiplier *
				(1 + (days - 7) * 0.02),
		);

		return {
			date,
			engagements,
			followers: Math.floor(
				(50000 + i * 100 + Math.cos(i / 3) * 2000 + ((i * 80) % 3000)) *
					followerMultiplier *
					(1 + (days - 7) * 0.01),
			),
			views: Math.floor(
				engagements * platformMult.impressions * typeMult.impressions * 3.5,
			),
			comments: Math.floor(
				engagements * platformMult.replies * typeMult.replies * 0.15,
			),
			impression: Math.floor(
				engagements * platformMult.impressions * typeMult.impressions * 4.2,
			),
			share: Math.floor(
				engagements * platformMult.shares * typeMult.shares * 0.1,
			),
		};
	});

	// Calculate stats from chart data
	const totalEngagements = chartData.reduce((sum, d) => sum + d.engagements, 0);
	const totalFollowers = chartData[chartData.length - 1]?.followers || 0;
	const avgEngagements = totalEngagements / days;

	// Calculate previous period for trend
	const previousEngagements = totalEngagements * (0.85 + random() * 0.1);

	const stats = [
		{
			label: "Impressions",
			value: formatMetricValue(
				Math.floor(
					totalEngagements *
						platformMult.impressions *
						typeMult.impressions *
						3.5,
				),
			),
			change: `+${(10 + random() * 15).toFixed(1)}%`,
			metricKey: "impression",
		},
		{
			label: "Engagements",
			value: formatMetricValue(Math.floor(totalEngagements)),
			change: `+${calculateTrend(totalEngagements, previousEngagements).toFixed(1)}%`,
			metricKey: "engagement",
		},
		{
			label: "Likes",
			value: formatMetricValue(
				Math.floor(totalFollowers * platformMult.likes * typeMult.likes * 0.8),
			),
			change: `+${(8 + random() * 20).toFixed(1)}%`,
			metricKey: "followers",
		},
		{
			label: "Profile Visits",
			value: formatMetricValue(
				Math.floor(
					totalFollowers * platformMult.visits * typeMult.visits * 0.02,
				),
			),
			change: `+${(5 + random() * 12).toFixed(1)}%`,
			metricKey: "views",
		},
		{
			label: "Replies",
			value: formatMetricValue(
				Math.floor(
					avgEngagements * platformMult.replies * typeMult.replies * 0.15,
				),
			),
			change: `+${(12 + random() * 25).toFixed(1)}%`,
			metricKey: "comments",
		},
		{
			label: "Shares",
			value: formatMetricValue(
				Math.floor(
					avgEngagements * platformMult.shares * typeMult.shares * 0.1,
				),
			),
			change: `+${(3 + random() * 10).toFixed(1)}%`,
			metricKey: "share",
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
				date: new Date(Date.now() - prevDayOffset * 24 * 60 * 60 * 1000),
				network: platform.network,
				title: `${platform.name} Post`,
				description: content.description,
				color: platform.color,
				href: `#${platform.name.toLowerCase()}-${i}`,
				target: "_self" as const,
			};
		}

		return {
			date: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000),
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

	// Generate default data (not affected by filters)
	const defaultData = useMemo(() => generateData("all", "overview", "7d"), []);

	// Generate filtered data only for line chart
	const { chartData: filteredChartData, markers: filteredMarkers } =
		useMemo(() => {
			const result = generateData(selectedSocial, selectedType, selectedTime);
			return { chartData: result.chartData, markers: result.markers };
		}, [selectedSocial, selectedType, selectedTime]);

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
				chartData={filteredChartData}
				markers={filteredMarkers}
				formatMetricValue={formatMetricValue}
				keyProp={`chart-${selectedSocial}-${selectedType}-${selectedTime}`}
				stats={defaultData.stats}
				primaryMetric={selectedMetric}
				onMetricChange={setSelectedMetric}
			/>

			{/* Sentiment & Viewer Cards - Not affected by filters */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
				<ViewerCard />
				<SentimentCard />
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
