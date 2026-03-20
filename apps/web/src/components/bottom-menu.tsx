"use client";

import {
  Home,
  Calendar,
  Settings,
  Wrench,
  Sparkles,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { cn } from "@better-stack-2/ui/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

// Theme constants
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type ThemeValue = typeof THEMES[keyof typeof THEMES];

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
  const { theme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | HTMLButtonElement | null)[]>([]);

  // Memoized hoveredItem - only recalculates when hoveredIndex changes
  const hoveredItem = useMemo(
    () => (hoveredIndex !== null ? menuItems[hoveredIndex] : null),
    [hoveredIndex]
  );

  // Keyboard shortcuts - only depends on router, pathname captured from closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (shouldIgnoreKeyboard(e.target as HTMLElement)) return;

      const key = e.key.toLowerCase();
      const matchingItem = KEY_TO_ITEM_MAP.get(key);

      if (matchingItem && pathname !== matchingItem.href) {
        router.push(matchingItem.href);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]); // pathname is captured from closure

  const handleThemeChange = useCallback((newTheme: ThemeValue) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  }, [setTheme]);

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
          "relative backdrop-blur-xl border rounded-2xl shadow-xl px-2 py-1.5 overflow-visible",
          theme === THEMES.DARK
            ? "bg-white/10 border-white/20"
            : "bg-black/80 border-black/20"
        )}
      >
        <nav className="flex items-center gap-0.5">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                ref={(el) => (itemRefs.current[index] = el)}
                href={item.href}
                className={cn(
                  "relative flex items-center justify-center p-2.5 rounded-xl transition-all",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <item.icon className="h-[18px] w-[18px]" />
              </Link>
            );
          })}

          {/* Theme button */}
          <div className="relative">
            <button
              ref={(el) => (itemRefs.current[menuItems.length] = el)}
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              onMouseEnter={() => setHoveredIndex(menuItems.length)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "relative flex items-center justify-center p-2.5 rounded-xl transition-all",
                showThemeMenu
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {theme === THEMES.DARK ? (
                <Moon className="h-[18px] w-[18px]" />
              ) : theme === THEMES.LIGHT ? (
                <Sun className="h-[18px] w-[18px]" />
              ) : (
                <Monitor className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Theme menu popup */}
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
                  transition={SPRING_TRANSITION}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 border border-white/20 rounded-xl shadow-lg overflow-hidden min-w-[120px]"
                >
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(THEMES.LIGHT)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-white text-sm"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(THEMES.DARK)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-white text-sm"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </motion.button>
                  <motion.button
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(THEMES.SYSTEM)}
                    className="flex items-center gap-2 w-full px-4 py-2 text-white text-sm"
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Tooltip popup above menu items */}
        <AnimatePresence>
          {hoveredItem && hoveredItem.shortcut && (
            <motion.div
              key="tooltip"
              className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1.5 bg-zinc-950/90 border border-zinc-800 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none overflow-hidden backdrop-blur-sm"
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
                  <span className="text-sm font-medium text-zinc-100">
                    {hoveredItem.label}
                  </span>
                  <span className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
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
