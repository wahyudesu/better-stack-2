"use client";

import {
	CheckIcon,
	ChevronDownIcon,
	CopyIcon,
	MessageSquareIcon,
} from "lucide-react";
import { Suspense, useState } from "react";
import { AIChat } from "@/components/ai-elements/chat";
import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";

const REFERENCE_PROMPTS = [
	"Analisis winning konten di platform Instagram",
	"Buatkan strategi content calendar untuk TikTok",
	" Tips meningkatkan engagement rate di LinkedIn",
] as const;

export default function AIChatPage() {
	const [copiedMcp, setCopiedMcp] = useState(false);
	const [inputValue, setInputValue] = useState("");

	const handleCopyMcp = async () => {
		const mcpCommand = "npx @anthropic-ai/mcp-server-anthropic";
		await navigator.clipboard.writeText(mcpCommand);
		setCopiedMcp(true);
		setTimeout(() => setCopiedMcp(false), 2000);
	};

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="mb-4 flex items-center justify-between">
				<h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
					<MessageSquareIcon className="h-6 w-6 text-primary" />
					AI Content Analysis
				</h1>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" size="sm" className="gap-1">
							MCP Setup
							<ChevronDownIcon className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={handleCopyMcp} className="gap-2">
							{copiedMcp ? (
								<CheckIcon className="h-4 w-4 text-green-500" />
							) : (
								<CopyIcon className="h-4 w-4" />
							)}
							{copiedMcp ? "Copied!" : "Copy MCP Command"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="mb-3 flex flex-wrap gap-2">
				{REFERENCE_PROMPTS.map((prompt) => (
					<Button
						key={prompt}
						variant="outline"
						size="sm"
						className="text-muted-foreground"
						onClick={() => setInputValue(prompt)}
					>
						{prompt}
					</Button>
				))}
			</div>
			<div className="h-[calc(100vh-280px)] min-h-[500px]">
				<Suspense
					fallback={
						<div className="animate-pulse h-full bg-muted rounded-lg" />
					}
				>
					<PromptInputProvider initialInput={inputValue}>
						<AIChat inputValue={inputValue} onInputChange={setInputValue} />
					</PromptInputProvider>
				</Suspense>
			</div>
		</div>
	);
}
