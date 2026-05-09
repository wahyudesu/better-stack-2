"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast as sooner } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { BrandingInput } from "@/lib/branding";
import { nicheOptions, toneOptions } from "@/lib/branding";
import { generateBrandVoiceAI, emptyBrandingState } from "@/lib/brand-voice";

const emptyState: BrandingInput = emptyBrandingState;

export default function BrandingPage() {
	const [input, setInput] = useState<BrandingInput>(emptyState);
	const [output, setOutput] = useState("");
	const [copied, setCopied] = useState(false);

	const updateField = (field: keyof BrandingInput, value: string) => {
		setInput((prev) => ({ ...prev, [field]: value }));
	};

	const handleGenerate = () => {
		if (!input.nama.trim()) {
			sooner.error("Nama wajib diisi!");
			return;
		}
		if (!input.niche) {
			sooner.error("Pilih niche dulu!");
			return;
		}
		if (!input.toneOfVoice) {
			sooner.error("Pilih tone of voice dulu!");
			return;
		}

		const generated = generateBrandVoiceAI(input);
		setOutput(generated);
	};

	const handleCopy = async () => {
		await navigator.clipboard.writeText(output);
		setCopied(true);
		sooner.success("System prompt copied!");
		setTimeout(() => setCopied(false), 2000);
	};

	const filledFields = Object.values(input).filter((v) => v.trim()).length;
	const totalFields = Object.keys(input).length;
	const progress = Math.round((filledFields / totalFields) * 100);

	return (
		<div className="mx-auto max-w-5xl px-4 py-16 w-full">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					Personal Branding Builder
				</h1>
				<p className="mt-2 text-muted-foreground">
					Build personal brand identity kamu
				</p>
			</div>

			<div className="space-y-5">
				{/* Progress indicator */}
				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<span>
						Progress: {filledFields}/{totalFields} fields filled
					</span>
					<span>{progress}%</span>
				</div>
				<div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
					<div
						className="h-full bg-primary transition-all duration-500"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Section 1: Identitas Dasar */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
							1
						</div>
						<h3 className="font-semibold">Identitas Dasar</h3>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor="nama">Nama *</Label>
							<Input
								id="nama"
								placeholder="e.g. John Doe"
								value={input.nama}
								onChange={(e) => updateField("nama", e.target.value)}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor="halYangSuka">Hal yang Aku Suka</Label>
							<Textarea
								id="halYangSuka"
								placeholder="Apa yang membuatmu excited? Apa passionmu?"
								value={input.halYangSuka}
								onChange={(e) => updateField("halYangSuka", e.target.value)}
								rows={3}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor="halYangBisa">Hal yang Aku Bisa</Label>
							<Textarea
								id="halYangBisa"
								placeholder="Skill, keahlian, pengalaman, atau apa yang kamu kuasai?"
								value={input.halYangBisa}
								onChange={(e) => updateField("halYangBisa", e.target.value)}
								rows={3}
								className="font-medium"
							/>
						</div>
					</div>
				</div>

				<Separator />

				{/* Section 2: Analisis Pasar */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
							2
						</div>
						<h3 className="font-semibold">Analisis Pasar</h3>
					</div>
					<div className="grid gap-4 sm:grid-cols-3">
						<div className="space-y-2">
							<Label htmlFor="niche">Niche *</Label>
							<Select
								value={input.niche}
								onValueChange={(v) => {
									if (v && typeof v === "string") updateField("niche", v);
								}}
							>
								<SelectTrigger id="niche" className="font-medium">
									<SelectValue placeholder="Pilih niche" />
								</SelectTrigger>
								<SelectContent>
									{nicheOptions.map((n) => (
										<SelectItem key={n.value} value={n.value}>
											{n.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{input.niche && (
								<p className="text-[11px] text-muted-foreground">
									{nicheOptions.find((n) => n.value === input.niche)?.description}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="kategori">Kategori</Label>
							<Input
								id="kategori"
								placeholder="e.g. Web Development"
								value={input.kategori}
								onChange={(e) => updateField("kategori", e.target.value)}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="microNiche">Micro-niche</Label>
							<Input
								id="microNiche"
								placeholder="e.g. React for Beginners"
								value={input.microNiche}
								onChange={(e) => updateField("microNiche", e.target.value)}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2 sm:col-span-3">
							<Label htmlFor="kenapaDibutuhkan">Kenapa Dibutuhkan</Label>
							<Textarea
								id="kenapaDibutuhkan"
								placeholder="Kenapa niche ini penting? Masalah apa yang kamu solve?"
								value={input.kenapaDibutuhkan}
								onChange={(e) => updateField("kenapaDibutuhkan", e.target.value)}
								rows={3}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2 sm:col-span-3">
							<Label htmlFor="peluangPenghasilan">Peluang Penghasilan</Label>
							<Textarea
								id="peluangPenghasilan"
								placeholder="Apa sumber pendapatan potensial di niche ini?"
								value={input.peluangPenghasilan}
								onChange={(e) =>
									updateField("peluangPenghasilan", e.target.value)
								}
								rows={3}
								className="font-medium"
							/>
						</div>
					</div>
				</div>

				<Separator />

				{/* Section 3: SWOT Analysis */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
							3
						</div>
						<h3 className="font-semibold">SWOT Analysis</h3>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="profileSosmed">Profile Sosmed</Label>
							<Textarea
								id="profileSosmed"
								placeholder="Platform apa saja yang kamu gunakan? Link sosmed kamu?"
								value={input.profileSosmed}
								onChange={(e) => updateField("profileSosmed", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="kelebihan">Kelebihan (Strengths)</Label>
							<Textarea
								id="kelebihan"
								placeholder="Apa keunggulan kamu dibanding lainnya?"
								value={input.kelebihan}
								onChange={(e) => updateField("kelebihan", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="kelemahan">Kelemahan (Weaknesses)</Label>
							<Textarea
								id="kelemahan"
								placeholder="Apa yang perlu ditingkatkan? Jujur aja..."
								value={input.kelemahan}
								onChange={(e) => updateField("kelemahan", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="peluang">Peluang (Opportunities)</Label>
							<Textarea
								id="peluang"
								placeholder="Apa peluang yang bisa kamu manfaatkan?"
								value={input.peluang}
								onChange={(e) => updateField("peluang", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor="tantangan">Tantangan (Challenges)</Label>
							<Textarea
								id="tantangan"
								placeholder="Apa rintangan yang kamu hadapi di niche ini?"
								value={input.tantangan}
								onChange={(e) => updateField("tantangan", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
					</div>
				</div>

				<Separator />

				{/* Section 4: Positioning */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
							4
						</div>
						<h3 className="font-semibold">Positioning</h3>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="toneOfVoice">Tone of Voice *</Label>
							<Select
								value={input.toneOfVoice}
								onValueChange={(v) => {
									if (v && typeof v === "string") updateField("toneOfVoice", v);
								}}
							>
								<SelectTrigger id="toneOfVoice" className="font-medium">
									<SelectValue placeholder="Pilih tone" />
								</SelectTrigger>
								<SelectContent>
									{toneOptions.map((t) => (
										<SelectItem key={t.value} value={t.value}>
											{t.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{input.toneOfVoice && (
								<p className="text-[11px] text-muted-foreground">
									{
										toneOptions.find((t) => t.value === input.toneOfVoice)
											?.description
									}
								</p>
							)}
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor="premis">Premis</Label>
							<Textarea
								id="premis"
								placeholder="Apa unique value proposition kamu? Kenapa orang harus follow kamu?"
								value={input.premis}
								onChange={(e) => updateField("premis", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
						<div className="space-y-2 sm:col-span-2">
							<Label htmlFor="targetAudiens">Target Audiens</Label>
							<Textarea
								id="targetAudiens"
								placeholder="Siapa target audience kamu? Usia, profesi, interest?"
								value={input.targetAudiens}
								onChange={(e) => updateField("targetAudiens", e.target.value)}
								rows={2}
								className="font-medium"
							/>
						</div>
					</div>
				</div>

				<Separator />

				{/* Section 5: Generate */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="flex size-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
							5
						</div>
						<h3 className="font-semibold">Generate Brand Voice AI</h3>
					</div>
					<div className="flex flex-wrap items-center gap-4">
						<Button
							onClick={handleGenerate}
							disabled={!input.nama.trim() || !input.niche || !input.toneOfVoice}
							className="gap-2"
						>
							<Sparkles className="h-4 w-4" />
							Buat Brand Voice AI
						</Button>
						<p className="text-xs text-muted-foreground">
							{filledFields < totalFields
								? `Isi lebih banyak field untuk hasil lebih maksimal`
								: "Semua field terisi! Siap generate."}
						</p>
					</div>
				</div>

				{/* Output */}
				{output && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">
								🤖 Brand Voice AI System Prompt
							</Label>
							<Button
								onClick={handleCopy}
								variant="outline"
								size="sm"
								className="gap-1.5"
							>
								{copied ? (
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
						<div className="rounded-lg border border/50 bg-muted/30 p-4">
							<pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
								{output}
							</pre>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}