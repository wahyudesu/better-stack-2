"use client";

import { useChart } from "./chart-context";

export interface ChartMarkerItem {
  /** Date for the marker position */
  date: Date;
  /** Icon/emoji to display */
  icon: string;
  /** Title for tooltip */
  title: string;
}

export interface ChartMarkersProps {
  /** Array of marker items to display */
  items: ChartMarkerItem[];
  /** Size of marker icon. Default: 20 */
  size?: number;
}

export function ChartMarkers({ items, size = 20 }: ChartMarkersProps) {
  const { xScale, innerHeight, margin, xAccessor, data } = useChart();

  // Find the closest data point index for each marker date
  const markers = items.map((item) => {
    const markerTime = item.date.getTime();

    // Find the data point with the closest date
    let closestIndex = 0;
    let minDiff = Infinity;

    data.forEach((d, i) => {
      const dataTime = xAccessor(d).getTime();
      const diff = Math.abs(dataTime - markerTime);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    return { ...item, closestIndex };
  });

  return (
    <g className="chart-markers">
      {markers.map((marker, i) => {
        const x = xScale(xAccessor(data[marker.closestIndex]));
        if (x === undefined) return null;

        return (
          <g key={i} transform={`translate(${x}, ${innerHeight})`}>
            {/* Marker line */}
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-innerHeight}
              stroke="var(--chart-grid)"
              strokeDasharray="2,2"
              strokeOpacity={0.5}
              strokeWidth={1}
            />
            {/* Marker circle at bottom */}
            <circle
              cx={0}
              cy={0}
              r={6}
              fill="var(--chart-1)"
              stroke="var(--background)"
              strokeWidth={2}
            />
              {/* Marker icon above */}
              <text
                x={0}
                y={-innerHeight - 10}
                textAnchor="middle"
                dominantBaseline="auto"
                fontSize={size}
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
              {marker.icon}
            </text>
          </g>
        );
      })}
    </g>
  );
}

ChartMarkers.displayName = "ChartMarkers";
// Mark this component for special handling in LineChart
(ChartMarkers as any).__isChartMarkers = true;

export default ChartMarkers;
