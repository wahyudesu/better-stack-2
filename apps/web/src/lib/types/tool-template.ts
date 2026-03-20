export interface ContentScriptTemplate {
  id: string;
  name: string;
  // Content Script Engine specific config
  purpose: string;
  platform: string;
  persona: string;
  framework: string;
  tone: string;
  format: string;
  // Optional: saved topic
  topic?: string;
  // Timestamp
  createdAt: number;
  isPreset?: boolean; // Pre-built templates that cannot be deleted
}

export interface ToolTemplateManager {
  templates: ContentScriptTemplate[];
  saveTemplate: (template: Omit<ContentScriptTemplate, "id" | "createdAt">) => ContentScriptTemplate;
  deleteTemplate: (id: string) => void;
  loadTemplate: (id: string) => ContentScriptTemplate | undefined;
}

const STORAGE_KEY = "content_script_templates";

export function createToolTemplateManager(): ToolTemplateManager {
  let templates: ContentScriptTemplate[] = [];

  // Load from localStorage on init
  const loadFromStorage = (): ContentScriptTemplate[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  templates = loadFromStorage();

  const saveToStorage = (updated: ContentScriptTemplate[]) => {
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

    saveTemplate(template: Omit<ContentScriptTemplate, "id" | "createdAt">) {
      const newTemplate: ContentScriptTemplate = {
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
  };
}

// Singleton instance
let templateManager: ToolTemplateManager | null = null;

export function getToolTemplateManager(): ToolTemplateManager {
  if (!templateManager) {
    templateManager = createToolTemplateManager();
    // Initialize with preset templates if empty
    if (templateManager.templates.length === 0) {
      initializePresetTemplates(templateManager);
    }
  }
  return templateManager;
}

// Pre-built templates
const PRESET_TEMPLATES: Omit<ContentScriptTemplate, "id" | "createdAt">[] = [
  {
    name: "Instagram Edukasi Reels",
    purpose: "edukasi",
    platform: "instagram",
    persona: "expert-mentor",
    framework: "pas",
    tone: "casual",
    format: "reels",
    isPreset: true,
  },
  {
    name: "TikTok Viral Hook",
    purpose: "entertainment",
    platform: "tiktok",
    persona: "provocative",
    framework: "aida",
    tone: "casual",
    format: "reels",
    isPreset: true,
  },
  {
    name: "LinkedIn Professional Post",
    purpose: "edukasi",
    platform: "linkedin",
    persona: "professional",
    framework: "bab",
    tone: "professional",
    format: "post",
    isPreset: true,
  },
  {
    name: "Twitter Thread Story",
    purpose: "engagement",
    platform: "twitter",
    persona: "storyteller",
    framework: "sss",
    tone: "friendly",
    format: "thread",
    isPreset: true,
  },
  {
    name: "YouTube Shorts Tips",
    purpose: "edukasi",
    platform: "youtube",
    persona: "friendly-relatable",
    framework: "fab",
    tone: "friendly",
    format: "reels",
    isPreset: true,
  },
  {
    name: "Instagram Promo Carousel",
    purpose: "promosi",
    platform: "instagram",
    persona: "friendly-relatable",
    framework: "pas",
    tone: "casual",
    format: "carousel",
    isPreset: true,
  },
];

function initializePresetTemplates(manager: ToolTemplateManager) {
  PRESET_TEMPLATES.forEach((preset) => {
    manager.saveTemplate(preset);
  });
}
