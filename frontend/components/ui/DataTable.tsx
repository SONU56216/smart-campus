"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No relevant records have been listed.",
  className,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: any) => {
    if (!field) return;
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a: any, b: any) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === "string") {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number") {
      return sortDirection === "asc" 
        ? aVal - bVal 
        : bVal - aVal;
    }

    return 0;
  });

  return (
    <div className={cn("overflow-hidden border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/20 shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-semibold select-none">
              {columns.map((column, idx) => {
                const isSortable = column.sortable && typeof column.accessor === "string";
                const isCurrentSort = sortField === column.accessor;

                return (
                  <th
                    key={idx}
                    onClick={() => isSortable && handleSort(column.accessor)}
                    className={cn(
                      "px-6 py-4 font-medium transition-colors",
                      isSortable && "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      {column.header}
                      {isSortable && (
                        <span className="text-slate-400">
                          {!isCurrentSort && <ChevronsUpDown className="w-3.5 h-3.5" />}
                          {isCurrentSort && sortDirection === "asc" && <ChevronUp className="w-3.5 h-3.5 text-primary" />}
                          {isCurrentSort && sortDirection === "desc" && <ChevronDown className="w-3.5 h-3.5 text-primary" />}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr 
                  key={keyExtractor(row)} 
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-all text-slate-700 dark:text-slate-300"
                >
                  {columns.map((col, cIdx) => {
                    const content = typeof col.accessor === "function" 
                      ? col.accessor(row) 
                      : (row[col.accessor] as any);

                    return (
                      <td key={cIdx} className="px-6 py-4">
                        {content ?? <span className="text-slate-300">-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
