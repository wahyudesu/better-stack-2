"use client";

import { useState } from "react";
import { Copy, Trash2, Send, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GeneratedPost, Tone } from "@/lib/types/ai-post";
import { platforms, tones } from "@/lib/constants/ai-post";

interface GeneratedPostCardProps {
  post: GeneratedPost;
  onPlan: (id: string) => void;
  onPost: (id: string) => void;
  onDelete: (id: string) => void;
}

const toneColors: Record<Tone, string> = {
  professional: "bg-blue-500",
  casual: "bg-green-500",
  inspirational: "bg-purple-500",
  educational: "bg-orange-500",
  friendly: "bg-pink-500",
  storytelling: "bg-indigo-500",
};

export function GeneratedPostCard({
  post,
  onPlan,
  onPost,
  onDelete,
}: GeneratedPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const platform = platforms.find((p) => p.id === post.platform);
  const tone = tones.find((t) => t.value === post.tone);

  const handleCopy = () => {
    const fullContent = `${post.content}\n\n${post.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlan = async () => {
    setIsPlanning(true);
    await onPlan(post.id);
    setIsPlanning(false);
  };

  const handlePost = async () => {
    setIsPosting(true);
    await onPost(post.id);
    setIsPosting(false);
  };

  const lines = post.content.split("\n");
  const contentPreview = lines.slice(0, 3).join("\n");
  const shouldTruncate = lines.length > 3;

  return (
    <Card className="border/50 overflow-hidden">
      {/* Header */}
      <div className="border-b border/50 px-4 py-3 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-base">{platform?.icon}</span>
          <span className="font-medium text-sm">{platform?.name}</span>
          {tone && (
            <>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary" className="text-xs gap-1">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    toneColors[tone.value],
                  )}
                />
                {tone.label}
              </Badge>
            </>
          )}
          <Badge variant="outline" className="text-xs">
            {post.content.length} / {platform?.maxChars}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(post.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        <pre
          className={cn(
            "whitespace-pre-wrap text-sm leading-relaxed font-sans",
            !expanded && "max-h-20 overflow-hidden",
          )}
        >
          {expanded ? post.content : contentPreview}
          {!expanded && shouldTruncate && (
            <span
              className="text-primary cursor-pointer hover:underline ml-1"
              onClick={() => setExpanded(true)}
            >
              [+ Show more]
            </span>
          )}
        </pre>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.hashtags.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="font-mono text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border/50 px-4 py-3 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlan}
            disabled={isPlanning}
            className="gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5" />
            {isPlanning ? "Planning..." : "Plan"}
          </Button>
          <Button
            size="sm"
            onClick={handlePost}
            disabled={isPosting}
            className="gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="text-muted-foreground"
        >
          {copied ? (
            <>
              <span className="text-green-500 mr-1">✓</span>
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
