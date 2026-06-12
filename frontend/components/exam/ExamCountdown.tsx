"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldAlert } from "lucide-react";

interface ExamCountdownProps {
  targetDate: string;
  title: string;
  subtitle?: string;
  onExpiry?: () => void;
}

export default function ExamCountdown({
  targetDate,
  title,
  subtitle = "Hacking registry streams in genuine real-time...",
  onExpiry,
}: ExamCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setIsExpired(true);
        if (onExpiry) onExpiry();
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpiry]);

  if (isExpired) {
    return (
      <div className="p-8 bg-slate-950 border border-white/5 rounded-3xl text-center space-y-4 max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
        <div className="space-y-1">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Countdown Elapsed</h3>
          <p className="text-xs text-slate-500 font-bold uppercase">The admit cards or services are now fully unfurled.</p>
        </div>
      </div>
    );
  }

  const items = [
    { label: "Days", value: timeLeft.days, color: "from-blue-500 to-indigo-600" },
    { label: "Hours", value: timeLeft.hours, color: "from-indigo-500 to-purple-600" },
    { label: "Mins", value: timeLeft.minutes, color: "from-purple-500 to-pink-600" },
    { label: "Secs", value: timeLeft.seconds, color: "from-pink-500 to-red-600" },
  ];

  return (
    <div className="bg-slate-900/30 border border-white/5 p-8 rounded-[32px] text-center max-w-xl mx-auto space-y-6 relative overflow-hidden backdrop-blur-md">
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/5 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Title block */}
      <div className="space-y-1.5">
        <span className="text-[9px] font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 animate-spin [animation-duration:8s]" />
          Registry Release Countdown
        </span>
        <h3 className="text-base md:text-lg font-black text-white uppercase tracking-wider leading-tight">
          {title}
        </h3>
        <p className="text-xs text-slate-500 font-bold uppercase leading-snug">
          {subtitle}
        </p>
      </div>

      {/* Numeric Block Columns */}
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md mx-auto">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-slate-950/80 border border-white/5 rounded-2xl p-3 md:p-4 relative group hover:border-slate-850 transition-all flex flex-col justify-center items-center"
          >
            {/* Glossy gradient strip */}
            <div className={`absolute top-0 inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${item.color}`} />
            
            <span className="text-xl md:text-3xl font-black text-white font-mono leading-none tracking-tight">
              {item.value.toString().padStart(2, "0")}
            </span>
            <span className="text-[9px] md:text-[10px] font-black text-slate-550 uppercase tracking-widest block pt-2 leading-none">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
