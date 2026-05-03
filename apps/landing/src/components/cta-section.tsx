"use client";

import { useState } from "react";
import { WaitlistModal } from "@/components/waitlist-modal";
import { DepthButton } from "@/components/ui/depth-buttons";

export function CtaSection() {
	const [open, setOpen] = useState(false);

	return (
		<section className="py-20 lg:py-32">
			<div className="max-w-5xl mx-auto">
				<div className="bg-card rounded-2xl p-8 sm:p-12 text-center">
					<h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
						Join waitlist &amp; get early access
					</h2>
					<p className="text-muted-foreground text-lg mb-8 leading-relaxed">
						Be first to know when ZenPost launches. No spam, unsubscribe anytime.
					</p>

					<div className="w-full max-w-sm mx-auto">
						<DepthButton variant="blue" onClick={() => setOpen(true)} className="w-full">
							Join Waitlist
						</DepthButton>
					</div>

					<p className="text-xs text-muted-foreground mt-4">
						Join 2,847+ creators and businesses in Indonesia
					</p>
				</div>
			</div>
			<WaitlistModal open={open} onOpenChange={setOpen} />
		</section>
	);
}
