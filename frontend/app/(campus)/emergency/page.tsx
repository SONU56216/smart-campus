"use client";

import EmergencySOS from "@/components/campus/EmergencySOS";
import { ShieldAlert, Info } from "lucide-react";

export default function EmergencyHubPage() {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-rose-500 uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
            Urgency Assistance & SOS Gateways
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Trigger simulated alert packages, extract target physical coordinates, and dial central campus dispatch hotlines.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[9px] uppercase font-black tracking-wider leading-none">
          SYSTEM ACTIVE 24/7
        </div>
      </div>

      {/* Main SOS and contact roster component */}
      <EmergencySOS />

    </div>
  );
}
