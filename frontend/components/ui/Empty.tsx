"use client";

import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyProps {
  title?: string;
  message?: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function Empty({ 
  title = "No Records Listed", 
  message = "This catalog folder currently holds zero assets logs.", 
  className,
  icon
}: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-3 min-h-[240px] border border-slate-100 bg-slate-50/50 rounded-2xl dark:border-slate-800 dark:bg-slate-900/10", className)}>
      <div className="p-4 bg-slate-100 text-slate-400 rounded-full dark:bg-slate-800 dark:text-slate-600">
        {icon || <Inbox className="w-8 h-8" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto dark:text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}
