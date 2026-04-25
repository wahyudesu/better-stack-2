import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function ToolsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}