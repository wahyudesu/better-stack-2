export type Platform = "threads" | "linkedin" | "twitter" | "instagram" | "tiktok";
export type ContentType = "single" | "thread" | "carousel" | "video";
export type Tone = "professional" | "casual" | "inspirational" | "educational" | "friendly" | "storytelling";
export type ScriptGoal = "engagement" | "sales" | "branding" | "education" | "entertainment";

export interface ToneOption {
  value: Tone;
  label: string;
  color: string;
  shortDesc: string;
}

export interface GeneratedPost {
  id: string;
  platform: Platform;
  contentType: ContentType;
  tone: Tone;
  goal: ScriptGoal;
  content: string;
  hashtags: string[];
  cta: string;
  createdAt: Date;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  description: string;
  maxChars: number;
  supports: ContentType[];
}
