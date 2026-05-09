"use client";

import { useState, useEffect } from "react";

const terminalLines = [
  { type: "input", text: "betterstack agent --task 'Create engagement report for client X'" },
  { type: "output", text: "🤖 Agent initialized. Running task..." },
  { type: "output", text: "" },
  { type: "output", text: "📊 Fetching data from 12 platforms..." },
  { type: "output", text: "   ✓ Twitter (247 engagements)" },
  { type: "output", text: "   ✓ Instagram (1.2K engagements)" },
  { type: "output", text: "   ✓ LinkedIn (89 engagements)" },
  { type: "output", text: "   ✓ Facebook (456 engagements)" },
  { type: "output", text: "   ✓ TikTok (3.8K engagements)" },
  { type: "output", text: "   ..." },
  { type: "output", text: "" },
  { type: "output", text: "📈 Generating report..." },
  { type: "output", text: "" },
  { type: "output", text: "┌─────────────────────────────────────────┐" },
  { type: "output", text: "│  CLIENT X - ENGAGEMENT REPORT           │" },
  { type: "output", text: "│  Period: May 1-7, 2026                   │" },
  { type: "output", text: "├─────────────────────────────────────────┤" },
  { type: "output", text: "│  Total Engagements: 6,831               │" },
  { type: "output", text: "│  Growth: +18.3% ↑                       │" },
  { type: "output", text: "│  Best Platform: TikTok                  │" },
  { type: "output", text: "│  Top Post: Reel #47 (12.4K views)       │" },
  { type: "output", text: "└─────────────────────────────────────────┘" },
  { type: "output", text: "" },
  { type: "input", text: "betterstack agent --insight" },
  { type: "output", text: "💡 Best time to post: 7PM - 9PM local time" },
  { type: "output", text: "💡 Trending hashtags: #growth #marketing" },
  { type: "output", text: "" },
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
          betterstack-agent — bash
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-4 min-h-[400px] max-h-[500px] overflow-y-auto">
        <div className="space-y-1">
          {/* Prompt line */}
          <div className="flex items-center gap-2 text-[#58A6FF]">
            <span className="text-[#7EE787]">➜</span>
            <span className="text-[#FF7B72]">~</span>
            <span className="text-[#C9D1D9]"> betterstack agent --help</span>
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
          <span>12 platforms connected</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Type</span>
          <span className="text-[#58A6FF]">betterstack agent --help</span>
          <span>for commands</span>
        </div>
      </div>
    </div>
  );
}