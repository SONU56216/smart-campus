"use client";

import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function FilterDropdown({
  options,
  value,
  onChange,
  placeholder = "All Statuses",
  label,
  className,
}: FilterDropdownProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 min-w-[140px]", className)}>
      {label && (
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider select-none">
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2 text-sm border border-slate-200 bg-white hover:bg-slate-50/50 dark:bg-slate-950 dark:border-slate-850 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl cursor-pointer transition-all text-slate-700 dark:text-slate-300 antialiased"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
