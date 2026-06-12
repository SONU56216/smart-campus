"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Grid } from "recharts";
import { Award, TrendingUp, Sparkles, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export interface SemesterGpa {
  semester: string;
  sgpa: number;
}

interface CGPAChartProps {
  currentSgpa: number;
  cgpa: number;
  history: SemesterGpa[];
}

export default function CGPAChart({ currentSgpa, cgpa, history }: CGPAChartProps) {
  // SVG circumference math for the circle gauge
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const targetPct = (currentSgpa / 10) * 100;
  const strokeDashoffset = circumference - (targetPct / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      {/* 1. Large Circular SGPA Gauge + CGPA block (Left Column) */}
      <div className="lg:col-span-5 bg-slate-900/30 border border-white/5 p-6 rounded-[28px] flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 z-10">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
            Registry Appraisal Overview
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase">
            Official credit appraisal index parameters
          </p>
        </div>

        {/* Circular Gauge */}
        <div className="py-6 flex flex-col items-center justify-center relative select-none">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Background circle track */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Dynamic filled tracking circle */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-blue-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>

            {/* Inset Label Center Text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
                Active SGPA
              </span>
              <span className="text-3xl font-black text-white font-mono leading-tight py-0.5">
                {currentSgpa.toFixed(2)}
              </span>
              <span className="text-[9px] text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                Outstanding
              </span>
            </div>
          </div>
        </div>

        {/* Cumulative CGPA bottom indicator and mini visual summary */}
        <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center z-10">
          <div className="space-y-0.5">
            <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
              Cumulative CGPA Ledger
            </span>
            <span className="text-white text-lg font-black font-mono">
              {cgpa.toFixed(2)} / 10.0
            </span>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/15 py-1 px-3 rounded-full flex items-center gap-1.5 animate-pulse">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase font-mono">
              Grade: O (Elite)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Historical Progress Bar Chart (Right Column) */}
      <div className="lg:col-span-7 bg-slate-900/30 border border-white/5 p-6 rounded-[28px] space-y-4 flex flex-col justify-between">
        <div className="space-y-1">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Semester-by-Semester Progression
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase">
            Trajectory scorecard analysis reflecting academic cycles
          </p>
        </div>

        {/* Recharts Container */}
        <div className="h-48 md:h-56 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="semester"
                stroke="#64748b"
                fontSize={9}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                stroke="#64748b"
                fontSize={9}
                domain={[0, 10]}
                tickCount={6}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950 border border-white/10 p-2.5 px-3.5 rounded-xl space-y-0.5 shadow-xl">
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                          Semester {payload[0].payload.semester}
                        </p>
                        <p className="text-xs font-black text-white font-mono">
                          SGPA: {Number(payload[0].value).toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="sgpa"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
