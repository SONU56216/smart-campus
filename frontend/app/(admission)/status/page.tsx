"use client";

import { useAdmission } from "@/hooks/useAdmission";
import ApplicationTracker from "@/components/admission/ApplicationTracker";
import { Loader2, PlusCircle, LayoutDashboard, ShieldEllipsis } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StatusPage() {
  const router = useRouter();
  const { useMyApplications } = useAdmission();
  const { data: applications, isLoading } = useMyApplications();

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* 1. Header Title */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            Registry Evaluation Status
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Live tracker reflecting verification stages of your active applications.
          </p>
        </div>

        <button
          onClick={() => router.push("/apply")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider leading-none"
        >
          <PlusCircle className="w-4 h-4" />
          Apply New Course
        </button>
      </div>

      {/* 2. Loading Or Applications checks */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-[10px] text-slate-550 font-black uppercase tracking-widest leading-none">
            Retrieving admissions registrations...
          </p>
        </div>
      ) : !applications || applications.length === 0 ? (
        /* Empty State with Mock Demo Button */
        <div className="space-y-6">
          <div className="bg-slate-900/30 border border-white/5 p-12 rounded-[24px] text-center max-w-lg mx-auto flex flex-col items-center justify-center gap-4 relative overflow-hidden">
            <ShieldEllipsis className="w-12 h-12 text-slate-800 animate-pulse" />
            
            <div className="space-y-1">
              <span className="text-[8.5px] font-black tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
                Zero Registries
              </span>
              <h3 className="text-sm font-black text-white uppercase tracking-wider leading-tight pt-1">
                No Active Admissions Profiles Found
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase max-w-sm mx-auto leading-relaxed pt-1">
                You currently do not have any submitted admission transcripts in our registry database.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
              <button
                onClick={() => router.push("/apply")}
                className="px-5 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                Start Form Now
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-5 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                Student Hub Home
              </button>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 space-y-4">
            <span className="text-[9px] font-black text-slate-550 uppercase tracking-widest pl-2 block text-center">
              Showing Interactive Preview Checklist (MOCK MODE)
            </span>
            <ApplicationTracker />
          </div>
        </div>
      ) : (
        /* Real applications list trackers */
        <div className="space-y-8">
          {applications.map((app: any) => (
            <div key={app.id} className="border-b border-white/5 pb-8 last:border-none last:pb-0">
              <ApplicationTracker fallbackApplication={app} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
