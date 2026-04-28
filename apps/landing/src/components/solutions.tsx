"use client";

import { DepthTabs, DepthTabsList, DepthTabsTrigger, DepthTabsPanel } from "@/components/ui/depth-tabs";

const industries = [
  {
    id: "agencies",
    label: "Agencies",
    headline: "Run your agency operations with military precision",
    description: "Manage multiple client accounts, streamline approvals, and deliver results faster—all from one command center.",
    features: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Client Dashboard",
        description: "Give each client their own branded portal to track performance",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 8L20 12M20 12L16 16M20 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "White-label Reports",
        description: "Generate professional reports with your agency's branding",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Team Collaboration",
        description: "Assign tasks, approve content, and manage workflows seamlessly",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Smart Scheduling",
        description: "Auto-post at optimal times across all client platforms",
      },
    ],
  },
  {
    id: "brands",
    label: "Brands",
    headline: "Build brand consistency at scale",
    description: "Maintain your brand voice across every platform while automating repetitive tasks that eat up your day.",
    features: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Brand Guidelines",
        description: "Enforce consistent voice, tone, and visuals across all content",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L4 20M4 16L8 16M4 16L4 12C4 10.8954 4.89543 10 6 10H10M20 8V12M20 8L16 8M20 8L20 12C20 13.1046 19.1046 14 18 14H14M8 4H12M8 4L4 4M8 4L8 8M14 10H18C19.1046 10 20 10.8954 20 12V14M14 10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Content Library",
        description: "Store and organize approved brand assets for quick access",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 13C7 13 8.5 15 12 15C15.5 15 17 13 17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10C7 10 9 12 12 12C15 12 17 10 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="8" r="1" fill="currentColor"/>
            <circle cx="15" cy="8" r="1" fill="currentColor"/>
          </svg>
        ),
        title: "Social Listening",
        description: "Monitor brand mentions and respond in real-time",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3V21H21M9 9L21 3M9 9L12 12M9 9L12 6M21 3L12 12M21 3V12H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Performance Analytics",
        description: "Track engagement, reach, and conversions in one dashboard",
      },
    ],
  },
  {
    id: "multi-location",
    label: "Multi-Location",
    headline: "Manage hundreds of locations without breaking a sweat",
    description: "From local franchises to global chains—control your entire location network from one dashboard with location-specific insights.",
    features: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Location Groups",
        description: "Organize locations by region, territory, or franchise",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21M3 12L7 8M3 12L7 16M21 12L17 8M21 12L17 16M12 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Cross-Location Posting",
        description: "Push content to single locations or the entire network instantly",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Location Benchmarking",
        description: "Compare performance across locations and identify top performers",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C23 17.5 22.5 16 21.5 15M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15ZM16 7C16 8.65685 14.6569 10 13 10C11.3431 10 10 8.65685 10 7C10 5.34315 11.3431 4 13 4C14.6569 4 16 5.34315 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Local Manager Access",
        description: "Give location managers controlled access to their own accounts",
      },
    ],
  },
  {
    id: "professional-services",
    label: "Professional Services",
    headline: "Attract clients with a powerful social presence",
    description: "Accountants, lawyers, consultants—establish thought leadership and generate leads through consistent, professional social media.",
    features: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Content Templates",
        description: "Pre-built templates for industry-specific content and compliance",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Lead Generation",
        description: "Turn social followers into qualified business leads",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C23 17.5 22.5 16 21.5 15M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Client Education",
        description: "Share insights that position you as the go-to expert",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 8L12 12M12 12L8 16M12 12L16 16M12 12L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Review Management",
        description: "Monitor and respond to client reviews across platforms",
      },
    ],
  },
  {
    id: "software-it",
    label: "Software & IT",
    headline: "Connect your product to your audience",
    description: "B2B tech companies use ZenPost to build developer communities, launch products, and drive adoption through strategic social presence.",
    features: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Developer Community",
        description: "Build relationships with developers through technical content",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Product Launches",
        description: "Coordinate launch campaigns across all channels simultaneously",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8H19C20.1046 8 21 8.89543 21 10V11M6 8H5C3.89543 8 3 8.89543 3 10V11M6 8L6 16M18 8L18 16M6 16H18M14 4H10C8.89543 4 8 4.89543 8 6V7M16 14H12C10.8954 14 10 14.8954 10 16V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "API Documentation Updates",
        description: "Sync changelogs and docs with social announcements instantly",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.24 12.24C19.12 11.56 17.76 11.18 16.38 11.08L15 11C13.65 10.93 12.5 12 12.42 13.35L12.34 15C12.24 16.38 11.86 17.74 11.18 18.86L9 21L6 18L8.14 15.82C9.26 15.14 10.62 14.76 12 14.68L13.35 14.6C14.7 14.53 15.77 15.38 15.85 16.73L15.93 18.06C16.03 19.44 16.41 20.8 17.09 21.92L20.24 12.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Technical Support",
        description: "Monitor issues and engage with users experiencing problems",
      },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    headline: "Enterprise-grade social media, without the chaos",
    description: "Built for large organizations with complex approval workflows, compliance needs, and demanding scale requirements.",
    features: [
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 21V19C3 16.7909 4.79086 15 7 15H11M17 21C17 18.7909 15.2091 17 13 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Role-Based Access",
        description: "Granular permissions for admins, managers, and content creators",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Compliance Ready",
        description: "SOC 2 compliant with audit logs and data retention policies",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C23 17.5 22.5 16 21.5 15M15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12C13.6569 12 15 13.3431 15 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Dedicated Support",
        description: "24/7 priority support with dedicated account manager",
      },
      {
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14L10 17L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
        title: "Custom Integrations",
        description: "Connect with your existing CRM, marketing stack, and data warehouse",
      },
    ],
  },
];

export function Solutions() {
  return (
    <section className="py-24 overflow-hidden" id="solutions">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-5xl mx-auto mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Empowering every marketer from agencies to freelancers
            </h2>
            <p className="text-muted-foreground text-lg">
              Whether you manage one brand or hundreds of clients, ZenPost scales with your ambition.
            </p>
          </div>

          {/* Tabs */}
          <DepthTabs defaultValue="agencies" className="w-full">
            <div className="flex justify-center mb-12">
              <DepthTabsList variant="outline" className="bg-background">
                {industries.map((industry) => (
                  <DepthTabsTrigger
                    key={industry.id}
                    value={industry.id}
                    size="lg"
                  >
                    {industry.label}
                  </DepthTabsTrigger>
                ))}
              </DepthTabsList>
            </div>

            {industries.map((industry) => (
              <DepthTabsPanel key={industry.id} value={industry.id}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Content */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl sm:text-3xl font-bold">
                        {industry.headline}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {industry.description}
                      </p>
                    </div>

                    {/* Feature list */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      {industry.features.map((feature, index) => (
                        <div
                          key={index}
                          className="group flex gap-4 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:border-primary/20 transition-all duration-200"
                        >
                          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {feature.icon}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-sm">
                              {feature.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Visual */}
                  <div className="relative">
                    <div className="absolute inset-0 -z-10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-full blur-3xl" />
                    </div>
                    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-2xl shadow-primary/5">
                      {/* Mock dashboard preview */}
                      <div className="space-y-4">
                        {/* Header bar */}
                        <div className="flex items-center gap-3 pb-4 border-b border-border">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div className="flex-1 h-7 bg-muted rounded-md flex items-center px-3">
                            <span className="text-xs text-muted-foreground">
                              app.zenpost.io/dashboard
                            </span>
                          </div>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Posts", value: "142", change: "+12%" },
                            { label: "Reach", value: "24.5K", change: "+8%" },
                            { label: "Engage", value: "3.2K", change: "+15%" },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="bg-muted/50 rounded-lg p-3 space-y-1"
                            >
                              <span className="text-xs text-muted-foreground">
                                {stat.label}
                              </span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-lg font-bold">
                                  {stat.value}
                                </span>
                                <span className="text-xs text-green-500">
                                  {stat.change}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Chart */}
                        <div className="bg-muted/30 rounded-lg p-4 h-32 flex items-end justify-center gap-1">
                          {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95, 85, 100].map(
                            (height, i) => (
                              <div
                                key={i}
                                className="w-5 bg-gradient-to-t from-primary to-accent rounded-t transition-all duration-300"
                                style={{ height: `${height}%` }}
                              />
                            )
                          )}
                        </div>

                        {/* Platform badges */}
                        <div className="flex gap-2 flex-wrap">
                          {[
                            "Twitter",
                            "Instagram",
                            "LinkedIn",
                            "TikTok",
                            "Facebook",
                          ].map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DepthTabsPanel>
            ))}
          </DepthTabs>
        </div>
      </div>
    </section>
  );
}
