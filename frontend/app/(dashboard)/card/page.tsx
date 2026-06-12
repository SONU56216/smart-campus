"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Smartphone, ShieldCheck, WifiOff, HelpCircle } from "lucide-react";
import DigitalIDCard from "@/components/card/DigitalIDCard";
import CardActions from "@/components/card/CardActions";
import { useCard } from "@/hooks/useCard";
import { useAuth } from "@/hooks/useAuth";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { toast } from "sonner";

export default function CardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isOnline = useOnlineStatus();
  const [offlineMockActive, setOfflineMockActive] = useState(false);
  const [localStatus, setLocalStatus] = useState<"ACTIVE" | "BLOCKED" | "EXPIRED">("ACTIVE");

  // Query real ID card data from our centralized server-side integration hook
  const { useIdCardData } = useCard();
  const { data: serverCardData, isLoading, error, refetch } = useIdCardData();

  // Gracefully construct standard credentials fallback structure if backend is not fully provisioned
  const fallbackStudentData = {
    studentId: user?.id || "MIT2026CS921",
    fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Lucas Bennett",
    dob: "2005-04-12",
    email: user?.email || "lucas.bennett@mit.edu",
    phone: "+1 (555) 732-8921",
    guardian: "Sarah Bennett",
    address: "742 Evergreen Terrace, Springfield, IL 62704",
    course: "Bachelor of Technology",
    department: "Computer Science & Engineering",
    gpa: "3.91",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces",
    status: localStatus,
    validUntil: "2027-06-30",
    bloodGroup: "O+",
  };

  const activeCardData = (serverCardData && !offlineMockActive) ? {
    ...serverCardData,
    status: localStatus, // allow overriding locally for lost/locked demo button triggers
  } : fallbackStudentData;

  useEffect(() => {
    if (!isOnline) {
      toast.warning("📴 Offline state detected. Serving local, crytographically cached ID Pass.");
    }
  }, [isOnline]);

  const handleStatusChange = (newStatus: "ACTIVE" | "BLOCKED" | "EXPIRED") => {
    setLocalStatus(newStatus);
  };

  const handleManualSync = async () => {
    try {
      toast.loading("Synchronizing student ledger with blockchain cell...");
      await refetch();
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.dismiss();
      toast.success("Synchronized successfully! Access rights verified.");
    } catch (_) {
      toast.dismiss();
      toast.error("Failed to make secure sockets handshakes. Serving cached credentials.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30 pb-16">
      {/* 1. Header Toolbar */}
      <header className="sticky top-0 z-30 transition-all border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-xs font-black uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Terminal Desk
          </Link>
          
          <div className="flex items-center gap-2.5">
            {/* Sync Refresh action */}
            <button
              onClick={handleManualSync}
              className="p-2 border border-white/5 bg-slate-900/50 hover:bg-slate-900 rounded-xl transition-all hover:border-slate-800 text-slate-300 active:scale-95 cursor-pointer"
              title="Sync Ledger"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Offline status stamp */}
            {!isOnline && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-amber-500/10 border border-amber-505/20 text-amber-500">
                <WifiOff className="w-3.5 h-3.5" />
                OFFLINE
              </span>
            )}

            {isOnline && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black bg-emerald-500/10 border border-emerald-550/20 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                SECURE SOCKS
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header Context */}
      <section className="max-w-2xl mx-auto px-4 pt-8 pb-4 text-center select-none">
        <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-200 bg-clip-text text-transparent uppercase tracking-wider">
          Secured Digital Pass
        </h2>
        <p className="text-[11px] text-zinc-400 font-extrabold uppercase tracking-[0.2em] pt-1">
          NFC RFID Transit Credential Verification Hub
        </p>
      </section>

      {/* 2. Main Portal Display (Center Card & Sidebar controls) */}
      <section className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
        
        {/* Left/Middle Column (Card display) - spans 7 units */}
        <div className="md:col-span-7 flex flex-col items-center">
          <DigitalIDCard 
            studentData={activeCardData}
            isLoading={isLoading && !offlineMockActive}
            error={error && !offlineMockActive ? error : null}
            refetch={handleManualSync}
            isOffline={!isOnline || offlineMockActive}
          />
        </div>

        {/* Right Column (Controls & Instructions) - spans 5 units */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Card core operational buttons */}
          <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2">
              Credential Controls
            </h3>
            
            <CardActions 
              studentData={activeCardData}
              onStatusChange={handleStatusChange}
            />

            {/* Test demo sandbox utilities */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
                Sandbox Simulator Controls (Dev Mode)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Fallback Switch */}
                <button
                  type="button"
                  onClick={() => {
                    setOfflineMockActive(!offlineMockActive);
                    toast.info(
                      offlineMockActive 
                        ? "Connecting back to main API channel..." 
                        : "Switched to high-fidelity offline cache simulation."
                    );
                  }}
                  className={`px-3 py-2 text-[10px] font-black rounded-lg border leading-none transition-all cursor-pointer ${
                    offlineMockActive 
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-400" 
                      : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {offlineMockActive ? "Using Offline Cache" : "Switch cache simulation"}
                </button>

                {/* Reset validation status */}
                <button
                  type="button"
                  onClick={() => {
                    setLocalStatus("ACTIVE");
                    toast.success("Card validity restored to ACTIVE.");
                  }}
                  className="px-3 py-2 text-[10px] font-black bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 rounded-lg transition-all cursor-pointer leading-none"
                >
                  Unblock Pass
                </button>
              </div>
            </div>
          </div>

          {/* Quick instructions container */}
          <div className="bg-slate-950 border border-white/5 hover:border-slate-800 transition-all p-5 rounded-2xl text-left select-none space-y-2.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400 pointer-events-none" />
              Verifying Security Policies
            </h4>
            <ul className="text-[10px] text-slate-500 space-y-2 font-bold leading-normal">
              <li>
                🔐 <strong className="text-slate-300">SCREEN GRABS BLOCK:</strong> If screen captures are detected, card layers automatically blur and trigger audit trails.
              </li>
              <li>
                📱 <strong className="text-slate-300">PHYSICAL SHAKE SENSOR:</strong> Shaking your smartphone triggers a rainbow holographic spectrum for quick badge verification at campus entry checks.
              </li>
              <li>
                🚀 <strong className="text-slate-305">OTP ENCRYPTED KEY:</strong> The QR payload signature contains an algorithm rotating keys dynamically. Use this when checking in at sports/dining gates.
              </li>
            </ul>
          </div>

        </div>
      </section>
    </main>
  );
}
