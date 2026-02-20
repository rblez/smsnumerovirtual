import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E5E5E5] rounded-xl shadow-sm",
        hover && "hover:border-[#2E2E2E]/30 hover:shadow-md transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

