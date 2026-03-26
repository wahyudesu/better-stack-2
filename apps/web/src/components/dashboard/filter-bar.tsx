"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCallback } from "react";

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

export interface FilterBarProps {
  selectedSocial: string;
  onSocialChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedTime: string;
  onTimeChange: (value: string) => void;
}

export function FilterBar({
  selectedSocial,
  onSocialChange,
  selectedType,
  onTypeChange,
  selectedTime,
  onTimeChange,
}: FilterBarProps) {
  // Stable callbacks using selectHandler pattern
  const handleSocialChange = useCallback((value: string | null) => {
    onSocialChange(value ?? "all");
  }, [onSocialChange]);

  const handleTypeChange = useCallback((value: string | null) => {
    onTypeChange(value ?? "overview");
  }, [onTypeChange]);

  const handleTimeChange = useCallback((value: string | null) => {
    onTimeChange(value ?? "7d");
  }, [onTimeChange]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <Select value={selectedSocial} onValueChange={handleSocialChange}>
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
        <Select value={selectedType} onValueChange={handleTypeChange}>
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

        <Select value={selectedTime} onValueChange={handleTimeChange}>
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
  );
}
