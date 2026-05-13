"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { WaitlistModal } from "@/components/waitlist-modal";
import { DepthButton } from "@/components/ui/depth-buttons";

export function CtaSection() {
	const [open, setOpen] = useState(false);

	return (
		<section className="py-16 lg:py-20">
			<div className="max-w-5xl mx-auto">
				<div className="bg-card rounded-2xl p-12 sm:p-16 text-center">
					<h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
						Join waitlist &amp; get early access
					</h2>
					<p className="text-muted-foreground text-lg mb-8 leading-relaxed">
					Be the first to know when ZenPost launches. We'll notify you as soon as we go live.
					</p>

					<div className="w-full max-w-sm mx-auto">
						<DepthButton variant="blue" onClick={() => { posthog.capture("waitlist_cta_clicked", { location: "cta_section" }); setOpen(true); }}>
							Join Waitlist
						</DepthButton>
					</div>

					<p className="text-xs text-muted-foreground mt-4">
					Be among first to know when ZenPost launches.
					</p>
				</div>
			</div>
			<WaitlistModal open={open} onOpenChange={setOpen} />
		</section>
	);
}
