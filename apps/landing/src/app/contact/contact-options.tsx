"use client";

import posthog from "posthog-js";
import { Mail, Headphones, MessageCircle } from "lucide-react";

const contactOptions = [
  {
    icon: <Headphones className="w-5 h-5" />,
    title: "Support",
    description: "Need help, found a bug, or got feature ideas? Send us a message",
    color: "bg-blue-500/10 text-blue-500",
    action: "featurebase",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "WhatsApp",
    description: "Wanna chat directly with the team? We’re just one message away",
    href: "https://wa.me/6281234567890",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: "Email",
    description: "Got questions, random ideas, feedback, or just wanna say hi? Hit us up at wahyu@zenpost.in",
    href: "mailto:why@wahyuikbal.com",
    color: "bg-primary/10 text-primary",
  },
];

function ContactCard({ option }: { option: (typeof contactOptions)[number] }) {
  const handleClick = () => {
    posthog.capture("contact_option_clicked", { option: option.title.toLowerCase() });
    if (option.action === "featurebase") {
      console.log("Featurebase check:", {
        exists: typeof window.Featurebase,
        isFunc: typeof window.Featurebase === "function",
      });
      if (typeof window.Featurebase === "function") {
        window.Featurebase("show");
      } else {
        console.warn("Featurebase not loaded yet");
      }
    }
  };

  const content = (
    <>
      <div className={`w-16 h-12 rounded-3xl mx-auto bg-card border border-border flex items-center justify-center mb-3`}>
        {option.icon}
      </div>
      <h3 className="font-semibold mb-1">{option.title}</h3>
      <p className="text-xs text-muted-foreground">{option.description}</p>
    </>
  );

  if (option.href) {
    return (
      <a
        href={option.href}
        target={option.href.startsWith("http") ? "_blank" : undefined}
        rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="bg-muted cursor-pointer hover:bg-secondary group rounded-4xl p-5 transition-all text-center"
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className="bg-secondary cursor-pointer group rounded-4xl p-5 transition-all text-center w-full"
      onClick={handleClick}
    >
      {content}
    </button>
  );
}

export function ContactOptions() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {contactOptions.map((option) => (
        <ContactCard key={option.title} option={option} />
      ))}
    </div>
  );
}
