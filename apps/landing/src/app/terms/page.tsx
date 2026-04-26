import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Terms of Service
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
            <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
              <div className="bg-card border border-border rounded-xl p-8 md:p-12">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground mb-6">
                  By accessing and using ZenPost (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Service.
                </p>

                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground mb-6">
                  ZenPost is a social media management dashboard that allows users to manage, schedule, and analyze social media content across multiple platforms. The Service includes various tools and features designed to help creators and businesses manage their social media presence.
                </p>

                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-6">
                  To access certain features of the Service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>

                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                <p className="text-muted-foreground mb-4">You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the intellectual property rights of others</li>
                  <li>Distribute malware or other harmful code</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Send spam or unsolicited communications</li>
                </ul>

                <h2 className="text-2xl font-semibold mb-4">5. Content Ownership</h2>
                <p className="text-muted-foreground mb-6">
                  You retain ownership of all content you create and publish through the Service. By using the Service, you grant us a non-exclusive, worldwide license to use, reproduce, and display your content for the purpose of providing the Service to you.
                </p>

                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground mb-6">
                  The Service and its original content, features, and functionality are owned by ZenPost and are protected by international copyright, trademark, and other intellectual property laws.
                </p>

                <h2 className="text-2xl font-semibold mb-4">7. Payment Terms</h2>
                <p className="text-muted-foreground mb-6">
                  Some features of the Service may require payment. By subscribing to a paid plan, you agree to pay all fees associated with your chosen subscription tier. All fees are non-refundable except as required by law.
                </p>

                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-muted-foreground mb-6">
                  ZenPost shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>

                <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground mb-6">
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. We will provide notice of any significant changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date.
                </p>

                <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms, please contact us at{" "}
                  <a href="mailto:legal@betterstack2.com" className="text-primary hover:underline">
                    legal@betterstack2.com
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
