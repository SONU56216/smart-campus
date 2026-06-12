"use client";

import { useAuth } from "@/hooks/useAuth";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import QuickActionGrid from "@/components/dashboard/QuickActionGrid";
import AttendanceGauge from "@/components/dashboard/AttendanceGauge";
import FeeStatusCard from "@/components/dashboard/FeeStatusCard";
import UpcomingExams from "@/components/dashboard/UpcomingExams";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { 
  Wallet, 
  ArrowRight, 
  Plus, 
  BadgeCheck, 
  Network,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 select-none">
      
      {/* 1. Immersive Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Responsive Command Shortcuts Grid */}
      <QuickActionGrid />

      {/* 3. Core Stats Row - 4-Column Responsive Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Slot A: Attendance gauge */}
        <AttendanceGauge />

        {/* Slot B: Treasury pie chart */}
        <FeeStatusCard />

        {/* Slot C: Wallet card */}
        <div className="p-6 rounded-[24px] border border-white/5 bg-gradient-to-br from-slate-900 to-blue-950/20 shadow-xl flex flex-col justify-between h-full min-h-[340px] text-left">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Wallet className="w-4.5 h-4.5 text-blue-400" />
                Electronic Wallet
              </h3>
              <span className="text-[9px] font-black bg-blue-500/10 border border-blue-500/20 text-blue-405 px-2 py-0.5 rounded font-mono uppercase">
                UPI
              </span>
            </div>

            {/* Glowing Digital Card Layout */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30 overflow-hidden shadow-lg shadow-blue-500/10 select-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8.5px] font-black text-white/60 lowercase tracking-widest uppercase">
                    Available Balance
                  </span>
                  <p className="text-2xl font-black text-white tracking-tight leading-none pt-1">
                    ₹{(user?.walletBalance ?? 1250.0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <CreditCard className="w-6 h-6 text-white/50" />
              </div>

              <div className="flex justify-between items-end pt-6">
                <div className="leading-none text-left">
                  <span className="text-[8px] text-white/50 font-bold block uppercase tracking-widest pb-1 max-w-[120px] truncate leading-none">
                    {user?.fullName || "Scholar User"}
                  </span>
                  <span className="text-[8.5px] text-white/70 font-bold font-mono tracking-widest">
                    •••• 8219
                  </span>
                </div>
                
                <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-450 bg-emerald-500/20 px-1.5 py-0.5 rounded uppercase leading-none">
                  <BadgeCheck className="w-3 h-3 text-emerald-400" />
                  AUTHENTIC
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-2.5">
            <Link href="/wallet" className="outline-none">
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 rounded-xl transition-all shadow-md group cursor-pointer">
                <Plus className="w-4 h-4 flex-shrink-0" />
                TOP UP WALLET
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
            
            <p className="text-[9.5px] text-slate-550 font-bold text-center leading-normal">
              Used for cashless printing & cafeteria gates.
            </p>
          </div>
        </div>

        {/* Slot D: Upcoming Exam list countdown */}
        <UpcomingExams />

      </div>

      {/* 4. Secondary Row: Splitting Timeline & Telemetry Alerts */}
      <RecentActivity />

    </div>
  );
}
