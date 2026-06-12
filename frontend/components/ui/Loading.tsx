"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  className?: string;
  spinnerClassName?: string;
}

export default function Loading({ message = "Loading campus assets...", className, spinnerClassName }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-4 min-h-[200px]", className)}>
      <div 
        className={cn(
          "w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin", 
          spinnerClassName
        )} 
      />
      {message && (
        <p className="text-sm font-medium text-slate-500 animate-pulse dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}
