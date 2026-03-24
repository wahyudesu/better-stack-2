import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ui } from "@clerk/ui";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import BottomMenu from "@/components/bottom-menu";
import { cn } from "@better-stack-2/ui/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

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
      <html lang="en" suppressHydrationWarning className={cn("font-sans", figtree.variable)}>
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
