/**
 * User, Workspace, and Account types.
 * These types are used before Convex integration.
 * Once Convex is integrated, these should be generated from schema.
 */

import type { ProfilePlatform } from "./core/platform";

// ============================================================
// 1. USER
// ============================================================

export type UserRole = "owner" | "admin" | "member" | "viewer";

export type UserStatus = "active" | "invited" | "disabled";

export interface User {
	id: string;
	/** Clerk user ID */
	clerkId: string;
	email: string;
	name: string;
	avatarUrl?: string;
	role: UserRole;
	status: UserStatus;
	createdAt: Date;
	updatedAt: Date;
}

// ============================================================
// 2. WORKSPACE
// ============================================================

export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

export type SubscriptionStatus =
	| "active"
	| "trialing"
	| "past_due"
	| "cancelled"
	| "paused";

export interface SubscriptionLimits {
	maxProfiles: number;
	maxPostsPerMonth: number;
	maxTeamMembers: number;
	aiGenerationsPerMonth: number;
	analyticsRetentionDays: number;
}

export interface Subscription {
	plan: SubscriptionPlan;
	status: SubscriptionStatus;
	currentPeriodStart: Date;
	currentPeriodEnd: Date;
	limits: SubscriptionLimits;
	stripeCustomerId?: string;
}

export interface Workspace {
	id: string;
	name: string;
	slug: string;
	ownerId: string;
	/** Connected social media profiles */
	profiles: SocialMediaProfileBasic[];
	/** Team members */
	members: WorkspaceMember[];
	/** Subscription info */
	subscription: Subscription;
	/** Workspace preferences */
	preferences: WorkspacePreferences;
	createdAt: Date;
	updatedAt: Date;
}

export interface SocialMediaProfileBasic {
	id: string;
	platform: ProfilePlatform;
	name: string;
	username: string;
	avatarUrl?: string;
	status: "active" | "disconnected" | "error" | "pending";
}

export interface WorkspaceMember {
	userId: string;
	role: UserRole;
	joinedAt: Date;
}

export interface WorkspacePreferences {
	defaultPlatforms: ProfilePlatform[];
	defaultScheduleTime: string; // HH:mm format
	timezone: string; // IANA timezone
	automationEnabled: boolean;
}

// ============================================================
// 3. NOTIFICATIONS & ACTIVITY
// ============================================================

export type NotificationType =
	| "post_published"
	| "post_failed"
	| "schedule_reminder"
	| "analytics_alert"
	| "team_invite"
	| "billing_alert"
	| "system";

export type NotificationStatus = "unread" | "read" | "archived";

export interface Notification {
	id: string;
	userId: string;
	type: NotificationType;
	title: string;
	message: string;
	status: NotificationStatus;
	metadata?: Record<string, string | number | boolean>;
	createdAt: Date;
}

// ============================================================
// 4. RECURRING SCHEDULE
// ============================================================

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export interface RecurringSchedule {
	id: string;
	title: string;
	/** Source template for generating posts */
	templateId: string;
	profileIds: string[];
	platforms: ProfilePlatform[];
	frequency: RecurrenceFrequency;
	/** For weekly: days of week [0=Sun, 1=Mon, ...] */
	daysOfWeek?: number[];
	/** For monthly: day of month */
	dayOfMonth?: number;
	/** Scheduled time (HH:mm) */
	scheduledTime: string;
	timezone: string;
	/** Number of posts to generate per occurrence */
	postsPerOccurrence: number;
	enabled: boolean;
	lastGeneratedAt?: Date;
	nextScheduledAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

// ============================================================
// 5. AUDIT LOG
// ============================================================

export interface AuditLogEntry {
	id: string;
	userId: string;
	action: string;
	entityType: "post" | "profile" | "workspace" | "member";
	entityId: string;
	metadata?: Record<string, string | number | boolean>;
	ipAddress?: string;
	userAgent?: string;
	createdAt: Date;
}
