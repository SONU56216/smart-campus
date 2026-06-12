"use client";

import CampusMap from "@/components/campus/CampusMap";
import { Compass, ExternalLink } from "lucide-react";

export default function CampusMapPage() {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-blue-400" />
            Interactive Campus Coordinates Map
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Search physical lecture hall buildings, locate RFID checkgates checkpoints, and optimize walking routes.
          </p>
        </div>

        <a 
          href="https://openstreetmap.org" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest text-blue-400 hover:text-blue-300"
        >
          OSM Registry Standards <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Interactive Map component */}
      <CampusMap />

    </div>
  );
}
