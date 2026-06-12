"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export default function StatsCard({
  title,
  value,
  prefix = "",
  suffix = "",
  description,
  icon,
  className,
  iconClassName,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Smooth visual counting animation on screen load
  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }

    const duration = 1000; // Animation duration in milliseconds
    const increment = end / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayValue(end);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={cn("relative overflow-hidden p-6 hover:translate-y-[-2px] transition-all duration-300 rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950/20 shadow-sm flex items-center justify-between", className)}>
      <div className="space-y-1.5 flex-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {title}
        </span>
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-xl font-bold text-slate-400">{prefix}</span>}
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
            {typeof value === "number" ? displayValue.toLocaleString() : value}
          </h2>
          {suffix && <span className="text-sm font-semibold text-slate-500">{suffix}</span>}
        </div>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
            {description}
          </p>
        )}
      </div>

      {icon && (
        <div className={cn("p-4 bg-slate-50 text-slate-500 rounded-2xl shrink-0 dark:bg-slate-900/50 dark:text-slate-400", iconClassName)}>
          {icon}
        </div>
      )}
    </div>
  );
}
