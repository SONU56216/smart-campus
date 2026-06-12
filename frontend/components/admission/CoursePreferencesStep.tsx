"use client";

import { useAdmissionStore } from "@/hooks/useAdmissionStore";
import { GraduationCap, ArrowLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

export const availableCourses = [
  { id: "CSE", code: "CS-101", name: "B.Tech Computer Science & Engineering" },
  { id: "AI_ML", code: "CS-102", name: "B.Tech Artificial Intelligence & Machine Learning" },
  { id: "ECE", code: "EC-201", name: "B.Tech Electronics & Communication Engineering" },
  { id: "IT", code: "IT-150", name: "B.Tech Information Technology & Cyber" },
  { id: "EE", code: "EE-301", name: "B.Tech Electrical & Robotics Engineering" },
  { id: "ME", code: "ME-401", name: "B.Tech Mechanical & Space Dynamics" },
];

export default function CoursePreferencesStep({ onNext, onPrev }: StepProps) {
  const { courses, setCourses, markStepComplete } = useAdmissionStore();

  // If choices are empty, pre-select default ones
  if (!courses.firstChoice && availableCourses.length > 0) {
    setCourses({
      firstChoice: availableCourses[0].id,
      secondChoice: availableCourses[1].id,
      thirdChoice: availableCourses[2].id,
    });
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!courses.firstChoice || !courses.secondChoice || !courses.thirdChoice) {
      toast.error("Please fill in all 3 preference slots.");
      return;
    }

    // Uniqueness validation
    if (
      courses.firstChoice === courses.secondChoice ||
      courses.firstChoice === courses.thirdChoice ||
      courses.secondChoice === courses.thirdChoice
    ) {
      toast.error("Preference tracks must be unique! Please select different courses.");
      return;
    }

    markStepComplete(2, true);
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6 select-none text-left">
      
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] space-y-6 shadow-xl">
        
        {/* Step Header */}
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4.5 h-4.5 text-blue-450" />
            PART 3: Curriculum Preferences
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase pt-0.5">
            Prioritize your core branch tracks. Placements are evaluated sequentially during merit selection rounds.
          </p>
        </div>

        {/* Dropdowns lists */}
        <div className="space-y-5">
          
          {/* 1st Choice */}
          <div className="space-y-1">
            <label className="text-[9px] font-black tracking-widest text-slate-500 block pl-1 uppercase">
              First Priority Stream Choice *
            </label>
            <select
              value={courses.firstChoice}
              onChange={(e) => setCourses({ firstChoice: e.target.value })}
              className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              required
            >
              <option value="">-- Choose first choice --</option>
              {availableCourses.map((c) => (
                <option key={`c1-${c.id}`} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* 2nd Choice */}
          <div className="space-y-1">
            <label className="text-[9px] font-black tracking-widest text-slate-500 block pl-1 uppercase">
              Second Priority Stream Choice *
            </label>
            <select
              value={courses.secondChoice}
              onChange={(e) => setCourses({ secondChoice: e.target.value })}
              className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              required
            >
              <option value="">-- Choose second choice --</option>
              {availableCourses.map((c) => (
                <option key={`c2-${c.id}`} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* 3rd Choice */}
          <div className="space-y-1">
            <label className="text-[9px] font-black tracking-widest text-slate-500 block pl-1 uppercase">
              Third Priority Stream Choice *
            </label>
            <select
              value={courses.thirdChoice}
              onChange={(e) => setCourses({ thirdChoice: e.target.value })}
              className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              required
            >
              <option value="">-- Choose third choice --</option>
              {availableCourses.map((c) => (
                <option key={`c3-${c.id}`} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Warning Indicator */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl leading-relaxed flex gap-3 text-xs font-bold">
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-[9.5px] uppercase tracking-wide">
            Your preferences are final once locked. Ensure choices represent different engineering branches carefully. Duplicate streams will be rejected.
          </span>
        </div>

      </div>

      {/* Button Controls */}
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
