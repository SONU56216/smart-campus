"use client";

import { Monitor, Info, CheckCircle2 } from "lucide-react";

interface SeatAssignmentProps {
  roomName: string;
  selectedSeat: string;
  totalSeats?: number;
}

export default function SeatAssignment({
  roomName,
  selectedSeat,
  totalSeats = 40,
}: SeatAssignmentProps) {
  // Generate mock seats grid, e.g., A1, A2, B1, B2 ...
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = [1, 2, 3, 4, 5];

  // Map designated seat index
  // selectedSeat is like "A-12" or "B3" etc. Normalize to match layout rows/cols.
  const normSeat = selectedSeat.replace("-", "").toUpperCase();

  return (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-6 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            Sitting Hall Corridor Map
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase">
            Detailed seat index: {selectedSeat} ({roomName})
          </p>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none">
            Room:
          </span>
          <span className="text-xs font-black text-white leading-none">
            {roomName}
          </span>
        </div>
      </div>

      {/* Screen/Prof Podium Front indicator */}
      <div className="space-y-2">
        <div className="w-full h-2 bg-gradient-to-r from-blue-500/10 via-blue-500/40 to-blue-500/10 rounded-full flex items-center justify-center relative">
          <span className="absolute text-[8px] font-black tracking-widest text-[#60a5fa] bg-slate-950 px-3 py-0.5 rounded-full uppercase border border-[#60a5fa]/20 leading-none">
            Supervisor Podium / Front Screen
          </span>
        </div>
      </div>

      {/* Seats grid */}
      <div className="flex flex-col items-center py-4 bg-slate-950/40 rounded-2xl border border-white/5">
        <div className="grid grid-cols-5 gap-2.5 md:gap-3.5 max-w-sm w-full px-4">
          {rows.map((row) =>
            cols.map((col) => {
              const seatId = `${row}${col}`;
              const isStudentSeat = normSeat === seatId || normSeat.includes(seatId);

              return (
                <div
                  key={seatId}
                  className={`aspect-square sm:w-11 sm:h-11 rounded-lg border text-[9px] font-white font-mono flex flex-col items-center justify-center transition-all ${
                    isStudentSeat
                      ? "bg-blue-600 border-blue-400 text-white font-black scale-110 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/40 animate-pulse"
                      : "bg-slate-900 border-white/5 text-slate-600 hover:border-slate-800"
                  }`}
                  title={isStudentSeat ? `Your Seat: ${seatId}` : `Seat ${seatId}`}
                >
                  <span className={isStudentSeat ? "text-[10px]" : ""}>{seatId}</span>
                  {isStudentSeat && <div className="w-1.5 h-1.5 bg-white rounded-full mt-0.5 animate-ping" />}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex flex-wrap gap-4 pt-1 text-[10px] uppercase font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-blue-600 border border-blue-400 rounded-md animate-pulse" />
          <span>Your Designated Workspace</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-slate-900 border border-white/5 rounded-md" />
          <span>Other Candidate Seat</span>
        </div>
      </div>
    </div>
  );
}
