import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-sans font-semibold rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#2E2E2E] text-white hover:bg-[#3E3E3E] shadow-[0_1px_2px_rgba(0,0,0,0.08)] ring-1 ring-white/10 hover:scale-[1.02] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.25)] active:scale-[0.98]",
    secondary: "bg-white text-[#2E2E2E] border border-[#E5E5E5] hover:bg-[#E8E1D4]/10 hover:border-[#2E2E2E]/40 hover:shadow-md",
    outline: "bg-transparent text-[#2E2E2E] border border-[#2E2E2E] hover:bg-[#2E2E2E] hover:text-white",
    ghost: "bg-transparent text-[#737373] hover:text-[#2E2E2E] hover:bg-[#E8E1D4]/20",
  };
  
  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-sm px-6 py-2.5",
    lg: "text-base px-8 py-3.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

