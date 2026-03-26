"use client";

import { Info, Globe, MapPin } from "lucide-react";
import { SimpleTooltip, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

const geoViewTypes = [
  {
    id: "country" as const,
    label: "Negara",
    tooltip: "Menampilkan distribusi pengguna berdasarkan negara",
    icon: <Globe aria-hidden="true" className="size-4" />,
  },
  {
    id: "region" as const,
    label: "Daerah",
    tooltip: "Menampilkan distribusi pengguna berdasarkan daerah/Provinsi",
    icon: <MapPin aria-hidden="true" className="size-4" />,
  },
];

export interface DemographicsDataItem {
  country?: string;
  region?: string;
  users: number;
}

export interface DemographicsCardProps {
  geoView: "country" | "region";
  onGeoViewChange: (view: "country" | "region") => void;
  data: DemographicsDataItem[];
}

const countryData: DemographicsDataItem[] = [
  { country: "Indonesia", users: 3500 },
  { country: "United States", users: 2800 },
  { country: "Japan", users: 1900 },
  { country: "Singapore", users: 1200 },
  { country: "Malaysia", users: 850 },
];

const regionData: DemographicsDataItem[] = [
  { region: "Jakarta", users: 2100 },
  { region: "Surabaya", users: 1400 },
  { region: "Bandung", users: 980 },
  { region: "Bali", users: 720 },
  { region: "Medan", users: 580 },
];

export function DemographicsCard({
  geoView,
  onGeoViewChange,
  data,
}: DemographicsCardProps) {
  const displayData = data.length > 0 ? data : geoView === "country" ? countryData : regionData;

  return (
    <div className="border rounded-lg p-3 sm:p-4 min-h-80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold">Demographics</p>
          <SimpleTooltip content="Menampilkan distribusi pengguna berdasarkan negara atau daerah">
            <Info className="size-4 text-muted-foreground cursor-help" />
          </SimpleTooltip>
        </div>
        <ButtonGroup className="gap-0.5">
          {geoViewTypes.map((type) => (
            <Tooltip key={type.id}>
              <TooltipTrigger
                render={
                  <Button
                    onClick={() => onGeoViewChange(type.id)}
                    variant="ghost"
                    size="sm"
                    data-active={geoView === type.id}
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
      </div>
      <BarChart
        data={displayData as unknown as Record<string, unknown>[]}
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
  );
}
