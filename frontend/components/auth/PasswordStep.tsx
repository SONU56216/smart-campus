"use client";

import { Lock, Eye, EyeOff, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { cn } from "@/lib/utils";

interface PasswordStepProps {
  formData: any;
  onChange: (fields: Partial<any>) => void;
  errors: Record<string, string>;
}

export default function PasswordStep({ formData, onChange, errors }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-4 text-left select-none">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Step 5: Set Passphrase & Review Application</h3>
        <p className="text-[10px] text-slate-400 font-medium pt-0.5">
          Establish an access credential and perform a fast sanity review over your application files ledger.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Passphrase Entry */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formData.password || ""}
              onChange={(e) => onChange({ password: e.target.value })}
              className={cn(
                "w-full pl-9 pr-9 py-2 text-xs text-slate-805 dark:text-zinc-100 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.password 
                  ? "border-red-300 focus:ring-red-100 dark:border-red-955 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <span className="text-[9px] font-bold text-red-500">{errors.password}</span>}
        </div>

        {/* Confirm Passphrase */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={formData.confirmPassword || ""}
              onChange={(e) => onChange({ confirmPassword: e.target.value })}
              className={cn(
                "w-full pl-9 pr-9 py-2 text-xs text-slate-855 dark:text-zinc-101 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.confirmPassword 
                  ? "border-red-300 focus:ring-red-101 dark:border-red-955 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
          </div>
          {errors.confirmPassword && <span className="text-[9px] font-bold text-red-500">{errors.confirmPassword}</span>}
        </div>
      </div>

      {/* Embedded Real-time strength meter */}
      <PasswordStrengthMeter password={formData.password || ""} />

      {/* Review Ledger component */}
      <div className="p-4 border border-blue-50 bg-blue-50/15 dark:border-blue-950/40 dark:bg-blue-950/10 rounded-2xl space-y-2 select-text">
        <h4 className="text-xs font-bold text-blue-900 dark:text-blue-400 flex items-center gap-1.5 leading-none">
          <ClipboardCheck className="w-4 h-4" />
          Review Application Entries
        </h4>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[11px] leading-relaxed select-text">
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">Name:</strong> {formData.firstName || "-"} {formData.lastName || "-"}</p>
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">DOB:</strong> {formData.dob || "-"}</p>
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">Gender:</strong> {formData.gender || "-"}</p>
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">Phone:</strong> {formData.phone || "-"}</p>
          <p className="text-slate-500 truncate"><strong className="text-slate-700 dark:text-slate-300">Email:</strong> {formData.email || "-"}</p>
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">Course Preference:</strong> {formData.course || "-"}</p>
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">Department:</strong> {formData.department || "-"}</p>
          <p className="text-slate-500"><strong className="text-slate-700 dark:text-slate-300">GPA Score:</strong> {formData.gpa || "-"}</p>
        </div>
      </div>
    </div>
  );
}
