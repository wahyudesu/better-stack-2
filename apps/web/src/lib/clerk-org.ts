import { clerkClient } from "@clerk/nextjs/server";

/**
 * Get all members of an organization
 */
export async function getOrgMembers(orgId: string) {
	const clerk = await clerkClient();
	return clerk.organizations.getOrganizationMembershipList({
		organizationId: orgId,
	});
}

/**
 * Get organization details
 */
export async function getOrg(orgId: string) {
	const clerk = await clerkClient();
	return clerk.organizations.getOrganization({ organizationId: orgId });
}

/**
 * Create organization invitation
 */
export async function inviteOrgMember(
	orgId: string,
	email: string,
	role: "org:admin" | "org:member",
	inviterUserId: string,
) {
	const clerk = await clerkClient();
	return clerk.organizations.createOrganizationInvitation({
		organizationId: orgId,
		inviterUserId,
		emailAddress: email,
		role,
		redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accepted-invite`,
	});
}

/**
 * Remove organization membership
 */
export async function removeOrgMember(orgId: string, userId: string) {
	const clerk = await clerkClient();
	const memberships = await clerk.organizations.getOrganizationMembershipList({
		organizationId: orgId,
	});
	const membership = memberships.data.find(
		(m) => m.publicUserData?.userId === userId,
	);
	if (membership) {
		await (clerk.organizations.deleteOrganizationMembership as any)(
			membership.id,
		);
	}
}

/**
 * Get user's Zernio API key from Clerk publicMetadata
 */
export async function getZernioApiKey(userId: string): Promise<string | null> {
	const clerk = await clerkClient();
	const user = await clerk.users.getUser(userId);
	return (user.publicMetadata?.zernioApiKey as string) ?? null;
}

/**
 * Set Zernio API key on Clerk user publicMetadata
 */
export async function setZernioApiKey(userId: string, apiKey: string) {
	const clerk = await clerkClient();
	await clerk.users.updateUserMetadata(userId, {
		publicMetadata: { zernioApiKey: apiKey },
	});
}
