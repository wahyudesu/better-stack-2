"use client";

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Security", href: "#security" },
    ],
  },
};

const socials = [
  { label: "Twitter", icon: "𝕏", href: "#" },
  { label: "Instagram", icon: "📷", href: "#" },
  { label: "LinkedIn", icon: "in", href: "#" },
  { label: "TikTok", icon: "♪", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Top section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B2</span>
                </div>
                <span className="font-bold text-lg">Better Stack 2</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Social media management dashboard untuk creator dan bisnis Indonesia.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <span className="text-sm">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-semibold mb-4">{footerLinks.product.title}</h4>
              <ul className="space-y-3">
                {footerLinks.product.links.map((link) => (
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

            {/* Legal links */}
            <div>
              <h4 className="font-semibold mb-4">{footerLinks.legal.title}</h4>
              <ul className="space-y-3">
                {footerLinks.legal.links.map((link) => (
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
              © 2025 Better Stack 2. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ untuk creator Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
