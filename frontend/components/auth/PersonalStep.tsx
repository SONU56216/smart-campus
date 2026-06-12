"use client";

import { useMemo } from "react";
import { User, Calendar, Users, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalStepProps {
  formData: any;
  onChange: (fields: Partial<any>) => void;
  errors: Record<string, string>;
}

export default function PersonalStep({ formData, onChange, errors }: PersonalStepProps) {
  const genderOptions = ["Male", "Female", "Other", "Prefer Not To Say"];
  const categoryOptions = ["General", "OBC", "SC", "ST", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <div className="space-y-4 text-left select-none">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Step 1: Scholar Information Details</h3>
        <p className="text-[10px] text-slate-400 font-medium pt-0.5">
          Enter legal name properties and basic biophysics metrics corresponding with your official certificates.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">First Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="e.g. Liam"
              value={formData.firstName || ""}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className={cn(
                "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-100 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.firstName 
                  ? "border-red-300 focus:ring-red-100 dark:border-red-950 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
          </div>
          {errors.firstName && <span className="text-[9px] font-bold text-red-500">{errors.firstName}</span>}
        </div>

        {/* Last Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="e.g. Miller"
              value={formData.lastName || ""}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className={cn(
                "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-100 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.lastName 
                  ? "border-red-300 focus:ring-red-100 dark:border-red-950 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
          </div>
          {errors.lastName && <span className="text-[9px] font-bold text-red-500">{errors.lastName}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Date Of Birth */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="date"
              value={formData.dob || ""}
              onChange={(e) => onChange({ dob: e.target.value })}
              className={cn(
                "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-105 bg-white hover:bg-slate-50/50 dark:bg-slate-945 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.dob 
                  ? "border-red-300 focus:ring-red-100 dark:border-red-950 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
          </div>
          {errors.dob && <span className="text-[9px] font-bold text-red-500">{errors.dob}</span>}
        </div>

        {/* Gender Selection */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
          <select
            value={formData.gender || ""}
            onChange={(e) => onChange({ gender: e.target.value })}
            className="w-full px-3 py-2 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category Profile */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category Category</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Users className="w-4 h-4" />
            </span>
            <select
              value={formData.category || ""}
              onChange={(e) => onChange({ category: e.target.value })}
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blood Group */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Heart className="w-4 h-4" />
            </span>
            <select
              value={formData.bloodGroup || ""}
              onChange={(e) => onChange({ bloodGroup: e.target.value })}
              className="w-full pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-all"
            >
              <option value="">Select Group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
