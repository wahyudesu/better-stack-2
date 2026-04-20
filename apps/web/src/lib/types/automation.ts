/**
 * Automation types for inbox/outreach features.
 */

export type AutomationType = "auto-reply" | "auto-comment";

export type TriggerType =
	| "keyword"
	| "all"
	| "followers-only"
	| "verified-only";

export interface AutomationRule {
	id: string;
	type: AutomationType;
	name: string;
	enabled: boolean;
	trigger: TriggerType;
	keywords?: string[];
	platforms: string[];
	response: string;
	delaySeconds: number;
	createdAt: string;
}

export interface AutomationSettings {
	autoReplyEnabled: boolean;
	autoCommentEnabled: boolean;
	rules: AutomationRule[];
}
