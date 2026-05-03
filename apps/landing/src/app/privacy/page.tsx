import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ZenPost",
  description:
    "Read ZenPost's privacy policy. Learn how we collect, use, and protect your personal information when you use our social media management platform.",
  alternates: {
    canonical: "https://zenpost.in/privacy",
  },
  openGraph: {
    title: "ZenPost Privacy Policy",
    description:
      "How ZenPost handles your data and protects your privacy.",
    url: "https://zenpost.in/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-secondary-foreground/70">
                Last updated: April 15, 2025
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-8 md:p-12">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground mb-6">
                  ZenPost (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by ZenPost.
                </p>

                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">We collect information you provide directly to us, including:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (profile picture, bio, social media handles)</li>
                  <li>Content you create or share through the Service</li>
                  <li>Communications and correspondence you send to us</li>
                  <li>Payment information (processed securely by third-party payment providers)</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">3. Automatically Collected Information</h2>
                <p className="text-muted-foreground mb-6">
                  When you access or use our Service, we automatically collect certain information, including your IP address, device type, browser type, operating system, unique device identifiers, and information about how you interact with the Service.
                </p>

                <h2 className="text-2xl font-semibold mb-4">4. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
                  <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">5. Information Sharing</h2>
                <p className="text-muted-foreground mb-6">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy. We may share information with service providers who assist us in operating our Service, conducting our business, or serving our users.
                </p>

                <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                <p className="text-muted-foreground mb-6">
                  We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                <p className="text-muted-foreground mb-6">
                  Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your personal data. To exercise these rights, please contact us at privacy@betterstack2.com.
                </p>

                <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
                <p className="text-muted-foreground mb-6">
                  We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>

                <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
                <p className="text-muted-foreground mb-6">
                  Our Service may contain links to third-party websites or services that are not owned or controlled by ZenPost. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
                </p>

                <h2 className="text-2xl font-semibold mb-4">10. Children&apos;s Privacy</h2>
                <p className="text-muted-foreground mb-6">
                  Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>

                <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
                <p className="text-muted-foreground mb-6">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                </p>

                <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@betterstack2.com" className="text-primary hover:underline">
                    privacy@betterstack2.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
