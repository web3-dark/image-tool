import * as React from "react"

import { buttonVariants } from "./button-variants"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) =>
  <button
    className={cn(buttonVariants({ variant, size, className }))}
    ref={ref}
    {...props}
  />
)
Button.displayName = "Button"

export { Button }
