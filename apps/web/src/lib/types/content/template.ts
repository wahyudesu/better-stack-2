/**
 * Unified template types.
 * Merges ComposerTemplate and ContentScriptTemplate into one.
 */

import { z } from "zod";
import type { ProfilePlatform } from "../core/platform";

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const STORAGE_KEY = "content_templates";

// Validation schema for content templates from localStorage
const contentTemplateSchema = z.object({
	id: z.string(),
	name: z.string().max(200),
	description: z.string().max(500).optional(),
	config: z.object({
		platform: z.string(),
		format: z.enum(["single", "thread", "carousel", "reels", "story"]),
		purpose: z.enum([
			"edukasi",
			"entertainment",
			"promosi",
			"engagement",
			"branding",
			"sales",
		]),
		framework: z.enum(["aida", "pas", "bab", "sss", "fab", "custom"]),
		tone: z.string().max(50),
		persona: z.enum([
			"expert-mentor",
			"friendly-relatable",
			"professional",
			"provocative",
			"storyteller",
			"coachable",
			"custom",
		]),
		topic: z.string().optional(),
		customInstructions: z.string().optional(),
	}),
	prompt: z.string().optional(),
	content: z.string().optional(),
	isPreset: z.boolean(),
	workspaceId: z.string().optional(),
	createdBy: z.string(),
	createdAt: z.string().or(z.date()),
	updatedAt: z.string().or(z.date()),
});

type SafeTemplate = z.infer<typeof contentTemplateSchema>;

// Sanitize and validate a single template
function sanitizeTemplate(raw: unknown): SafeTemplate | null {
	try {
		return contentTemplateSchema.parse(raw);
	} catch {
		return null;
	}
}

// ============================================================
// TEMPLATE CORE
// ============================================================

export type TemplateFormat =
	| "single"
	| "thread"
	| "carousel"
	| "reels"
	| "story";
export type TemplatePurpose =
	| "edukasi"
	| "entertainment"
	| "promosi"
	| "engagement"
	| "branding"
	| "sales";
export type TemplateFramework =
	| "aida"
	| "pas"
	| "bab"
	| "sss"
	| "fab"
	| "custom";
export type TemplatePersona =
	| "expert-mentor"
	| "friendly-relatable"
	| "professional"
	| "provocative"
	| "storyteller"
	| "coachable"
	| "custom";

export interface TemplateConfig {
	platform: string;
	format: TemplateFormat;
	purpose: TemplatePurpose;
	framework: TemplateFramework;
	tone: string;
	persona: TemplatePersona;
	/** Optional saved topic/context */
	topic?: string;
	/** Custom instructions */
	customInstructions?: string;
}

export interface ContentTemplate {
	id: string;
	name: string;
	description?: string;
	/** Template configuration */
	config: TemplateConfig;
	/** Optional: prompt template for AI generation */
	prompt?: string;
	/** Optional: default content/caption */
	content?: string;
	/** Is this a preset template (cannot be deleted) */
	isPreset: boolean;
	/** Workspace ID (for team templates) */
	workspaceId?: string;
	/** Who created this template */
	createdBy: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}

// ============================================================
// TEMPLATE MANAGER
// ============================================================

export interface TemplateManager {
	templates: SafeTemplate[];
	saveTemplate: (
		template: Omit<ContentTemplate, "id" | "createdAt" | "updatedAt">,
	) => SafeTemplate;
	deleteTemplate: (id: string) => void;
	loadTemplate: (id: string) => SafeTemplate | undefined;
	updateTemplate: (
		id: string,
		updates: Partial<ContentTemplate>,
	) => SafeTemplate | undefined;
	duplicateTemplate: (id: string) => SafeTemplate | undefined;
}

export function createTemplateManager(): TemplateManager {
	let templates: SafeTemplate[] = [];

	const loadFromStorage = (): SafeTemplate[] => {
		if (typeof window === "undefined") return [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (!stored) return [];
			const parsed = JSON.parse(stored);
			if (!Array.isArray(parsed)) return [];
			// Validate and sanitize each template - drop invalid ones
			return parsed
				.map(sanitizeTemplate)
				.filter((t): t is SafeTemplate => t !== null);
		} catch {
			return [];
		}
	};

	const saveToStorage = (updated: SafeTemplate[]) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to save templates:", e);
		}
	};

	templates = loadFromStorage();

	return {
		get templates() {
			return templates;
		},

		saveTemplate(partial) {
			const newTemplate: SafeTemplate = {
				...partial,
				id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				createdAt: new Date(),
				updatedAt: new Date(),
			} as SafeTemplate;
			templates = [...templates, newTemplate];
			saveToStorage(templates);
			return newTemplate;
		},

		deleteTemplate(id) {
			templates = templates.filter((t) => t.id !== id);
			saveToStorage(templates);
		},

		loadTemplate(id) {
			return templates.find((t) => t.id === id);
		},

		updateTemplate(id, updates) {
			const index = templates.findIndex((t) => t.id === id);
			if (index !== -1) {
				templates[index] = {
					...templates[index],
					...updates,
					updatedAt: new Date(),
				} as SafeTemplate;
				saveToStorage(templates);
				return templates[index];
			}
		},

		duplicateTemplate(id) {
			const original = templates.find((t) => t.id === id);
			if (!original) return;
			return this.saveTemplate({
				...original,
				name: `${original.name} (Copy)`,
				isPreset: false,
			});
		},
	};
}

// Singleton instance
let templateManager: TemplateManager | null = null;

export function getTemplateManager(): TemplateManager {
	if (!templateManager) {
		templateManager = createTemplateManager();
		if (templateManager.templates.length === 0) {
			initializePresetTemplates(templateManager);
		}
	}
	return templateManager;
}

// ============================================================
// PRESET TEMPLATES
// ============================================================

const PRESET_TEMPLATES: Omit<
	ContentTemplate,
	"id" | "createdAt" | "updatedAt"
>[] = [
	{
		name: "Instagram Edukasi Reels",
		description: "Educational content in Reels format for Instagram",
		config: {
			platform: "instagram",
			format: "reels",
			purpose: "edukasi",
			framework: "pas",
			tone: "casual",
			persona: "expert-mentor",
		},
		isPreset: true,
		createdBy: "system",
	},
	{
		name: "TikTok Viral Hook",
		description: "Attention-grabbing TikTok content",
		config: {
			platform: "tiktok",
			format: "reels",
			purpose: "entertainment",
			framework: "aida",
			tone: "casual",
			persona: "provocative",
		},
		isPreset: true,
		createdBy: "system",
	},
	{
		name: "LinkedIn Professional Post",
		description: "Professional thought leadership content",
		config: {
			platform: "linkedin",
			format: "single",
			purpose: "branding",
			framework: "bab",
			tone: "professional",
			persona: "professional",
		},
		isPreset: true,
		createdBy: "system",
	},
	{
		name: "Twitter Thread Story",
		description: "Engaging thread format for Twitter",
		config: {
			platform: "twitter",
			format: "thread",
			purpose: "engagement",
			framework: "sss",
			tone: "friendly",
			persona: "storyteller",
		},
		isPreset: true,
		createdBy: "system",
	},
	{
		name: "YouTube Shorts Tips",
		description: "Quick tips in YouTube Shorts format",
		config: {
			platform: "youtube",
			format: "reels",
			purpose: "edukasi",
			framework: "fab",
			tone: "friendly",
			persona: "friendly-relatable",
		},
		isPreset: true,
		createdBy: "system",
	},
	{
		name: "Instagram Promo Carousel",
		description: "Promotional carousel for Instagram",
		config: {
			platform: "instagram",
			format: "carousel",
			purpose: "promosi",
			framework: "pas",
			tone: "casual",
			persona: "friendly-relatable",
		},
		isPreset: true,
		createdBy: "system",
	},
];

function initializePresetTemplates(manager: TemplateManager) {
	PRESET_TEMPLATES.forEach((preset) => {
		manager.saveTemplate(preset);
	});
}
