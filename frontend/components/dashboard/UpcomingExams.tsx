"use client";

import { useEffect, useState } from "react";
import { GraduationCap, Timer, Calendar, ClipboardCheck } from "lucide-react";

interface Exam {
  id: string;
  subjectCode: string;
  subjectName: string;
  date: string; // ISO / Date string
  session: string; // Morning / Afternoon
}

export default function UpcomingExams() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "exam-1",
      subjectCode: "CS-401",
      subjectName: "Database Management Systems",
      date: "2026-06-25T10:00:00.000Z",
      session: "FORENOON (10:00 AM - 01:00 PM)",
    },
    {
      id: "exam-2",
      subjectCode: "CS-403",
      subjectName: "Theory of Computation",
      date: "2026-06-28T14:00:00.000Z",
      session: "AFTERNOON (02:00 PM - 05:00 PM)",
    },
    {
      id: "exam-3",
      subjectCode: "CS-405",
      subjectName: "Compiler Design Lab",
      date: "2026-07-02T10:00:00.000Z",
      session: "FORENOON (10:00 AM - 01:00 PM)",
    },
  ]);

  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  useEffect(() => {
    const calculateCountdowns = () => {
      const times: Record<string, string> = {};
      exams.forEach((exam) => {
        const diffMs = new Date(exam.date).getTime() - Date.now();
        if (diffMs <= 0) {
          times[exam.id] = "Exam in progress / complete";
          return;
        }

        const days = Math.floor(diffMs / (24 * 3600 * 1000));
        const hours = Math.floor((diffMs % (24 * 3600 * 1000)) / (3600 * 1000));
        const mins = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));

        times[exam.id] = `${days}d ${hours}h ${mins}m`;
      });
      setCountdowns(times);
    };

    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [exams]);

  const getFormatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch (_) {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl select-none text-left">
      <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4.5 h-4.5 text-blue-400" />
          Academics Exam Lineup
        </h3>
        <span className="text-[9px] font-black bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded uppercase font-mono tracking-widest">
          SUMMER SESS
        </span>
      </div>

      <div className="space-y-3.5">
        {exams.map((exam) => (
          <div 
            key={exam.id} 
            className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-white/10 border border-transparent transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group"
          >
            {/* Subject Info */}
            <div className="space-y-1">
              <span className="inline-block text-[9px] font-black bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded uppercase select-all font-mono">
                {exam.subjectCode}
              </span>
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wide group-hover:text-white transition-colors pt-0.5 leading-none">
                {exam.subjectName}
              </h4>
              <p className="text-[10px] text-slate-550 font-bold leading-none pt-1">
                {exam.session}
              </p>
            </div>

            {/* Timers Column */}
            <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end gap-x-4 gap-y-1 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3.5 md:pt-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <Calendar className="w-4.5 h-4.5 text-slate-600" />
                {getFormatDate(exam.date)}
              </div>
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-lg text-xs font-black">
                <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                {countdowns[exam.id] || "Calculating..."}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
