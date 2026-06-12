"use client";

import { Calendar, Clock, MapPin, ClipboardList } from "lucide-react";

export interface ScheduleEvent {
  date: string;
  day: string;
  time: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  seatNo: string;
}

interface ExamScheduleProps {
  events: ScheduleEvent[];
}

export default function ExamSchedule({ events }: ExamScheduleProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 bg-slate-900/10 border border-white/5 rounded-[24px] text-center max-w-sm mx-auto flex flex-col items-center justify-center gap-3">
        <ClipboardList className="w-10 h-10 text-slate-800 animate-bounce" />
        <p className="text-xs text-slate-500 uppercase font-black tracking-widest leading-none">
          No Registered Schedules Found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center gap-2 pl-1">
        <Calendar className="w-4 h-4 text-blue-400" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1 block">
          Current Examination Timetable
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="p-5 bg-slate-900/30 border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-900/55 transition-all group relative overflow-hidden"
          >
            {/* Visual border marker */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-2xl" />

            {/* Left Col: Target Date Block */}
            <div className="flex items-center gap-4 pl-1">
              <div className="bg-slate-950 border border-white/5 rounded-xl px-3.5 py-2.5 text-center min-w-[76px]">
                <span className="block text-[10px] font-black uppercase text-blue-400 tracking-wider font-mono">
                  {event.day.substring(0, 3)}
                </span>
                <span className="block text-sm font-black text-white font-mono leading-tight pt-0.5">
                  {event.date.split(" ")[0]}
                </span>
                <span className="block text-[8px] font-bold text-slate-550 uppercase tracking-widest">
                  {event.date.split(" ")[1] || "DEC"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-550 uppercase tracking-widest font-mono">
                  {event.subjectCode}
                </span>
                <h4 className="text-sm font-black text-white uppercase tracking-tight leading-tight">
                  {event.subjectName}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {event.time}
                </div>
              </div>
            </div>

            {/* Right Col: Desk Seating Info */}
            <div className="flex gap-3 md:self-stretch items-center md:border-l border-white/5 md:pl-6">
              <div className="space-y-0.5">
                <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block font-mono">
                  Location Matrix
                </span>
                <div className="flex items-center gap-1 text-xs text-white font-black uppercase">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Hall: {event.room}
                </div>
              </div>

              <div className="bg-blue-600/10 border border-blue-500/15 p-2 px-3 rounded-lg text-center font-mono">
                <span className="block text-[8px] font-black text-blue-400 uppercase tracking-widest">
                  Desk
                </span>
                <span className="block text-xs font-black text-white leading-none pt-0.5">
                  {event.seatNo}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
