"use client";

import { FileText, UserCheck } from "lucide-react";
import { useState } from "react";
import { ContentScriptEngine } from "@/components/features/tools/ContentScriptEngine";
import { PersonalBrandingBuilder } from "@/components/features/tools/PersonalBrandingBuilder";
import { Card, CardContent } from "@/components/ui/card";
import { pageContainerClassName, pageMaxWidth } from "@/lib/layout";
import { cn } from "@/lib/utils";

const tools = [
	{
		id: "script-engine" as const,
		label: "Content Script Engine",
		icon: FileText,
		description: "Generate AI system prompts for content creation",
	},
	{
		id: "branding" as const,
		label: "Personal Branding Builder",
		icon: UserCheck,
		description: "Build your personal brand identity",
	},
];

type ToolId = (typeof tools)[number]["id"];

export default function ToolsPage() {
	const [activeTool, setActiveTool] = useState<ToolId>("script-engine");

	return (
		<div className={pageContainerClassName} style={pageMaxWidth}>
			<div className="mb-6">
				<h1 className="text-2xl font-bold tracking-tight">Tools</h1>
				<p className="text-sm text-muted-foreground">
					Content creation & branding tools
				</p>
			</div>

			{/* Tool Tabs */}
			<div className="flex gap-2 mb-6">
				{tools.map((tool) => (
					<button
						type="button"
						key={tool.id}
						onClick={() => setActiveTool(tool.id)}
						className={cn(
							"flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all",
							activeTool === tool.id
								? "border-primary bg-primary/5 text-primary font-medium"
								: "border text-muted-foreground hover:text-foreground",
						)}
					>
						<tool.icon className="h-4 w-4" />
						{tool.label}
					</button>
				))}
			</div>

			{/* Tool Content */}
			<Card className="border">
				<CardContent className="p-6">
					{activeTool === "script-engine" && <ContentScriptEngine />}
					{activeTool === "branding" && <PersonalBrandingBuilder />}
				</CardContent>
			</Card>
		</div>
	);
}
