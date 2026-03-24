"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@better-stack-2/ui/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon, Tick02Icon, ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"
import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from '@better-stack-2/ui/components/animate-ui/primitives/effects/highlight';
import { getStrictContext } from '@better-stack-2/ui/lib/get-strict-context';
import { useControlledState } from '@better-stack-2/ui/hooks/use-controlled-state';
import { useDataState } from '@better-stack-2/ui/hooks/use-data-state';

// Context for tracking highlighted value
type SelectActiveValueContextType = {
  highlightedValue: string | null;
  setHighlightedValue: (value: string | null) => void;
};

type SelectContextType = {
  isOpen: boolean;
  setIsOpen: SelectProps['onOpenChange'];
};

const [SelectActiveValueProvider, useSelectActiveValue] =
  getStrictContext<SelectActiveValueContextType>('SelectActiveValueContext');
const [SelectProvider, useSelect] =
  getStrictContext<SelectContextType>('SelectContext');

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;

function Select(props: SelectProps) {
  const [isOpen, setIsOpen] = useControlledState({
    value: props?.open,
    defaultValue: props?.defaultOpen,
    onChange: props?.onOpenChange,
  });
  const [highlightedValue, setHighlightedValue] = React.useState<string | null>(
    null,
  );

  return (
    <SelectActiveValueProvider value={{ highlightedValue, setHighlightedValue }}>
      <SelectProvider value={{ isOpen, setIsOpen }}>
        <SelectPrimitive.Root
          data-slot="select"
          {...props}
          onOpenChange={setIsOpen}
        />
      </SelectProvider>
    </SelectActiveValueProvider>
  );
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-fit items-center justify-between gap-1.5 rounded-4xl border border-input bg-input/30 px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="pointer-events-none size-4 text-muted-foreground" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

type SelectHighlightProps = Omit<
  HighlightProps,
  'controlledItems' | 'enabled' | 'hover'
> & {
  animateOnHover?: boolean;
};

function SelectHighlight({
  transition = { type: 'spring', stiffness: 600, damping: 40 },
  ...props
}: SelectHighlightProps) {
  const { highlightedValue } = useSelectActiveValue();

  return (
    <Highlight
      data-slot="select-highlight"
      click={false}
      controlledItems
      transition={transition}
      value={highlightedValue}
      {...props}
    />
  );
}

type SelectHighlightItemProps = HighlightItemProps;

function SelectHighlightItem(props: SelectHighlightItemProps) {
  return <HighlightItem data-slot="select-highlight-item" {...props} />;
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  transition = { duration: 0.08 },
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  > & {
    transition?: { duration: number };
  }) {
  const { isOpen } = useSelect();

  return (
    <SelectPrimitive.Portal>
      <AnimatePresence>
        {isOpen && (
          <SelectPrimitive.Positioner
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            alignItemWithTrigger={alignItemWithTrigger}
            className="isolate z-50"
          >
            <SelectPrimitive.Popup
              data-slot="select-content"
              data-align-trigger={alignItemWithTrigger}
              render={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={transition}
                  style={{ willChange: 'opacity, transform' }}
                  className={cn("relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-2xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/5", className)}
                  {...props}
                />
              }
            >
              <SelectScrollUpButton />
              <SelectPrimitive.List>{children}</SelectPrimitive.List>
              <SelectScrollDownButton />
            </SelectPrimitive.Popup>
          </SelectPrimitive.Positioner>
        )}
      </AnimatePresence>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-3 py-2.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  const { setHighlightedValue } = useSelectActiveValue();
  const [, highlightedRef] = useDataState<HTMLDivElement>(
    'highlighted',
    undefined,
    (value) => {
      if (value === true) {
        const el = highlightedRef.current;
        const v = el?.dataset.value || el?.id || null;
        if (v) setHighlightedValue(v);
      }
    },
  );

  return (
    <SelectPrimitive.Item
      ref={highlightedRef}
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2.5 rounded-xl py-2 pr-8 pl-3 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />
        }
      >
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-border/50",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectHighlight,
  SelectHighlightItem,
  useSelectActiveValue,
  useSelect,
}
