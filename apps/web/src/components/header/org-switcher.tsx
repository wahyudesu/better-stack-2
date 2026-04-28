"use client";

import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { Skeleton } from "@zenpost/ui/components/skeleton";

export function OrgSwitcher() {
	const { isLoaded } = useOrganization();

	if (!isLoaded) {
		return <Skeleton className="h-9 w-[160px] rounded-md" />;
	}

	return (
		<OrganizationSwitcher
			afterSelectOrganizationUrl={`/?org=:slug`}
			afterCreateOrganizationUrl={`/?org=:slug`}
			afterLeaveOrganizationUrl="/"
		/>
	);
}
