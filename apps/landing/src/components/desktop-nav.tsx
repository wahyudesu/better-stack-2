import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { companyLinks, companyLinks2, productLinks, topNavLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";

export function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem className="bg-transparent">
					<NavigationMenuTrigger className="bg-transparent">
						Product
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<div className="rounded-lg grid w-lg grid-cols-2 gap-2 border bg-popover p-2 shadow">
							{productLinks.map((item, i) => (
								<a key={`item-${item.label}-${i}`} href={item.href}>
									<LinkItem {...item} />
								</a>
							))}
						</div>
						<div className="p-2">
							<p className="text-muted-foreground text-sm">
								Interested?{" "}
								<a
									className="font-medium text-foreground hover:underline"
									href="#"
								>
									Schedule a demo
								</a>
							</p>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				{topNavLinks.map((link) => (
					<a key={link.label} className="px-4 rounded-md p-2 hover:bg-accent" href={link.href}>
						{link.label}
					</a>
				))}
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent">
						Company
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
						<div className="grid w-lg grid-cols-2 gap-2">
							<div className="rounded-lg space-y-2 border bg-popover p-2 shadow">
								{companyLinks.map((item, i) => (
									<a key={`item-${item.label}-${i}`} href={item.href}>
										<LinkItem {...item} />
									</a>
								))}
							</div>
							<div className="space-y-2 p-3">
								{companyLinks2.map((item, i) => (
									<a
										className="flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
										href={item.href}
										key={`item-${item.label}-${i}`}
									>
										{item.icon}
										{item.label}
									</a>
								))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}