"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function Error({ message = "A sync failure has blocked access.", onRetry, className }: ErrorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto my-6 border border-rose-100 bg-rose-50/50 rounded-2xl dark:border-rose-950 dark:bg-rose-950/20", className)}>
      <div className="p-3 bg-rose-100 text-rose-600 rounded-full dark:bg-rose-950/50 dark:text-rose-500">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Sync Stream Exception
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-rose-200 bg-white hover:bg-rose-50 text-slate-800 rounded-xl transition-all shadow-sm active:scale-95 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-200"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Connection
        </button>
      )}
    </div>
  );
}
