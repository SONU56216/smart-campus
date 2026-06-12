"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Calendar, BookOpen, GraduationCap } from "lucide-react";

export default function WelcomeBanner() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("Good Morning");
  const [currentDate, setCurrentDate] = useState("");

  const quotes = [
    "Innovation distinguishes between a leader and a follower. Let's build something grand.",
    "Your education is a dress rehearsal for a life that is yours to lead. Make it outstanding.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Strive for progress, not perfection. Every coding line is progress.",
    "Technology is best when it brings people together. Spark your mind today."
  ];

  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    // Resolve greeting
    const hr = new Date().getHours();
    if (hr >= 12 && hr < 17) setGreeting("Good Afternoon");
    else if (hr >= 17) setGreeting("Good Evening");
    else setGreeting("Good Morning");

    // Format current date
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));

    // Choose random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="relative overflow-hidden w-full rounded-[28px] border border-blue-500/20 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl select-none"
    >
      {/* Dynamic Ambient Blur Spheres */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row items-center gap-6 z-10 text-center md:text-left">
        {/* Scholar Circle Badge with Glow */}
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden border-2 border-blue-400 bg-slate-900 p-1 shadow-lg shadow-blue-500/20">
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop&crop=faces"} 
              alt={user?.fullName || "Scholar Name"}
              className="w-full h-full object-cover rounded-2xl" 
            />
          </div>
          {/* Status Dot */}
          <span className="absolute bottom-1 right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
          </span>
        </div>

        {/* Text Container */}
        <div className="space-y-1.5 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/15 border border-blue-400/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Metropolitan Member Portal
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-normal">
            {greeting}, <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">{user?.fullName?.split(" ")[0] || "Rahul"}</span>!
          </h2>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1.5 text-xs font-bold text-slate-400 pt-0.5">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-blue-405" />
              Computer Science & Engineering
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-emerald-450" />
              B.Tech • Semester 4
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed pt-2">
            "{quote}"
          </p>
        </div>
      </div>

      {/* Date Stamps Card Panel */}
      <div className="relative z-10 flex flex-col items-center md:items-end bg-white/5 border border-white/5 p-4 rounded-2xl text-center md:text-right min-w-[160px] backdrop-blur-sm">
        <div className="p-2.5 bg-blue-500/15 border border-blue-400/20 text-blue-405 rounded-xl mb-2 flex items-center justify-center">
          <Calendar className="w-5 h-5" />
        </div>
        <span className="text-[9px] text-slate-450 font-black uppercase tracking-widest block select-none">
          Active Station Time
        </span>
        <span className="text-xs font-black text-white block uppercase tracking-wide pt-1 leading-none">
          {currentDate || "Thursday, June 11, 2026"}
        </span>
        <span className="text-[8.5px] text-emerald-400 font-bold font-mono pt-1 select-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          Terminal Active: UTC+5.30
        </span>
      </div>

    </motion.div>
  );
}
