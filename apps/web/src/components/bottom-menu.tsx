"use client";

import {
  Home,
  Calendar,
  Settings,
  Wrench,
  Sparkles,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@better-stack-2/ui/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Shared animation constant
const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
};

// Key-to-item map for O(1) keyboard lookup
const KEY_TO_ITEM_MAP = new Map(
  [
    { href: "/calendar", icon: Calendar, label: "Calendar", shortcut: "C", key: "c" },
    { href: "/dashboard", icon: Home, label: "Dashboard", shortcut: "D", key: "d" },
    { href: "/ai", icon: Sparkles, label: "AI", shortcut: "A", key: "a" },
    { href: "/tools", icon: Wrench, label: "Tools", shortcut: "T", key: "t" },
    { href: "/settings", icon: Settings, label: "Settings", shortcut: "S", key: "s" },
  ].filter((item) => item.key).map((item) => [item.key!, item])
);

const menuItems: Array<{
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut?: string;
  key?: string;
}> = [
  { href: "/calendar", icon: Calendar, label: "Calendar", shortcut: "C", key: "c" },
  { href: "/dashboard", icon: Home, label: "Dashboard", shortcut: "D", key: "d" },
  { href: "/ai", icon: Sparkles, label: "AI", shortcut: "A", key: "a" },
  { href: "/tools", icon: Wrench, label: "Tools", shortcut: "T", key: "t" },
  { href: "/settings", icon: Settings, label: "Settings", shortcut: "S", key: "s" },
];

// Helper to check if keyboard input should be ignored
const shouldIgnoreKeyboard = (target: HTMLElement): boolean => {
  const ignoreTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);
  return (
    ignoreTags.has(target.tagName) ||
    target.isContentEditable ||
    target.closest("[contenteditable=true]") !== null
  );
};

export default function BottomMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);
  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);

  // Keep refs in sync
  pathnameRef.current = pathname;
  routerRef.current = router;

  // Memoized hoveredItem - only recalculates when hoveredIndex changes
  const hoveredItem = useMemo(
    () => (hoveredIndex !== null ? menuItems[hoveredIndex] : null),
    [hoveredIndex]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyboard(e.target as HTMLElement)) return;

      const key = e.key.toLowerCase();
      const matchingItem = KEY_TO_ITEM_MAP.get(key);

      if (matchingItem && pathnameRef.current !== matchingItem.href) {
        routerRef.current.push(matchingItem.href as any);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Memoized tooltip position - only recalculates when hoveredIndex changes
  const tooltipPos = useMemo(() => {
    if (hoveredIndex === null || !containerRef.current) return { x: 0 };

    const item = itemRefs.current[hoveredIndex];
    if (!item) return { x: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    return {
      x: itemRect.left - containerRect.left + itemRect.width / 2,
    };
  }, [hoveredIndex]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div
        ref={containerRef}
          className={cn(
            "relative border rounded-2xl shadow-xl px-2 py-1.5 overflow-visible bg-background border-border",
          )}
      >
        <nav className="flex items-center gap-0.5">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                href={item.href as any}
                className={cn(
                  "relative flex items-center justify-center p-2.5 rounded-xl transition-all",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <item.icon className="size-[18px]" />
              </Link>
            );
          })}
        </nav>

        {/* Tooltip popup above menu items */}
        <AnimatePresence>
          {hoveredItem && hoveredItem.shortcut && (
            <motion.div
              key="tooltip"
                className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1.5 bg-popover border border-border rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none overflow-hidden"
              initial={{ opacity: 0, y: 10, scale: 0.95, x: tooltipPos.x, translateX: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: tooltipPos.x, translateX: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
              transition={SPRING_TRANSITION}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={hoveredItem.href}
                  className="flex items-center gap-2"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={SPRING_TRANSITION}
                >
                  <span className="text-sm font-medium text-foreground">
                    {hoveredItem.label}
                  </span>
                  <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                    {hoveredItem.shortcut}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
