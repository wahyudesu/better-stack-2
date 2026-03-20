"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { chartCssVars, useChart } from "./chart-context";

export interface SegmentBackgroundProps {
  /** Fill color for the selected region. Default: var(--chart-segment-background) */
  fill?: string;
}

/**
 * Background highlight for the selected region.
 * Renders a semi-transparent rectangle covering the selected date range.
 */
export function SegmentBackground({
  fill = chartCssVars.segmentBackground,
}: SegmentBackgroundProps) {
  const { selection, innerHeight } = useChart();

  const dimensions = useMemo(() => {
    if (!selection?.active) {
      return null;
    }

    const x = selection.startX;
    const width = selection.endX - selection.startX;

    return { x, width };
  }, [selection]);

  if (!dimensions) {
    return null;
  }

  return (
    <motion.rect
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      fill={fill}
      height={innerHeight}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      width={dimensions.width}
      x={dimensions.x}
      y={0}
    />
  );
}

SegmentBackground.displayName = "SegmentBackground";

export interface SegmentLineProps {
  /** Line color. Default: var(--chart-segment-line) */
  stroke?: string;
  /** Line width. Default: 1 */
  strokeWidth?: number;
  /** Line style variant */
  variant?: "dashed" | "solid" | "gradient";
}

const segmentLineId = "chart-segment-gradient";

/**
 * Common segment line component with variant support
 */
function SegmentLine({
  x,
  variant = "dashed",
  stroke = chartCssVars.segmentLine,
  strokeWidth = 1,
  innerHeight,
}: SegmentLineProps & { x: number; innerHeight: number }) {
  const strokeDasharray = variant === "dashed" ? "4,4" : undefined;

  // For gradient variant, we need a defs with linear gradient
  if (variant === "gradient") {
    return (
      <>
        <defs>
          <linearGradient id={segmentLineId} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={stroke} stopOpacity={0} />
            <stop offset="15%" stopColor={stroke} stopOpacity={1} />
            <stop offset="85%" stopColor={stroke} stopOpacity={1} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <motion.line
          animate={{ opacity: 1, y2: innerHeight }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0, y2: innerHeight * 0.5 }}
          stroke={`url(#${segmentLineId})`}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transition={{ duration: 0.2 }}
          x1={x}
          x2={x}
          y1={0}
        />
      </>
    );
  }

  return (
    <motion.line
      animate={{ opacity: 1, y2: innerHeight }}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0, y2: innerHeight * 0.5 }}
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      strokeLinecap="round"
      strokeWidth={strokeWidth}
      transition={{ duration: 0.2 }}
      x1={x}
      x2={x}
      y1={0}
    />
  );
}

/**
 * Vertical line at the start (left) of the selection.
 * Shows where the selected date range begins.
 */
export function SegmentLineFrom(props: SegmentLineProps) {
  const { selection, innerHeight } = useChart();

  if (!selection?.active) {
    return null;
  }

  return <SegmentLine innerHeight={innerHeight} x={selection.startX} {...props} />;
}

SegmentLineFrom.displayName = "SegmentLineFrom";

/**
 * Vertical line at the end (right) of the selection.
 * Shows where the selected date range ends.
 */
export function SegmentLineTo(props: SegmentLineProps) {
  const { selection, innerHeight } = useChart();

  if (!selection?.active) {
    return null;
  }

  return <SegmentLine innerHeight={innerHeight} x={selection.endX} {...props} />;
}

SegmentLineTo.displayName = "SegmentLineTo";

export default SegmentBackground;
