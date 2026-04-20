import { Eye, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Platform, socialAccounts } from "@/data/mock";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

const platformIcons: Record<Platform, string> = {
	instagram: "📸",
	tiktok: "🎵",
	twitter: "𝕏",
	youtube: "▶️",
};

const platformNames: Record<Platform, string> = {
	instagram: "Instagram",
	tiktok: "TikTok",
	twitter: "Twitter/X",
	youtube: "YouTube",
};

function formatNumber(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toString();
}

export default function HomePage() {
	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Overview performa akun sosial media kamu.
				</p>
			</div>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{socialAccounts.map((acc) => (
					<Card key={acc.platform} className="border-border/50">
						<CardContent className="p-4">
							<div className="flex items-center justify-between mb-3">
								<span className="text-lg">{platformIcons[acc.platform]}</span>
								<Badge
									variant="secondary"
									className={cn(
										"text-[10px] font-medium",
										acc.followersChange >= 0
											? "bg-success/10 text-success"
											: "bg-destructive/10 text-destructive",
									)}
								>
									{acc.followersChange >= 0 ? (
										<TrendingUp className="mr-0.5 h-3 w-3" />
									) : (
										<TrendingDown className="mr-0.5 h-3 w-3" />
									)}
									{Math.abs(acc.followersChange)}%
								</Badge>
							</div>
							<p className="text-xl font-bold">{formatNumber(acc.followers)}</p>
							<p className="text-[11px] text-muted-foreground">
								{platformNames[acc.platform]} followers
							</p>
							<div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
								<span className="flex items-center gap-0.5">
									<Eye className="h-3 w-3" />
									{formatNumber(acc.impressions)}
								</span>
								<span>{acc.engagement}% eng.</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
