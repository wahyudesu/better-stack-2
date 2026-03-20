"use client";

import { Fragment, useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { LineChart, Line, Grid, XAxis, ChartTooltip, SegmentBackground, SegmentLineFrom, SegmentLineTo } from "@/components/charts/line-chart";
import { ChartMarkers } from "@/components/charts/markers";

// Mock data generator based on filters
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

  // Generate markers based on time range
  const markerCount = Math.max(1, Math.floor(days / 6));
  const markerIcons = ["📱", "🎯", "🔥", "📢", "💡", "🚀", "⭐", "🎨"];
  const markerTitles = ["Product Launch", "Campaign Start", "Viral Content", "Announcement", "Tips", "New Feature", "Special Offer", "Trending"];

  const markers = Array.from({ length: markerCount }, (_, i) => {
    const dayOffset = Math.floor((days / (markerCount + 1)) * (i + 1));
    return {
      date: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000),
      icon: markerIcons[i % markerIcons.length],
      title: markerTitles[i % markerTitles.length],
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

export default function DashboardPage() {
  const [selectedSocial, setSelectedSocial] = useState("all");
  const [selectedType, setSelectedType] = useState("overview");
  const [selectedTime, setSelectedTime] = useState("7d");

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
      <div className="flex items-center justify-between gap-4">
        <Select value={selectedSocial} onValueChange={setSelectedSocial}>
          <SelectTrigger className="w-[200px]">
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

        <div className="flex items-center gap-3">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
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

          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[140px]">
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
      <div className="grid grid-cols-2 gap-0 lg:grid-cols-5 border rounded-lg overflow-hidden" key={`${selectedSocial}-${selectedType}-${selectedTime}`}>
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "p-4",
              index !== stats.length - 1 && "border-r border-border/50"
            )}
          >
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <div className="flex items-center gap-0.5 text-xs text-success mt-1">
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="border rounded-lg p-4 overflow-visible pb-6" key={`chart-${selectedSocial}-${selectedType}-${selectedTime}`}>
        <LineChart
          data={chartData}
          aspectRatio="3 / 1"
          margin={{ top: 70, right: 20, bottom: 50, left: 20 }}
        >
          <Grid horizontal numTicksRows={5} />
          <Line
            dataKey="engagements"
            stroke="var(--chart-line-primary)"
            strokeWidth={2.5}
          />
          <Line
            dataKey="followers"
            stroke="var(--chart-line-secondary)"
            strokeWidth={2.5}
          />
          <XAxis numTicks={6} />
          <ChartMarkers items={markers} />
          <ChartTooltip
            rows={(point) => [
              {
                color: "var(--chart-line-primary)",
                label: "Engagements",
                value: formatMetricValue(point.engagements as number),
              },
              {
                color: "var(--chart-line-secondary)",
                label: "Followers",
                value: formatMetricValue(point.followers as number),
              },
            ]}
          />
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
          Followers range from {formatMetricValue(Math.min(...chartData.map((d) => d.followers)))} to{" "}
            {formatMetricValue(Math.max(...chartData.map((d) => d.followers)))}.
          </p>
        </div>

        {/* 2 Kotak Atas - Pendek */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 min-h-32">
            <p className="text-sm font-medium">Kotak 1</p>
          </div>
          <div className="border rounded-lg p-4 min-h-32">
            <p className="text-sm font-medium">Kotak 2</p>
          </div>
        </div>

        {/* 2 Kotak Bawah - Lebih Panjang */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 min-h-80">
            <p className="text-sm font-medium">Kotak 3</p>
          </div>
          <div className="border rounded-lg p-4 min-h-80">
            <p className="text-sm font-medium">Kotak 4</p>
          </div>
        </div>

        {/* Kotak 5 - Recent Posts */}
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-4">Recent Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Post 1 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">𝕏</div>
                  <span className="text-xs text-muted-foreground">Twitter/X</span>
                </div>
                <p className="text-sm line-clamp-2">Excited to announce our new product launch! 🚀 #startup #tech</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>❤️ 1.2K</span>
                  <span>💬 89</span>
                  <span>🔄 234</span>
                </div>
              </div>
            </div>

            {/* Post 2 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs">📷</div>
                  <span className="text-xs text-muted-foreground">Instagram</span>
                </div>
                <p className="text-sm line-clamp-2">Behind the scenes at our office! Team work makes the dream work 💪</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>❤️ 3.5K</span>
                  <span>💬 156</span>
                  <span>💬 42</span>
                </div>
              </div>
            </div>

            {/* Post 3 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-xs">♪</div>
                  <span className="text-xs text-muted-foreground">TikTok</span>
                </div>
                <p className="text-sm line-clamp-2">Day in the life of a startup founder! #startuplife #entrepreneur</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>❤️ 12.8K</span>
                  <span>💬 892</span>
                  <span>🔄 1.5K</span>
                </div>
              </div>
            </div>

            {/* Post 4 */}
            <div className="rounded-lg border overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <span className="text-4xl">💼</span>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs">in</div>
                  <span className="text-xs text-muted-foreground">LinkedIn</span>
                </div>
                <p className="text-sm line-clamp-2">We're hiring! Join our growing team and build the future with us.</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
