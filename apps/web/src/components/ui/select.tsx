"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

function Select({ value: controlledValue, defaultValue = "", onValueChange, children }: SelectProps) {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
    const [open, setOpen] = React.useState(false)

    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
    const handleValueChange = (newValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
      setOpen(false)
    }

    return (
      <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
        <div className="relative inline-flex">{children}</div>
      </SelectContext.Provider>
    )
  }

function useSelect() {
  const context = React.useContext(SelectContext)
  if (!context) {
    throw new Error("Select components must be used within a Select")
  }
  return context
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelect()

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const { value } = useSelect()
  return (
    <span ref={ref} className={cn("", className)} {...props}>
      {value || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSelect()

    if (!open) return null

      return (
        <div
          ref={ref}
            className={cn(
              "absolute left-0 z-50 mt-1 min-w-full rounded-md border bg-popover text-popover-foreground shadow-md",
              className
            )}
          {...props}
        >
          <div className="p-1">{children}</div>
        </div>
      )
  }
)
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useSelect()
    const isSelected = selectedValue === value

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground whitespace-nowrap",
          isSelected && "bg-accent",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
}
