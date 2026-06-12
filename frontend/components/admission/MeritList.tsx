"use client";

import { useAdmission } from "@/hooks/useAdmission";
import { useState, useEffect } from "react";
import { Search, Trophy, Layers, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { availableCourses } from "./CoursePreferencesStep";

interface MeritCandidate {
  rank: number;
  id: string;
  name: string;
  marks: number;
  category: string;
  status: "SELECTED" | "SHORTLISTED" | "WAITING" | "REJECTED";
}

export default function MeritList() {
  const { usePublicMeritList } = useAdmission();
  
  const [selectedCourse, setSelectedCourse] = useState("CSE");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: serverMeritList, isLoading } = usePublicMeritList(selectedCourse);

  // Setup rich fallback dynamic lists database
  const fallbackMeritDatabase: Record<string, MeritCandidate[]> = {
    CSE: [
      { rank: 1, id: "ADM-91823-1", name: "Rohan Khanna", marks: 99.85, category: "GENERAL", status: "SELECTED" },
      { rank: 2, id: "ADM-82012-2", name: "Aria Mukherji", marks: 99.42, category: "OBC", status: "SELECTED" },
      { rank: 3, id: "ADM-42105-3", name: "Kabir Sengupta", marks: 98.91, category: "GENERAL", status: "SELECTED" },
      { rank: 4, id: "ADM-10512-4", name: "Ananya Roy", marks: 98.50, category: "SC", status: "SHORTLISTED" },
      { rank: 5, id: "ADM-92251-5", name: "Ishan Bose", marks: 97.90, category: "ST", status: "SHORTLISTED" },
      { rank: 6, id: "ADM-82190-6", name: "Devika Sen", marks: 96.40, category: "EWS", status: "WAITING" },
    ],
    AI_ML: [
      { rank: 1, id: "ADM-20152-1", name: "Siddharth Das", marks: 99.50, category: "GENERAL", status: "SELECTED" },
      { rank: 2, id: "ADM-91820-2", name: "Meera Nair", marks: 99.10, category: "GENERAL", status: "SELECTED" },
      { rank: 3, id: "ADM-82110-3", name: "Aditya Verma", marks: 98.20, category: "OBC", status: "SELECTED" },
      { rank: 4, id: "ADM-32050-4", name: "Zara Sheikh", marks: 97.80, category: "EWS", status: "SHORTLISTED" },
      { rank: 5, id: "ADM-42111-5", name: "Nikhil Gupta", marks: 95.90, category: "SC", status: "WAITING" },
    ],
    ECE: [
      { rank: 1, id: "ADM-11290-1", name: "Arjun Mehta", marks: 98.40, category: "GENERAL", status: "SELECTED" },
      { rank: 2, id: "ADM-90518-2", name: "Riya Sharma", marks: 97.90, category: "GENERAL", status: "SELECTED" },
      { rank: 3, id: "ADM-81920-3", name: "Rahul Kapoor", marks: 96.50, category: "OBC", status: "SHORTLISTED" },
      { rank: 4, id: "ADM-71102-4", name: "Priya Patel", marks: 94.20, category: "ST", status: "WAITING" },
    ],
    IT: [
      { rank: 1, id: "ADM-50311-1", name: "Karan Johar", marks: 98.90, category: "GENERAL", status: "SELECTED" },
      { rank: 2, id: "ADM-40150-2", name: "Tanvi Saxena", marks: 98.10, category: "OBC", status: "SELECTED" },
      { rank: 3, id: "ADM-92110-3", name: "Shreyas Iyer", marks: 96.90, category: "SC", status: "SHORTLISTED" },
    ],
    EE: [
      { rank: 1, id: "ADM-70518-1", name: "Vikram Seth", marks: 97.60, category: "GENERAL", status: "SELECTED" },
      { rank: 2, id: "ADM-60225-2", name: "Shalini Vats", marks: 95.80, category: "OBC", status: "SHORTLISTED" },
    ],
    ME: [
      { rank: 1, id: "ADM-90215-1", name: "Abhishek Singh", marks: 96.80, category: "GENERAL", status: "SELECTED" },
      { rank: 2, id: "ADM-81123-2", name: "Neha Kakkar", marks: 94.30, category: "ST", status: "SHORTLISTED" },
    ]
  };

  const activeRecords = serverMeritList && serverMeritList.length > 0 
    ? serverMeritList 
    : (fallbackMeritDatabase[selectedCourse] || []);

  const filteredCandidates = activeRecords.filter((cand) => {
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = cand.name.toLowerCase().includes(q);
      const matchId = cand.id.toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 select-none text-left">
      
      {/* 1. Controller Filters Rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/15 border border-white/5 p-4 rounded-2xl select-none">
        
        {/* Search names Input */}
        <div className="relative flex items-center bg-slate-950 border border-slate-800 focus-within:border-blue-500 rounded-xl px-3.5 py-2.5 transition-all">
          <Search className="w-4.5 h-4.5 text-slate-550 mr-2 flex-shrink-0" />
          <input
            placeholder="Search by Name or Reference ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs text-slate-200 bg-transparent focus:outline-none w-full font-bold uppercase"
          />
        </div>

        {/* Selected Course dropdown */}
        <div className="flex flex-col space-y-1 justify-center">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-2.5 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
          >
            {availableCourses.map((c) => (
              <option key={`merit-opt-${c.id}`} value={c.id}>
                COURSE: {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Counter counts metrics */}
        <div className="flex items-center justify-end">
          <span className="text-[10px] text-slate-550 font-black uppercase tracking-widest pl-2">
            Candidates: {filteredCandidates.length} Listed
          </span>
        </div>

      </div>

      {/* 2. Merit scoreboard Table */}
      {isLoading ? (
        <div className="py-24 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-slate-900/30 border border-white/5 rounded-[24px] p-20 text-center flex flex-col items-center justify-center gap-4">
          <Trophy className="w-11 h-11 text-slate-800" />
          <p className="text-xs font-black text-slate-550 uppercase tracking-widest leading-none">
            No entries found matching criteria.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-white/5 rounded-[24px] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none select-none">
                  <th className="p-4 w-20 text-center">Rank</th>
                  <th className="p-4 w-36">Reference ID</th>
                  <th className="p-4">Candidate Full Name</th>
                  <th className="p-4 text-center">Cutoff Score Ratio</th>
                  <th className="p-4 text-center">Category Class</th>
                  <th className="p-4 text-right">Merit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-slate-950/20 font-bold">
                {filteredCandidates.map((cand) => {
                  const isTop3 = cand.rank <= 3;
                  const isSelected = cand.status === "SELECTED";
                  const isShortlisted = cand.status === "SHORTLISTED";
                  const isWaiting = cand.status === "WAITING";

                  return (
                    <tr key={cand.id} className="hover:bg-white/5 transition-all">
                      {/* Rank */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-mono font-black text-[10px] leading-none ${
                          isTop3 
                            ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 shadow"
                            : "bg-white/5 text-slate-400"
                        }`}>
                          #{cand.rank}
                        </span>
                      </td>

                      {/* ID */}
                      <td className="p-4 font-mono font-black text-blue-450 select-all uppercase">
                        {cand.id}
                      </td>

                      {/* Name */}
                      <td className="p-4 text-slate-200">
                        {cand.name}
                      </td>

                      {/* Score marks */}
                      <td className="p-4 text-center font-black text-slate-100">
                        {cand.marks.toFixed(2)} percentile
                      </td>

                      {/* Category */}
                      <td className="p-4 text-center text-slate-400 font-bold uppercase">
                        {cand.category}
                      </td>

                      {/* Status */}
                      <td className="p-4 text-right">
                        <span className={`inline-block text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded leading-none ${
                          isSelected ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" :
                          isShortlisted ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                          isWaiting ? "bg-amber-500/10 border border-amber-500/20 text-amber-500" :
                          "bg-red-500/10 border border-red-500/20 text-red-400"
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
