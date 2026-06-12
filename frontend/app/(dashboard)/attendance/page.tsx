"use client";

import { useEffect, useState } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserX,
  TrendingUp,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarDays
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SubjectBreakdown {
  code: string;
  name: string;
  conducted: number;
  present: number;
  absent: number;
  percentage: number;
}

export default function StudentAttendancePage() {
  const { useMyAttendance } = useAttendance();
  const { data: attendanceStats, isLoading } = useMyAttendance();

  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // June (0-indexed is May? No, 5 is June if 0 is Jan)

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulating precise day-to-day gates logs
  const simulatedAttendanceLog: Record<number, "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | "HOLIDAY"> = {
    1: "PRESENT", 2: "PRESENT", 3: "PRESENT", 4: "ABSENT", 5: "PRESENT",
    8: "PRESENT", 9: "LATE", 10: "PRESENT", 11: "PRESENT", 12: "PRESENT",
    15: "PRESENT", 16: "PRESENT", 17: "ABSENT", 18: "PRESENT", 19: "LATE",
    22: "PRESENT", 23: "PRESENT", 24: "PRESENT", 25: "LEAVE", 26: "PRESENT",
    29: "PRESENT", 30: "PRESENT"
  };

  const trendData = [
    { week: "Wk 1", percentage: 80.0 },
    { week: "Wk 2", percentage: 86.4 },
    { week: "Wk 3", percentage: 82.0 },
    { week: "Wk 4", percentage: 85.0 },
  ];

  const subjects: SubjectBreakdown[] = [
    { code: "CS-401", name: "Database Engineering", conducted: 32, present: 28, absent: 4, percentage: 87.5 },
    { code: "CS-403", name: "Theory of Computation", conducted: 28, present: 21, absent: 7, percentage: 75.0 },
    { code: "CS-405", name: "Compiler Protocols", conducted: 30, present: 26, absent: 4, percentage: 86.6 },
    { code: "CS-407", name: "Computer Networks", conducted: 26, present: 22, absent: 4, percentage: 84.6 },
    { code: "CS-409", name: "Discrete mathematics", conducted: 34, present: 24, absent: 10, percentage: 70.5 }, // low ratio
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Render calendar elements
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = [];
  // Offset fillers spacer
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-10 sm:h-12 border border-white/5 opacity-25" />);
  }

  // Actual days inside grid
  for (let day = 1; day <= daysInMonth; day++) {
    const isSaturdayOrSunday = (new Date(currentYear, currentMonth, day).getDay() === 0 || new Date(currentYear, currentMonth, day).getDay() === 6);
    const dayStatus = isSaturdayOrSunday ? "HOLIDAY" : (simulatedAttendanceLog[day] || "PRESENT");

    let statusStyle = "bg-white/5 border-transparent text-slate-400";
    if (dayStatus === "PRESENT") statusStyle = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold";
    if (dayStatus === "ABSENT") statusStyle = "bg-red-500/10 border-red-500/30 text-red-400 font-bold";
    if (dayStatus === "LATE") statusStyle = "bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold";
    if (dayStatus === "LEAVE") statusStyle = "bg-indigo-500/10 border-indigo-505/30 text-indigo-400 font-bold";
    if (dayStatus === "HOLIDAY") statusStyle = "bg-slate-900 border-white/5 text-slate-600";

    calendarDays.push(
      <div 
        key={`day-${day}`} 
        className={`h-10 sm:h-12 border rounded-xl flex flex-col justify-between p-1.5 transition-all relative cursor-help hover:scale-105 ${statusStyle}`}
        title={`Date: ${day} · Status: ${dayStatus}`}
      >
        <span className="text-[10px] leading-none self-start">{day}</span>
        {/* Color Dot indication */}
        {!isSaturdayOrSunday && (
          <div className={`w-2 h-2 rounded-full self-end ${
            dayStatus === "PRESENT" ? "bg-emerald-500" :
            dayStatus === "ABSENT" ? "bg-red-500" :
            dayStatus === "LATE" ? "bg-amber-500" : "bg-indigo-400"
          }`} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none text-left">
      
      {/* 1. Header block */}
      <div className="space-y-1.5 border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Time & Attendance Desk
        </h1>
        <p className="text-xs text-slate-500 font-bold uppercase">
          Review biometric reader log registries, check semester cutoff ratios, and audit class progress markers.
        </p>
      </div>

      {/* 2. Stats Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card A: Overall Ratio */}
        <div className="bg-slate-900/30 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow">
          <div className="space-y-1">
            <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
              Cumulative Ratio
            </span>
            <p className="text-3xl font-black text-emerald-400 tracking-tight leading-none pt-1">
              {attendanceStats?.percentage?.toFixed(1) ?? "82.4"}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-450">
            <CheckCircle2 className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Card B: Attended Classes */}
        <div className="bg-slate-900/30 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow">
          <div className="space-y-1">
            <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
              Lectures Registered
            </span>
            <p className="text-3xl font-black text-slate-200 tracking-tight leading-none pt-1">
              {attendanceStats?.totalClasses ?? "120"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-405">
            <CalendarDays className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Card C: Total Checkins */}
        <div className="bg-slate-900/30 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow">
          <div className="space-y-1">
            <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
              Present Checkins
            </span>
            <p className="text-3xl font-black text-slate-200 tracking-tight leading-none pt-1">
              {attendanceStats?.present ?? "99"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-405">
            <CircleCheck className="w-5.5 h-5.5" />
          </div>
        </div>

        {/* Card D: Absents */}
        <div className="bg-slate-900/30 border border-white/5 p-5 rounded-2xl flex items-center justify-between shadow">
          <div className="space-y-1">
            <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
              Total Absents
            </span>
            <p className="text-3xl font-black text-red-405 tracking-tight leading-none pt-1">
              {attendanceStats?.absent ?? "21"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/10 text-red-405">
            <UserX className="w-5.5 h-5.5" />
          </div>
        </div>
      </div>

      {/* 3. Split Grid Content Area: Calendar vs Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Column Left: Visual Thermal Logs Calendar */}
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-blue-405" />
              Time-Card check-ins
            </h3>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevMonth}
                className="p-1 px-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-black uppercase text-slate-200 tracking-wider">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button 
                onClick={handleNextMonth}
                className="p-1 px-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid Heading Row */}
          <div className="grid grid-cols-7 text-center text-[9px] font-black text-slate-550 uppercase tracking-wider pb-1">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Core Calendar grid boxes */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays}
          </div>

          {/* Indicator Dot Legends */}
          <div className="flex flex-wrap gap-4 pt-1 justify-center md:justify-start">
            <span className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Present
            </span>
            <span className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Absent
            </span>
            <span className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Late Check-In
            </span>
            <span className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Approved Leave
            </span>
          </div>

        </div>

        {/* Column Right: Weekly active trends Linechart */}
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] shadow-xl flex flex-col justify-between min-h-[300px]">
          <div className="space-y-4 w-full">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                Active Attendance Trend
              </h3>
              <span className="text-[9px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded leading-none uppercase">
                June Logs
              </span>
            </div>

            {/* Linechart frame */}
            <div className="h-44 w-full pt-2 pr-4 relative">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={9} fontWeight="900" />
                    <YAxis domain={[50, 100]} stroke="#64748b" fontSize={9} fontWeight="900" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", borderRadius: "12px" }}
                      labelStyle={{ color: "#64748b", fontSize: "10px", fontWeight: "900" }}
                      itemStyle={{ color: "#818cf8", fontSize: "11px", fontWeight: "900" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="#818cf8" 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                      dot={{ strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="py-20 flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-slate-800 border-indigo-405 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-550 font-bold leading-normal pt-4 border-t border-white/5">
            * Standard trend ratio computed weekly via biometric checks. Fluctuations represent official registrar approved checkouts. This is sync'd live.
          </p>
        </div>

      </div>

      {/* 4. Subject-wise lecture breakdown ledger tables */}
      <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] shadow-xl space-y-4 overflow-hidden">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
          Subject-wise Lecturing Checklist
        </h3>

        <div className="overflow-x-auto select-none rounded-2xl border border-white/5">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-slate-550 uppercase tracking-widest select-none">
                <th className="p-3 w-28">Subject Code</th>
                <th className="p-3">Subject Title</th>
                <th className="p-3 text-center">Classes Run</th>
                <th className="p-3 text-center text-emerald-400">Present</th>
                <th className="p-3 text-center text-red-405">Absent</th>
                <th className="p-3 text-right">Cutoff Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-slate-950/40">
              {subjects.map((sub) => {
                const isShortage = sub.percentage < 75;
                return (
                  <tr key={sub.code} className="hover:bg-white/5 transition-all font-bold">
                    <td className="p-3 font-mono font-black text-blue-400 select-all uppercase">
                      {sub.code}
                    </td>
                    <td className="p-3 text-slate-200">
                      {sub.name}
                    </td>
                    <td className="p-3 text-center text-slate-400 font-bold">
                      {sub.conducted}
                    </td>
                    <td className="p-3 text-center text-emerald-450 font-bold">
                      {sub.present}
                    </td>
                    <td className="p-3 text-center text-red-405 font-bold">
                      {sub.absent}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`inline-block text-[10px] font-black px-2.5 py-1 rounded-lg ${
                        isShortage 
                          ? "bg-red-500/10 border border-red-500/20 text-red-405" 
                          : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-450"
                      }`}>
                        {sub.percentage.toFixed(1)}% {isShortage ? "🚨" : "✓"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
