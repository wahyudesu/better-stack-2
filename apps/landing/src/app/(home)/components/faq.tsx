"use client";

import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

const faqs = [
  {
    question: "Can Zenpost handle thousands of client accounts?",
    answer:
      "Yes. Scales to unlimited accounts, no changes needed.",
  },
  {
    question: "Can AI agents use Zenpost to post on social media?",
    answer:
      "Yes. Zenpost ships an MCP server with 280+ tools. Connect it to Claude Desktop, Cursor, or any MCP-compatible client and your agent can post, schedule, read analytics, and manage DMs via natural language.",
  },
  {
    question: "Which social media platforms does Zenpost support?",
    answer:
      "15 platforms: Instagram, TikTok, X/Twitter, Facebook, LinkedIn, YouTube, WhatsApp, Threads, Pinterest, Reddit, Bluesky, Telegram, Google Business, Snapchat, and Discord. With Ads API support for 7 platforms.",
  },
  {
    question: "Will posting through Zenpost get my accounts banned or reduce reach?",
    answer:
      "No. We only use official platform APIs, so your posts are treated exactly like native posts.",
  },
];

export const FAQ = () => (
  <div className="w-full py-20 lg:py-32">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge variant="outline">FAQ</Badge>
          <div className="flex gap-2 flex-col">
            <h4 className="text-2xl md:text-5xl font-bold tracking-tight max-w-xl text-center">
              Got questions?
            </h4>
            <p className="text-lg leading-relaxed text-muted-foreground max-w-xl text-center">
              Find answers to common questions about ZenPost below.
              Still have questions? Reach out anytime.
            </p>
          </div>
        </div>

        <div className="max-w-3xl w-full mx-auto">
          <Accordion defaultValue={["faq-0"]} className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={"faq-" + index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="flex justify-center">
          <Button className="gap-4" variant="outline" onClick={() => window.Featurebase?.("showNewMessage")}>
            Any questions? Reach out <PhoneCall className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);
