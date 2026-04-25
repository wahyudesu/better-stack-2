import { cn } from "@zenpost/ui/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { strokeWidth: _strokeWidth, ...rest } = props
  return (
    <HugeiconsIcon icon={Loading03Icon} role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...rest} />
  )
}

export { Spinner }
