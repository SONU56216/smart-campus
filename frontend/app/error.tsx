"use client";

import { useEffect } from "react";
import { Terminal, ShieldX, RefreshCw, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception metrics to systems
    console.error("Next.js Route Boundary Exception: ", error);
    toast.error("A critical system exception was intercepted.");
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none text-center relative overflow-hidden">
      {/* alarm strobe glow effect */}
      <div className="absolute w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[80px]" />

      <div className="max-w-md w-full space-y-6 z-10">
        
        {/* INTERCEPTED EXCEPTION INDICATOR */}
        <div className="w-20 h-20 bg-red-600/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto relative animate-bounce">
          <div className="absolute inset-0 rounded-3xl border-2 border-red-500/20 scale-110 animate-ping" />
          <ShieldX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase leading-none">
            PROTOCOL CORRUPTED
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono tracking-widest leading-none pt-1">
            DIGEST: {error.digest || "SYS_SECURE_INTEGRATION_ABORT"}
          </p>
          <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-left font-mono text-[9px] text-red-400 leading-relaxed overflow-x-auto scrollbar-none max-h-36">
            EXCEPTION LOGS:<br />
            {error.message || "An unhandled exception occurred rendering this route scope."}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={() => {
              toast.loading("Resetting internal viewport stacks...");
              setTimeout(() => {
                reset();
              }, 600);
            }}
            className="flex-1 py-3 text-xs font-black bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center inline-flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/10"
          >
            <RefreshCw className="w-4 h-4" /> Reset Workspace
          </button>

          <Link
            href="/dashboard"
            className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-white/5 uppercase tracking-wider text-center inline-flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
          </Link>
        </div>

      </div>

    </div>
  );
}
