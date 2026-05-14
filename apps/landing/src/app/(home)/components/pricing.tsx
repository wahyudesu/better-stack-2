"use client";

import posthog from "posthog-js";
import { Check, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individuals getting started.",
    features: [
      "2 social accounts",
      "1 team member",
      "Unlimited posts",
      "Publishing + analytics + comments + DMs",
    ],
    cta: "Contact Us",
    ctaHref: "/contact",
    highlighted: false,
  },
  {
    name: "Creator",
    price: "Rp249k",
    period: "/mo",
    description: "For creators and small brands who need more power.",
    features: [
      "5 social accounts",
      "2 team members",
      "Unlimited posts",
      "Publishing + analytics + comments + DMs + ads",
      "AI content tools",
    ],
    cta: "Contact Us",
    ctaHref: "/contact",
    highlighted: false,
  },
  {
    name: "Team",
    price: "Rp999k",
    period: "/mo",
    description: "Built for growing teams and collaborative workflows.",
    features: [
      "15 social accounts",
      "10 team members",
      "Unlimited posts",
      "Publishing + analytics + comments + DMs + ads",
      "Team collaboration",
      "Approval workflow",
      "AI workspace tools",
    ],
    cta: "Contact Us",
    ctaHref: "/contact",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "Custom",
    period: "",
    description: "Built for agencies and larger marketing teams.",
    features: [
      "100+ social accounts",
      "Unlimited team members",
      "White-label support",
      "Client workspace management",
      "Approval workflow",
      "Priority support",
      "Advanced automation & API access",
    ],
    cta: "Contact Us",
    ctaHref: "/contact",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28" id="pricing">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            No hidden fees. Cancel anytime. All plans include unlimited updates.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map(
            ({
              name,
              price,
              period,
              description,
              features,
              cta,
              ctaHref,
              highlighted,
            }) => (
              <Card
                key={name}
                className={
                  highlighted
                    ? "relative overflow-hidden p-2 bg-primary text-primary-foreground ring-1 ring-primary"
                    : "border-border ring-0 border p-2"
                }
              >
                {highlighted && (
                  <div className="absolute inset-0 -z-10 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,currentColor,transparent_60%)]" />
                  </div>
                )}

                <CardHeader className="m-0 w-full p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={
                        highlighted ? "text-primary-foreground" : "text-foreground"
                      }
                    >
                      {name}
                    </CardTitle>
                    {highlighted && (
                      <span className="rounded-full bg-primary-foreground/10 px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Popular
                      </span>
                    )}
                  </div>

                  <CardDescription
                    className={
                      highlighted
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    {description}
                  </CardDescription>

                  <div
                    className={`mt-4 flex items-baseline gap-1 ${
                      highlighted ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    <span className="text-4xl font-bold tracking-tight">{price}</span>
                    {period && (
                      <span
                        className={`text-sm font-medium ${
                          highlighted
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {period}
                      </span>
                    )}
                  </div>

                  <Button
                    render={
                      <a
                        href={ctaHref}
                        className="mt-4 flex w-full items-center justify-center gap-2"
                        onClick={() => posthog.capture("pricing_plan_contact_clicked", { plan: name, price })}
                      />
                    }
                    variant={highlighted ? "secondary" : "outline"}
                    size="sm"
                  >
                    {cta}
                  </Button>
                </CardHeader>

                <CardContent
                  className={`border-t p-4 ${
                    highlighted
                      ? ""
                      : ""
                  }`}
                >
                  <ul className="flex flex-col gap-3">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className={`flex items-start gap-3 text-sm ${
                          highlighted
                            ? "text-primary-foreground/90"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Check
                          className={`mt-0.5 size-4 shrink-0 ${
                            highlighted
                              ? "text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
