"use client";

import { useState } from "react";
import { 
  Eye, 
  Map, 
  Compass, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Info, 
  PlayCircle,
  Video
} from "lucide-react";
import { toast } from "sonner";

interface TourLocation {
  id: string;
  name: string;
  panPhoto: string;
  youtubeId: string;
  description: string;
  stats: string;
}

const TOUR_LOCATIONS: TourLocation[] = [
  {
    id: "entrance",
    name: "Main Gates Induction Arch",
    panPhoto: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000",
    youtubeId: "dQw4w9WgXcQ", // Roll guide
    description: "Our historic red brick gateway where incoming scholars complete physical pass allocations, biometric face scanning registrations, and digital credentials validations.",
    stats: "ESTABLISHED 2004 • CAPACITY: 120 GATES"
  },
  {
    id: "library",
    name: "Digital Study Lounge Archives",
    panPhoto: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1000",
    youtubeId: "dQw4w9WgXcQ",
    description: "The six-floor academic research warehouse, integrating biometric scanner turnstiles, high-density reference books racks, and central server terminals.",
    stats: "ESTABLISHED 2008 • CAPACITY: 1,500 SEATS"
  },
  {
    id: "cse",
    name: "B.Tech CSE Artificial Intelligence Labs",
    panPhoto: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000",
    youtubeId: "dQw4w9WgXcQ",
    description: "High-spec neural network testing rooms, modular electronics workbenches, and secure academic intranet centers.",
    stats: "ESTABLISHED 2012 • CAPACITY: 400 TERMINALS"
  },
  {
    id: "student",
    name: "Amphitheater Canteen Commons",
    panPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000",
    youtubeId: "dQw4w9WgXcQ",
    description: "The primary student union plaza and food court, configured with cashless card payment POS registers and an open-air cultural performance stage.",
    stats: "ESTABLISHED 2015 • CAPACITY: 2,000 SCHOLARS"
  }
];

export default function VirtualTourPage() {
  const [activeLoc, setActiveLoc] = useState<TourLocation>(TOUR_LOCATIONS[0]);
  const [yaw, setYaw] = useState(0); // 360 degree rotation angle (模拟 X position panning)
  const [pitch, setPitch] = useState(0); // 360 degree pitch angle (模拟 Y position panning)

  const handlePan = (direction: "left" | "right" | "up" | "down") => {
    switch (direction) {
      case "left":
        setYaw((prev) => (prev - 15 + 360) % 360);
        break;
      case "right":
        setYaw((prev) => (prev + 15) % 360);
        break;
      case "up":
        setPitch((prev) => Math.min(prev + 10, 30));
        break;
      case "down":
        setPitch((prev) => Math.max(prev - 10, -30));
        break;
    }
    toast.message(`Panning camera vector: Azimuth ${yaw}°, Pitch ${pitch}°`);
  };

  const resetCamera = () => {
    setYaw(0);
    setPitch(0);
    toast.success("Optic lens recalibrated to default focus.");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Eye className="w-6 h-6 text-indigo-400" />
          University Virtual Tour Station
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase font-mono">
          Explore panoramic site visuals, audit research laboratories virtually, and stream campus documentation videos.
        </p>
      </div>

      {/* LOCATION TOGGLE GRID ROW */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
        {TOUR_LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => {
              setActiveLoc(loc);
              resetCamera();
            }}
            className={`px-4.5 py-3 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer border whitespace-nowrap transition-all ${
              activeLoc.id === loc.id
                ? "bg-indigo-600 border-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/10"
                : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* CORE 360 DEGREES VIEWER CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* VIEWING PORT - 8 COLS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-[32px] overflow-hidden border border-white/5 bg-slate-950 h-[420px] shadow-2xl group">
            
            {/* PANORAMIC SCREEN CANVAS AND ZOOM MATRIX */}
            <div 
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{
                backgroundImage: `url('${activeLoc.panPhoto}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: `scale(1.15) translate(${yaw / 15}px, ${pitch * 2}px)`,
                filter: "brightness(0.9) contrast(1.1)"
              }}
            />

            {/* Neon optic compass scan lines */}
            <div className="absolute inset-x-0 h-[2px] bg-indigo-500/10 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute inset-y-0 w-[2px] bg-indigo-500/10 left-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Float Calibration Dashboard Overlay */}
            <div className="absolute top-4.5 left-4.5 z-10 p-3 bg-slate-900/95 border border-white/10 rounded-2xl filter backdrop-blur space-y-1.5 font-mono text-[9px] text-slate-400 uppercase select-none shadow-lg">
              <span className="font-extrabold text-white text-[10px] tracking-wide block flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-400 animate-spin" /> Panorama Azimuth Hud
              </span>
              • STATION ID: {activeLoc.id.toUpperCase()}<br />
              • CAMERA PAN: {yaw}° AZIMUTH<br />
              • ELEVATION: {pitch}° PITCH
            </div>

            {/* MANUAL RETICULAR PANNING WHEEL BUTTONS CONTROLS */}
            <div className="absolute bottom-6 right-6 z-10 p-4 bg-slate-900/90 border border-white/10 rounded-3xl filter backdrop-blur flex flex-col items-center gap-1.5 shadow-2xl">
              <div className="flex gap-1.5 justify-center">
                <button 
                  onClick={() => handlePan("up")} 
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-white/5 hover:border-slate-700 text-white rounded-xl transition-all cursor-pointer"
                >
                  <ArrowUpDownIcon icon={ArrowUp} />
                </button>
              </div>
              <div className="flex gap-1.5 items-center justify-center">
                <button 
                  onClick={() => handlePan("left")} 
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-white/5 hover:border-slate-700 text-white rounded-xl transition-all cursor-pointer"
                >
                  <ArrowUpDownIcon icon={ArrowLeft} />
                </button>
                <button 
                  onClick={resetCamera} 
                  className="p-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all shrink-0"
                >
                  Recal
                </button>
                <button 
                  onClick={() => handlePan("right")} 
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-white/5 hover:border-slate-700 text-white rounded-xl transition-all cursor-pointer"
                >
                  <ArrowUpDownIcon icon={ArrowRight} />
                </button>
              </div>
              <div className="flex gap-1.5 justify-center">
                <button 
                  onClick={() => handlePan("down")} 
                  className="p-2 bg-slate-950 hover:bg-slate-800 border border-white/5 hover:border-slate-700 text-white rounded-xl transition-all cursor-pointer"
                >
                  <ArrowUpDownIcon icon={ArrowDown} />
                </button>
              </div>
            </div>

            {/* Panoramic status tracker bottom left */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-950/80 px-3.5 py-2.5 rounded-xl border border-white/5 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">
              360° SYNTHETIC VIEWPORT ACTIVE
            </div>
          </div>

          {/* Details Narrative panel */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono font-black text-indigo-400 tracking-wider uppercase block">
                {activeLoc.stats}
              </span>
              <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
                {activeLoc.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-semibold">
                {activeLoc.description}
              </p>
            </div>
          </div>
        </div>

        {/* BRIGHT MEDIA EMBED AREA - 4 COLS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* VIDEO STREAM CONTAINER CARD */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-[0.25em] flex items-center gap-1.5 leading-none">
              <Video className="w-5 h-5 text-red-500 shrink-0" />
              Interactive Guide stream
            </h3>
            <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              Stream complete introductory footage mapping the selected site coordinates, narrated by the MUT Student Union.
            </p>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-white/5">
              <iframe
                src={`https://www.youtube.com/embed/${activeLoc.youtubeId}`}
                title="MUT Tour Guide Broadcast Stream"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-slate-950 border border-white/5 rounded-2xl space-y-2 text-[10px]">
              <span className="font-extrabold text-white uppercase tracking-wider block">MUT Virtual Tour Guidelines</span>
              <p className="text-slate-500 font-bold uppercase font-mono leading-relaxed">
                • STREAM STATUS: 1080P SYNCED<br />
                • DURATION: 03 MIN 42 SEC<br />
                • SYNC LOCK: LOCAL CREDENTIALS MATCH
              </p>
            </div>
          </div>

          <div className="p-4.5 bg-gradient-to-tr from-indigo-500/10 to-transparent border border-indigo-500/10 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-[10px] text-slate-400 font-bold uppercase font-mono leading-normal">
              For complete 3D augmented reality helmet projections, proceed directly to the Block B robotics labs virtual environments desks.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

// Inner icon container helper
function ArrowUpDownIcon({ icon: Icon }: { icon: any }) {
  return <Icon className="w-4.5 h-4.5 text-slate-300" />;
}
