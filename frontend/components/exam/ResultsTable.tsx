"use client";

import { useState } from "react";
import { ArrowUpDown, HelpCircle, Trophy, Sparkles, BookOpen } from "lucide-react";

export interface ScoreItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  maxMarks: number;
  obtainedMarks: number;
  grade: string;
  result: "PASS" | "FAIL" | "WITHHELD";
  credits?: number;
}

interface ResultsTableProps {
  scores: ScoreItem[];
}

export default function ResultsTable({ scores }: ResultsTableProps) {
  const [sortField, setSortField] = useState<keyof ScoreItem>("subjectCode");
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof ScoreItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedScores = [...scores].sort((a, b) => {
    let aVal = a[sortField] || "";
    let bVal = b[sortField] || "";

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }

    return sortAsc
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 pl-1">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 block">
            Subject-wise Grade Card Analysis
          </h3>
        </div>
        <span className="text-[10px] text-slate-550 uppercase font-bold">
          {scores.length} Subjects Evaluated
        </span>
      </div>

      <div className="border border-white/5 rounded-[24px] overflow-hidden bg-slate-900/10">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/80 text-slate-450 text-[10px] uppercase font-black tracking-widest text-left">
                <th
                  onClick={() => handleSort("subjectCode")}
                  className="py-4 px-5 hover:text-white cursor-pointer select-none font-mono"
                >
                  <div className="flex items-center gap-1.5">
                    Subject Code
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-5">Subject Title</th>
                <th
                  onClick={() => handleSort("obtainedMarks")}
                  className="py-4 px-5 hover:text-white cursor-pointer select-none text-right font-mono"
                >
                  <div className="flex items-center gap-1.5 justify-end">
                    Marks
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("grade")}
                  className="py-4 px-5 hover:text-white cursor-pointer select-none text-center"
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    Letter Grade
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-5 text-center">Outcome</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 bg-slate-900/10 text-xs">
              {sortedScores.map((score) => {
                const isPass = score.result === "PASS";
                const isWithheld = score.result === "WITHHELD";

                return (
                  <tr
                    key={score.id || score.subjectCode}
                    className="hover:bg-slate-900/30 transition-colors group"
                  >
                    {/* Subject Code */}
                    <td className="py-4 px-5 font-bold font-mono text-slate-400 text-[11px] uppercase tracking-wide">
                      {score.subjectCode}
                    </td>

                    {/* Subject Title */}
                    <td className="py-4 px-5 font-black text-white uppercase tracking-tight">
                      {score.subjectName}
                    </td>

                    {/* Marks achieved */}
                    <td className="py-4 px-5 text-right font-mono">
                      <div className="space-y-0.5">
                        <span className="text-white font-black text-sm">
                          {score.obtainedMarks}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold block">
                          / {score.maxMarks} Max
                        </span>
                      </div>
                    </td>

                    {/* Letter Grade */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`text-sm font-black px-3 py-1 rounded-full font-mono ${
                          score.grade.startsWith("A") || score.grade.startsWith("O")
                            ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                            : score.grade.startsWith("B")
                            ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                            : score.grade.startsWith("F")
                            ? "text-red-400 bg-red-500/10 border border-red-500/20"
                            : "text-slate-400 bg-slate-500/10 border border-slate-500/20"
                        }`}
                      >
                        {score.grade}
                      </span>
                    </td>

                    {/* Outcome Status */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md ${
                          isPass
                            ? "text-emerald-500 bg-emerald-500/10"
                            : isWithheld
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-red-500 bg-red-500/10"
                        }`}
                      >
                        {score.result}
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
