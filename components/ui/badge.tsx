import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "sale" | "warning" | "success" | "neutral" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-[#1F4E43]/10 text-[#1F4E43] border border-[#1F4E43]/20",
    sale: "bg-[#C2222E] text-white font-medium",
    warning: "bg-[#F59E0B] text-slate-900 font-medium",
    success: "bg-[#1B9E60]/15 text-[#18804E] border border-[#1B9E60]/30 font-medium",
    neutral: "bg-[#E4E7EB] text-[#14171A] font-medium",
    outline: "border border-[#E4E7EB] text-[#6B7280] bg-transparent",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
