"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformIcon, type Platform } from "@/components/ui/PlatformIcon";
import { cn } from "@/lib/utils";

// Platform configuration
export const PLATFORM_OPTIONS = [
  { value: "all" as const, label: "All Platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pinterest", label: "Pinterest" },
  { value: "threads", label: "Threads" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reddit", label: "Reddit" },
  { value: "bluesky", label: "Bluesky" },
  { value: "telegram", label: "Telegram" },
  { value: "snapchat", label: "Snapchat" },
] as const;

export const PLATFORM_OPTIONS_NO_ALL = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "X / Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "pinterest", label: "Pinterest" },
  { value: "threads", label: "Threads" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reddit", label: "Reddit" },
  { value: "bluesky", label: "Bluesky" },
  { value: "telegram", label: "Telegram" },
  { value: "snapchat", label: "Snapchat" },
] as const;

export type PlatformFilterValue = Platform | "all";

// ============================================
// PlatformFilterDropdown - Dropdown based filter
// ============================================

interface PlatformFilterDropdownProps {
  value: PlatformFilterValue;
  onChange: (value: PlatformFilterValue) => void;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function PlatformFilterDropdown({
  value,
  onChange,
  size = "sm",
  className,
}: PlatformFilterDropdownProps) {
  const sizeClasses = {
    sm: "h-7 gap-1.5 px-3 text-xs",
    default: "h-9 gap-2 px-4 text-sm",
    lg: "h-10 gap-2 px-5 text-base",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
          className={cn(sizeClasses[size], "font-medium", className)}
        >
          {value === "all" ? (
            "All Platforms"
          ) : (
            <span className="flex items-center gap-1.5">
              <PlatformIcon
                platform={value}
                size={size === "sm" ? 16 : size === "lg" ? 20 : 18}
              />
              {PLATFORM_OPTIONS.find((p) => p.value === value)?.label}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-2">
            {PLATFORM_OPTIONS.map((platform) => (
              <DropdownMenuItem
                key={platform.value}
                onClick={() => onChange(platform.value)}
                className="flex items-center justify-between py-2 text-sm rounded-lg"
              >
                <span className="flex items-center gap-2.5">
                  {platform.value !== "all" && (
                    <PlatformIcon platform={platform.value} size={20} />
                  )}
                  <span className="font-medium">{platform.label}</span>
                </span>
                {value === platform.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// PlatformFilterSelect - Select based filter
// ============================================

interface PlatformFilterSelectProps {
  value: Platform;
  onChange: (value: Platform) => void;
  placeholder?: string;
  className?: string;
  showIcon?: boolean;
}

export function PlatformFilterSelect({
  value,
  onChange,
  placeholder = "Select platform",
  className,
  showIcon = true,
}: PlatformFilterSelectProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as Platform)}>
      <SelectTrigger className={cn("w-[180px] h-8 font-medium", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {PLATFORM_OPTIONS_NO_ALL.map((platform) => (
          <SelectItem key={platform.value} value={platform.value}>
            <span className="flex items-center gap-2 font-medium">
              {showIcon && <PlatformIcon platform={platform.value} size={16} />}
              <span>{platform.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// PlatformFilterMulti - Multi-select button group
// ============================================

export const PLATFORM_MULTI_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "facebook", label: "Facebook" },
  { value: "threads", label: "Threads" },
] as const;

export type PlatformMultiValue =
  (typeof PLATFORM_MULTI_OPTIONS)[number]["value"];

interface PlatformFilterMultiProps {
  values: PlatformMultiValue[];
  onChange: (values: PlatformMultiValue[]) => void;
  label?: string;
  className?: string;
}

export function PlatformFilterMulti({
  values,
  onChange,
  label = "Platforms",
  className,
}: PlatformFilterMultiProps) {
  const togglePlatform = (platform: PlatformMultiValue) => {
    onChange(
      values.includes(platform)
        ? values.filter((p) => p !== platform)
        : [...values, platform],
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2">
        {PLATFORM_MULTI_OPTIONS.map((platform) => (
          <button
            key={platform.value}
            type="button"
            onClick={() => togglePlatform(platform.value)}
            className={cn(
              "cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              values.includes(platform.value)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {platform.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Compact platform pills (horizontal scrollable)
// ============================================

interface PlatformFilterPillsProps {
  value: PlatformFilterValue;
  onChange: (value: PlatformFilterValue) => void;
  options?: typeof PLATFORM_OPTIONS;
  className?: string;
}

export function PlatformFilterPills({
  value,
  onChange,
  options = PLATFORM_OPTIONS,
  className,
}: PlatformFilterPillsProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide",
        className,
      )}
    >
      {options.map((platform) => (
        <button
          key={platform.value}
          type="button"
          onClick={() => onChange(platform.value)}
          className={cn(
            "cursor-pointer shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all",
            value === platform.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/70",
          )}
        >
          {platform.value !== "all" && (
            <PlatformIcon platform={platform.value} size={14} />
          )}
          {platform.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// Helper to get platform label
// ============================================

export function getPlatformLabel(platform: PlatformFilterValue): string {
  return PLATFORM_OPTIONS.find((p) => p.value === platform)?.label || platform;
}
