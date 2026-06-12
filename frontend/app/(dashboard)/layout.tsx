"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import MobileNav from "@/components/dashboard/MobileNav";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, fetchMe } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Sync session and perform safety login checkpoint redirects
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
      router.push("/login"); // Lock access to unauthorised visitor sessions
    }
  }, [checkingAuth, isAuthenticated, router]);

  if (checkingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center select-none text-center">
        {/* Sleek rotating ring loader */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-indigo-500/30 animate-spin" />
          {/* logo heart beat badge inside */}
          <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 text-blue-400">
              <path d="M50,15 L80,25 L80,55 C80,72 50,85 50,85 C50,85 20,72 20,55 L20,25 L50,15 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] pt-5 leading-none">
          Decrypting PassKit Certificates...
        </p>
      </div>
    );
  }

  // Session authenticated, serve student board
  if (!isAuthenticated) return null;

  return (
    <div className="relative flex min-h-screen bg-slate-950 text-slate-100 antialiased overflow-x-hidden selection:bg-blue-500/20">
      
      {/* 1. Desktop Left Sidebar */}
      <Sidebar />

      {/* 2. Main Area Panel */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 h-screen overflow-y-auto bg-slate-950">
        {/* Dynamic Header */}
        <Navbar />

        {/* Dynamic Pages Area wrapped in responsive margins and spacing grids padding */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {children}
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation Menu */}
      <MobileNav />
    </div>
  );
}
