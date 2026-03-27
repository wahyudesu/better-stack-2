/**
 * Security Settings Tab Component.
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function SecurityTab() {
	return (
		<div className="space-y-5">
			<Card>
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Password</p>
					<div className="flex flex-col gap-3">
						<div className="space-y-2">
							<Label>Current password</Label>
							<Input type="password" />
						</div>
						<div className="space-y-2">
							<Label>New password</Label>
							<Input type="password" />
						</div>
					</div>
					<div className="flex justify-end">
						<Button size="sm">Update</Button>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="p-5 space-y-3">
					<p className="text-sm font-semibold">Two-factor authentication</p>
					<div className="flex items-center gap-3">
						<Switch />
						<span className="text-sm text-muted-foreground">Disabled</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
