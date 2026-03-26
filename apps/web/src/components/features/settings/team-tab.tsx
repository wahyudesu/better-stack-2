/**
 * Team Settings Tab Component.
 */

import { Button } from "@/components/ui/button";
import { teamMembers } from "@/data/mock";
import { TeamMemberCard } from "@/components/ui/TeamMemberCard";

export function TeamTab() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div />
				<Button size="sm">Invite</Button>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				{teamMembers.map((m) => (
					<TeamMemberCard
						key={m.id}
						id={m.id}
						name={m.name}
						role={m.role}
						email={m.email}
						avatar={m.avatar}
						online={m.online}
						tasksCompleted={m.tasksCompleted}
					/>
				))}
			</div>
		</div>
	);
}
