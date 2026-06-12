"use client";

import { Award, BookOpen, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface AcademicStepProps {
  formData: any;
  onChange: (fields: Partial<any>) => void;
  errors: Record<string, string>;
}

export default function AcademicStep({ formData, onChange, errors }: AcademicStepProps) {
  const departmentOptions = [
    { value: "CSE", label: "Computer Science & Engineering" },
    { value: "ECE", label: "Electronics & Communications" },
    { value: "EE", label: "Electrical Engineering" },
    { value: "ME", label: "Mechanical Engineering" },
    { value: "CE", label: "Civil Engineering" },
  ];

  const courseOptions = [
    { value: "BTECH", label: "Bachelor of Technology (B.Tech - 4 Years)" },
    { value: "MTECH", label: "Master of Technology (M.Tech - 2 Years)" },
    { value: "PHD", label: "Doctor of Philosophy (Ph.D.)" },
  ];

  return (
    <div className="space-y-4 text-left select-none">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Step 3: Academic & Preference Config</h3>
        <p className="text-[10px] text-slate-400 font-medium pt-0.5">
          Choose the educational syllabus streamline and academic discipline matching your entry requirements.
        </p>
      </div>

      {/* Select Course Program */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Course Program</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <BookOpen className="w-4 h-4" />
          </span>
          <select
            value={formData.course || ""}
            onChange={(e) => onChange({ course: e.target.value })}
            className={cn(
              "w-full pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 cursor-pointer transition-all",
              errors.course 
                ? "border-red-305 focus:ring-red-112 dark:border-red-955 focus:border-red-500" 
                : "focus:ring-primary/20 focus:border-primary"
            )}
          >
            <option value="">Select Course</option>
            {courseOptions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {errors.course && <span className="text-[9px] font-bold text-red-500">{errors.course}</span>}
      </div>

      {/* Select Department preference */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department Preference</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Layers className="w-4 h-4" />
          </span>
          <select
            value={formData.department || ""}
            onChange={(e) => onChange({ department: e.target.value })}
            className={cn(
              "w-full pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 cursor-pointer transition-all",
              errors.department 
                ? "border-red-305 focus:ring-red-112 dark:border-red-955 focus:border-red-500" 
                : "focus:ring-primary/20 focus:border-primary"
            )}
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept.value} value={dept.value}>{dept.label}</option>
            ))}
          </select>
        </div>
        {errors.department && <span className="text-[9px] font-bold text-red-500">{errors.department}</span>}
      </div>

      {/* High School Marks / GPA */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High School GPA or Marks (%)</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Award className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="e.g. 3.82 or 92%"
            value={formData.gpa || ""}
            onChange={(e) => onChange({ gpa: e.target.value })}
            className={cn(
              "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-101 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
              errors.gpa 
                ? "border-red-300 focus:ring-red-101 dark:border-red-955 focus:border-red-500" 
                : "focus:ring-primary/20 focus:border-primary"
            )}
          />
        </div>
        {errors.gpa && <span className="text-[9px] font-bold text-red-500">{errors.gpa}</span>}
      </div>
    </div>
  );
}
