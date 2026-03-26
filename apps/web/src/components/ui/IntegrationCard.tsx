"use client"

import { Switch } from "@/components/ui/switch"
import { PlatformIcon, type Platform } from "@/components/ui/PlatformIcon"
import { cn } from "@/lib/utils"

interface IntegrationCardProps {
  id: string
  name: string
  platform: Platform
  connected: boolean
  handle: string | null
  followers: string | null
  posts: number | null
  color: string
  onToggle: (id: string) => void
  className?: string
}

export function IntegrationCard({
  id,
  name,
  platform,
  connected,
  handle,
  followers,
  posts,
  color,
  onToggle,
  className,
}: IntegrationCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border/50 p-3",
        className
      )}
    >
      <div className={cn("p-2 rounded-lg", color)}>
        <PlatformIcon platform={platform} className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{name}</p>
        {connected && handle ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">{handle}</span>
            {followers && (
              <>
                <span>•</span>
                <span>{followers}</span>
              </>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Not connected</p>
        )}
      </div>
      <Switch
        checked={connected}
        onCheckedChange={() => onToggle(id)}
      />
    </div>
  )
}
