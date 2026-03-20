import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-250 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden",
  {
    variants: {
      variant: {
        teal:
          "bg-gradient-to-r from-teal to-teal-dark text-[#08070F] shadow-[0_0_20px_rgba(0,212,200,0.4)] hover:shadow-[0_0_30px_rgba(0,212,200,0.6)] hover:-translate-y-0.5 hover:scale-[1.03]",
        purple:
          "bg-gradient-to-r from-purple-light to-purple text-white shadow-[0_0_20px_rgba(123,94,167,0.4)] hover:shadow-[0_0_30px_rgba(123,94,167,0.6)] hover:-translate-y-0.5 hover:scale-[1.03]",
        ghost:
          "bg-transparent text-text-primary border border-white/15 hover:bg-white/6 hover:border-white/25 hover:-translate-y-0.5 hover:scale-[1.03]",
        magenta:
          "bg-gradient-to-r from-magenta to-purple-light text-white shadow-[0_0_20px_rgba(214,58,249,0.4)] hover:shadow-[0_0_30px_rgba(214,58,249,0.6)] hover:-translate-y-0.5 hover:scale-[1.03]",
        default:
          "bg-gradient-to-r from-teal to-teal-dark text-[#08070F] shadow-[0_0_20px_rgba(0,212,200,0.4)] hover:shadow-[0_0_30px_rgba(0,212,200,0.6)] hover:-translate-y-0.5 hover:scale-[1.03]",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-white/15 bg-transparent text-white hover:bg-white/6",
        secondary: "bg-surface2 text-text-primary border border-white/8 hover:bg-white/8",
        link: "text-teal underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 text-base",
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
      // Ripple effect
      const btn = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height) * 2;
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
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
