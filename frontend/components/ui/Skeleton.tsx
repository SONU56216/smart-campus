"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
}

export default function Skeleton({ className, variant = "rectangular" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "shimmer-loader",
        {
          "h-4 w-full rounded-md": variant === "text",
          "h-24 w-full rounded-xl": variant === "rectangular",
          "h-12 w-12 rounded-full": variant === "circular",
        },
        className
      )}
    />
  );
}
