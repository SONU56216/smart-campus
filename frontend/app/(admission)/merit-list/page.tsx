"use client";

import MeritList from "@/components/admission/MeritList";
import { Trophy, HelpCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MeritListPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-fade-in text-left">
      
      {/* 1. Page Header */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500 animate-pulse" />
            Public Cutoff Merit Ledger
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Curriculum ranking lists based on certified secondary scores and general weight computations.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Got to Dashboard
        </button>
      </div>

      {/* Helper message */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-405 text-left rounded-2xl leading-relaxed flex gap-3 text-xs font-semibold">
        <HelpCircle className="w-5 h-5 flex-shrink-0" />
        <span className="text-[10px] uppercase tracking-wide leading-normal text-blue-400">
          Rankings are updated dynamically after each document auditing round. Candidates residing on waitlists are automatically elevated to higher preferences if seats are waived.
        </span>
      </div>

      {/* 2. Merit Table component inclusion */}
      <MeritList />

    </div>
  );
}
