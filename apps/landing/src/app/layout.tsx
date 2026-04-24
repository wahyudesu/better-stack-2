import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@/components/clerk-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZenPost - Coming Soon",
  description: "Social media management dashboard yang powerful. Join waitlist untuk early access.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
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
          <link rel="preconnect" href="https://picsum.photos" />
          <link rel="dns-prefetch" href="https://picsum.photos" />
        </head>
        <body className="antialiased">{children}<Toaster /></body>
      </html>
    </ClerkProvider>
  );
}