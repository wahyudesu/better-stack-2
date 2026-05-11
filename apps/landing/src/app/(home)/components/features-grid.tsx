"use client";

import {
  FaChartLine,
  FaInbox,
  FaCalendar,
  FaWandMagic,
  FaImages,
  FaUsers,
  FaGlobe,
  FaClock,
  FaFileInvoice,
  FaBriefcase,
  FaLayerGroup,
  FaRocket,
  FaCircleUser,
  FaRotate,
  FaBolt,
} from "react-icons/fa6";

const features = [
  {
    icon: <FaChartLine />,
    title: "Performance Analytics",
    description: "Track engagement, reach, and conversions across all your platforms in real-time.",
  },
  {
    icon: <FaInbox />,
    title: "Brand Inbox",
    description: "All DMs, comments, and mentions from 14+ platforms — in one inbox. Nothing slips through.",
  },
  {
    icon: <FaCalendar />,
    title: "Multi-Channel Publishing",
    description: "Schedule and publish to 14+ platforms from one calendar. No more tab-switching.",
  },
  {
    icon: <FaWandMagic />,
    title: "AI Analytics Assistant",
    description: "Ask your data anything. Get answers on what's driving growth — not more charts.",
  },
  {
    icon: <FaImages />,
    title: "Media Library",
    description: "Store and organize all your brand assets — images, videos, GIFs. Access anytime.",
  },
  {
    icon: <FaUsers />,
    title: "Team Collaboration",
    description: "Invite team members and multi role support.",
  },
  {
    icon: <FaGlobe />,
    title: "Multi-Platform Support",
    description: "Connect Twitter, Instagram, Facebook, LinkedIn, TikTok, YouTube, and 8+ more.",
  },
  {
    icon: <FaClock />,
    title: "Best Time to Post",
    description: "AI analyzes your audience's active hours and auto-posts at the optimal moment.",
  },
  {
    icon: <FaFileInvoice />,
    title: "White-label Reports",
    description: "Generate professional reports with your branding. Download as PDF or share via link.",
  },
  {
    icon: <FaBriefcase />,
    title: "Multi-Brand Support",
    description: "Manage multiple brands from one dashboard. Perfect for agencies handling many clients.",
  },
  {
    icon: <FaLayerGroup />,
    title: "Sentiment Analysis",
    description: "Spot negative feedback early — before it becomes a public complaint.",
  },
  {
    icon: <FaRocket />,
    title: "Ads Campaign Boosting",
    description: "Amplify your best-performing posts with paid boost — directly from the dashboard.",
  },
  {
    icon: <FaCircleUser />,
    title: "Social CRM",
    description: "Track your most engaged customers across platforms. Build relationships, not just followers.",
  },
  {
    icon: <FaRotate />,
    title: "24/7 Automation",
    description: "Set it and forget it. Auto-post, auto-reply, and auto-schedule — running while you sleep.",
  },
  {
    icon: <FaBolt />,
    title: "Boost Organic Posts",
    description: "Promote any scheduled or published Social Media post as an ad with one API call.",
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-secondary/30" id="features">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4 tracking-tight">
              Everything you need to dominate social media
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From scheduling to analytics — all the tools to plan, publish, engage, and grow across 14+ platforms.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-none">
                  {feature.description}
                </p>

                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
