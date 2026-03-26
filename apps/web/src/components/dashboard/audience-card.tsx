"use client";

import { useState } from "react";
import { Info, Users, Eye } from "lucide-react";
import { SimpleTooltip, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { PieChart } from "@/components/charts/pie-chart";
import { PieSlice } from "@/components/charts/pie-slice";
import { Legend, LegendItemComponent, LegendMarker, LegendLabel } from "@/components/charts/pie-legend";

const demoViewTypes = [
  {
    id: "follower" as const,
    label: "Follower",
    tooltip: "Menampilkan distribusi berdasarkan tipe follower (Verified, Regular, New)",
    icon: <Users aria-hidden="true" className="size-4" />,
  },
  {
    id: "viewer" as const,
    label: "Viewer",
    tooltip: "Menampilkan distribusi berdasarkan sumber viewer (Organic, Suggested, Hashtag, External)",
    icon: <Eye aria-hidden="true" className="size-4" />,
  },
];

const pieColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

const followerData = [
  { label: "Verified", value: 35 },
  { label: "Regular", value: 45 },
  { label: "New", value: 20 },
];

const viewerData = [
  { label: "Organic", value: 52 },
  { label: "Suggested", value: 28 },
  { label: "Hashtag", value: 15 },
  { label: "External", value: 5 },
];

export interface AudienceCardProps {
  demoView?: "follower" | "viewer";
  onDemoViewChange?: (view: "follower" | "viewer") => void;
  followerData?: { label: string; value: number }[];
  viewerData?: { label: string; value: number }[];
}

// Pie Chart with Legend wrapper
function PieChartWithLegend({
  data,
  size,
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

export function AudienceCard({
  demoView = "follower",
  onDemoViewChange,
  followerData: customFollowerData,
  viewerData: customViewerData,
}: AudienceCardProps) {
  const currentFollowerData = customFollowerData || followerData;
  const currentViewerData = customViewerData || viewerData;
  const currentDemoData = demoView === "follower" ? currentFollowerData : currentViewerData;

  return (
    <div className="border rounded-lg p-3 sm:p-4 min-h-80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Audience</p>
          <SimpleTooltip content="Menampilkan distribusi audience berdasarkan tipe follower atau sumber viewer">
            <Info className="size-4 text-muted-foreground cursor-help" />
          </SimpleTooltip>
        </div>
        {onDemoViewChange && (
          <ButtonGroup className="gap-0.5">
            {demoViewTypes.map((type) => (
              <Tooltip key={type.id}>
                <TooltipTrigger
                  render={
                    <Button
                      onClick={() => onDemoViewChange(type.id)}
                      variant="ghost"
                      size="sm"
                      data-active={demoView === type.id}
                      className="text-sm"
                    >
                      {type.icon}
                      {type.label}
                    </Button>
                  }
                />
                <TooltipContent className="max-w-52 text-center">
                  {type.tooltip}
                </TooltipContent>
              </Tooltip>
            ))}
          </ButtonGroup>
        )}
      </div>
      <div className="flex flex-col items-center justify-center">
        <PieChartWithLegend data={currentDemoData} size={160} />
        <p className="text-xs sm:text-sm font-medium mt-3 sm:mt-4 mb-3">
          {demoView === "follower" ? "Follower Distribution" : "Viewer Distribution"}
        </p>
      </div>
    </div>
  );
}
