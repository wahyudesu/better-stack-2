// apps/web/src/lib/zernio-user.ts
import { api } from './client'
import type { ApiResponse } from './client'

export interface ZernioUser {
  _id: string
  name: string
  email?: string
  role: 'owner' | 'member'
  isRoot: boolean
  profileAccess: string[]
  createdAt: string
  image?: string
}

export interface TeamData {
  currentUserId: string
  users: ZernioUser[]
  canDelete?: boolean
}

/**
 * Get all users in the workspace (team members)
 * Uses Zernio API - source of truth
 */
export async function getTeamMembers(): Promise<TeamData | null> {
  const result = await api.listUsers()
  if (result.error) {
    console.error('Failed to fetch team:', result.error)
    return null
  }
  return result.data as TeamData
}

/**
 * Get current user's role in workspace
 */
export async function getCurrentUserRole(): Promise<string | null> {
  const team = await getTeamMembers()
  if (!team) return null
  const currentUser = team.users.find((u) => u._id === team.currentUserId)
  return currentUser?.role ?? null
}

/**
 * Check if current user is owner/admin
 */
export async function isCurrentUserOwner(): Promise<boolean> {
  const role = await getCurrentUserRole()
  return role === 'owner'
}

/**
 * Map Zernio user role to Clerk org role
 * Zernio owner → Clerk org:admin
 * Zernio member → Clerk org:member
 */
export function zernioRoleToClerkRole(zernioRole: string): 'org:admin' | 'org:member' {
  return zernioRole === 'owner' ? 'org:admin' : 'org:member'
}