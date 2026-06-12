"use client";

import FacultyDirectory from "@/components/campus/FacultyDirectory";
import { GraduationCap, ExternalLink } from "lucide-react";

export default function FacultyDirectoryPage() {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            Metropolitan Academic Faculty Guild
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Direct registry mapping of professors, research fellows, laboratory directors, and office registrars.
          </p>
        </div>

        <a 
          href="https://metrouni.edu.in" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-emerald-400 hover:text-emerald-350"
        >
          University Directory Handbook <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Roster component */}
      <FacultyDirectory />

    </div>
  );
}
