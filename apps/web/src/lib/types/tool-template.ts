// Re-export from unified template system
// This file exists for backward compatibility with imports from @/lib/types/tool-template

export type { ContentTemplate as ContentScriptTemplate } from "./content/template";
export { getTemplateManager as getToolTemplateManager } from "./content/template";
