"use client";

import { Activity } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center select-none text-center p-4">
      
      {/* High precision loading frame */}
      <div className="space-y-6 max-w-sm w-full animate-pulse flex flex-col items-center justify-center">
        
        {/* Spinner block */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500/20 animate-spin" />
          <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] leading-none">
            Resolving Security Blocks...
          </p>
          <p className="text-[8.5px] text-slate-650 font-bold uppercase tracking-wider font-mono leading-none">
            Decrypting passkit encryption nodes
          </p>
        </div>

        {/* Dummy skeleton rods to simulate UI frames loading */}
        <div className="space-y-2 w-full pt-6">
          <div className="h-4 bg-slate-900 rounded-lg w-3/4 mx-auto" />
          <div className="h-3.5 bg-slate-900 rounded-lg w-1/2 mx-auto" />
        </div>

      </div>

    </div>
  );
}
