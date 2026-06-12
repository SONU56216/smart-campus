"use client";

import { useEffect, useState } from "react";
import { 
  WifiOff, 
  RefreshCw, 
  CreditCard, 
  Smartphone, 
  MapPin, 
  Bell, 
  CheckCircle2, 
  Sparkles,
  Award
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleManualCheck = () => {
    if (typeof window !== "undefined") {
      const live = navigator.onLine;
      setIsOnline(live);
      if (live) {
        toast.success("Connection re-established successfully! Syncing active passes...");
        window.location.reload();
      } else {
        toast.error("Still offline. Ensure cellular network bands or university Wi-Fi is active.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 select-none text-center relative overflow-hidden">
      {/* ambient glows */}
      <div className="absolute w-[300px] h-[300px] bg-slate-800/10 rounded-full blur-[80px]" />

      <div className="max-w-md w-full space-y-6 z-10 text-left">
        
        {/* INTERPOLATED WIFI OFF VISUALIZER */}
        <div className="w-20 h-20 bg-slate-900 border border-white/5 text-slate-400 rounded-3xl flex items-center justify-center mx-auto relative animate-pulse">
          <WifiOff className="w-10 h-10 text-slate-500" />
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">YOU&apos;RE DISCONNECTED</h1>
          <p className="text-xs text-slate-500 font-bold uppercase font-mono tracking-widest leading-none">
            COMMUNICATION BAND INTERRUPTED
          </p>
          <p className="text-xs text-slate-450 leading-relaxed font-semibold pt-2">
            The applet has transitioned into sandbox mode due to a lack of active cellular or Wi-Fi connectivity. Critical security features remain cache-active locally.
          </p>
        </div>

        {/* RECONNECT ACTION CONTROLLER */}
        <button
          onClick={handleManualCheck}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 leading-none shadow-lg shadow-blue-500/10"
        >
          <RefreshCw className="w-4 h-4" /> Verify Connection & Sync
        </button>

        {/* OFFLINE SECURE CACHED DATA LIST */}
        <div className="space-y-3 pt-4">
          <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">
            Locally Saved Offline Cache Blocks
          </span>

          <div className="space-y-2.5">
            {[
              { label: "My Smart Pass Barcode", desc: "Encryption tokens cached securely. Ready for offline optical scanner gates.", icon: CreditCard },
              { label: "Calibrated Campus blueprints", desc: "Vector map shapes and building legends active offline.", icon: MapPin },
              { label: "Emergency dialer contacts", desc: "Telecom links remain fully dial-ready without cellular internet.", icon: Smartphone },
              { label: "Incoming announcement board", desc: "Recently retrieved inbox publications index.", icon: Bell }
            ].map((cache, i) => {
              const Icon = cache.icon;
              return (
                <div key={i} className="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-slate-950 border border-white/5 rounded-xl text-blue-400 shrink-0">
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-white uppercase tracking-wider leading-none flex items-center gap-1.5">
                      {cache.label}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    </span>
                    <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                      {cache.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* iOS offline standalone reminder block */}
        <div className="p-4.5 bg-gradient-to-tr from-blue-500/10 to-transparent border border-blue-500/10 rounded-2xl flex items-start gap-3">
          <Award className="w-5 h-5 text-blue-400 shrink-0" />
          <p className="text-[9.5px] text-slate-400 font-bold uppercase font-mono leading-normal">
            Local browser storage allows full offline access to barcodes and pass graphics. No printouts necessary when boarding turnstiles.
          </p>
        </div>

      </div>

    </div>
  );
}
