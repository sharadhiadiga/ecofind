import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-button text-white shadow-button hover:bg-gradient-button-hover hover:shadow-button-hover hover:scale-105",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md hover:scale-105",
        outline:
          "border-2 border-eco-primary bg-background text-eco-primary hover:bg-eco-primary hover:text-white shadow-sm hover:shadow-md hover:scale-105",
        secondary:
          "bg-eco-secondary text-eco-primary-dark border border-eco-primary/20 hover:bg-eco-secondary/80 hover:border-eco-primary/40 shadow-sm hover:shadow-md hover:scale-105",
        ghost: "hover:bg-eco-secondary hover:text-eco-primary-dark hover:scale-105",
        link: "text-eco-primary underline-offset-4 hover:underline hover:text-eco-primary-light",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
