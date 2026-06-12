"use client";

import { useExam } from "@/hooks/useAdmission"; // Or useExam from @/hooks/useExam
import { useExam as useExamHook } from "@/hooks/useExam";
import { useStudent } from "@/hooks/useStudent";
import ExamFormCard, { ExaminationHistoryList } from "@/components/exam/ExamFormCard";
import { Loader2, Sparkles, HelpCircle, FileText, Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ExamFormsPage() {
  const router = useRouter();
  const { useProfile } = useStudent();
  const { useAvailableExams, useMyExamForms } = useExamHook();

  const { data: student, isLoading: loadingProfile } = useProfile();
  const { data: config, isLoading: loadingRules } = useAvailableExams();
  const { data: myForms, isLoading: loadingForms } = useMyExamForms();

  const isLoading = loadingProfile || loadingRules || loadingForms;

  // Render Loader if queries are fetching
  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
          Syncing University Examination registries...
        </p>
      </div>
    );
  }

  // Active parameter values
  const regularFee = config?.examFee ?? 3000; // fallback if undefined
  const backlogFee = config?.backlogSubjectFee ?? 800;
  const currentSemester = student?.semester ?? 1;

  // Let's check status of currently submitted regular forms (avoiding double-filling)
  const regularForm = myForms?.find((f) => !f.isBacklog);
  const backlogForm = myForms?.find((f) => f.isBacklog && f.backlogSubjects?.length > 0);

  const handleApply = (type: "REGULAR" | "BACKLOG" | "SUPPLEMENTARY") => {
    router.push(`/exam/fill-form?type=${type.toLowerCase()}`);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-6xl mx-auto py-2">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Registry Examination Forms
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Official portal to register and pay credentials for semester examinations.
          </p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span className="text-[9.5px] font-black text-blue-400 uppercase tracking-widest">
            Session: {config?.examSession ?? "DEC 2024 / JAN 2025"}
          </span>
        </div>
      </div>

      {/* Helper Note Banner */}
      <div className="p-4 bg-slate-900/30 border border-white/5 text-slate-400 text-left rounded-2xl leading-relaxed flex gap-3 text-xs font-semibold">
        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <span className="text-[10.5px] uppercase tracking-wide leading-normal">
          Always review subject lists before locking registration forms. Forms require a verified student signature and complete fee settlement to authorize the issuance of formal admit entry cards.
        </span>
      </div>

      {/* Available Exam choices columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Regular End-Semester card */}
        <ExamFormCard
          type="REGULAR"
          semester={currentSemester}
          subjectsCount={5} // standard subject size
          totalFee={regularFee}
          status={regularForm ? "SUBMITTED" : undefined}
          onApply={() => handleApply("REGULAR")}
          isApplied={!!regularForm}
        />

        {/* 2. Backlog Arrear card */}
        <ExamFormCard
          type="BACKLOG"
          semester={currentSemester}
          subjectsCount={2}
          totalFee={backlogFee}
          status={backlogForm ? "PAID" : undefined}
          onApply={() => handleApply("BACKLOG")}
          isApplied={!!backlogForm}
        />

        {/* 3. Supplementary Card */}
        <ExamFormCard
          type="SUPPLEMENTARY"
          semester={currentSemester}
          subjectsCount={1}
          totalFee={1500}
          onApply={() => handleApply("SUPPLEMENTARY")}
        />

      </div>

      {/* Registry application submission history row */}
      <div className="border-t border-white/5 pt-8">
        <ExaminationHistoryList
          history={myForms ?? []}
          onFormClick={(id) => router.push(`/exam/admit-card?formId=${id}`)}
        />
      </div>

    </div>
  );
}
