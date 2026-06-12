"use client";

import SocialFeed from "@/components/campus/SocialFeed";
import { Share2, Rss } from "lucide-react";

export default function CampusSocialHubPage() {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Share2 className="w-6 h-6 text-pink-500" />
            University Social Media Hub
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Chronological microblogs, Instagram picture grids, and active community broadcast schedules.
          </p>
        </div>

        <div className="flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-slate-555">
          <Rss className="w-3.5 h-3.5" /> SYNCED ONLINE IN REAL-TIME
        </div>
      </div>

      {/* Social Feed component */}
      <SocialFeed />

    </div>
  );
}
