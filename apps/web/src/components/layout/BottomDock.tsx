"use client";

import { Home, CalendarDays, Wrench, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/tools", icon: Wrench, label: "Tools" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

function DockItem({ to, icon: Icon, label }: { to: string; icon: typeof Home; label: string }) {
  const pathname = usePathname() ?? "/";
  const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setShowTooltip(true), 2000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
  };

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {showTooltip && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background shadow-lg">
          {label}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-foreground" />
        </div>
      )}
      <Link
        href={to as any}
        className={cn(
          "flex items-center justify-center rounded-xl p-2.5 transition-all",
          isActive
            ? "bg-white/20 text-white"
            : "text-white/50 hover:text-white/80"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </Link>
    </div>
  );
}

export function BottomDock() {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <nav className="flex items-center gap-0.5 rounded-2xl bg-foreground px-2 py-1.5 shadow-xl">
        {navItems.map((item) => (
          <DockItem key={item.to} {...item} />
        ))}
      </nav>
    </div>
  );
}
