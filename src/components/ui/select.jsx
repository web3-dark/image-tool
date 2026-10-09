import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "../../lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "group flex h-11 w-full items-center justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground shadow-sm outline-none transition-[border-color,box-shadow,background-color] duration-fast hover:border-border-strong hover:bg-surface-muted/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-surface sm:h-10 [&>span]:truncate",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform duration-fast group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary motion-reduce:transition-none" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-pointer items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-pointer items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

// Keep menus inside a native dialog's top layer when portalled is false.
const SelectContent = React.forwardRef(({ className, children, position = "popper", portalled = true, ...props }, ref) => {
  const content = (
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "select-menu relative z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-[8rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-lg border border-border bg-surface text-foreground shadow-lg",
        position === "popper" && "min-w-[max(8rem,var(--radix-select-trigger-width))]",
        className
      )}
      position={position}
      sideOffset={6}
      collisionPadding={8}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className="w-full space-y-1 p-1.5"
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  );
  return portalled ? <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal> : content;
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-md py-2 pl-3 pr-9 text-sm leading-5 outline-none transition-colors duration-fast data-[highlighted]:bg-surface-muted data-[highlighted]:text-foreground data-[state=checked]:bg-primary-muted data-[state=checked]:data-[highlighted]:ring-1 data-[state=checked]:data-[highlighted]:ring-inset data-[state=checked]:data-[highlighted]:ring-primary/20 data-[state=checked]:font-medium data-[state=checked]:text-primary-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50 sm:min-h-10",
      className
    )}
    {...props}
  >
    <span className="absolute right-3 flex h-4 w-4 items-center justify-center text-primary">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
