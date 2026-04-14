"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TIMEZONES } from "@/lib/constants/time";

interface ScheduledDateTimeProps {
	date: string;
	time: string;
	timezone: string;
	onDateChange: (date: string) => void;
	onTimeChange: (time: string) => void;
	onTimezoneChange: (timezone: string) => void;
}

export function ScheduledDateTime({
	date,
	time,
	timezone,
	onDateChange,
	onTimeChange,
	onTimezoneChange,
}: ScheduledDateTimeProps) {
	return (
		<div className="space-y-3">
			<span className="text-sm font-medium">date & time</span>
			<div className="flex flex-col sm:flex-row gap-3">
				<input
					type="date"
					value={date}
					onChange={(e) => onDateChange(e.target.value)}
					className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
				/>
				<input
					type="time"
					value={time}
					onChange={(e) => onTimeChange(e.target.value)}
					className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
				/>
			</div>
			<div className="space-y-1.5">
				<span className="text-xs text-muted-foreground">timezone</span>
				<Select value={timezone} onValueChange={onTimezoneChange}>
					<SelectTrigger className="w-full">
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
	);
}
