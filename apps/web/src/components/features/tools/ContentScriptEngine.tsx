"use client";

import {
	Bookmark,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast as sooner } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	contentPurposes,
	frameworks,
	generateSystemPrompt,
	personas,
	platforms,
	tones,
} from "@/lib/constants/tools";
import {
	type ContentScriptTemplate,
	getToolTemplateManager,
} from "@/lib/types/tool-template";
import { cn } from "@/lib/utils";

interface GeneratedOutput {
	id: string;
	prompt: string;
	variation: number;
}

export function ContentScriptEngine() {
	const [purpose, setPurpose] = useState("edukasi");
	const [platform, setPlatform] = useState("instagram");
	const [persona, setPersona] = useState("expert-mentor");
	const [framework, setFramework] = useState("pas");
	const [topic, setTopic] = useState("");
	const [format, setFormat] = useState("reels");
	const [tone, setTone] = useState("casual");
	const [quantity, setQuantity] = useState(1);
	const [outputs, setOutputs] = useState<GeneratedOutput[]>([]);
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [expandedOutputId, setExpandedOutputId] = useState<string | null>(null);

	// Template state
	const [_isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
	const [showAllTemplates, setShowAllTemplates] = useState(false);
	const templateManager = getToolTemplateManager();
	const visibleTemplates = showAllTemplates
		? templateManager.templates
		: templateManager.templates.slice(0, 3);
	const hasMoreTemplates = templateManager.templates.length > 3;

	const handleGenerate = () => {
		if (!topic.trim()) {
			sooner.error("Please enter a topic");
			return;
		}

		const newOutputs: GeneratedOutput[] = [];
		for (let i = 1; i <= quantity; i++) {
			const prompt = generateSystemPrompt(
				purpose,
				platform,
				persona,
				framework,
				topic,
				tone,
				i,
			);
			newOutputs.push({
				id: `${Date.now()}-${i}`,
				prompt,
				variation: i,
			});
		}
		setOutputs(newOutputs);
		// Auto-expand first output
		setExpandedOutputId(newOutputs[0]?.id || null);
	};

	const handleCopy = async (id: string, content: string) => {
		await navigator.clipboard.writeText(content);
		setCopiedId(id);
		sooner.success("System prompt copied!");
		setTimeout(() => setCopiedId(null), 2000);
	};

	const _toggleExpand = (id: string) => {
		setExpandedOutputId(expandedOutputId === id ? null : id);
	};

	// Template handlers
	const _getCurrentConfig = () => ({
		purpose,
		platform,
		persona,
		framework,
		tone,
		format,
		topic: topic || undefined,
	});

	const handleLoadTemplate = (template: ContentScriptTemplate) => {
		setPurpose(template.config.purpose);
		setPlatform(template.config.platform);
		setPersona(template.config.persona);
		setFramework(template.config.framework);
		setTone(template.config.tone);
		setFormat(template.config.format);
		if (template.config.topic) setTopic(template.config.topic);
		sooner.success(`Template "${template.name}" loaded!`);
	};

	return (
		<div className="space-y-6">
			{/* Template Bar - Top of Form */}
			<div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 border border-primary/20">
				<div className="flex items-center gap-2 mb-3">
					<Bookmark className="h-5 w-5 text-primary" />
					<div className="text-sm font-medium text-zinc-900 dark:text-white">
						Quick Templates
					</div>
					<span className="text-xs text-zinc-500 dark:text-zinc-400">
						({templateManager.templates.length} available)
					</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{visibleTemplates.map((template) => (
						<Button
							key={template.id}
							onClick={() => handleLoadTemplate(template)}
							variant={template.isPreset ? "default" : "outline"}
							size="sm"
							className={cn(
								"h-7 gap-1.5 text-xs",
								!template.isPreset && "bg-white dark:bg-zinc-800",
							)}
						>
							{template.isPreset && <Sparkles className="h-3 w-3" />}
							{template.name}
						</Button>
					))}
					{/* Read More / Show Less Button */}
					{hasMoreTemplates && (
						<Button
							onClick={() => setShowAllTemplates(!showAllTemplates)}
							variant="default"
							size="sm"
							className="h-7 gap-1.5 text-xs"
						>
							{showAllTemplates ? (
								<>
									<ChevronUp className="h-3 w-3" />
									Show Less
								</>
							) : (
								<>
									<ChevronDown className="h-3 w-3" />
									Read More ({templateManager.templates.length - 3})
								</>
							)}
						</Button>
					)}
					{/* Manage Templates Button */}
					<Button
						onClick={() => setIsTemplateDialogOpen(true)}
						variant="outline"
						size="sm"
						className="h-7 gap-1.5 text-xs border-dashed"
					>
						<span>+ Manage</span>
					</Button>
				</div>
			</div>

			{/* Section 1: Konteks & Platform */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
						1
					</div>
					<h3 className="font-semibold">Konteks & Platform</h3>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{/* Tujuan Utama */}
					<div className="space-y-2">
						<Label>Tujuan Utama</Label>
						<Select
							value={purpose}
							onValueChange={(val: unknown) =>
								setPurpose((val as string | null) ?? "edukasi")
							}
						>
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih tujuan" />
							</SelectTrigger>
							<SelectContent>
								{contentPurposes.map((p) => (
									<SelectItem key={p.value} value={p.value}>
										{p.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-[11px] text-muted-foreground">
							{contentPurposes.find((p) => p.value === purpose)?.description}
						</p>
					</div>

					{/* Role Pengguna */}
					<div className="space-y-2">
						<Label>Role Pengguna</Label>
						<Select
							value={persona}
							onValueChange={(val: unknown) =>
								setPersona((val as string | null) ?? "expert-mentor")
							}
						>
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih role" />
							</SelectTrigger>
							<SelectContent>
								{personas.map((p) => (
									<SelectItem key={p.value} value={p.value}>
										{p.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-[11px] text-muted-foreground">
							{personas.find((p) => p.value === persona)?.description}
						</p>
					</div>

					{/* Platform Target */}
					<div className="space-y-2">
						<Label>Platform Target</Label>
						<Select
							value={platform}
							onValueChange={(val: unknown) =>
								setPlatform((val as string | null) ?? "instagram")
							}
						>
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih platform" />
							</SelectTrigger>
							<SelectContent>
								{platforms.map((p) => (
									<SelectItem key={p.value} value={p.value}>
										{p.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-[11px] text-muted-foreground">
							{platforms.find((p) => p.value === platform)?.description}
						</p>
					</div>

					{/* Tone */}
					<div className="space-y-2">
						<Label>Tone</Label>
						<Select
							value={tone}
							onValueChange={(val: unknown) =>
								setTone((val as string | null) ?? "casual")
							}
						>
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih tone" />
							</SelectTrigger>
							<SelectContent>
								{tones.map((t) => (
									<SelectItem key={t.value} value={t.value}>
										{t.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<Separator />

			{/* Section 2: Spesifikasi Konten */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
						2
					</div>
					<h3 className="font-semibold">Spesifikasi Konten</h3>
				</div>
				<div className="grid gap-4 sm:grid-cols-3">
					{/* Topik */}
					<div className="space-y-2 sm:col-span-2">
						<Label>Topik / Keyword</Label>
						<Input
							placeholder="e.g. Tips produktivitas untuk freelancer"
							value={topic}
							onChange={(e) => setTopic(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
							className="font-medium"
						/>
					</div>

					{/* Format Konten */}
					<div className="space-y-2">
						<Label>Format Konten</Label>
						<Select
							value={format}
							onValueChange={(val: unknown) =>
								setFormat((val as string | null) ?? "single")
							}
						>
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih format" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="reels">🎬 Video/Reels</SelectItem>
								<SelectItem value="carousel">📱 Carousel</SelectItem>
								<SelectItem value="thread">🧵 Thread</SelectItem>
								<SelectItem value="story">📖 Story</SelectItem>
								<SelectItem value="post">📝 Post/Article</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<Separator />

			{/* Section 3: Strategi Copywriting */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
						3
					</div>
					<h3 className="font-semibold">Strategi Copywriting</h3>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{/* Framework */}
					<div className="space-y-2">
						<Label>Framework</Label>
						<Select
							value={framework}
							onValueChange={(val: unknown) =>
								setFramework((val as string | null) ?? "pas")
							}
						>
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih framework" />
							</SelectTrigger>
							<SelectContent>
								{frameworks.map((f) => (
									<SelectItem key={f.value} value={f.value}>
										{f.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-[11px] text-muted-foreground">
							{frameworks.find((f) => f.value === framework)?.description}
						</p>
					</div>

					{/* CTA Type */}
					<div className="space-y-2">
						<Label>Jenis CTA</Label>
						<Select defaultValue="save">
							<SelectTrigger className="w-full font-medium">
								<SelectValue placeholder="Pilih CTA" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="save">💾 Save this post</SelectItem>
								<SelectItem value="share">📤 Share to friend</SelectItem>
								<SelectItem value="follow">➕ Follow for more</SelectItem>
								<SelectItem value="comment">💬 Comment below</SelectItem>
								<SelectItem value="link">🔗 Link in bio</SelectItem>
								<SelectItem value="dm">📩 DM for info</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<Separator />

			{/* Section 4: Target Audience */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
						4
					</div>
					<h3 className="font-semibold">Target Audience</h3>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{/* Demografis */}
					<div className="space-y-2">
						<Label>Demografis</Label>
						<Input
							placeholder="e.g. Pria/Wanita 25-35 tahun, profesional"
							className="font-medium"
						/>
					</div>

					{/* Pain Points */}
					<div className="space-y-2">
						<Label>Pain Points / Masalah</Label>
						<Input
							placeholder="e.g. Kesulitan manajemen waktu, burnout"
							className="font-medium"
						/>
					</div>
				</div>
			</div>

			<Separator />

			{/* Section 5: Quantity & Generate */}
			<div className="space-y-4">
				<div className="flex items-center gap-2">
					<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
						5
					</div>
					<h3 className="font-semibold">Generate Variasi</h3>
				</div>
				<div className="flex flex-wrap items-center gap-4">
					<div className="space-y-2">
						<Label>Jumlah Variasi</Label>
						<ToggleGroup
							value={[String(quantity)]}
							onValueChange={(val) =>
								val && val.length > 0 && setQuantity(Number(val[0]))
							}
							className="gap-1"
						>
							<ToggleGroupItem
								value="1"
								className="px-4 py-2 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
							>
								1
							</ToggleGroupItem>
							<ToggleGroupItem
								value="2"
								className="px-4 py-2 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
							>
								2
							</ToggleGroupItem>
							<ToggleGroupItem
								value="3"
								className="px-4 py-2 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
							>
								3
							</ToggleGroupItem>
							<ToggleGroupItem
								value="5"
								className="px-4 py-2 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
							>
								5
							</ToggleGroupItem>
						</ToggleGroup>
						<p className="text-[11px] text-muted-foreground">
							{quantity === 1 ? "Single output" : `${quantity} variasi berbeda`}
						</p>
					</div>

					<Button
						onClick={handleGenerate}
						disabled={!topic.trim()}
						className="gap-2"
					>
						<Sparkles className="h-4 w-4" />
						Generate {quantity > 1 ? `${quantity} Variasi` : "System Prompt"}
					</Button>
				</div>
			</div>

			{/* Output Panel */}
			{outputs.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label className="text-sm font-medium">
							📋 Generated Output
							{outputs.length > 1 ? `s (${outputs.length})` : ""}
						</Label>
						<Button
							onClick={handleGenerate}
							variant="outline"
							size="sm"
							className="gap-1.5"
						>
							🔄 Regenerate
						</Button>
					</div>

					{/* Variation Cards */}
					<div className="space-y-3">
						{outputs.map((output) => (
							<Collapsible
								key={output.id}
								open={expandedOutputId === output.id}
								onOpenChange={(open) => {
									if (open) {
										setExpandedOutputId(output.id);
									} else {
										setExpandedOutputId(null);
									}
								}}
								className="rounded-lg border border/50 bg-muted/30 overflow-hidden"
							>
								<CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors data-[state=open]:bg-muted/50">
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											#{output.variation}
										</Badge>
										<span className="text-sm font-medium">
											{output.variation === 1
												? "Original Version"
												: `Variation ${output.variation}`}
										</span>
									</div>
									{expandedOutputId === output.id ? (
										<ChevronUp className="h-4 w-4 text-muted-foreground" />
									) : (
										<ChevronDown className="h-4 w-4 text-muted-foreground" />
									)}
								</CollapsibleTrigger>

								<CollapsibleContent className="px-4 pb-4">
									<div className="rounded-lg border border/50 bg-muted p-4">
										<pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
											{output.prompt}
										</pre>
									</div>
									<div className="mt-3 flex justify-end">
										<Button
											onClick={() => handleCopy(output.id, output.prompt)}
											variant="outline"
											size="sm"
											className="gap-1.5"
										>
											{copiedId === output.id ? (
												<>
													<Check className="h-3.5 w-3.5" />
													Copied!
												</>
											) : (
												<>
													<Copy className="h-3.5 w-3.5" />
													Copy
												</>
											)}
										</Button>
									</div>
								</CollapsibleContent>
							</Collapsible>
						))}
					</div>

					{/* Copy All Button */}
					{outputs.length > 1 && (
						<Button
							onClick={() => {
								const allContent = outputs
									.map(
										(o) =>
											`=== VARIATION ${o.variation} ===\n\n${o.prompt}\n\n`,
									)
									.join("\n");
								navigator.clipboard.writeText(allContent);
								sooner.success("All variations copied!");
							}}
							variant="outline"
							size="sm"
							className="w-full gap-1.5"
						>
							<Copy className="h-3.5 w-3.5" />
							Copy All Variations
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
