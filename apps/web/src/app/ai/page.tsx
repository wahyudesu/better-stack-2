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
			{/*<div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400">
				<span className="font-medium">Beta:</span> AI features masih dalam
				pengembangan. Output bisa kurang akurat.
			</div>*/}
			<div className="mb-4 flex items-center justify-between">
				<h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
					<MessageSquareIcon className="h-6 w-6 text-primary" />
					AI Content Analysis
				</h1>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<button
							type="button"
							className="inline-flex items-center justify-center rounded-4xl gap-1 px-3 py-1.5 text-sm font-medium bg-transparent hover:bg-muted transition-colors"
						>
							MCP Setup
							<ChevronDownIcon className="h-4 w-4" />
						</button>
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
