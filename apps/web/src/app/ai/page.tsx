"use client";

import { MessageSquareIcon } from "lucide-react";
import { Suspense } from "react";
import { AIChat } from "@/components/ai-elements/chat";
import { useAuthGate } from "@/components/auth";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

export default function AIChatPage() {
	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="mb-4">
				<h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
					<MessageSquareIcon className="h-6 w-6 text-primary" />
					AI Content Analysis
				</h1>
			</div>
			<div className="h-[calc(100vh-220px)] min-h-[500px]">
				<Suspense
					fallback={
						<div className="animate-pulse h-full bg-muted rounded-lg" />
					}
				>
					<AIChat />
				</Suspense>
			</div>
		</div>
	);
}
