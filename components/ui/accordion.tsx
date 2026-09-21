"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  id,
  title,
  subtitle,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-[#E4E7EB] py-3.5", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        id={`accordion-header-${id}`}
        className="flex w-full items-center justify-between text-left group focus-visible:outline-2 focus-visible:outline-[#1F4E43] rounded py-1 cursor-pointer"
      >
        <div>
          <span className="text-base font-medium text-[#14171A] group-hover:text-[#1F4E43] transition-colors">
            {title}
          </span>
          {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#6B7280] transition-transform duration-200 shrink-0 ml-4",
            isOpen && "rotate-180 text-[#1F4E43]"
          )}
        />
      </button>
      {isOpen && (
        <div
          id={`accordion-content-${id}`}
          role="region"
          aria-labelledby={`accordion-header-${id}`}
          className="pt-3 pb-1 text-sm text-[#4B5563] leading-relaxed animate-in fade-in slide-in-from-top-1"
        >
          {children}
        </div>
      )}
    </div>
  );
}
