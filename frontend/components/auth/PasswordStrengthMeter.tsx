"use client";

import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password?: string;
}

export default function PasswordStrengthMeter({ password = "" }: PasswordStrengthMeterProps) {
  const criteria = useMemo(() => [
    { label: "At least 8 characters long", test: (val: string) => val.length >= 8 },
    { label: "Contains a uppercase letter", test: (val: string) => /[A-Z]/.test(val) },
    { label: "Contains a lowercase letter", test: (val: string) => /[a-z]/.test(val) },
    { label: "Contains a numeric digit", test: (val: string) => /[0-9]/.test(val) },
    { label: "Contains a special character (@, $, !, %)", test: (val: string) => /[@$!%*?&#]/.test(val) },
  ], []);

  const strengthScore = useMemo(() => {
    if (!password) return 0;
    return criteria.filter((item) => item.test(password)).length;
  }, [password, criteria]);

  const strengthColor = useMemo(() => {
    if (strengthScore <= 1) return { label: "Weak Profile", color: "bg-red-500", text: "text-red-500" };
    if (strengthScore <= 3) return { label: "Moderate Protection", color: "bg-amber-500", text: "text-amber-500" };
    if (strengthScore <= 4) return { label: "High Integrity", color: "bg-blue-500", text: "text-blue-500" };
    return { label: "Secured Academic Grade", color: "bg-emerald-500", text: "text-emerald-500" };
  }, [strengthScore]);

  return (
    <div className="space-y-3.5 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Credential strength</span>
        <span className={cn("text-xs font-bold transition-all", strengthColor.text)}>
          {password ? strengthColor.label : "Empty Passphrase"}
        </span>
      </div>

      {/* Segmented Progress Bars */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5 select-none">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "h-full rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300",
              password && idx < strengthScore && strengthColor.color
            )}
          />
        ))}
      </div>

      {/* Rules Bullet List Checklist */}
      <ul className="space-y-1.5 text-xs select-none">
        {criteria.map((item, idx) => {
          const isPassed = password ? item.test(password) : false;
          return (
            <li
              key={idx}
              className={cn(
                "flex items-center gap-1.5 font-medium transition-colors",
                isPassed ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-500"
              )}
            >
              {isPassed ? (
                <Check className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 shrink-0 text-slate-350" />
              )}
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
