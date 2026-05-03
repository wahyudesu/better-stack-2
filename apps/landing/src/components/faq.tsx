import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

const faqs = [
  {
    question: "What platforms does ZenPost support?",
    answer:
      "ZenPost supports 14+ social media platforms — including Instagram, Facebook, TikTok, YouTube, LinkedIn, Twitter/X, Pinterest, Reddit, Bluesky, Threads, and more — all in one dashboard.",
  },
  {
    question: "Is my social media account data safe with ZenPost?",
    answer:
      "Yes. We use industry-standard encryption and never store your actual social media credentials. Connections use secure OAuth.",
  },
  {
    question: "Can I use ZenPost with my team?",
    answer:
      "Yes! Multi-user features with role access let you invite team members with different roles — admin, editor, or viewer. Collaboration without the chaos.",
  },
  {
    question: "How does ZenPost pricing work?",
    answer:
      "We're currently in early access with special pricing. Join the waitlist now to get early access and the latest pricing info directly to your email.",
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
          <Button className="gap-4" variant="outline">
            Any questions? Reach out <PhoneCall className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);