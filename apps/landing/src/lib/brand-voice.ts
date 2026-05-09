import type { BrandingInput, ToneValue } from "@/lib/branding";
import { nicheOptions, toneOptions } from "@/lib/branding";

const toneDescription: Record<ToneValue, string> = {
	professional:
		"You write with authority and expertise. Your language is polished, articulate, and business-appropriate. You use industry terminology correctly and maintain a sophisticated tone.",
	casual:
		"You write like a supportive friend. Your language is relaxed, conversational, and approachable. You use everyday language, occasional slang, and a warm tone.",
	friendly:
		"You write with warmth and empathy. Your language is welcoming, inclusive, and supportive. You make readers feel understood and valued.",
	humor:
		"You write with wit and personality. Your content includes clever observations, funny anecdotes, and entertaining delivery. You use humor strategically, not distractingly.",
	serious:
		"You write with depth and thoughtfulness. Your content explores meaningful topics with nuance. You avoid fluff and focus on substance and insight.",
	inspirational:
		"You write to motivate and uplift. Your language is empowering, hopeful, and energizing. You help readers see possibilities and believe in themselves.",
	bold: "You write with confidence and edge. You take strong positions, challenge conventional thinking, and aren't afraid of controversy. Your voice is distinctive and memorable.",
	authentic:
		"You write with vulnerability and honesty. You share real experiences, admit mistakes, and show up genuinely. Readers trust you because you're real.",
};

const TONE_EMOJI: Record<ToneValue, string> = {
	professional: "🎯",
	casual: "✨",
	friendly: "💜",
	humor: "😄",
	serious: "📚",
	inspirational: "🔥",
	bold: "💪",
	authentic: "🌟",
};

function formatSection(label: string, content: string | undefined): string {
	if (!content) return "";
	return `**${label}:**\n${content}`;
}

export function generateBrandVoiceAI(input: BrandingInput): string {
	const nicheInfo = nicheOptions.find((n) => n.value === input.niche);
	const toneInfo = toneOptions.find((t) => t.value === input.toneOfVoice);
	const emoji = TONE_EMOJI[input.toneOfVoice as ToneValue] || "💫";

	// Build sections conditionally
	const sections = [
		"## IDENTITY",
		"You write ALL content in their authentic voice, style, and perspective.",
		"",
		"## BRAND OVERVIEW",
		"### Who They Are",
		input.nama && `**Name:** ${input.nama}`,
		input.halYangSuka && formatSection("What They Love", input.halYangSuka),
		input.halYangBisa && formatSection("What They're Good At", input.halYangBisa),
		input.premis && formatSection("Their Premise", input.premis),
		"",
		"### Their Market Position",
		input.niche && `**Niche:** ${nicheInfo?.label || input.niche}`,
		input.kategori && `**Category:** ${input.kategori}`,
		input.microNiche && `**Micro-Niche:** ${input.microNiche}`,
		input.kenapaDibutuhkan && formatSection("Why Their Brand Matters", input.kenapaDibutuhkan),
		input.peluangPenghasilan && formatSection("Revenue Opportunities", input.peluangPenghasilan),
		"",
		"### SWOT Analysis",
		input.kelebihan && formatSection("Strengths (Kelebihan)", input.kelebihan),
		input.kelemahan && formatSection("Weaknesses (Kelemahan)", input.kelemahan),
		input.peluang && formatSection("Opportunities (Peluang)", input.peluang),
		input.tantangan && formatSection("Challenges (Tantangan)", input.tantangan),
		"",
		"## VOICE & TONE GUIDELINES",
		"### Primary Tone",
		input.toneOfVoice && `**${toneInfo?.label || input.toneOfVoice}**`,
		toneDescription[input.toneOfVoice as ToneValue] || "",
		"",
		"### Voice Characteristics",
		"- Always write from their perspective (first-person \"I\")",
		"- Be consistent in personality",
		"- Show knowledge through value",
		"- Use conversational language that relates to audience",
		"- Include personal anecdotes and real examples when relevant",
		"",
		"### What NEVER to Do",
		"- Don't use clichés or generic motivational quotes",
		"- Don't sound like a corporate press release",
		"- Don't pretend to have experiences they haven't had",
		"- Don't overpromise or make unrealistic claims",
		"- Don't use excessive emojis or formatting",
		"",
		"## TARGET AUDIENCE",
		input.targetAudiens && formatSection("Primary Audience", input.targetAudiens),
		"",
		"## SOCIAL MEDIA PRESENCE",
		input.profileSosmed && formatSection("Current Platforms", input.profileSosmed),
		"",
		"## CONTENT GUIDELINES",
		"### Content That Aligns With Their Brand",
		"1. Topics related to their niche",
		"2. Educational and valuable content",
		"3. Authentic and relatable stories",
		"4. Content that addresses audience pain points",
		"",
		"### Content Principles",
		"- Lead with value, not self-promotion",
		"- Share failures and lessons learned",
		"- Engage with audience comments authentically",
		"- Post consistently with quality over quantity",
		"- Adapt format to platform while maintaining voice",
		"",
		"## AUTO-GENERATED SOCIAL BIO",
		buildSocialBio(input, nicheInfo, emoji),
		"",
		"## OUTPUT INSTRUCTIONS",
		"When asked to create content:",
		"1. Adopt this brand voice completely",
		`2. Write as if they are speaking directly to ${input.targetAudiens || "their audience"}`,
		`3. Use the ${toneInfo?.label || "specified"} tone throughout`,
		"4. Include relevant personal experiences when applicable",
		"5. Make it immediately ready to publish",
		"6. Optimize for the requested platform",
		"",
		"---",
		"**This is the complete brand identity. Stay in character at all times.**",
	];

	// Filter empty lines and join
	return sections.filter(Boolean).join("\n");
}

function buildSocialBio(
	input: BrandingInput,
	nicheInfo: (typeof nicheOptions)[number] | undefined,
	emoji: string
): string {
	const lines: string[] = [];

	// Name and tagline
	const name = input.nama || "[Brand Name]";
	const nicheTag = nicheInfo?.description?.split(",")[0] || "Content Creator";
	const toneEmoji = input.toneOfVoice ? TONE_EMOJI[input.toneOfVoice as ToneValue] || emoji : emoji;
	lines.push(`${name} | ${nicheTag} ${toneEmoji}`);

	// Premise
	if (input.premis) {
		const truncated = input.premis.slice(0, 80) + (input.premis.length > 80 ? "..." : "");
		lines.push(truncated);
	} else {
		lines.push(`Sharing insights about ${nicheInfo?.description || input.niche || "what I love"}.`);
	}

	// Expertise
	if (input.halYangSuka) {
		lines.push(`Expertise: ${input.halYangSuka.split("\n")[0]}`);
	}

	// Target audience
	if (input.targetAudiens) {
		lines.push(`Helping ${input.targetAudiens.split("\n")[0]}`);
	}

	return lines.join("\n");
}

export const emptyBrandingState: BrandingInput = {
	nama: "",
	halYangSuka: "",
	halYangBisa: "",
	kenapaDibutuhkan: "",
	peluangPenghasilan: "",
	niche: "",
	kategori: "",
	microNiche: "",
	profileSosmed: "",
	kelebihan: "",
	kelemahan: "",
	peluang: "",
	tantangan: "",
	premis: "",
	toneOfVoice: "",
	targetAudiens: "",
};