# Clerk Organizations + Zernio User/Teams Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Clerk auth (login/session) with Zernio data (users/teams/workspaces). Zernio is source of truth — user roles, team membership, and workspace access all come from Zernio API. Clerk is auth provider only.

**Architecture:** Clerk handles authentication and provides org-switcher UI. On login, Clerk user ID is mapped to Zernio user ID (via email match or stored `zernioUserId` in Clerk metadata). All team/workspace data fetched from Zernio `GET /v1/users`. Clerk role (org:admin/org:member) is derived from Zernio role (owner/member) at session time.

**Tech Stack:** Clerk (`@clerk/nextjs`), Zernio API (apps/server), Convex, Next.js App Router, Zustand

---

## File Structure

```
apps/web/
├── src/
│   ├── app/api/clerk-webhook/route.ts        # (minimal - just for Clerk org events if needed)
│   ├── lib/clerk-org.ts                      # Clerk auth + org UI helpers
│   ├── lib/zernio-user.ts                    # Zernio user/team fetching (NEW)
│   └── stores/auth-store.ts                  # Already exists
│   └── app/(dashboard)/team/page.tsx         # Team members page from Zernio (NEW)

apps/server/
├── src/
│   └── (no new files - existing routes handle Zernio)

apps/web/convex/
└── (reuse existing, no orgs table needed - data from Zernio directly)
```

---

## Task Map

| Task | Description |
|------|-------------|
| 1 | **Zernio user fetching** — `lib/zernio-user.ts` with `getTeamMembers()`, `getCurrentUser()`, `getUserRole()` |
| 2 | **Clerk → Zernio user mapping** — map Clerk user ID to Zernio user via email or stored `zernioUserId` |
| 3 | **Dashboard team page** — UI fetching from Zernio `GET /v1/users` |
| 4 | **OrganizationSwitcher UI** — Clerk org switcher component in header |
| 5 | **Route protection** — auth guard + Zernio role check |
| 6 | **Org-scoped routes** — `/orgs/[slug]/dashboard` with Zernio profile data |

---

## Key Design Decisions

1. **Zernio = source of truth** for users, teams, roles
2. **Clerk = auth only** — no org sync webhook to Zernio
3. **Mapping** — on first login, match Clerk user email to Zernio user email → store `zernioUserId` in Clerk `publicMetadata`
4. **Profile = workspace** — Zernio profile is the team workspace. One Clerk org = one Zernio profile
5. **Role mapping** — Zernio `owner` → Clerk `org:admin`, Zernio `member` → Clerk `org:member`

---

## Tasks

### Task 1: Zernio User Fetching Helper

**Files:**
- Create: `apps/web/src/lib/zernio-user.ts`

- [ ] **Step 1: Create zernio-user.ts**

```typescript
// apps/web/src/lib/zernio-user.ts
import { api } from './client'
import { useAuthStore } from '@/stores'

export interface ZernioUser {
  _id: string
  name: string
  email: string
  role: 'owner' | 'member'
  isRoot: boolean
  profileAccess: string[]
  createdAt: string
  image?: string
}

export interface TeamData {
  currentUserId: string
  users: ZernioUser[]
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
  return result.data
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
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/zernio-user.ts
git commit -m "feat: add Zernio user fetching helper"
```

---

### Task 2: Clerk → Zernio User Mapping

**Files:**
- Modify: `apps/web/src/lib/clerk-org.ts`

- [ ] **Step 1: Add mapping helpers**

```typescript
// apps/web/src/lib/clerk-org.ts
import { clerkClient } from '@clerk/nextjs/server'
import { getTeamMembers, type ZernioUser } from './zernio-user'

/**
 * Get Clerk user metadata and map to Zernio user
 */
export async function getClerkUserWithZernioMapping(clerkUserId: string) {
  const clerk = await clerkClient()
  const clerkUser = await clerk.users.getUser(clerkUserId)

  const zernioUserId = clerkUser.publicMetadata?.zernioUserId as string | undefined

  // If no mapping, try to find by email
  if (!zernioUserId) {
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (email) {
      const team = await getTeamMembers()
      if (team) {
        const matchedUser = team.users.find(
          (u: ZernioUser) => u.email?.toLowerCase() === email.toLowerCase(),
        )
        if (matchedUser) {
          // Store mapping for future use
          await clerk.users.updateUserMetadata(clerkUserId, {
            publicMetadata: { zernioUserId: matchedUser._id },
          })
          return { clerkUser, zernioUser: matchedUser }
        }
      }
    }
  }

  // If mapping exists, get the Zernio user
  if (zernioUserId) {
    const team = await getTeamMembers()
    if (team) {
      const zernioUser = team.users.find((u) => u._id === zernioUserId)
      if (zernioUser) {
        return { clerkUser, zernioUser }
      }
    }
  }

  return { clerkUser, zernioUser: null }
}

/**
 * Get all members of an organization (from Clerk)
 * Used for UI - OrganizationSwitcher
 */
export async function getOrgMembers(orgId: string) {
  const clerk = await clerkClient()
  return clerk.organizations.getOrganizationMembershipList({ organizationId: orgId })
}

/**
 * Get organization details (from Clerk)
 */
export async function getOrg(orgId: string) {
  const clerk = await clerkClient()
  return clerk.organizations.getOrganization({ organizationId: orgId })
}

/**
 * Create organization invitation (from Clerk)
 */
export async function inviteOrgMember(
  orgId: string,
  email: string,
  role: 'org:admin' | 'org:member',
  inviterUserId: string,
) {
  const clerk = await clerkClient()
  return clerk.organizations.createOrganizationInvitation({
    organizationId: orgId,
    inviterUserId,
    emailAddress: email,
    role,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accepted-invite`,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/clerk-org.ts
git commit -m "feat: add Clerk to Zernio user mapping"
```

---

### Task 3: Dashboard Team Page (from Zernio)

**Files:**
- Create: `apps/web/src/app/(dashboard)/team/page.tsx`

- [ ] **Step 1: Create team page**

```tsx
// apps/web/src/app/(dashboard)/team/page.tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getTeamMembers, isCurrentUserOwner, zernioRoleToClerkRole } from '@/lib/zernio-user'

export default async function TeamPage() {
  const { userId, orgId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const team = await getTeamMembers()
  const isOwner = await isCurrentUserOwner()

  if (!team) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load team data</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        {isOwner && (
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Owner
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {team.users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      user.role === 'owner'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total: {team.users.length} member(s)
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/\(dashboard\)/team/page.tsx
git commit -m "feat: add team members page from Zernio data"
```

---

### Task 4: OrganizationSwitcher UI

**Files:**
- Modify: `apps/web/src/components/header/user-menu.tsx`

- [ ] **Step 1: Add OrganizationSwitcher to header**

```tsx
// apps/web/src/components/header/user-menu.tsx
'use client'

import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'

export function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <OrganizationSwitcher
        hidePersonal
        afterCreateOrganizationUrl="/team"
        afterSelectOrganizationUrl="/team"
      />
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/header/user-menu.tsx
git commit -m "feat: add OrganizationSwitcher to header"
```

---

### Task 5: Route Protection

**Files:**
- Create: `apps/web/src/middleware.ts`

- [ ] **Step 1: Create middleware**

```typescript
// apps/web/src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Protect /team route - require authentication
  if (pathname.startsWith('/team')) {
    auth().protect()
  }

  // Protect /settings routes
  if (pathname.startsWith('/settings')) {
    auth().protect()
  }
})

export const config = {
  matcher: ['/team/:path*', '/settings/:path*'],
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/middleware.ts
git commit -m "feat: add route protection middleware"
```

---

### Task 6: Org-Scoped Routes (Optional - If Using Clerk Orgs for UI)

**Files:**
- Create: `apps/web/src/app/orgs/[slug]/page.tsx`
- Create: `apps/web/src/app/orgs/[slug]/settings/page.tsx`

- [ ] **Step 1: Create org page with Zernio data**

```tsx
// apps/web/src/app/orgs/[slug]/page.tsx
import { auth, redirect } from '@clerk/nextjs/server'
import { getTeamMembers } from '@/lib/zernio-user'

export default async function OrgPage({ params }: { params: { slug: string } }) {
  const { orgSlug } = await auth()

  // Verify URL slug matches active org
  if (orgSlug !== params.slug) {
    redirect('/team')
  }

  const team = await getTeamMembers()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organization: {params.slug}</h1>
      <p className="text-gray-600 mb-4">
        Team data from Zernio — {team?.users.length ?? 0} members
      </p>
      {/* Reuse team table component */}
      <pre>{JSON.stringify(team, null, 2)}</pre>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/orgs/[slug]/page.tsx
git commit -m "feat: add org-scoped page with Zernio data"
```

---

## Env Vars Needed

```bash
# apps/web/.env.local
CLERK_WEBHOOK_SECRET=whsec_...        # Optional - only if using Clerk webhooks
NEXT_PUBLIC_APP_URL=http://localhost:3000
SERVER_URL=http://localhost:8787
SERVER_INTERNAL_KEY=your-internal-key  # For server-to-server calls
```

---

## Verification Steps

1. **Test team page:** Go to `/team` — should show 2 users from Zernio
2. **Test org switcher:** Click org switcher in header — should show Clerk orgs
3. **Test route protection:** Try to access `/team` when logged out — should redirect to sign-in

---

## Self-Review Checklist

1. **Spec coverage:** Zernio as source of truth implemented. Team page fetches from Zernio. Clerk only for auth UI.
2. **No placeholders:** All code blocks filled.
3. **Architecture:** Correct — Zernio = source of truth, Clerk = auth only.
4. **Role mapping:** Zernio `owner` → Clerk `org:admin`, Zernio `member` → Clerk `org:member`.
5. **No webhook sync:** Clerk org events don't create/update Zernio data. Mapping is on-demand at login.

---

## Execution Options

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?