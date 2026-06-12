"use client";

import { useAdmissionStore } from "@/hooks/useAdmissionStore";
import { ArrowLeft, CheckSquare, Square, FileCheck, Award, GraduationCap, ShieldCheck, FileCheck2 } from "lucide-react";
import { toast } from "sonner";
import { availableCourses } from "./CoursePreferencesStep";

interface StepProps {
  onPrev: () => void;
  onSubmit: () => void;
}

export default function ReviewSubmitStep({ onPrev, onSubmit }: StepProps) {
  const { personal, academic, courses, documents, acceptedDeclaration, setAcceptedDeclaration } = useAdmissionStore();

  const getCourseName = (id: string) => {
    return availableCourses.find((c) => c.id === id)?.name || id;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedDeclaration) {
      toast.error("Please read and accept the declaration of verification to proceed.");
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 select-none text-left">
      
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] space-y-6 shadow-xl">
        
        {/* Step Header */}
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileCheck2 className="w-4.5 h-4.5 text-indigo-400" />
            PART 5: Final Evaluation & Submit
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase pt-0.5">
            Audit your candidate inputs. Once submitted, revisions cannot occur until verification stages resolve.
          </p>
        </div>

        {/* DOUBLE COLUMN REVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Section 1: Demographics */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2.5">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
              <ShieldCheck className="w-4 h-4" />
              1. CANDIDATE PROFILE
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 font-semibold">
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Full Name:</span><span className="text-white font-bold">{personal.fullName}</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Date of Birth:</span><span className="text-white font-bold">{personal.dob}</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Gender Type:</span><span className="text-white font-bold">{personal.gender}</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Category:</span><span className="text-white font-bold">{personal.category}</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Blood Group:</span><span className="text-white font-bold">{personal.bloodGroup}</span></div>
            </div>
          </div>

          {/* Section 2: Academics */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2.5">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
              <GraduationCap className="w-4 h-4" />
              2. EVALUATION RATIOS
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 font-semibold">
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Class 10 Board:</span><span className="text-white font-bold">{academic.class10Board} ({academic.class10Year})</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">10th Score Ratio:</span><span className="text-emerald-400 font-bold">{academic.class10Marks}%</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Class 12 Board:</span><span className="text-white font-bold">{academic.class12Board} ({academic.class12Year})</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">12th Score Ratio:</span><span className="text-emerald-400 font-bold">{academic.class12Marks}%</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Entrance Exam:</span><span className="text-indigo-405 font-bold">{academic.entranceExamName}</span></div>
              <div className="flex justify-between uppercase"><span className="text-slate-550 font-black">Entrance Score:</span><span className="text-indigo-400 font-bold font-mono">{academic.entranceExamScore}</span></div>
            </div>
          </div>

          {/* Section 3: Course preference */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2.5 md:col-span-2">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
              <Award className="w-4 h-4" />
              3. CURRICULUM STREAM PRIORITIES
            </h4>
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-[9px] font-black bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded leading-none">PREF 1</span>
                <span className="uppercase text-white font-bold">{getCourseName(courses.firstChoice)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 border-t border-white/[0.03] pt-2">
                <span className="text-[9px] font-black bg-slate-800 border border-white/5 text-slate-400 px-1.5 py-0.5 rounded leading-none">PREF 2</span>
                <span className="uppercase text-slate-300 font-bold">{getCourseName(courses.secondChoice)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 border-t border-white/[0.03] pt-2">
                <span className="text-[9px] font-black bg-slate-800 border border-white/5 text-slate-400 px-1.5 py-0.5 rounded leading-none">PREF 3</span>
                <span className="uppercase text-slate-400 font-bold">{getCourseName(courses.thirdChoice)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Document Checks */}
          <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2.5 md:col-span-2">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-1.5">
              <FileCheck className="w-4 h-4" />
              4. SIGNED VERIFIED ATTACHMENTS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {[
                { label: "Photo ID", data: documents.photo },
                { label: "Signature", data: documents.signature },
                { label: "10th Mark", data: documents.class10Marksheet },
                { label: "12th Mark", data: documents.class12Marksheet },
                { label: "Govt ID Proof", data: documents.idProof },
              ].map((doc, idx) => (
                <div key={`doc-check-${idx}`} className="p-2 border border-emerald-500/10 bg-emerald-500/[0.01] rounded-xl flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] font-black text-emerald-400 leading-none">✓ LOADED</span>
                  <p className="text-[9px] text-slate-500 uppercase font-black tracking-wide leading-none pt-0.5">{doc.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Custom declaration switch checkbox widget */}
        <div 
          onClick={() => setAcceptedDeclaration(!acceptedDeclaration)}
          className="p-4 bg-slate-950 border border-white/5 rounded-xl flex items-start gap-3 cursor-pointer transition-all hover:bg-white/[0.01]"
        >
          <div className="pt-0.5 flex-shrink-0 text-blue-450">
            {acceptedDeclaration ? (
              <CheckSquare className="w-4.5 h-4.5 text-blue-500" />
            ) : (
              <Square className="w-4.5 h-4.5 text-slate-650" />
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold leading-normal uppercase">
            I hereby solemnly declare and confirm that all details provided in this file is authentic and correct to the best of my knowledge. I authorize verification audits of my transcripts.
          </p>
        </div>

      </div>

      {/* Button controls */}
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
          className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-black bg-indigo-600 hover:bg-indigo-500 border border-indigo-550 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider leading-none pt-[15px]"
        >
          Submit Admission Application
        </button>
      </div>

    </form>
  );
}
