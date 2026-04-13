import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@/components/clerk-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Better Stack 2 - Coming Soon",
  description: "Social media management dashboard yang powerful. Join waitlist untuk early access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={GeistSans.variable}>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}