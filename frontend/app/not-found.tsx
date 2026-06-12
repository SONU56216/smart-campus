"use client";

import Link from "next/link";
import { Compass, ShieldAlert, ChevronLeft, LayoutDashboard } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none text-center relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute w-[320px] h-[320px] bg-blue-600/5 rounded-full blur-[90px]" />
      
      <div className="max-w-md w-full space-y-6 z-10">
        
        {/* RADAR RETICLE ICON GRID */}
        <div className="w-24 h-24 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-3xl flex items-center justify-center mx-auto relative animate-pulse">
          <div className="absolute inset-0 rounded-3xl border-2 border-blue-500/20 scale-110 animate-ping" />
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">404 PATH LOST</h1>
          <p className="text-xs text-slate-500 font-bold uppercase font-mono tracking-widest leading-none">
            Error Code: HTTP_NOT_FOUND_MATRIX
          </p>
          <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-semibold pt-2">
            The credential segment or virtual page coordinates you are looking for has been relocated, purged, or is locked under different clearance levels.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button 
            onClick={() => window.history.back()}
            className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center inline-flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" /> Go Back
          </button>
          
          <Link 
            href="/dashboard"
            className="flex-1 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center shadow-lg shadow-blue-500/25 inline-flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" /> Go Home
          </Link>
        </div>

      </div>

    </div>
  );
}
