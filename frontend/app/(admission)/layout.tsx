"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ShieldAlert, Compass } from "lucide-react";

export default function AdmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchMe } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkState = async () => {
      try {
        await fetchMe();
      } catch (_) {} finally {
        setCheckingAuth(false);
      }
    };
    
    checkState();
  }, [fetchMe]);

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [checkingAuth, isAuthenticated, router]);

  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center select-none text-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500/30 animate-spin" />
          <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 text-blue-400">
              <path d="M50,15 L80,25 L80,55 C80,72 50,85 50,85 C50,85 20,72 20,55 L20,25 L50,15 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-slate-550 font-black uppercase tracking-[0.25em] pt-5 leading-none">
          SECURE SECTOR AUDITING...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/25 flex flex-col justify-between">
      
      {/* Dynamic Simple Admissions navigation header */}
      <header className="border-b border-white/5 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between select-none">
          <div 
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Compass className="w-4.5 h-4.5" />
            </div>
            <div className="leading-tight text-left">
              <span className="text-xs font-black tracking-widest text-white uppercase block">
                CAMPUS PASS
              </span>
              <span className="text-[9.5px] font-black text-blue-502 text-blue-400 uppercase block tracking-wider leading-none">
                Admissions desk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/apply")}
              className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Enroll Apply
            </button>
            <button
              onClick={() => router.push("/status")}
              className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Tracker Status
            </button>
            <button
              onClick={() => router.push("/merit-list")}
              className="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
            >
              Public Rankings
            </button>
          </div>
        </div>
      </header>

      {/* Primary child renders container with centering spacers */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 lg:p-8 py-8 md:py-12">
        {children}
      </main>

      {/* Simple footer legal compliance terms */}
      <footer className="border-t border-white/5 py-4 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[9.5px] uppercase font-bold text-slate-550 tracking-wide">
            © 2026 Campus Pass Systems. Certified Admissions Office & Chancellor's Seat Regulations Apply.
          </p>
        </div>
      </footer>

    </div>
  );
}
