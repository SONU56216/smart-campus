"use client";

import { useAttendance } from "@/hooks/useAttendance";
import { CheckCircle2, AlertTriangle, CalendarRange } from "lucide-react";

export default function AttendanceGauge() {
  const { useMyAttendance } = useAttendance();
  const { data: attendanceStats, isLoading } = useMyAttendance();

  // Extract variables or provide fallbacks
  const attendanceRate = attendanceStats?.percentage ?? 82.4; 
  const totalClasses = attendanceStats?.totalClasses ?? 120;
  const present = attendanceStats?.present ?? 99;
  const absent = attendanceStats?.absent ?? 21;

  // SVG parameters for circle gauge
  const radius = 55;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (attendanceRate / 100) * circumference;

  const isShortage = attendanceRate < 75;

  return (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] shadow-xl flex flex-col justify-between select-none h-full min-h-[340px] text-left">
      <div>
        <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
          <h3 className="text-xs font-black text-slate-305 uppercase tracking-wider flex items-center gap-2">
            <CalendarRange className="w-4.5 h-4.5 text-blue-400" />
            Gate Scans & Attendance
          </h3>
          <span className="text-[9px] font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded uppercase">
            ACTIVE
          </span>
        </div>

        {/* Circular Progress Meter */}
        <div className="flex items-center justify-center h-44 relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Circle Frame */}
            <circle
              stroke="#1e293b"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Foreground Fill Stroke with glow properties */}
            <circle
              stroke={isShortage ? "#ef4444" : "#10b981"}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset, strokeLinecap: "round" }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Absolute metrics inside */}
          <div className="absolute flex flex-col items-center justify-center pointer-events-none leading-none">
            <span className="text-xl font-black text-white">{attendanceRate.toFixed(1)}%</span>
            <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest pt-1 block leading-none">Ratio</span>
          </div>
        </div>
      </div>

      {/* Brief Alerts & Total Counts */}
      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-2 bg-white/[0.01] border border-white/5 p-2 rounded-xl text-center">
          <div>
            <span className="text-[8px] font-black text-slate-550 uppercase">PRESENT</span>
            <p className="text-sm font-black text-emerald-450 pt-0.5">{present} Class</p>
          </div>
          <div>
            <span className="text-[8px] font-black text-slate-550 uppercase">ABSENT</span>
            <p className="text-sm font-black text-red-405 pt-0.5">{absent} Class</p>
          </div>
        </div>

        {/* Minimal Shortage Banner Alert */}
        {isShortage ? (
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-405 leading-tight">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-bounce" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Shortage Warning! Below 75% limit.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-405 leading-tight">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wide">
              Compliance Clear. No shortage dues.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
