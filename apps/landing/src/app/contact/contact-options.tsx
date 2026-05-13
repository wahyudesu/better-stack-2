"use client";

import posthog from "posthog-js";
import { Mail, FileText, MessageCircle } from "lucide-react";

const contactOptions = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Docs",
    description: "Read it first, it's helpful.",
    href: "#",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Telegram",
    description: "Message the founder directly.",
    href: "#",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    description: "We read them all, we promise.",
    href: "mailto:hello@zenpost.id",
    color: "bg-green-500/10 text-green-500",
  },
];

export function ContactOptions() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {contactOptions.map((option) => (
        <a
          key={option.title}
          href={option.href}
          className="group bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-all hover:border-primary/30"
          onClick={() => posthog.capture("contact_option_clicked", { option: option.title.toLowerCase() })}
        >
          <div
            className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center mb-4`}
          >
            {option.icon}
          </div>
          <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
          <p className="text-sm text-muted-foreground">
            {option.description}
          </p>
        </a>
      ))}
    </div>
  );
}
