import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[#14171A] uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-11 px-3.5 rounded-md border bg-white text-[#14171A] text-base transition-colors",
            "placeholder:text-[#9CA3AF]",
            "focus-visible:outline-2 focus-visible:outline-[#1F4E43] focus-visible:outline-offset-2",
            "disabled:bg-[#F3F4F6] disabled:text-[#9CA3AF] disabled:cursor-not-allowed",
            error ? "border-[#C2222E] focus-visible:outline-[#C2222E]" : "border-[#E4E7EB] hover:border-[#D1D5DB]",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={inputId ? `${inputId}-error` : undefined} className="mt-1.5 text-xs text-[#C2222E] flex items-center gap-1">
            <svg className="w-3.5 h-3.5 inline shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
