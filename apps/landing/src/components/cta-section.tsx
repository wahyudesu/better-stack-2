"use client";

import { useState } from "react";
import { WaitlistModal } from "@/components/waitlist-modal";
import { DepthButton } from "@/components/ui/depth-buttons";

export function CtaSection() {
	const [open, setOpen] = useState(false);

	return (
		<section className="py-16 px-4">
			<div className="max-w-xl mx-auto text-center">
				<h2 className="text-2xl sm:text-3xl font-bold mb-3">
					Join waitlist &amp; get early access
				</h2>
				<p className="text-muted-foreground mb-6">
					Be first to know when ZenPost launches. No spam, unsubscribe anytime.
				</p>

				<DepthButton variant="blue" onClick={() => setOpen(true)}>
					Join Waitlist
				</DepthButton>

				<p className="text-xs text-muted-foreground mt-4">
					Join 2,847+ creator dan bisnis Indonesia
				</p>
			</div>
			<WaitlistModal open={open} onOpenChange={setOpen} />
		</section>
	);
}
