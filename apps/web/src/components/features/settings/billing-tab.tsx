/**
 * Billing Settings Tab Component.
 */

import { CreditCard, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BILLING_HISTORY } from "@/lib/constants/settings";

export function BillingTab() {
	return (
		<div className="flex flex-col gap-6">
			{/* Current Plan */}
			<Card>
				<CardContent className="p-4 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<Sparkles className="h-5 w-5 text-primary" />
							</div>
							<div>
								<p className="font-display font-semibold">Pro Plan</p>
								<p className="text-xs text-muted-foreground">
									$29/month • Renews on Apr 1, 2024
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								Change Plan
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="text-destructive hover:text-destructive"
							>
								Cancel
							</Button>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-4">
						<div className="p-3 bg-muted/30 rounded-lg">
							<p className="text-xs text-muted-foreground">AI Generations</p>
							<p className="text-sm font-medium">847 / 1,000</p>
							<Progress value={84.7} className="h-1 mt-1.5" />
						</div>
						<div className="p-3 bg-muted/30 rounded-lg">
							<p className="text-xs text-muted-foreground">Scheduled Posts</p>
							<p className="text-sm font-medium">23 / 50</p>
							<Progress value={46} className="h-1 mt-1.5" />
						</div>
						<div className="p-3 bg-muted/30 rounded-lg">
							<p className="text-xs text-muted-foreground">
								Connected Accounts
							</p>
							<p className="text-sm font-medium">5 / 10</p>
							<Progress value={50} className="h-1 mt-1.5" />
						</div>
						<div className="p-3 bg-muted/30 rounded-lg">
							<p className="text-xs text-muted-foreground">Team Members</p>
							<p className="text-sm font-medium">3 / 5</p>
							<Progress value={60} className="h-1 mt-1.5" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Payment Method */}
			<Card>
				<CardContent className="p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-display font-semibold text-sm">
								Payment Method
							</p>
							<p className="text-xs text-muted-foreground">
								Manage your payment details
							</p>
						</div>
						<Button variant="outline" size="sm">
							Update
						</Button>
					</div>
					<div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
						<div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md">
							<CreditCard className="h-4 w-4 text-white" />
						</div>
						<div className="flex-1">
							<p className="text-sm font-medium">•••• •••• •••• 4242</p>
							<p className="text-xs text-muted-foreground">Expires 12/2025</p>
						</div>
						<span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
							Default
						</span>
					</div>
				</CardContent>
			</Card>

			{/* Billing History */}
			<Card>
				<CardContent className="p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div>
							<p className="font-display font-semibold text-sm">
								Billing History
							</p>
							<p className="text-xs text-muted-foreground">
								Download past invoices
							</p>
						</div>
					</div>
					<div className="space-y-1">
						{BILLING_HISTORY.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors"
							>
								<div className="flex items-center gap-3">
									<span className="text-xs text-muted-foreground w-20">
										{item.date}
									</span>
									<span className="text-sm font-medium">{item.invoice}</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-sm">{item.amount}</span>
									<span className="text-xs text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded">
										{item.status}
									</span>
									<Button variant="ghost" size="icon" className="h-6 w-6">
										<Download className="h-3 w-3" />
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
