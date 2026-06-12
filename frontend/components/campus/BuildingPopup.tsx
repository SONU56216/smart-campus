"use client";

import { X, Clock, MapPin, Compass, Navigation, School, Sparkles } from "lucide-react";

interface BuildingInfo {
  id: string;
  name: string;
  photo: string;
  departments: string[];
  hours: string;
  description: string;
  floorCount: number;
}

interface BuildingPopupProps {
  building: BuildingInfo;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function BuildingPopup({ building, onClose, onNavigate }: BuildingPopupProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/50 w-full max-w-sm flex flex-col text-left filter backdrop-blur animate-scale-in">
      {/* Photo header block */}
      <div className="h-36 bg-slate-950 relative overflow-hidden">
        <img 
          src={building.photo} 
          alt={building.name} 
          className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-350"
        />
        {/* gradient fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        
        {/* Closed control */}
        <button
          onClick={onClose}
          className="p-1.5 bg-slate-950/80 hover:bg-slate-900 border border-white/5 hover:border-slate-800 text-slate-300 hover:text-white rounded-lg transition-all absolute top-3.5 right-3.5 z-10 cursor-pointer"
        >
          <X className="w-4 h-4 shrink-0" />
        </button>

        {/* Floating Sector Badge */}
        <span className="absolute bottom-3.5 left-4.5 z-10 px-2 py-0.5 bg-blue-600 border border-blue-500 rounded text-[8.5px] text-white font-black uppercase tracking-wider">
          SECTOR-12 CAMPUS
        </span>
      </div>

      {/* Content panel */}
      <div className="p-5.5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5 leading-none">
            <School className="w-4 h-4 text-blue-400 shrink-0" />
            {building.name}
          </h3>
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            {building.description}
          </p>
        </div>

        {/* Operating status metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono border-y border-white/5 py-3">
          <div className="space-y-0.5 text-left">
            <span className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider font-sans block">Timing Schedules</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 uppercase leading-none">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              {building.hours}
            </div>
          </div>

          <div className="space-y-0.5 text-left">
            <span className="text-[8.5px] font-black uppercase text-slate-500 tracking-wider font-sans block">Floors Index</span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 uppercase leading-none">
              <Compass className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              {building.floorCount} FLOORS TOTAL
            </div>
          </div>
        </div>

        {/* Departments tag list */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">HOSTED DEPARTMENTS</span>
          <div className="flex flex-wrap gap-1">
            {building.departments.map((dept) => (
              <span
                key={dept}
                className="px-2 py-0.5 bg-slate-950 border border-white/5 rounded text-[8.5px] font-extrabold font-mono text-blue-300 uppercase shrink-0"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation bottom action trigger button */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate(building.id)}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-500/10 leading-none"
          >
            <Navigation className="w-3.5 h-3.5 shrink-0" />
            Establish Navigation Route
          </button>
        </div>
      </div>
    </div>
  );
}
