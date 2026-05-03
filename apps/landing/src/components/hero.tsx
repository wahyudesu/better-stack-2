"use client";

import Image from "next/image";
import { HeroWaitlistForm } from "@/components/hero-waitlist-form";
import { WaitlistSocialProof } from "@/components/waitlist-social-proof";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type TabId = "analytics" | "inbox" | "scheduler" | "ads" | "ai";

const tabContent: Record<
  TabId,
  { title: string; description: string }
> = {
  analytics: {
    title: "Real-time Analytics",
    description:
      "Track engagement, followers, and ad performance across 14+ platforms — all in one dashboard.",
  },
  inbox: {
    title: "Unified Inbox",
    description:
      "All DMs, comments, and mentions in one place. Nothing falls through the cracks.",
  },
  scheduler: {
    title: "Smart Scheduler",
    description:
      "Plan, schedule, and auto-post to all your platforms — from one calendar.",
  },
  ads: {
    title: "Ads Analytics",
    description:
      "See performance from Google, Meta, and TikTok ads together. Know which actually converts.",
  },
  ai: {
    title: "AI Assistant",
    description:
      "Get caption suggestions, hashtag recommendations, and content ideas — generated in seconds.",
  },
};

export function Hero() {
	return (
		<section className="relative overflow-hidden py-16 sm:py-20 lg:py-28" id="hero">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-0 h-[420px] w-[min(90vw,640px)] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-3xl" />
				<div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl lg:right-[10%]" />
			</div>

			<div className="container mx-auto px-4 items-center">
				<div className="mx-auto flex max-w-5xl flex-col items-center gap-12">
					{/* Copy + waitlist */}
					<div className="w-full text-center">
						<div className="mb-5 flex justify-center">
							<Badge variant="secondary" className="gap-2 pl-2 pr-3 py-1.5">
								<span className="relative flex h-2 w-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
									<span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
								</span>
								Early access
							</Badge>
						</div>

						<div className="space-y-5 max-w-2xl mx-auto text-center items-center">
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
								From idea to published post — across 14+ platforms — in one clean workspace.
							</h1>
							<p className="text-lg text-muted-foreground mx-auto max-w-xl leading-relaxed">
								Schedule and boost content, manage conversations, and track performance — all in one simple place. No more tab-switching.
							</p>
						</div>

						<div className="mx-auto mt-8 max-w-md">
							<WaitlistSocialProof />
							<HeroWaitlistForm />
						</div>
					</div>

					{/* Product preview tabs */}
					<div className="w-full pt-16">
						<Tabs defaultValue="analytics" className="w-full">
							<div className="flex justify-center">
								<TabsList className="gap-2">
									<TabsTrigger value="analytics" className="p-2 sm:p-3 rounded-full text-xs sm:text-sm">Analytics</TabsTrigger>
									<TabsTrigger value="inbox" className="p-2 sm:p-3 rounded-full text-xs sm:text-sm">Inbox</TabsTrigger>
									<TabsTrigger value="scheduler" className="p-2 sm:p-3 rounded-full text-xs sm:text-sm">Scheduler</TabsTrigger>
									<TabsTrigger value="ads" className="p-2 sm:p-3 rounded-full text-xs sm:text-sm">Ads</TabsTrigger>
									<TabsTrigger value="ai" className="p-2 sm:p-3 rounded-full text-xs sm:text-sm">AI</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent value="analytics" className="mt-2">
								<div className="overflow-hidden rounded-2xl border border-border/80">
									<Image
										src="/okok.png"
										alt={tabContent.analytics.title}
										width={1200}
										height={675}
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
										loading="lazy"
										className="w-full h-auto"
									/>
								</div>
							</TabsContent>

							<TabsContent value="inbox" className="mt-2">
								<div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
									<Image
										src="/okok.png"
										alt={tabContent.inbox.title}
										width={1200}
										height={675}
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
										loading="lazy"
										className="w-full h-auto"
									/>
								</div>
							</TabsContent>

							<TabsContent value="scheduler" className="mt-2">
								<div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
									<Image
										src="/okok.png"
										alt={tabContent.scheduler.title}
										width={1200}
										height={675}
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
										loading="lazy"
										className="w-full h-auto"
									/>
								</div>
							</TabsContent>

							<TabsContent value="ads" className="mt-2">
								<div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
									<Image
										src="/okok.png"
										alt={tabContent.ads.title}
										width={1200}
										height={675}
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
										loading="lazy"
										className="w-full h-auto"
									/>
								</div>
							</TabsContent>

							<TabsContent value="ai" className="mt-2">
								<div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
									<Image
										src="/okok.png"
										alt={tabContent.ai.title}
										width={1200}
										height={675}
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
										loading="lazy"
										className="w-full h-auto"
									/>
								</div>
							</TabsContent>
						</Tabs>

					</div>
				</div>

				<div className="mt-8 pt-8">
					<div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
						<div className="flex-1 max-w-none w-full sm:max-w-[280px] text-center">
							<div className="mb-4 flex justify-center">
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
								</div>
							</div>
							<p className="text-muted-foreground">Track every metric across all platforms — engagement, followers, ad spend — without switching tabs.</p>
						</div>
						<div className="flex-1 max-w-none w-full sm:max-w-[280px] text-center">
							<div className="mb-4 flex justify-center">
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
							</div>
							<p className="text-muted-foreground">All your DMs, comments, and mentions — in one inbox. No more opening 5 tabs.</p>
						</div>
						<div className="flex-1 max-w-none w-full sm:max-w-[280px] text-center">
							<div className="mb-4 flex justify-center">
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
									</svg>
								</div>
							</div>
							<p className="text-muted-foreground">See which posts actually grow your brand — with clear analytics, not guesswork.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
