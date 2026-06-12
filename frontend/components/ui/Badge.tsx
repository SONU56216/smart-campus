"use client";

import { getStatusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export default function Badge({ status, label, className }: BadgeProps) {
  const meta = getStatusColor(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm select-none transition-colors duration-250",
        meta.bg,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulseGlow", meta.badge)} />
      {label || status.replace(/_/g, " ")}
    </span>
  );
}
