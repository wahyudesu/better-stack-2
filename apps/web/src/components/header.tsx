"use client";

import { OrgSwitcher } from "@/components/header/org-switcher";
import { StreakPopover } from "@/components/header/streak-popover";
import { UserMenu } from "@/components/header/user-menu";

export default function Header() {
	return (
		<header className="z-30 mx-auto flex w-full max-w-[1024px] items-center justify-between px-5 py-6">
			<OrgSwitcher />

			<div className="flex items-center gap-2">
				<StreakPopover />
				<UserMenu />
			</div>
		</header>
	);
}
