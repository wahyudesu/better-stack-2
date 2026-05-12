"use client";

import { useState, useEffect } from "react";

const terminalLines = [
  { type: "input", text: "zenpost agent --task 'Plan Q2 ads campaign for Brand X'" },
  { type: "output", text: "🤖 Agent initialized. Running task..." },
  { type: "output", text: "" },
  { type: "output", text: "📁 Fetching assets from Google Drive..." },
  { type: "output", text: "   ✓ campaign-banners/ (12 files)" },
  { type: "output", text: "   ✓ product-shots/ (8 files)" },
  { type: "output", text: "   ✓ copy-guides/ (3 files)" },
  { type: "output", text: "" },
  { type: "output", text: "🎯 Planning ads campaign..." },
  { type: "output", text: "" },
  { type: "output", text: "┌─────────────────────────────────────────┐" },
  { type: "output", text: "│  Q2 CAMPAIGN — BRAND X                  │" },
  { type: "output", text: "│  Budget: $5,000/month                   │" },
  { type: "output", text: "├─────────────────────────────────────────┤" },
  { type: "output", text: "│  Meta Ads:     $2,000  (40%)            │" },
  { type: "output", text: "│  Google Ads:   $1,500  (30%)           │" },
  { type: "output", text: "│  TikTok Ads:   $1,500  (30%)           │" },
  { type: "output", text: "│  Target: 25-40, DTC shoppers            │" },
  { type: "output", text: "│  Duration: Apr 1 - Jun 30              │" },
  { type: "output", text: "└─────────────────────────────────────────┘" },
  { type: "output", text: "" },
  { type: "input", text: "zenpost agent --create-content --drive folderId123" },
  { type: "output", text: "📸 Generating content for Instagram & LinkedIn..." },
  { type: "output", text: "   ✓ Batched 8 images from Drive" },
  { type: "output", text: "   ✓ Resized for Instagram (1080x1080)" },
  { type: "output", text: "   ✓ Resized for LinkedIn (1200x627)" },
  { type: "output", text: "" },
  { type: "output", text: "   📤 Uploading to Instagram..." },
  { type: "output", text: "   ✓ Posted: carousel-1.jpg" },
  { type: "output", text: "   ✓ Posted: carousel-2.jpg" },
  { type: "output", text: "" },
  { type: "output", text: "   📤 Uploading to LinkedIn..." },
  { type: "output", text: "   ✓ Posted: brand-x-campaign.jpg" },
  { type: "output", text: "" },
  { type: "output", text: "✅ 5 posts scheduled across 2 platforms" },
];

export function AgentTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentInput, setCurrentInput] = useState(0);

  useEffect(() => {
    const totalLines = terminalLines.length;
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= totalLines) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const inputCount = terminalLines
      .slice(0, visibleLines)
      .filter((l) => l.type === "input").length;
    setCurrentInput(inputCount);
  }, [visibleLines]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-[#0D1117] font-mono text-sm">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
          <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
          <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 text-center text-xs text-[#8B949E]">
          zenpost-agent — bash
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
        <div className="space-y-1">
          {/* Prompt line */}
          <div className="flex items-center gap-2 text-[#58A6FF]">
            <span className="text-[#7EE787]">➜</span>
            <span className="text-[#FF7B72]">~</span>
            <span className="text-[#C9D1D9]"> zenpost agent --help</span>
          </div>
          <div className="text-[#8B949E] text-xs mb-4">
            AI Agent CLI — Automate your social media workflow
          </div>

          {/* Animated lines */}
          {terminalLines.slice(0, visibleLines).map((line, idx) => (
            <div key={idx} className="flex items-start gap-2">
              {line.type === "input" ? (
                <>
                  <span className="text-[#7EE787]">➜</span>
                  <span className="text-[#FF7B72]">~</span>
                  <span className="text-[#C9D1D9]">{line.text}</span>
                </>
              ) : (
                <div className="text-[#C9D1D9] whitespace-pre">{line.text}</div>
              )}
            </div>
          ))}

          {/* Cursor for current input */}
          {currentInput < terminalLines.filter((l) => l.type === "input").length && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[#7EE787]">➜</span>
              <span className="text-[#FF7B72]">~</span>
              <span className="inline-block h-4 w-2 bg-[#58A6FF] animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* Terminal footer */}
      <div className="border-t border-border/50 px-4 py-2 flex items-center justify-between text-xs text-[#8B949E]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
            Agent Active
          </span>
          <span>Google Drive connected</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Type</span>
          <span className="text-[#58A6FF]">zenpost agent --help</span>
          <span>for commands</span>
        </div>
      </div>
    </div>
  );
}
