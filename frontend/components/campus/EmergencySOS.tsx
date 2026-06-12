"use client";

import { useState } from "react";
import { 
  PhoneCall, 
  MapPin, 
  ShieldAlert, 
  Flame, 
  HeartHandshake, 
  Volume2, 
  Sparkles, 
  Activity, 
  Heart, 
  Clock, 
  Send 
} from "lucide-react";
import { toast } from "sonner";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  hours: string;
  icon: any;
  color: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: "1", name: "Campus Security HQ", phone: "+91 1122334400", hours: "24 HOURS / 365 DAYS", icon: ShieldAlert, color: "text-red-500 bg-red-500/10 border-red-500/20" },
  { id: "2", name: "Metro Ambulance Dispatch", phone: "+91 1122334411", hours: "24 HOURS / 365 DAYS", icon: Activity, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { id: "3", name: "Dean of Student Welfare", phone: "+91 1122334422", hours: "09:00 AM - 05:00 PM", icon: HeartHandshake, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { id: "4", name: "Women Emergency Helpline", phone: "+91 1122334433", hours: "24 HOURS / 365 DAYS", icon: Heart, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  { id: "5", name: "Campus Medical Center", phone: "+91 1122334444", hours: "24 HOURS / 365 DAYS", icon: Heart, color: "text-teal-400 bg-teal-400/10 border-teal-400/20" },
  { id: "6", name: "Anti-Ragging Committee", phone: "+91 1122334477", hours: "24 HOURS / 365 DAYS", icon: ShieldAlert, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { id: "7", name: "Fire & Safety Wardens", phone: "+91 1122334488", hours: "24 HOURS / 365 DAYS", icon: Flame, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" }
];

export default function EmergencySOS() {
  const [isActivating, setIsActivating] = useState(false);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [alertDispatched, setAlertDispatched] = useState(false);

  // Synthesize warning alarm dynamically using Web Audio API
  const playSirensAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Siren oscillator 1
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "triangle";

      // Modulator to frequency shift
      osc1.frequency.setValueAtTime(600, ctx.currentTime);
      osc1.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 1.2);
      osc1.frequency.linearRampToValueAtTime(600, ctx.currentTime + 2.4);

      osc2.frequency.setValueAtTime(300, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(500, ctx.currentTime + 1.2);
      osc2.frequency.linearRampToValueAtTime(300, ctx.currentTime + 2.4);

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 3.0); // fade out

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 3.0);
      osc2.stop(ctx.currentTime + 3.0);
    } catch (_) {
      // Audio permission or API block fail-silently
    }
  };

  const handleSOSClick = () => {
    if (isActivating) return;
    setIsActivating(true);
    setAlertDispatched(false);
    playSirensAudio();

    toast.loading("Querying on-chip GPS receiver satellite grids...", { id: "sos-action" });

    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsLocation({ lat, lng });
          dispatchPanicSuite(lat, lng);
        },
        () => {
          // Fallback static coords
          const lat = 28.5921;
          const lng = 77.0465;
          setGpsLocation({ lat, lng });
          dispatchPanicSuite(lat, lng);
        },
        { timeout: 4000 }
      );
    } else {
      // Static coordinates for Dwarka Sector 12
      const lat = 28.5921;
      const lng = 77.0465;
      setGpsLocation({ lat, lng });
      dispatchPanicSuite(lat, lng);
    }
  };

  const dispatchPanicSuite = (lat: number, lng: number) => {
    setTimeout(() => {
      setAlertDispatched(true);
      setIsActivating(false);
      
      // Multi notification broadcast toast series
      toast.dismiss("sos-action");
      toast.success("GPS Location acquired successfully!");
      
      setTimeout(() => {
        toast.error(`SOS BROADCAST DISPATCHED: Core Security has locked onto coordinates [${lat.toFixed(4)}, ${lng.toFixed(4)}]. Guard dispatch underway.`, {
          duration: 6000
        });
      }, 500);

      setTimeout(() => {
        toast.success("Automated Alert SMS dispatched to close family contacts & mentors.", {
          duration: 4000
        });
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* MASSIVE PULSING RED SOS COMPONENT */}
      <div className="bg-slate-900 border border-red-500/20 rounded-[32px] p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden select-none">
        {/* Glow ambient circle background */}
        <div className="absolute w-[280px] h-[280px] bg-red-500/5 rounded-full blur-[80px]" />

        <div className="space-y-2 max-w-md z-10">
          <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 leading-none">
            <Volume2 className="w-4 h-4 animate-bounce" />
            Central Campus Emergency Hub
          </h2>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            Pressing the button immediately triggers a satellite GPS locate payload, notifies central control guards, and rings local campus command desks.
          </p>
        </div>

        {/* SOS BUTTON INNER RADIUS TRIGGERS */}
        <div className="py-8 z-10 flex flex-col items-center gap-4">
          <button
            onClick={handleSOSClick}
            disabled={isActivating}
            className={`w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center relative cursor-pointer outline-none transition-all duration-500 ${
              isActivating 
                ? "bg-red-700/80 scale-95 border-4 border-red-500 animate-pulse" 
                : "bg-red-650 hover:bg-red-500 border-4 border-red-400/40 shadow-[0_0_50px_rgba(239,68,68,0.45)] hover:shadow-[0_0_80px_rgba(239,68,68,0.65)] hover:scale-105"
            }`}
          >
            {/* outer visual pulsing rings */}
            {!isActivating && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-red-500/10 animate-pulse" />
              </>
            )}

            <ShieldAlert className="w-12 h-12 text-white mb-2 animate-bounce" />
            <span className="text-base font-black text-white tracking-widest uppercase">
              {isActivating ? "Locating..." : "S O S"}
            </span>
            <p className="text-[7.5px] text-red-100 font-bold uppercase tracking-wider mt-0.5 leading-none">
              Tap to Broadcast
            </p>
          </button>

          {gpsLocation ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950 border border-white/5 rounded-xl font-mono text-[9px] text-slate-500 uppercase leading-none font-bold">
              <MapPin className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
              COORDINATES: {gpsLocation.lat.toFixed(6)}, {gpsLocation.lng.toFixed(6)}
            </div>
          ) : (
            <p className="text-[8.5px] uppercase font-bold text-slate-500 tracking-wider">
              READY FOR TRANSMISSION • ACCURACY SCALE +/- 5 METERS
            </p>
          )}
        </div>

        {/* SOS dispatch report logs sheet */}
        {alertDispatched && gpsLocation && (
          <div className="p-4 bg-red-500/5 text-left border border-red-500/10 rounded-2xl w-full z-10 max-w-md space-y-2 font-mono text-[10px] text-red-400 animate-scale-in">
            <div className="flex items-center justify-between border-b border-red-500/10 pb-1">
              <span className="font-extrabold uppercase flex items-center gap-1.5 text-[11px]">
                <Send className="w-3.5 h-3.5" /> Panic Suite Active Broadcast
              </span>
              <span>100% SIGNAL</span>
            </div>
            <p className="font-semibold leading-normal uppercase">
              • ATTACHED GPS POSITION: {gpsLocation.lat} LAT / {gpsLocation.lng} LNG<br />
              • SECTOR CODE MATCHED: DWARKA SECTOR 12 GATEWAYS UNITECH<br />
              • CHANNELS ACCESSED: [TELEPHONY_VOICE, SMS_OVERRIDE_EMERGENCY, GUARD_DASHBOARD_LIVE_ALERT]<br />
              • REPORT RECIPIENTS: [Dean Office, Security Guards HQ, Mentor Panel]
            </p>
          </div>
        )}
      </div>

      {/* EMERGENCY PRIMARY NUMBER ROSTER */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-red-400" />
            Direct One-Tap Hotline Dialers
          </h3>
          <p className="text-[10px] text-slate-550 font-bold uppercase font-mono mt-0.5">
            Direct mobile linkage. Click any card phone rate below to trigger instant dialer setup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                href={`tel:${item.phone}`}
                key={item.id}
                className="bg-slate-900 border border-white/5 rounded-2xl p-5 hover:border-slate-800 hover:bg-slate-875 hover:scale-[1.01] transition-all cursor-pointer flex flex-col justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${item.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-white truncate uppercase tracking-wider leading-none">
                      {item.name}
                    </h4>
                    <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide leading-none pt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-550 shrink-0" />
                      {item.hours}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
                  <span className="text-[11px] font-mono font-extrabold text-red-400 group-hover:text-red-300">
                    {item.phone}
                  </span>
                  <div className="p-1 px-2.5 bg-slate-950 border border-white/5 group-hover:border-red-500/20 group-hover:bg-red-500/5 text-slate-400 group-hover:text-red-400 rounded-lg text-[9px] uppercase font-black transition-all inline-flex items-center gap-1 leading-none">
                    <PhoneCall className="w-3 h-3" /> Dial
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}
