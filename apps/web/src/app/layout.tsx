import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import "../index.css";
import "./globals.css";
import BottomMenu from "@/components/bottom-menu";
import Header from "@/components/header";
import Providers from "@/components/providers";
import ClientClerkProvider from "@/components/clerk-provider";

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
					<Providers>
						<div className="grid grid-rows-[auto_1fr] h-svh">
							<Header />
							{children}
						</div>
						<BottomMenu />
					</Providers>
				</ClientClerkProvider>
			</body>
		</html>
	);
}