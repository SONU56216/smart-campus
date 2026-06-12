"use client";

import { ClipboardCheck, Sparkles, BookOpen, AlertCircle, CheckCircle2, Coins, ArrowRight, ShieldCheck } from "lucide-react";
import { ExamForm } from "@/types";

interface ExamFormCardProps {
  type: "REGULAR" | "BACKLOG" | "SUPPLEMENTARY";
  semester: number;
  subjectsCount: number;
  totalFee: number;
  status?: "PENDING" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";
  onApply: () => void;
  isApplied?: boolean;
}

export default function ExamFormCard({
  type,
  semester,
  subjectsCount,
  totalFee,
  status,
  onApply,
  isApplied = false,
}: ExamFormCardProps) {
  
  // Icon and theme config based on exam application type
  const config = {
    REGULAR: {
      title: "Regular End-Semester",
      desc: "Apply for current semester examination syllabus registrations.",
      icon: <BookOpen className="w-5 h-5 text-blue-400" />,
      colorClass: "from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-400",
      btnClass: "bg-blue-600 hover:bg-blue-500 text-white",
    },
    BACKLOG: {
      title: "Arrears / Backlog Exam",
      desc: "Re-apply for subject components failed in prior academic cycles.",
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      colorClass: "from-amber-500/10 to-orange-500/5 border-amber-500/20 text-amber-500",
      btnClass: "bg-amber-600 hover:bg-amber-500 text-white",
    },
    SUPPLEMENTARY: {
      title: "Supplementary Examination",
      desc: "Special supplementary registry to bolster scores or make-up terms.",
      icon: <ClipboardCheck className="w-5 h-5 text-purple-400" />,
      colorClass: "from-purple-500/10 to-pink-500/5 border-purple-500/20 text-purple-400",
      btnClass: "bg-purple-600 hover:bg-purple-500 text-white",
    },
  }[type];

  // Rendering status flags gracefully
  const getStatusBadge = (s: string) => {
    switch (s) {
      case "SUBMITTED":
        return <span className="text-[9px] font-black tracking-wider text-blue-400 bg-blue-500/15 border border-blue-500/25 px-2.5 py-1 rounded-md uppercase">Submitted</span>;
      case "APPROVED":
        return <span className="text-[9px] font-black tracking-wider text-indigo-400 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-1 rounded-md uppercase">Approved</span>;
      case "PAID":
        return <span className="text-[9px] font-black tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-1 rounded-md uppercase flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Paid Secure</span>;
      case "REJECTED":
        return <span className="text-[9px] font-black tracking-wider text-red-400 bg-red-500/15 border border-red-500/25 px-2.5 py-1 rounded-md uppercase">Clarification needed</span>;
      default:
        return <span className="text-[9px] font-black tracking-wider text-slate-400 bg-slate-500/15 border border-slate-500/25 px-2.5 py-1 rounded-md uppercase">Available</span>;
    }
  };

  return (
    <div className={`p-6 rounded-[28px] border bg-gradient-to-br ${config.colorClass} flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-xl transition-all h-full text-left relative overflow-hidden`}>
      <div className="space-y-4">
        {/* Title marker */}
        <div className="flex justify-between items-start gap-4">
          <div className="p-3 bg-slate-950/40 rounded-2xl border border-white/5 inline-flex">
            {config.icon}
          </div>
          {status ? getStatusBadge(status) : getStatusBadge("")}
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black tracking-wider text-slate-500 block uppercase">
            Semester {semester} Session
          </span>
          <h3 className="text-base font-black text-white uppercase tracking-wider">
            {config.title}
          </h3>
          <p className="text-xs text-slate-450 leading-relaxed font-semibold">
            {config.desc}
          </p>
        </div>

        {/* Quantities checklist */}
        <p className="text-xs border-t border-white/5 pt-4 text-slate-400 font-medium font-mono flex items-center justify-between">
          <span>Subjects Included:</span>
          <span className="text-white font-black">{subjectsCount} Courses</span>
        </p>

        <p className="text-xs border-b border-white/5 pb-4 text-slate-400 font-medium font-mono flex items-center justify-between">
          <span>Application Fee:</span>
          <span className="text-white font-black flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-blue-400" />
            ₹{totalFee}
          </span>
        </p>
      </div>

      <div className="pt-6 w-full">
        {isApplied ? (
          <div className="w-full text-center py-2.5 border border-emerald-500/20 bg-emerald-505/5 text-emerald-400 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Registration Logged
          </div>
        ) : (
          <button
            onClick={onApply}
            className={`w-full py-3 text-xs font-black rounded-xl transition-all cursor-pointer uppercase tracking-wider flex items-center justify-center gap-1.5 ${config.btnClass}`}
          >
            Apply & Fill Form
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Subordinate History checklist table
interface ExaminationHistoryListProps {
  history: ExamForm[];
  onFormClick?: (id: string) => void;
}

export function ExaminationHistoryList({ history, onFormClick }: ExaminationHistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-1 pl-1">
        <h4 className="text-sm font-black text-white uppercase tracking-wider">
          Previous Exam Registry Applications History
        </h4>
        <p className="text-xs text-slate-550 font-bold uppercase">
          Audit ledger reflecting status logs of your prior examination registrations
        </p>
      </div>

      <div className="border border-white/5 rounded-2xl overflow-hidden bg-slate-900/10">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-slate-950 text-slate-450 uppercase text-[9px] tracking-wider font-black font-mono">
              <th className="py-3.5 px-5">Reg ID</th>
              <th className="py-3.5 px-5 text-center">Semester</th>
              <th className="py-3.5 px-5">Scope</th>
              <th className="py-3.5 px-5 text-right font-mono">Paid Total</th>
              <th className="py-3.5 px-5 text-center">Outcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {history.map((form) => {
              const isPaid = form.status === "PAID";
              return (
                <tr
                  key={form.id}
                  onClick={() => onFormClick && onFormClick(form.id)}
                  className={`hover:bg-slate-900/30 transition-colors ${onFormClick ? "cursor-pointer" : ""}`}
                >
                  <td className="py-4 px-5 text-white font-bold font-mono">
                    #{form.id.slice(0, 10).toUpperCase()}
                  </td>
                  <td className="py-4 px-5 text-center font-bold text-slate-400">
                    Sem {form.semester}
                  </td>
                  <td className="py-4 px-5 font-sans font-bold text-slate-350">
                    {form.isBacklog ? "Backlog Arrears Courses" : "Regular Curriculum Courses"} ({form.subjects.length} modules)
                  </td>
                  <td className="py-4 px-5 text-right text-white font-bold font-mono">
                    ₹{(form.examFee + form.lateFee).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md ${
                        form.status === "PAID"
                          ? "text-emerald-500 bg-emerald-550/10 border border-emerald-555/20"
                          : form.status === "SUBMITTED"
                          ? "text-blue-500 bg-blue-550/10 border border-blue-555/20"
                          : "text-amber-500 bg-amber-550/10 border border-amber-555/20"
                      }`}
                    >
                      {form.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
