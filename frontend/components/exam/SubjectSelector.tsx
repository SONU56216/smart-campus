"use client";

import { Check, BookOpen, Sparkles, Award } from "lucide-react";

export interface SubjectItem {
  code: string;
  name: string;
  credits: number;
  isBacklog?: boolean;
}

interface SubjectSelectorProps {
  subjects: SubjectItem[];
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
  feePerRegular: number;
  feePerBacklog: number;
}

export default function SubjectSelector({
  subjects,
  selectedCodes,
  onChange,
  feePerRegular,
  feePerBacklog,
}: SubjectSelectorProps) {
  const toggleSubject = (code: string) => {
    if (selectedCodes.includes(code)) {
      onChange(selectedCodes.filter((c) => c !== code));
    } else {
      onChange([...selectedCodes, code]);
    }
  };

  const totalCreditsSelected = subjects
    .filter((s) => selectedCodes.includes(s.code))
    .reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <label className="text-[10px] font-black tracking-widest uppercase text-slate-500 block">
            Select Course Subjects for Exam Session
          </label>
          <span className="text-xs text-slate-400 font-medium font-mono">
            {selectedCodes.length} of {subjects.length} selected
          </span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 py-1 px-3 rounded-full">
          <Award className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] text-white uppercase font-black tracking-wider">
            {totalCreditsSelected} Credits Selected
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {subjects.map((sub) => {
          const isSelected = selectedCodes.includes(sub.code);
          const currentFee = sub.isBacklog ? feePerBacklog : feePerRegular;

          return (
            <div
              key={sub.code}
              onClick={() => toggleSubject(sub.code)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex justify-between items-center relative overflow-hidden select-none ${
                isSelected
                  ? "bg-blue-600/10 border-blue-500/45 shadow-lg shadow-blue-500/5 translate-y-[-2px]"
                  : "bg-slate-900/40 hover:bg-slate-900/60 border-white/5 hover:border-white/10"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-bl-xl shadow-lg" />
              )}
              
              <div className="flex items-center gap-3">
                {/* Visual marker */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    sub.isBacklog
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}
                >
                  {sub.isBacklog ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <BookOpen className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase font-mono">
                      {sub.code}
                    </span>
                    {sub.isBacklog && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black rounded uppercase tracking-wider">
                        Backlog
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {sub.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">
                    {sub.credits} Credits • Fee: ₹{currentFee}
                  </span>
                </div>
              </div>

              {/* Status Mark */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "border-slate-800 text-transparent"
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
