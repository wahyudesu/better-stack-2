"use client";

import { Fragment, useState, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, Info, ChevronDown, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, selectHandler } from "@/lib/utils";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import {
  LineChart, Line, XAxis, YAxis, Grid, ChartTooltip,
  SegmentBackground, SegmentLineFrom, SegmentLineTo,
  ChartMarkers, type ChartMarker, MarkerTooltipContent, useActiveMarkers
} from "@/components/charts/line-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { Legend, LegendItemComponent, LegendMarker, LegendLabel } from "@/components/charts/pie-legend";

// Colors for pie chart
const pieColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

// Pie Chart with Legend wrapper
function PieChartWithLegend({
  data,
  size
}: {
  data: { label: string; value: number }[];
  size: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Add colors to legend items
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


function generateData(socialMedia: string, type: string, timeRange: string) {
  // Determine number of days based on time range
  const daysMap: Record<string, number> = {
    "7d": 7,
    "14d": 14,
    "30d": 30,
    "90d": 90,
    "custom": 30,
  };
  const days = daysMap[timeRange] || 7;

  // Platform multipliers
  const platformMultipliers: Record<string, { engagements: number; followers: number; impressions: number; likes: number; visits: number; replies: number }> = {
    all: { engagements: 1, followers: 1, impressions: 1, likes: 1, visits: 1, replies: 1 },
    facebook: { engagements: 0.8, followers: 1.2, impressions: 1.5, likes: 0.9, visits: 1.1, replies: 0.7 },
    instagram: { engagements: 1.5, followers: 1.3, impressions: 1.2, likes: 1.8, visits: 0.9, replies: 0.6 },
    twitter: { engagements: 1.2, followers: 0.9, impressions: 1.3, likes: 0.7, visits: 1.3, replies: 1.8 },
    tiktok: { engagements: 2.0, followers: 1.8, impressions: 2.5, likes: 2.2, visits: 0.7, replies: 0.4 },
    youtube: { engagements: 0.6, followers: 1.5, impressions: 1.8, likes: 0.8, visits: 1.2, replies: 0.5 },
    linkedin: { engagements: 0.5, followers: 0.8, impressions: 0.9, likes: 0.4, visits: 1.8, replies: 1.2 },
    pinterest: { engagements: 0.4, followers: 0.7, impressions: 1.1, likes: 0.6, visits: 2.0, replies: 0.3 },
  };

  // Type multipliers
  const typeMultipliers: Record<string, { engagements: number; followers: number; impressions: number; likes: number; visits: number; replies: number }> = {
    overview: { engagements: 1, followers: 1, impressions: 1, likes: 1, visits: 1, replies: 1 },
    engagement: { engagements: 1.5, followers: 0.8, impressions: 0.7, likes: 1.3, visits: 0.9, replies: 1.8 },
    reach: { engagements: 0.6, followers: 1.5, impressions: 1.8, likes: 0.7, visits: 1.3, replies: 0.5 },
    impressions: { engagements: 0.5, followers: 0.7, impressions: 2.0, likes: 0.5, visits: 0.8, replies: 0.3 },
  };

  const platformMult = platformMultipliers[socialMedia] || platformMultipliers.all;
  const typeMult = typeMultipliers[type] || typeMultipliers.overview;

  // Generate chart data
  const chartData = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - ((days - 1) - i));
    const baseMultiplier = platformMult.engagements * typeMult.engagements;
    const followerMultiplier = platformMult.followers * typeMult.followers;

    return {
      date,
      engagements: Math.floor((8000 + Math.sin(i / 4) * 3000 + ((i * 150) % 5000)) * baseMultiplier * (1 + (days - 7) * 0.02)),
      followers: Math.floor((50000 + i * 100 + Math.cos(i / 3) * 2000 + ((i * 80) % 3000)) * followerMultiplier * (1 + (days - 7) * 0.01)),
    };
  });

  // Calculate stats from chart data
  const totalEngagements = chartData.reduce((sum, d) => sum + d.engagements, 0);
  const totalFollowers = chartData[chartData.length - 1]?.followers || 0;
  const avgEngagements = totalEngagements / days;

  // Calculate previous period for trend
  const previousEngagements = totalEngagements * (0.85 + Math.random() * 0.1);

  const stats = [
    {
      label: "Impressions",
      value: formatMetricValue(Math.floor(totalEngagements * platformMult.impressions * typeMult.impressions * 3.5)),
      change: `+${(10 + Math.random() * 15).toFixed(1)}%`,
    },
    {
      label: "Engagements",
      value: formatMetricValue(Math.floor(totalEngagements)),
      change: `+${calculateTrend(totalEngagements, previousEngagements).toFixed(1)}%`,
    },
    {
      label: "Likes",
      value: formatMetricValue(Math.floor(avgEngagements * platformMult.likes * typeMult.likes * 0.8)),
      change: `+${(8 + Math.random() * 20).toFixed(1)}%`,
    },
    {
      label: "Profile Visits",
      value: formatMetricValue(Math.floor(totalFollowers * platformMult.visits * typeMult.visits * 0.02)),
      change: `+${(5 + Math.random() * 12).toFixed(1)}%`,
    },
    {
      label: "Replies",
      value: formatMetricValue(Math.floor(avgEngagements * platformMult.replies * typeMult.replies * 0.15)),
      change: `+${(12 + Math.random() * 25).toFixed(1)}%`,
    },
  ];

  // Generate markers based on time range with social media posts
  const markerCount = Math.max(2, Math.floor(days / 5));

  // Social media platforms with icons and colors
  const platforms = [
    { name: "Instagram", icon: "📷", color: "#E1306C" },
    { name: "Threads", icon: "🧵", color: "#000000" },
    { name: "Twitter/X", icon: "𝕏", color: "#000000" },
    { name: "TikTok", icon: "♪", color: "#000000" },
    { name: "LinkedIn", icon: "💼", color: "#0077B5" },
  ];

  // Sample post content
  const postContents = [
    { title: "New Product Launch", description: "Check out our latest product!" },
    { title: "Behind the Scenes", description: "A sneak peek into our office" },
    { title: "Customer Spotlight", description: "Featuring our amazing customers" },
    { title: "Industry Tips", description: "5 tips for better engagement" },
    { title: "Team Friday", description: "Meet the amazing team" },
    { title: "Product Tutorial", description: "How to get started with our product" },
    { title: "Success Story", description: "How we helped a customer succeed" },
    { title: "Event Announcement", description: "Join us at our upcoming event" },
  ];

  const markers: ChartMarker[] = Array.from({ length: markerCount }, (_, i) => {
    const dayOffset = Math.floor((days / (markerCount + 1)) * (i + 1));
    const platform = platforms[i % platforms.length];
    const content = postContents[i % postContents.length];
    const isMultiple = Math.random() > 0.6; // 40% chance of multiple posts on same day

    // For some markers, add multiple posts on the same day
    if (isMultiple && i > 0) {
      const prevDayOffset = Math.floor((days / (markerCount + 1)) * i);
      return {
        date: new Date(Date.now() - prevDayOffset * 24 * 60 * 60 * 1000),
        icon: platform.icon,
        title: `${platform.name} Post`,
        description: content.description,
        color: platform.color,
        href: `#${platform.name.toLowerCase()}-${i}`,
        target: "_self" as const,
      };
    }

    return {
      date: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000),
      icon: platform.icon,
      title: `${platform.name} Post`,
      description: content.description,
      color: platform.color,
      href: `#${platform.name.toLowerCase()}-${i}`,
      target: "_self" as const,
    };
  });

  return { stats, chartData, markers };
}

// Format numbers with K/M suffix
function formatMetricValue(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value.toLocaleString();
}

// Calculate trend percentage
function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// Marker content component for displaying active markers in tooltip
interface MarkerContentDemoProps {
  markers: ChartMarker[];
}

function MarkerContentDemo({ markers }: MarkerContentDemoProps) {
  const activeMarkers = useActiveMarkers(markers);
  if (activeMarkers.length === 0) {
    return null;
  }
  return <MarkerTooltipContent markers={activeMarkers} />;
}

const socialMediaOptions = [
  { value: "all", label: "All Social Media" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter/X" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pinterest", label: "Pinterest" },
];

const metricOptions = [
  { value: "engagement", label: "Engagement" },
  { value: "views", label: "Views" },
  { value: "comments", label: "Comments" },
  { value: "impression", label: "Impression" },
  { value: "share", label: "Share" },
];

const typeOptions = [
  { value: "overview", label: "Overview" },
  { value: "engagement", label: "Engagement" },
  { value: "reach", label: "Reach" },
  { value: "impressions", label: "Impressions" },
];

const timeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "14d", label: "Last 14 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "custom", label: "Custom range" },
];

  // Bar chart data for Kotak 3
  const browserData = [
    { browser: "Chrome", users: 1250 },
    { browser: "Safari", users: 980 },
    { browser: "Firefox", users: 650 },
    { browser: "Edge", users: 420 },
    { browser: "Opera", users: 280 },
  ];

  // Country data
  const countryData = [
    { country: "Indonesia", users: 3500 },
    { country: "United States", users: 2800 },
    { country: "Japan", users: 1900 },
    { country: "Singapore", users: 1200 },
    { country: "Malaysia", users: 850 },
  ];

  // Region data
  const regionData = [
    { region: "Jakarta", users: 2100 },
    { region: "Surabaya", users: 1400 },
    { region: "Bandung", users: 980 },
    { region: "Bali", users: 720 },
    { region: "Medan", users: 580 },
  ];

  // Pie chart data for Kotak 4 - Device
  const pieData = [
    { label: "Desktop", value: 45 },
    { label: "Mobile", value: 35 },
    { label: "Tablet", value: 15 },
    { label: "Other", value: 5 },
  ];

    // Follower data
    const followerData = [
      { label: "Verified", value: 35 },
      { label: "Regular", value: 45 },
      { label: "New", value: 20 },
    ];

    // Viewer data
      const viewerData = [
        { label: "Organic", value: 52 },
        { label: "Suggested", value: 28 },
        { label: "Hashtag", value: 15 },
        { label: "External", value: 5 },
      ];

export default function DashboardPage() {
      const [selectedSocial, setSelectedSocial] = useState("all");
      const [selectedType, setSelectedType] = useState("overview");
      const [selectedTime, setSelectedTime] = useState("7d");
      const [geoView, setGeoView] = useState<"country" | "region">("country");
      const [demoView, setDemoView] = useState<"follower" | "viewer">("follower");
      const [primaryMetric, setPrimaryMetric] = useState("engagement");
      const [secondaryMetric, setSecondaryMetric] = useState<string | null>(null);

      // Get current demographic data
      const currentDemoData = demoView === "follower" ? followerData : viewerData;

  // Generate data based on filters
  const { stats, chartData, markers } = useMemo(
    () => generateData(selectedSocial, selectedType, selectedTime),
    [selectedSocial, selectedType, selectedTime]
  );

  return (
    <div className={pageContainerClassName} style={pageMaxWidth}>
      <div>
        {/*<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview performa akun sosial media kamu.</p>*/}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Select value={selectedSocial} onValueChange={selectHandler(setSelectedSocial, "all")}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select social media" />
          </SelectTrigger>
          <SelectContent>
            {socialMediaOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Select value={selectedType} onValueChange={selectHandler(setSelectedType, "overview")}>
            <SelectTrigger className="w-full sm:w-[140px] flex-shrink-0">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTime} onValueChange={selectHandler(setSelectedTime, "7d")}>
            <SelectTrigger className="w-full sm:w-[140px] flex-shrink-0">
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
      </div>

        {/* Stats - Animated with key to trigger re-render */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-0 sm:border sm:rounded-lg sm:overflow-hidden" key={`${selectedSocial}-${selectedType}-${selectedTime}`}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "flex-shrink-0 w-[140px] sm:w-auto rounded-lg border border-border p-3 sm:p-4",
                "sm:rounded-none sm:border-0",
                // Only show right border on lg screens for all but last item
                "lg:border-r lg:border-border/50",
                index >= stats.length - 2 && "lg:border-r-0"
              )}
            >
              <p className="text-xs text-muted-foreground mb-1 truncate">{stat.label}</p>
              <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
              <div className="flex items-center gap-0.5 text-xs text-success mt-1">
                <TrendingUp className="size-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Line Chart */}
            <div
              className="border rounded-lg p-3 sm:p-4 overflow-visible pb-4 sm:pb-6 group"
              key={`chart-${selectedSocial}-${selectedType}-${selectedTime}`}
              onMouseEnter={() => {}}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {/* Primary Metric Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-base sm:text-lg font-semibold whitespace-nowrap">
                        {metricOptions.find(m => m.value === primaryMetric)?.label} Performance
                        <ChevronDown className="ml-1.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[160px]">
                      {metricOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => {
                            setPrimaryMetric(option.value);
                            if (secondaryMetric === option.value) {
                              setSecondaryMetric(null);
                            }
                          }}
                        >
                          <span className="flex-1">{option.label}</span>
                          {primaryMetric === option.value && (
                            <svg className="size-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                    {/* Secondary Metric Selector - appears on hover */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "text-base sm:text-lg font-semibold whitespace-nowrap transition-opacity duration-200",
                            "opacity-0 group-hover:opacity-100",
                            secondaryMetric && "opacity-100"
                          )}
                        >
{secondaryMetric 
                              ? `vs ${metricOptions.find(m => m.value === secondaryMetric)?.label}`
                              : "Secondary Metrics"
                            }
                          <ChevronDown className="ml-1.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[160px]">
                        {metricOptions.filter(m => m.value !== primaryMetric).map((option) => (
                          <DropdownMenuItem
                            key={option.value}
                            onClick={() => setSecondaryMetric(secondaryMetric === option.value ? null : option.value)}
                          >
                            <span className="flex-1">{option.label}</span>
                            {secondaryMetric === option.value && (
                              <svg className="size-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>
<LineChart
              data={chartData}
              aspectRatio="3 / 1"
              margin={{ top: 70, right: 50, bottom: 50, left: 10 }}
            >
              <Grid horizontal />
              <Line
              dataKey="engagements"
              stroke="var(--chart-line-primary)"
              strokeWidth={2.5}
            />
            {secondaryMetric && (
              <Line
                dataKey="followers"
                stroke="var(--chart-line-secondary)"
                strokeWidth={2.5}
              />
            )}
            <XAxis numTicks={6} />
            <YAxis numTicks={5} position="right" formatValue={formatMetricValue} />
            <ChartMarkers items={markers} />
            <ChartTooltip
              rows={(point) => [
                {
                  color: "var(--chart-line-primary)",
                  label: metricOptions.find(m => m.value === primaryMetric)?.label || "Engagements",
                  value: formatMetricValue(point.engagements as number),
                },
                secondaryMetric ? {
                  color: "var(--chart-line-secondary)",
                  label: metricOptions.find(m => m.value === secondaryMetric)?.label || "Followers",
                  value: formatMetricValue(point.followers as number),
                } : null,
              ].filter(Boolean) as { color: string; label: string; value: string }[]}
            >
              <MarkerContentDemo markers={markers} />
            </ChartTooltip>
            {/* Segment Selection - click and drag to select date range */}
            <SegmentBackground />
            <SegmentLineFrom variant="dashed" />
            <SegmentLineTo variant="dashed" />
          </LineChart>

          {/* Screen reader summary for accessibility */}
          <p className="sr-only">
            Chart showing social media performance over {chartData.length} days.{" "}
            Engagements range from {formatMetricValue(Math.min(...chartData.map((d) => d.engagements)))} to{" "}
            {formatMetricValue(Math.max(...chartData.map((d) => d.engagements)))}.{" "}
            {secondaryMetric && `Followers range from ${formatMetricValue(Math.min(...chartData.map((d) => d.followers)))} to ${formatMetricValue(Math.max(...chartData.map((d) => d.followers)))}.`}
            </p>
        </div>

            {/* 2 Kotak Bawah - Lebih Panjang */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 sm:p-4 min-h-80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
<p className="text-base font-semibold">Demographics</p>
                      <SimpleTooltip content="Menampilkan distribusi pengguna berdasarkan negara atau daerah">
                      <Info className="size-4 text-muted-foreground cursor-help" />
                    </SimpleTooltip>
                  </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Button
                        onClick={() => setGeoView("country")}
                        variant="link"
                        size="sm"
                        className={cn(
                          "underline-offset-4 text-sm",
                          geoView === "country" && "underline"
                        )}
                      >
                        Negara
                      </Button>
                      <Button
                        onClick={() => setGeoView("region")}
                        variant="link"
                        size="sm"
                        className={cn(
                          "underline-offset-4 text-sm",
                          geoView === "region" && "underline"
                        )}
                      >
                        Daerah
                      </Button>
                    </div>
              </div>
<BarChart
                  data={geoView === "country" ? countryData : regionData}
                  xDataKey={geoView === "country" ? "country" : "region"}
                  orientation="horizontal"
                  margin={{ left: 85 }}
                  aspectRatio="4 / 3"
                >
                  <Bar dataKey="users" lineCap={4} />
                <BarYAxis />
                <ChartTooltip showCrosshair={false} />
              </BarChart>
            </div>
                <div className="border rounded-lg p-3 sm:p-4 min-h-80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">Audience</p>
                      <SimpleTooltip content="Menampilkan distribusi audience berdasarkan tipe follower atau sumber viewer">
                        <Info className="size-4 text-muted-foreground cursor-help" />
                      </SimpleTooltip>
                    </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                          onClick={() => setDemoView("follower")}
                          variant="link"
                          size="sm"
                          className={cn(
                            "underline-offset-4 text-sm",
                            demoView === "follower" && "underline"
                          )}
                        >
                          Follower
                        </Button>
                        <Button
                          onClick={() => setDemoView("viewer")}
                          variant="link"
                          size="sm"
                          className={cn(
                            "underline-offset-4 text-sm",
                            demoView === "viewer" && "underline"
                          )}
                        >
                          Viewer
                        </Button>
                      </div>
                </div>
                    <div className="flex flex-col items-center justify-center">
                      <PieChartWithLegend data={currentDemoData} size={160} />
                      <p className="text-xs sm:text-sm font-medium mt-3 sm:mt-4 mb-3">
                        {demoView === "follower" ? "Follower Distribution" : "Viewer Distribution"}
                      </p>
                    </div>
              </div>
        </div>

            {/* Kotak 5 - Recent Posts */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base font-semibold">Recent Posts</h3>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors group"
              >
                More Analytics
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="border rounded-lg p-3 sm:p-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {/* Post 1 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">📱</span>
              </div>
              <div className="p-2 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="size-4 sm:size-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] sm:text-xs">𝕏</div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Twitter/X</span>
                </div>
                <p className="text-[11px] sm:text-sm line-clamp-2">Excited to announce our new product launch! 🚀 #startup #tech</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                  <span>❤️ 1.2K</span>
                  <span>💬 89</span>
                  <span>🔄 234</span>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">📸</span>
              </div>
              <div className="p-2 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="size-4 sm:size-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-[10px] sm:text-xs">📷</div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Instagram</span>
                </div>
                <p className="text-[11px] sm:text-sm line-clamp-2">Behind the scenes at our office! Team work makes the dream work 💪</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                  <span>❤️ 3.5K</span>
                  <span>💬 156</span>
                  <span>💬 42</span>
                </div>
              </div>
            </div>

            {/* Post 3 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">🎵</span>
              </div>
              <div className="p-2 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="size-4 sm:size-5 rounded-full bg-black flex items-center justify-center text-white text-[10px] sm:text-xs">♪</div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">TikTok</span>
                </div>
                <p className="text-[11px] sm:text-sm line-clamp-2">Day in the life of a startup founder! #startuplife #entrepreneur</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                  <span>❤️ 12.8K</span>
                  <span>💬 892</span>
                  <span>🔄 1.5K</span>
                </div>
              </div>
            </div>

            {/* Post 4 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl">💼</span>
              </div>
              <div className="p-2 sm:p-3">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="size-4 sm:size-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-[10px] sm:text-xs">in</div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground truncate">LinkedIn</span>
                </div>
                <p className="text-[11px] sm:text-sm line-clamp-2">We're hiring! Join our growing team and build the future with us.</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
                  <span>👍 456</span>
                  <span>💬 78</span>
                  <span>🔄 123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
