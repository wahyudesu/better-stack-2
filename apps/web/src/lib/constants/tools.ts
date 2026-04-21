import type { LucideIcon } from "lucide-react";
import { FileText, UserCheck } from "lucide-react";

// Content purpose options
export const contentPurposes = [
	{
		value: "edukasi",
		label: "📚 Edukasi",
		description: "Membagikan knowledge dan informasi",
	},
	{
		value: "entertainment",
		label: "🎬 Entertainment",
		description: "Menghibur dan menghibur audience",
	},
	{
		value: "promosi",
		label: "🚀 Promosi/Sales",
		description: "Mempromosikan produk/jasa",
	},
	{
		value: "inspirasi",
		label: "✨ Inspirasi/Motivasi",
		description: "Menginspirasi dan memotivasi",
	},
	{
		value: "engagement",
		label: "💬 Engagement/Storytelling",
		description: "Membangun connection dan engagement",
	},
] as const;

// Platform options
export const platforms = [
	{
		value: "instagram",
		label: "📸 Instagram",
		description: "Reels, Carousel, Stories",
	},
	{
		value: "tiktok",
		label: "🎵 TikTok",
		description: "Short-form video 15-60s",
	},
	{
		value: "twitter",
		label: "𝕏 Twitter/X",
		description: "Threads, short posts",
	},
	{ value: "youtube", label: "▶️ YouTube", description: "Long-form & Shorts" },
	{
		value: "linkedin",
		label: "💼 LinkedIn",
		description: "Professional content",
	},
] as const;

// Persona options
export const personas = [
	{
		value: "expert-mentor",
		label: "🎓 Expert Mentor",
		description: "Authoritative, educational, trustworthy",
	},
	{
		value: "friendly-relatable",
		label: "😊 Friendly Relatable",
		description: "Casual, approachable, like-a-friend",
	},
	{
		value: "storyteller",
		label: "📖 Storyteller",
		description: "Narrative-driven, emotional, engaging",
	},
	{
		value: "provocative",
		label: "🔥 Provocative/Edgy",
		description: "Bold, controversial, attention-grabbing",
	},
	{
		value: "professional",
		label: "💼 Professional Corporate",
		description: "Formal, data-driven, business-focused",
	},
] as const;

// Copywriting framework options
export const frameworks = [
	{
		value: "pas",
		label: "PAS",
		description: "Problem - Agitate - Solution",
		guidance: `PROBLEM: Identify the audience's pain point
AGITATE: Make the problem feel urgent and emotional
SOLUTION: Present your offering as the answer`,
	},
	{
		value: "aida",
		label: "AIDA",
		description: "Attention - Interest - Desire - Action",
		guidance: `ATTENTION: Hook viewer immediately in first 3 seconds
INTEREST: Build curiosity with compelling facts or story
DESIRE: Show benefits and emotional payoff
ACTION: Clear, specific call-to-action`,
	},
	{
		value: "fab",
		label: "FAB",
		description: "Features - Advantages - Benefits",
		guidance: `FEATURES: What the product/service has
ADVANTAGES: What those features mean (differentiation)
BENEFITS: What the user gets out of it (WIIFM)`,
	},
	{
		value: "bab",
		label: "BAB",
		description: "Before - After - Bridge",
		guidance: `BEFORE: Describe current negative situation
AFTER: Paint picture of ideal positive outcome
BRIDGE: Show how your solution bridges the gap`,
	},
	{
		value: "sss",
		label: "SSS",
		description: "Star - Story - Solution",
		guidance: `STAR: Introduce character or yourself as hero
STORY: Share struggle and journey
SOLUTION: Reveal what solved the problem`,
	},
] as const;

// Tone options
export const tones = [
	{ value: "casual", label: "😊 Casual" },
	{ value: "professional", label: "💼 Professional" },
	{ value: "friendly", label: "🤗 Friendly" },
	{ value: "humor", label: "😂 Humor" },
	{ value: "serious", label: "😐 Serious" },
] as const;

export interface Tool {
	id: string;
	label: string;
	icon: LucideIcon;
	description: string;
}

export const tools: Tool[] = [
	{
		id: "script-engine",
		label: "Content Script Engine",
		icon: FileText,
		description: "Generate AI system prompts for content creation",
	},
	{
		id: "branding",
		label: "Personal Branding Builder",
		icon: UserCheck,
		description: "Build your personal brand identity",
	},
] as const;

export type ToolId = (typeof tools)[number]["id"];

// Platform-specific guidance
export function getPlatformGuidance(platform: string): string {
	const guidance: Record<string, string> = {
		instagram: `• Visual-first approach
• Use 3-5 relevant hashtags
• Optimal: Reels (15-30s), Carousel (5-10 slides)
• First 3 seconds crucial for hook
• CTA: "Save this", "Share with someone who needs it"`,

		tiktok: `• Hook in first 1-2 seconds
• Use trending sounds when relevant
• Optimal length: 15-45 seconds
• Fast-paced editing
• CTA: "Follow for more", "Comment your thoughts"`,

		twitter: `• Concise, punchy sentences
• Use thread format for longer content
• 2-3 hashtags max
• Engage with replies
• CTA: "Retweet if you agree", "Thread 🧵"`,

		youtube: `• Hook in first 30 seconds
• Long-form: 8-15 minutes optimal
• Shorts: Under 60 seconds
• Pattern interrupt every 2-3 minutes
• CTA: "Subscribe", "Smash that like button"`,

		linkedin: `• Professional yet conversational
• Value-driven, not salesy
• Use line breaks for readability
• Tag relevant people/companies
• CTA: "Share your thoughts", "Let's connect"`,
	};
	return guidance[platform] || guidance.instagram;
}

// Generate system prompt based on inputs
export function generateSystemPrompt(
	purpose: string,
	platform: string,
	persona: string,
	framework: string,
	topic: string,
	tone: string,
	variation: number = 1,
): string {
	const purposeInfo = contentPurposes.find((p) => p.value === purpose);
	const platformInfo = platforms.find((p) => p.value === platform);
	const _personaInfo = personas.find((p) => p.value === persona);
	const frameworkInfo = frameworks.find((f) => f.value === framework);
	const toneInfo = tones.find((t) => t.value === tone);

	const personaDescription: Record<string, string> = {
		"expert-mentor":
			"You are an Expert Mentor - authoritative yet approachable. You have deep knowledge and experience in this field. Your tone is educational, trustworthy, and encouraging. You use clear explanations and back up claims with expertise.",
		"friendly-relatable":
			"You are a Friendly Relatable creator - like a supportive friend sharing valuable insights. Your tone is warm, casual, and genuine. You connect through shared experiences and vulnerability.",
		storyteller:
			"You are a Storyteller - narrative-driven and emotionally engaging. You weave compelling narratives that draw people in. You use vivid details, emotional arcs, and relatable moments.",
		provocative:
			"You are a Provocative/Edgy creator - bold, opinionated, and attention-grabbing. You challenge conventional thinking and stir conversation. You're not afraid of controversy when it serves the message.",
		professional:
			"You are a Professional Corporate communicator - formal, polished, and business-focused. You use data, facts, and professional language. You maintain credibility and authority throughout.",
	};

	const purposeGuidance: Record<string, string> = {
		edukasi:
			"Focus on clarity and learning outcomes. Break down complex topics into digestible pieces. Use examples and analogies.",
		entertainment:
			"Prioritize engagement and enjoyment. Use humor, surprises, and emotional peaks. Keep energy high throughout.",
		promosi:
			"Balance value with persuasion. Lead with benefit, not features. Build desire before making the ask.",
		inspirasi:
			"Focus on emotional connection and aspirational messaging. Share wisdom and motivate action. Use empowering language.",
		engagement:
			"Prioritize two-way communication. Ask questions, invite responses, create shareable moments. Build community.",
	};

	// Variation modifiers
	const variationModifiers: Record<number, string> = {
		1: "",
		2: "Take a more direct and punchy approach. Focus on immediate impact.",
		3: "Add more emotional storytelling elements. Make it personal and relatable.",
		4: "Focus on data-driven, educational content. Include statistics and facts.",
		5: "Create urgency and FOMO. Use time-sensitive language.",
	};

	const variationNote =
		variation > 1
			? `\n## VARIATION NOTE
This is Variation #${variation}. ${variationModifiers[variation]}

Make this version distinctly different from other variations while maintaining the same core message and framework.\n`
			: "";

	return `# CONTENT GENERATION SYSTEM PROMPT

## ROLE
${personaDescription[persona]}

## CONTEXT
You are creating content for: ${platformInfo?.label || platform}
Content Purpose: ${purposeInfo?.label || purpose} (${purposeInfo?.description || ""})
Topic: ${topic}
Tone: ${toneInfo?.label || tone}
${variation > 1 ? `Variation: #${variation} of the set` : ""}

## FRAMEWORK: ${frameworkInfo?.label} (${frameworkInfo?.description})
${frameworkInfo?.guidance || ""}

## CONTENT GOAL
${purposeGuidance[purpose] || ""}

## PLATFORM-SPECIFIC GUIDELINES
${getPlatformGuidance(platform)}${variationNote}
## OUTPUT REQUIREMENTS
1. Follow the ${frameworkInfo?.label} framework strictly
2. Maintain ${toneInfo?.label} tone throughout
3. Optimize for ${platformInfo?.label} specifically
4. Include appropriate call-to-action
5. Make it immediately usable - ready to publish

## DELIVERABLE
Create a complete content script following these guidelines. Include:
- Hook/headline
- Main body content using the framework
- Call-to-action
- Hashtag suggestions (if applicable to platform)

--- Generate the content script below ---`;
}
