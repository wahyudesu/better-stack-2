import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "../index.css";
import { cn } from "@better-stack-2/ui/lib/utils";
import BottomMenu from "@/components/bottom-menu";
import Header from "@/components/header";
import Providers from "@/components/providers";

export const metadata: Metadata = {
	title: "better-stack-2",
	description: "better-stack-2",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider ui={ui}>
			<html lang="en" suppressHydrationWarning className={GeistSans.variable}>
				<body className="antialiased">
					<Providers>
						<div className="grid grid-rows-[auto_1fr] h-svh">
							<Header />
							{children}
						</div>
						<BottomMenu />
					</Providers>
				</body>
			</html>
		</ClerkProvider>
	);
}
