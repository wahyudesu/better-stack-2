"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("DropdownMenu components must be used within a DropdownMenu")
  }
  return context
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children?: React.ReactNode
}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ className, asChild = false, children, ...props }, ref) => {
    const { open, setOpen } = useDropdownMenu()

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        onClick: () => setOpen(!open),
        ref,
      } as any)
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn("", className)}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
  children: React.ReactNode
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "center", sideOffset = 4, children, ...props }, ref) => {
    const { open, setOpen } = useDropdownMenu()
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open, setOpen])

    if (!open) return null

    const alignClasses = {
      start: "left-0",
      center: "left-1/2 -translate-x-1/2",
      end: "right-0",
    }

    return (
      <div
        ref={(node) => {
          (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === "function") ref(node)
          else if (ref) ref.current = node
        }}
        className={cn(
          "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
          alignClasses[align],
          className
        )}
        style={{ marginTop: sideOffset }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
