/**
 * Platform Filter Components - Usage Examples
 *
 * This file contains examples of how to use the reusable platform filter components.
 */

import { useState } from "react";
import {
  PlatformFilterDropdown,
  PlatformFilterSelect,
  PlatformFilterMulti,
  PlatformFilterPills,
  type PlatformFilterValue,
  type PlatformMultiValue,
} from "@/components/ui/platform-filter";
import type { Platform } from "@/components/ui/PlatformIcon";

// ============================================
// Example 1: PlatformFilterDropdown
// Use for single-select with "All" option
// ============================================

export function DropdownExample() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilterValue>("all");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dropdown Filter</h3>

      {/* Basic usage */}
      <PlatformFilterDropdown
        value={selectedPlatform}
        onChange={setSelectedPlatform}
      />

      {/* Small size */}
      <PlatformFilterDropdown
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        size="sm"
      />

      {/* Large size */}
      <PlatformFilterDropdown
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        size="lg"
      />

      {/* With custom className */}
      <PlatformFilterDropdown
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        className="w-64"
      />
    </div>
  );
}

// ============================================
// Example 2: PlatformFilterSelect
// Use for single-select without "All" option
// ============================================

export function SelectExample() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Filter</h3>

      {/* Basic usage */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by platform:
        </span>
        <PlatformFilterSelect
          value={selectedPlatform}
          onChange={setSelectedPlatform}
        />
      </div>

      {/* Without icon */}
      <PlatformFilterSelect
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        showIcon={false}
      />

      {/* With custom placeholder */}
      <PlatformFilterSelect
        value={selectedPlatform}
        onChange={setSelectedPlatform}
        placeholder="Choose a platform..."
      />
    </div>
  );
}

// ============================================
// Example 3: PlatformFilterMulti
// Use for multi-select with button group
// ============================================

export function MultiSelectExample() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformMultiValue[]>([
    "instagram",
    "tiktok",
  ]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Multi-Select Filter</h3>

      {/* Basic usage */}
      <PlatformFilterMulti
        values={selectedPlatforms}
        onChange={setSelectedPlatforms}
      />

      {/* With custom label */}
      <PlatformFilterMulti
        values={selectedPlatforms}
        onChange={setSelectedPlatforms}
        label="Select platforms for automation"
      />

      {/* Display selected values */}
      <p className="text-sm text-muted-foreground">
        Selected: {selectedPlatforms.join(", ")}
      </p>
    </div>
  );
}

// ============================================
// Example 4: PlatformFilterPills
// Use for compact horizontal scrollable pills
// ============================================

export function PillsExample() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilterValue>("all");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Pills Filter</h3>

      {/* All platforms */}
      <PlatformFilterPills
        value={selectedPlatform}
        onChange={setSelectedPlatform}
      />

      {/* Filter items list */}
      <div className="space-y-2">
        {/* Your filtered content here */}
        {selectedPlatform === "all" ? (
          <p className="text-sm text-muted-foreground">Showing all platforms</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Showing content for {selectedPlatform}
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// Example 5: Real-world usage with data filtering
// ============================================

interface Post {
  id: string;
  title: string;
  platform: Platform;
}

const mockPosts: Post[] = [
  { id: "1", title: "Summer vibes", platform: "instagram" },
  { id: "2", title: "Tech review", platform: "youtube" },
  { id: "3", title: "Quick thought", platform: "twitter" },
];

export function RealWorldExample() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilterValue>("all");

  const filteredPosts =
    selectedPlatform === "all"
      ? mockPosts
      : mockPosts.filter((post) => post.platform === selectedPlatform);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Posts</h3>
        <PlatformFilterDropdown
          value={selectedPlatform}
          onChange={setSelectedPlatform}
          size="sm"
        />
      </div>

      <div className="space-y-2">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <p className="font-medium">{post.title}</p>
            <p className="text-sm text-muted-foreground">{post.platform}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

// ============================================
// Example 6: Combining with other filters
// ============================================

export function CombinedFiltersExample() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilterValue>("all");
  const [dateRange, setDateRange] = useState<"week" | "month" | "all">("all");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <PlatformFilterDropdown
          value={selectedPlatform}
          onChange={setSelectedPlatform}
          size="sm"
        />

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
          className="h-7 px-3 text-xs border rounded-md bg-background"
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        Filters: {selectedPlatform} × {dateRange}
      </p>
    </div>
  );
}
