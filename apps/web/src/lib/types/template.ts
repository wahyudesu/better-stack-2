export interface ComposerTemplate {
	id: string;
	name: string;
	// Configuration options
	platform?: string;
	contentType?: string;
	goal?: string;
	tone?: string;
	// Optional: saved message/prompt
	message?: string;
	// Timestamp
	createdAt: number;
}

export interface TemplateManager {
	templates: ComposerTemplate[];
	saveTemplate: (template: Omit<ComposerTemplate, "id" | "createdAt">) => void;
	deleteTemplate: (id: string) => void;
	loadTemplate: (id: string) => ComposerTemplate | undefined;
	updateTemplate: (id: string, updates: Partial<ComposerTemplate>) => void;
}

const STORAGE_KEY = "composer_templates";

export function createTemplateManager(): TemplateManager {
	let templates: ComposerTemplate[] = [];

	// Load from localStorage on init
	const loadFromStorage = (): ComposerTemplate[] => {
		if (typeof window === "undefined") return [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch {
			return [];
		}
	};

	templates = loadFromStorage();

	const saveToStorage = (updated: ComposerTemplate[]) => {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to save templates:", e);
		}
	};

	return {
		get templates() {
			return templates;
		},

		saveTemplate(template: Omit<ComposerTemplate, "id" | "createdAt">) {
			const newTemplate: ComposerTemplate = {
				...template,
				id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
				createdAt: Date.now(),
			};
			templates = [...templates, newTemplate];
			saveToStorage(templates);
			return newTemplate;
		},

		deleteTemplate(id: string) {
			templates = templates.filter((t) => t.id !== id);
			saveToStorage(templates);
		},

		loadTemplate(id: string) {
			return templates.find((t) => t.id === id);
		},

		updateTemplate(id: string, updates: Partial<ComposerTemplate>) {
			const index = templates.findIndex((t) => t.id === id);
			if (index !== -1) {
				templates[index] = { ...templates[index], ...updates };
				saveToStorage(templates);
				return templates[index];
			}
		},
	};
}

// Singleton instance
let templateManager: TemplateManager | null = null;

export function getTemplateManager(): TemplateManager {
	if (!templateManager) {
		templateManager = createTemplateManager();
	}
	return templateManager;
}
