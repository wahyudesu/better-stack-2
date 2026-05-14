"use client";

import { Logo } from "@/components/logo";

const footerLinks = {
  product: {
    title: "Product",
    links: [{ label: "Tools", href: "/tools" }],
  },
  tools: {
    title: "Tools",
    links: [
      { label: "Content Script Engine", href: "/tools/script-engine" },
      { label: "Personal Branding Builder", href: "/tools/branding" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Top section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 ">
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo className="h-8" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule and boost content, manage conversations, and track performance across social media in one simple place.
              </p>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-semibold mb-4">{footerLinks.company.title}</h4>
              <ul className="space-y-3">
                {footerLinks.company.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools links */}
            <div>
              <h4 className="font-semibold mb-4">{footerLinks.tools.title}</h4>
              <ul className="space-y-3">
                {footerLinks.tools.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 ZenPost. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for creators in Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}