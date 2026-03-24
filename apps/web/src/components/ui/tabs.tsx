import * as React from "react";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { TabsRootProps } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

type TabsComponentProps = TabsRootProps;

function Tabs({ className, ...props }: TabsComponentProps) {
  return (
    <BaseTabs.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

type TabsListProps = React.ComponentProps<typeof BaseTabs.List> & {
  variant?: "default" | "line";
};

function TabsListFn({ className, variant = "default", ...props }: TabsListProps) {
  const baseClasses = variant === "line"
    ? "relative inline-flex h-9 w-fit items-center justify-center bg-transparent gap-1 border-b"
    : "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]";

  return (
    <BaseTabs.List
      className={cn(baseClasses, className)}
      {...props}
    />
  );
}

type TabsTabProps = React.ComponentProps<typeof BaseTabs.Tab>;

function TabsTab({ className, ...props }: TabsTabProps) {
  return (
    <BaseTabs.Tab
      className={cn(
        "data-[selected]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md w-full px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors duration-500 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

type TabsPanelProps = React.ComponentProps<typeof BaseTabs.Panel>;

function TabsPanel({ className, ...props }: TabsPanelProps) {
  return (
    <BaseTabs.Panel
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsListFn as TabsList,
  TabsTab,
  TabsPanel,
  // Backward compatibility aliases for old naming
  TabsTab as TabsTrigger,
  TabsPanel as TabsContent,
  type TabsComponentProps as TabsProps,
  type TabsListProps,
  type TabsTabProps,
  type TabsPanelProps,
};
