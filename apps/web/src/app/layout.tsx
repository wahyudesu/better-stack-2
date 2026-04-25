import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "../index.css";
import "./globals.css";
import BottomMenu from "@/components/bottom-menu";
import ClientClerkProvider from "@/components/clerk-provider";
import ConvexClientProvider from "@/components/convex-client-provider";
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
		<html lang="en" suppressHydrationWarning className={GeistSans.variable}>
			<body className="antialiased">
				<ClientClerkProvider>
					<ConvexClientProvider>
						<Providers>
							<div className="grid grid-rows-[auto_1fr] h-svh">
								<Header />
								{children}
							</div>
							<BottomMenu />
						</Providers>
					</ConvexClientProvider>
				</ClientClerkProvider>
			</body>
		</html>
	);
}
