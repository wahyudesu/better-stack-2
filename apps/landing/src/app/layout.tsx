import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@/components/clerk-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const baseUrl = "https://zenpost.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ZenPost - All-in-One Social Media Management for Indonesia",
    template: "%s | ZenPost",
  },
  description:
    "ZenPost adalah platform manajemen社交媒体yangcentralized analytics, scheduler, inbox, dan ads—dalam satu dashboard. Dirancang untuk agency dan bisnis di Indonesia.",
  keywords: [
    "social media management",
    "社交媒体管理",
    "analytics instagram",
    "scheduler sosial media",
    "管理社交媒体",
    "instagram analytics",
    "multi-platform social media",
    "zenpost",
  ],
  authors: [{ name: "ZenPost", url: baseUrl }],
  creator: "ZenPost",
  publisher: "ZenPost",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: baseUrl,
    siteName: "ZenPost",
    title: "ZenPost - All-in-One Social Media Management for Indonesia",
    description:
      "Analytics, scheduler, inbox, dan ads—sekaligus dalam satu dashboard. Dirancang untuk agency dan bisnis di Indonesia.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZenPost - Social Media Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZenPost - All-in-One Social Media Management for Indonesia",
    description:
      "Analytics, scheduler, inbox, dan ads—sekaligus dalam satu dashboard. Dirancang untuk agency dan bisnis di Indonesia.",
    images: ["/og-image.png"],
    creator: "@zenpost",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
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
      <html lang="id" suppressHydrationWarning className={GeistSans.variable}>
        <head>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="preconnect" href="https://picsum.photos" />
          <link rel="dns-prefetch" href="https://picsum.photos" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "ZenPost",
                applicationCategory: "BusinessApplication",
                description:
                  "All-in-One Social Media Management platform for Indonesia",
                url: baseUrl,
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "IDR",
                  availability: "https://schema.org/PreOrder",
                },
              }),
            }}
          />
        </head>
        <body className="antialiased">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}