"use client";

import { useAdmissionStore } from "@/hooks/useAdmissionStore";
import { GraduationCap, ArrowLeft, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

export default function AcademicHistoryStep({ onNext, onPrev }: StepProps) {
  const { academic, setAcademic, markStepComplete } = useAdmissionStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Core Validations
    const m10 = parseFloat(academic.class10Marks);
    const m12 = parseFloat(academic.class12Marks);
    if (!academic.class10Marks || isNaN(m10) || m10 < 0 || m10 > 100) {
      toast.error("Class 10 score must be a valid percentage between 0 and 100.");
      return;
    }
    if (!academic.class12Marks || isNaN(m12) || m12 < 0 || m12 > 100) {
      toast.error("Class 12 score must be a valid percentage between 0 and 100.");
      return;
    }
    if (!academic.entranceExamScore || isNaN(parseFloat(academic.entranceExamScore))) {
      toast.error("Entrance Exam Score is required and must be a valid decimal value.");
      return;
    }

    markStepComplete(1, true);
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6 select-none text-left">
      
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] space-y-6 shadow-xl">
        
        {/* Step Header */}
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5 text-emerald-400" />
            PART 2: Core Academic Thresholds
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase pt-0.5">
            Declare your secondary school percentages and entrance ranking grades.
          </p>
        </div>

        {/* 1. Class 10th Record Group */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 opacity-70" />
            Class 10 Board credentials
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            
            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Secondary Board Name
              </label>
              <select
                value={academic.class10Board}
                onChange={(e) => setAcademic({ class10Board: e.target.value })}
                className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE / CISCE</option>
                <option value="STATE">STATE BOARD PROVINCE</option>
                <option value="IB">IB INTERNATIONAL</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Aggregate Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 94.5"
                value={academic.class10Marks}
                onChange={(e) => setAcademic({ class10Marks: e.target.value })}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Year of Passing
              </label>
              <select
                value={academic.class10Year}
                onChange={(e) => setAcademic({ class10Year: e.target.value })}
                className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold"
              >
                {Array.from({ length: 10 }).map((_, i) => {
                  const yr = (2026 - i - 2).toString();
                  return <option key={yr} value={yr}>{yr}</option>;
                })}
              </select>
            </div>

          </div>
        </div>

        {/* 2. Class 12th Record Group */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 opacity-70" />
            Class 12 Intermediate Board credentials
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            
            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Senior Board Name
              </label>
              <select
                value={academic.class12Board}
                onChange={(e) => setAcademic({ class12Board: e.target.value })}
                className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              >
                <option value="CBSE">CBSE</option>
                <option value="ISC">ISC / CISCE</option>
                <option value="STATE">STATE BOARD PROVINCE</option>
                <option value="IB">IB INTERNATIONAL</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Aggregate Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 96.2"
                value={academic.class12Marks}
                onChange={(e) => setAcademic({ class12Marks: e.target.value })}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Year of Passing
              </label>
              <select
                value={academic.class12Year}
                onChange={(e) => setAcademic({ class12Year: e.target.value })}
                className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold"
              >
                {Array.from({ length: 5 }).map((_, i) => {
                  const yr = (2026 - i).toString();
                  return <option key={yr} value={yr}>{yr}</option>;
                })}
              </select>
            </div>

          </div>
        </div>

        {/* 3. Entrance Exam score details */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 opacity-70" />
            General Entrance metrics
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            
            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Entrance Exam Name
              </label>
              <select
                value={academic.entranceExamName}
                onChange={(e) => setAcademic({ entranceExamName: e.target.value })}
                className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              >
                <option value="JEE MAIN">JEE MAIN ENTRANCE</option>
                <option value="SAT">SAT SCHOLASTIC EXAM</option>
                <option value="CAMPUS_TEST">CAMPUS APTITUDE TEST</option>
                <option value="ACT">ACT EXAM</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block pl-1">
                Exam Scoring Rank / Percentile *
              </label>
              <input
                placeholder="e.g. 99.85 percentile / 885"
                value={academic.entranceExamScore}
                onChange={(e) => setAcademic({ entranceExamScore: e.target.value })}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none uppercase font-bold"
                required
              />
            </div>

          </div>
        </div>

      </div>

      {/* Controller Buttons */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider leading-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider leading-none pt-[15px]"
        >
          Confirm and Proceed Next Step
        </button>
      </div>

    </form>
  );
}
