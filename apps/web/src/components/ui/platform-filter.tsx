"use client";

import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuTrigger,
  MenuPanel,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
} from "@better-stack-2/ui/components/animate-ui/components/base/menu";
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
// PlatformFilterMenu - Animate UI Menu based filter
// ============================================

interface PlatformFilterMenuProps {
  value: PlatformFilterValue;
  onChange: (value: PlatformFilterValue) => void;
  size?: "sm" | "default" | "lg";
  className?: string;
  triggerClassName?: string;
}

export function PlatformFilterMenu({
  value,
  onChange,
  size = "sm",
  className,
  triggerClassName,
}: PlatformFilterMenuProps) {
  const sizeClasses = {
    sm: "h-7 gap-1.5 px-3 text-xs",
    default: "h-9 gap-2 px-4 text-sm",
    lg: "h-10 gap-2 px-5 text-base",
  };

  const iconSize = size === "sm" ? 16 : size === "lg" ? 20 : 18;

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button
            variant="ghost"
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
            className={cn(sizeClasses[size], "font-medium", triggerClassName)}
          >
            {value === "all" ? (
              "All Platforms"
            ) : (
              <span className="flex items-center gap-1.5">
                <PlatformIcon platform={value} size={iconSize} />
                {PLATFORM_OPTIONS.find((p) => p.value === value)?.label}
              </span>
            )}
            <ChevronDown className="ml-auto size-4 opacity-50" />
          </Button>
        }
      />
      <MenuPanel className="w-56">
        <MenuGroup>
          <MenuGroupLabel>All Platforms</MenuGroupLabel>
          <MenuItem onClick={() => onChange("all")}>
            <span className="flex items-center gap-2.5 flex-1">
              <span className="size-5 flex items-center justify-center bg-muted rounded-md">
                <span className="text-xs">All</span>
              </span>
              <span className="font-medium">All Platforms</span>
            </span>
            {value === "all" && <Check className="size-4 text-primary" />}
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Social Media</MenuGroupLabel>
          {PLATFORM_OPTIONS.filter((p) => p.value !== "all").map((platform) => (
            <MenuItem
              key={platform.value}
              onClick={() => onChange(platform.value)}
            >
              <span className="flex items-center gap-2.5 flex-1">
                <PlatformIcon platform={platform.value} size={20} />
                <span className="font-medium">{platform.label}</span>
              </span>
              {value === platform.value && (
                <Check className="size-4 text-primary" />
              )}
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuPanel>
    </Menu>
  );
}

// ============================================
// PlatformFilterDropdown - Dropdown based filter (legacy)
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
    <Menu>
      <MenuTrigger
        render={
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
            <ChevronDown className="ml-auto size-4 opacity-50" />
          </Button>
        }
      />
        <MenuPanel className="w-56" align="start">
          <MenuGroup>
            {PLATFORM_OPTIONS.map((platform) => (
            <MenuItem
              key={platform.value}
              onClick={() => onChange(platform.value)}
            >
              <span className="flex items-center gap-2.5 flex-1">
                {platform.value !== "all" && (
                  <PlatformIcon platform={platform.value} size={20} />
                )}
                <span className="font-medium">{platform.label}</span>
              </span>
              {value === platform.value && (
                <Check className="size-4 text-primary" />
              )}
            </MenuItem>
          ))}
        </MenuGroup>
      </MenuPanel>
    </Menu>
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
}: PlatformFilterSelectAdvancedProps) {
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

// ============================================
// PlatformOption interface for custom options
// ============================================

export interface PlatformOption {
  value: string;
  label: string;
}

// ============================================
// PlatformFilterSelectAdvanced - Flexible single/multi-select with custom options
// ============================================

interface PlatformFilterSelectAdvancedProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options?: readonly PlatformOption[] | PlatformOption[];
  multiSelect?: boolean;
  placeholder?: string;
  className?: string;
  showIcon?: boolean;
  label?: string;
  triggerClassName?: string;
}

export function PlatformFilterSelectAdvanced({
  value,
  onChange,
  options,
  multiSelect = false,
  placeholder = "Select platform",
  className,
  showIcon = true,
  label,
  triggerClassName,
}: PlatformFilterSelectAdvancedProps) {
  // Use provided options or default to all platforms without "all"
  const platformOptions = options || PLATFORM_OPTIONS_NO_ALL;

  if (multiSelect) {
    const values = Array.isArray(value) ? value : [];
    const toggleOption = (optionValue: string) => {
      const newValues = values.includes(optionValue)
        ? values.filter((v) => v !== optionValue)
        : [...values, optionValue];
      onChange(newValues);
    };

    return (
      <div className={cn("space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <Menu>
          <MenuTrigger
            render={
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between font-medium",
                  triggerClassName,
                )}
              >
                <span className="flex items-center gap-2">
                  {values.length > 0 ? (
                    <>
                      {showIcon && values.length === 1 && (
                        <PlatformIcon platform={values[0] as Platform} size={16} />
                      )}
                      <span>
                        {values.length === 1
                          ? platformOptions.find((o) => o.value === values[0])?.label
                          : `${values.length} selected`}
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">{placeholder}</span>
                  )}
                </span>
                <ChevronDown className="size-4 opacity-50" />
              </Button>
            }
          />
          <MenuPanel className="w-56">
            <MenuGroup>
              {platformOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                >
                  <span className="flex items-center gap-2.5 flex-1">
                    {showIcon && (
                      <PlatformIcon platform={option.value as Platform} size={20} />
                    )}
                    <span className="font-medium">{option.label}</span>
                  </span>
                  {values.includes(option.value) && (
                    <Check className="size-4 text-primary" />
                  )}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuPanel>
        </Menu>
      </div>
    );
  }

  // Single select mode
  const currentValue = typeof value === "string" ? value : undefined;

  return (
    <Select
      value={currentValue}
      onValueChange={(val) => onChange(val)}
    >
      <SelectTrigger className={cn("w-[180px] h-8 font-medium", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {platformOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <span className="flex items-center gap-2 font-medium">
              {showIcon && <PlatformIcon platform={option.value as Platform} size={16} />}
              <span>{option.label}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ============================================
// PlatformFilterPillsMulti - Multi-select pills with custom options
// ============================================

interface PlatformFilterPillsMultiProps {
  values: string[];
  onChange: (values: string[]) => void;
  options?: readonly PlatformOption[] | PlatformOption[];
  label?: string;
  className?: string;
  allowAll?: boolean;
  showIcon?: boolean;
}

export function PlatformFilterPillsMulti({
  values,
  onChange,
  options = PLATFORM_OPTIONS_NO_ALL,
  label = "Platforms",
  className,
  allowAll = false,
  showIcon = false,
}: PlatformFilterPillsMultiProps) {
  const displayOptions = allowAll
    ? [{ value: "all", label: "All Platforms" }, ...options] as const
    : options;

  const togglePlatform = (platformValue: string) => {
    if (platformValue === "all") {
      onChange([]);
      return;
    }
    onChange(
      values.includes(platformValue)
        ? values.filter((p) => p !== platformValue)
        : [...values, platformValue],
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {displayOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => togglePlatform(option.value)}
            className={cn(
              "cursor-pointer px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5",
              option.value === "all"
                ? values.length === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
                : values.includes(option.value)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {showIcon && option.value !== "all" && (
              <PlatformIcon platform={option.value as Platform} size={14} />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
