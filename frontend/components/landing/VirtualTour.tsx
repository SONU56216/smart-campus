"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Sparkles, X, Compass, ExternalLink } from "lucide-react";

export default function VirtualTour() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 shadow-2xl border border-slate-800 select-none">
          {/* Layer Blur Blobs */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          {/* Core Card Grid Section */}
          <div className="relative z-10 grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-950/40 text-blue-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Next-Gen Metaverse Tour
              </span>
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Simulate Campus Spaces Virtually
                </h2>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-semibold">
                  Step inside our state-of-the-art supercomputing blocks, robotic fabrication rooms, and expansive student recreational gardens without stepping foot outside. Fully compatible with WebVR headsets.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-xs font-bold text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md transform active:scale-95 group"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Launch Simulator Tour
                </button>
                <a
                  href="https://google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl transition-all"
                >
                  <Compass className="w-4 h-4" />
                  Satellite Grid Coordinates
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-center relative">
              {/* SVG Mock Canvas Mockup */}
              <div className="w-full aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden group shadow-inner">
                <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                {/* SVG radar compass grid circle */}
                <svg className="w-2/3 h-2/3 text-blue-500/20 animate-spin-slow" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.5" />
                </svg>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(true)}
                  className="absolute p-4 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-lg backdrop-blur-sm cursor-pointer z-10 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Play className="w-6 h-6 fill-current" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded/Simulated VR Tour Dialog Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-4xl aspect-video bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-slate-900 bg-slate-950 flex items-center justify-between text-white">
              <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary animate-pulse" />
                Simulation Feed: MET Central Quadrangle Block
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 px-3 text-slate-500 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Real Web Mockup Embed/Simulation Area */}
            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center relative">
              {/* Representing a panoramic background slider or elegant canvas mock */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.3)_0%,rgba(2,6,23,1)_80%)] flex flex-col items-center justify-center px-6 text-center select-none">
                <Compass className="w-12 h-12 text-blue-400 animate-bounce mb-3" />
                <h4 className="text-base font-bold text-white mb-2">Simulated Interactive Quad Panorama</h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                  Dragging your cursor sweeps the panoramic lens. In development environments, interactive hotlink node markers link directly to physical IoT lockers.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-xl border border-blue-500/40 text-blue-300 text-xs font-semibold hover:bg-blue-950 transition-all"
                >
                  Terminate Virtual Feed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
