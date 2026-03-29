/**
 * Preferences Settings Tab Component.
 * Includes general, appearance, and calendar settings.
 */

"use client";

import { Palette, Settings } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
	ACCENT_COLORS,
	THEME_OPTIONS,
	TIMEZONES,
} from "@/lib/constants/settings";
import { cn } from "@/lib/utils";
import type { FirstDayOfWeek, TimeFormat } from "./types";

export function PreferencesTab() {
	const { theme, setTheme } = useTheme();
	const [firstDayOfWeek, setFirstDayOfWeek] =
	useState<FirstDayOfWeek>("monday");
	const [timezone, setTimezone] = useState("Asia/Jakarta");
	const [timeFormat, setTimeFormat] = useState<TimeFormat>("24h");
	const [selectedColor, setSelectedColor] = useState("default");
	const [animatedDock, setAnimatedDock] = useState(true);
	const [projectName, setProjectName] = useState("Acme Corp");
	const [publicStats, setPublicStats] = useState(false);

	return (
		<div className="space-y-4">
			{/* General Settings */}
			<Card>
				<CardContent className="p-5 space-y-4">
					<div className="flex items-center gap-2">
						<Settings className="h-4 w-4" />
						<p className="text-sm font-semibold">General</p>
					</div>

					<div className="space-y-2">
						<Label className="text-sm">Project name</Label>
						<Input
							value={projectName}
							onChange={(e) => setProjectName(e.target.value)}
						/>
					</div>

					<div className="flex items-center justify-between py-2">
						<div>
							<p className="text-sm font-medium">Public stats</p>
							<p className="text-xs text-muted-foreground">
								Share your project statistics publicly
							</p>
						</div>
						<Switch checked={publicStats} onCheckedChange={setPublicStats} />
					</div>
				</CardContent>
			</Card>

			{/* Appearance Settings */}
			<Card>
				<CardContent className="p-5 space-y-4">
					<div className="flex items-center gap-2">
						<Palette className="h-4 w-4" />
						<p className="text-sm font-semibold">Appearance</p>
					</div>

					{/* Theme */}
					<div className="flex flex-col gap-3">
						<p className="text-xs text-muted-foreground">Theme</p>
						<div className="grid grid-cols-3 gap-3">
							{THEME_OPTIONS.map((option) => (
								<button
									key={option.value}
									onClick={() => setTheme(option.value)}
									className={cn(
										"flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
										theme === option.value
											? "border-primary bg-primary/5"
											: "border hover:bg-muted/50",
									)}
								>
									<div
										className={cn(
											"h-6 w-6 rounded-full border",
											option.value === "light" && "bg-white border-gray-200",
											option.value === "dark" && "bg-gray-900 border-gray-700",
											option.value === "system" &&
												"bg-gradient-to-r from-white to-gray-900 border-gray-400",
										)}
									/>
									<span className="text-xs font-medium">{option.label}</span>
								</button>
							))}
						</div>
					</div>

					{/* Accent Color */}
					<div className="flex flex-col gap-3">
						<p className="text-xs text-muted-foreground">Accent Color</p>
						<div className="flex flex-wrap gap-2">
							{ACCENT_COLORS.map((color) => (
								<button
									key={color.value}
									onClick={() => setSelectedColor(color.value)}
									className={cn(
										"group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110",
										selectedColor === color.value &&
											"ring-2 ring-primary ring-offset-2 ring-offset-background",
									)}
									title={color.name}
								>
									<div className={cn("h-6 w-6 rounded-full", color.color)} />
								</button>
							))}
						</div>
					</div>

					{/* Animated Dock */}
					<div className="flex items-center justify-between py-2">
						<div>
							<p className="text-sm font-medium">Animated Dock</p>
							<p className="text-xs text-muted-foreground">
								Enable or disable the animated dock effect
							</p>
						</div>
						<Switch checked={animatedDock} onCheckedChange={setAnimatedDock} />
					</div>
				</CardContent>
			</Card>

			{/* Calendar Settings */}
			<Card>
				<CardContent className="p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-display font-semibold text-sm">
								Calendar Settings
							</p>
							<p className="text-xs text-muted-foreground">
								Customize your calendar view preferences.
							</p>
						</div>
						<Button size="sm">Save</Button>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<Label className="text-xs">First Day of Week</Label>
							<Select
								value={firstDayOfWeek}
								onValueChange={(v) => setFirstDayOfWeek(v as FirstDayOfWeek)}
							>
								<SelectTrigger className="w-full h-8 text-sm font-medium">
									<SelectValue placeholder="Select first day" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="sunday">Sunday</SelectItem>
									<SelectItem value="monday">Monday</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="text-xs">Timezone</Label>
							<Select
								value={timezone}
								onValueChange={(v) => setTimezone(v ?? "Asia/Jakarta")}
							>
								<SelectTrigger className="w-full h-8 text-sm font-medium">
									<SelectValue placeholder="Select timezone" />
								</SelectTrigger>
								<SelectContent>
									{TIMEZONES.map((tz) => (
										<SelectItem key={tz.value} value={tz.value}>
											{tz.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-1.5">
						<Label className="text-xs">Time Format</Label>
						<div className="flex items-center gap-3">
							<Select
								value={timeFormat}
								onValueChange={(v) => setTimeFormat(v as TimeFormat)}
							>
								<SelectTrigger className="w-[160px] h-8 text-sm font-medium">
									<SelectValue placeholder="Select format" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
									<SelectItem value="24h">24 Hour</SelectItem>
								</SelectContent>
							</Select>
							<span className="text-xs text-muted-foreground">
								Preview: {timeFormat === "12h" ? "3:30 PM" : "15:30"}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
