"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { navLinks } from "@/components/nav-links";

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-full md:border md:transition-all md:ease-out",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
					{
						"md:px-2": scrolled,
					}
				)}
			>
				<a
					className="rounded-full p-2 hover:bg-muted dark:hover:bg-muted/50"
					href="#"
				>
					<Logo className="h-4" />
				</a>
				<div className="hidden items-center gap-6 md:flex">
					{navLinks.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-sm font-medium text-muted-foreground hover:text-foreground"
						>
							{link.label}
						</a>
					))}
				</div>
				<div className="hidden items-center gap-2 md:flex">
					<Button size="sm" variant="ghost">
						Login
					</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
