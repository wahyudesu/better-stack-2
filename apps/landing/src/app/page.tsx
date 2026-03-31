"use client";

import { useState } from "react";

export default function Home() {
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus("loading");

		// TODO: Implement waitlist submission (Clerk/Convex)
		// For now, simulate API call
		setTimeout(() => {
			setStatus("success");
			setEmail("");
		}, 1000);
	};

	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			{/* Header */}
			<header className="border-b border-border/40">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<div className="font-bold text-xl">Better Stack 2</div>
					<nav className="flex gap-6 text-sm text-muted-foreground">
						<a href="#features" className="hover:text-foreground transition-colors">
							Features
						</a>
						<a href="#about" className="hover:text-foreground transition-colors">
							About
						</a>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
				<div className="max-w-3xl w-full text-center space-y-8">
					<div className="space-y-4">
						<h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
							Social Media Management
							<span className="text-primary"> Dashboard</span>
						</h1>
						<p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
							Kelola semua social media kamu dari satu tempat. Schedule content,
							track analytics, dan grow audience dengan AI-powered insights.
						</p>
					</div>

					{/* Waitlist Form */}
					<form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={status === "loading" || status === "success"}
								className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
								required
							/>
							<button
								type="submit"
								disabled={status === "loading" || status === "success"}
								className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
							>
								{status === "loading" ? "Joining..." : status === "success" ? "Joined!" : "Join Waitlist"}
							</button>
						</div>
						{status === "success" && (
							<p className="text-sm text-green-600 dark:text-green-400">
								🎉 You&apos;re on the list! We&apos;ll be in touch soon.
							</p>
						)}
						{status === "error" && (
							<p className="text-sm text-destructive">
								Something went wrong. Please try again.
							</p>
						)}
					</form>

					{/* Features */}
					<div id="features" className="grid sm:grid-cols-3 gap-8 pt-16">
						<div className="space-y-2">
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
								<span className="text-2xl">📊</span>
							</div>
							<h3 className="font-semibold">Analytics</h3>
							<p className="text-sm text-muted-foreground">
								Track performance across all platforms in one dashboard
							</p>
						</div>
						<div className="space-y-2">
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
								<span className="text-2xl">📅</span>
							</div>
							<h3 className="font-semibold">Scheduling</h3>
							<p className="text-sm text-muted-foreground">
								Plan and schedule content ahead of time
							</p>
						</div>
						<div className="space-y-2">
							<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
								<span className="text-2xl">🤖</span>
							</div>
							<h3 className="font-semibold">AI Powered</h3>
							<p className="text-sm text-muted-foreground">
								Generate content ideas and optimize with AI
							</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="border-t border-border/40 py-8">
				<div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
					<p>© 2025 Better Stack 2. Coming soon.</p>
				</div>
			</footer>
		</div>
	);
}
