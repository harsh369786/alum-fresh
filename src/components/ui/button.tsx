import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[0.82rem] font-medium tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden",
  {
    variants: {
      variant: {
        charcoal:
          "bg-charcoal text-white hover:bg-[#1a1a1a] shadow-sm hover:shadow-md",
        sage:
          "bg-sage-dark text-white hover:bg-sage shadow-sm hover:shadow-md",
        cream:
          "bg-cream text-charcoal border border-parchment hover:bg-[#f0ece4] shadow-sm",
        ghost:
          "bg-transparent text-charcoal hover:bg-cream/50",
        default:
          "bg-charcoal text-white hover:bg-[#1a1a1a] shadow-sm hover:shadow-md",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "border border-parchment bg-transparent text-charcoal hover:bg-cream/30 hover:border-sage-light",
        secondary: "bg-cream text-charcoal border border-parchment hover:bg-parchment",
        link: "text-sage-dark underline-offset-4 hover:underline p-0 h-auto",
        teal: "bg-sage-dark text-white hover:bg-sage", // Legacy alias for backward compatibility during migration
        purple: "bg-charcoal text-white hover:bg-[#1a1a1a]", // Legacy alias
        magenta: "bg-charcoal text-white hover:bg-[#1a1a1a]", // Legacy alias
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 px-5 text-xs",
        lg: "h-14 px-10 text-[0.95rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      // Clean ripple for high-end look (optional, but keep it subtle)
      const btn = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.15);
        width: ${rippleSize}px;
        height: ${rippleSize}px;
        top: ${e.clientY - rect.top - rippleSize / 2}px;
        left: ${e.clientX - rect.left - rippleSize / 2}px;
        animation: ripple-anim 0.6s linear forwards;
        pointer-events: none;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
      onClick?.(e);
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
