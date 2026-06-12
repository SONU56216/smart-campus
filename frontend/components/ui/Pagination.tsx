"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800 bg-transparent px-4 select-none", className)}>
      <div className="text-xs text-slate-500">
        Page <span className="font-semibold text-slate-800 dark:text-slate-300">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-800 dark:text-slate-300">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white rounded-lg transition-all dark:bg-slate-950 dark:border-slate-850"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((page, index, array) => {
              const showEllipsis = index > 0 && page - array[index - 1] > 1;

              return (
                <div key={page} className="flex items-center">
                  {showEllipsis && <span className="px-2 text-xs text-slate-400">...</span>}
                  <button
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "px-3 py-1 text-xs font-semibold rounded-lg transition-all",
                      currentPage === page
                        ? "bg-primary text-white shadow-sm"
                        : "border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-850 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white rounded-lg transition-all dark:bg-slate-950 dark:border-slate-850"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
}
