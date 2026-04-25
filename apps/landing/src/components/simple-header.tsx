"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { DepthButton } from "@/components/ui/depth-buttons";

const navLinks: { label: string; href: string }[] = [
  { label: "Features", href: "/#features" },
  { label: "Comparison", href: "/#comparison" },
  { label: "Blog", href: "/blog" },
];

export function SimpleHeader() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border/50 bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6 text-primary"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold text-foreground">ZenPost</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href as any}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <DepthButton
            variant="blue"
            className="h-9 px-5 text-sm"
            onClick={() => {
              const form = document.getElementById("waitlist-form");
              if (form) {
                form.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Get Early Access
          </DepthButton>
        </div>
      </nav>
    </header>
  );
}