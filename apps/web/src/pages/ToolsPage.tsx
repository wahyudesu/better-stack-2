import { useState } from "react";
import { Sparkles, FileText, UserCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

const tools = [
  { id: "script" as const, label: "Content Script", icon: FileText, description: "Generate a draft script" },
  { id: "branding" as const, label: "Brand Builder", icon: UserCheck, description: "Build your brand identity" },
];

type ToolId = (typeof tools)[number]["id"];

function generateScript(platform: string, topic: string, tone: string): string {
  const hooks: Record<string, string> = {
    casual: `Hey guys! So today let's talk about ${topic}...`,
    professional: `Today we'll dive into ${topic} and why it matters.`,
    funny: `POV: You finally decided to learn about ${topic} 😂`,
  };
  const hook = hooks[tone] || hooks.casual;
  return `[${platform.toUpperCase()} · ${tone.toUpperCase()}]\n\n${hook}\n\nKey points:\n1. Understand your audience\n2. Stay consistent\n3. Engage authentically\n\nCTA: Follow for more ${topic} tips!`;
}

function generateBranding(name: string, niche: string): string {
  return `Brand Blueprint for ${name}\n\nNiche: ${niche}\nBio: ${name} | ${niche} Creator\n\nContent Pillars:\n1. Educational content\n2. Behind the scenes\n3. Community engagement\n\nPosting: IG 4x/week · TikTok daily · Twitter 2x/day · YT 1x/week`;
}

function ScriptTool() {
  const [platform, setPlatform] = useState("instagram");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("casual");
  const [output, setOutput] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label>Platform</Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
              <SelectItem value="twitter">Twitter/X</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="funny">Funny</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Topic</Label>
          <Input placeholder="e.g. personal branding" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
      </div>
      <Button onClick={() => topic.trim() && setOutput(generateScript(platform, topic, tone))} disabled={!topic.trim()} size="sm" className="gap-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        Generate
      </Button>
      {output && (
        <pre className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{output}</pre>
      )}
    </div>
  );
}

function BrandingTool() {
  const [name, setName] = useState("");
  const [niche, setNiche] = useState("tech");
  const [output, setOutput] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name / Brand</Label>
          <Input placeholder="e.g. Acme Studio" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Niche</Label>
          <Select value={niche} onValueChange={setNiche}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={() => name.trim() && setOutput(generateBranding(name, niche))} disabled={!name.trim()} size="sm" className="gap-1.5">
        <Sparkles className="h-3.5 w-3.5" />
        Generate
      </Button>
      {output && (
        <pre className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{output}</pre>
      )}
    </div>
  );
}

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("script");

  return (
    <div className={pageContainerClassName} style={pageMaxWidth}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
        <p className="text-sm text-muted-foreground">Content creation & branding tools</p>
      </div>

      <div className="flex gap-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
              activeTool === tool.id
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-border"
            )}
          >
            <tool.icon className="h-4 w-4" />
            {tool.label}
          </button>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-5">
          {activeTool === "script" && <ScriptTool />}
          {activeTool === "branding" && <BrandingTool />}
        </CardContent>
      </Card>
    </div>
  );
}
