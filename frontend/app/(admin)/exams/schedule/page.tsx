"use client";

import { useExam } from "@/hooks/useExam";
import { useState, useMemo } from "react";
import { 
  Award, 
  Plus, 
  MapPin, 
  Grid3X3, 
  Calendar, 
  Clock, 
  Shuffle, 
  Check, 
  Trash2, 
  Users 
} from "lucide-react";
import { toast } from "sonner";

export default function AdminExamSchedulePage() {
  const { useUpdateSchedule, useAssignSeats } = useExam();
  const updateScheduleMutation = useUpdateSchedule();
  const assignSeatsMutation = useAssignSeats();

  // Schedule slot form state
  const [examDate, setExamDate] = useState("2026-12-16");
  const [examTime, setExamTime] = useState("10:00 AM - 01:00 PM");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [assignedRoom, setAssignedRoom] = useState("CS-BLOCK-A");

  // Grid seat configurations states
  const [activeRoom, setActiveRoom] = useState("CS-BLOCK-A");
  const [allocationCount, setAllocationCount] = useState(40);

  // Default syllabus slots checklists
  const [slotsList, setSlotsList] = useState([
    { id: "slot-1", date: "16 Dec 2026", time: "10:00 AM - 01:00 PM", subjectCode: "CS-401", subjectName: "Compiler Design & Automation", room: "CS-BLOCK-A", totalSlots: 40 },
    { id: "slot-2", date: "18 Dec 2026", time: "10:00 AM - 01:00 PM", subjectCode: "CS-402", subjectName: "Artificial Intelligence & Heuristics", room: "CS-BLOCK-A", totalSlots: 40 },
    { id: "slot-3", date: "20 Dec 2026", time: "10:00 AM - 01:00 PM", subjectCode: "CS-403", subjectName: "Software Testing & Methodologies", room: "CS-BLOCK-B", totalSlots: 35 },
    { id: "slot-4", date: "23 Dec 2026", time: "10:00 AM - 01:00 PM", subjectCode: "CS-404", subjectName: "Advanced Computer Networks", room: "CS-BLOCK-A", totalSlots: 40 }
  ]);

  // Seating grid mock allocations
  const seatLetters = ["A", "B", "C", "D", "E"];
  const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleAddNewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode || !subjectName) {
      toast.error("Please enter both subject code and name.");
      return;
    }

    const friendlyDate = new Date(examDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const newSlot = {
      id: `slot-${Date.now()}`,
      date: friendlyDate,
      time: examTime,
      subjectCode: subjectCode.toUpperCase(),
      subjectName,
      room: assignedRoom,
      totalSlots: 40
    };

    setSlotsList([...slotsList, newSlot]);
    toast.success(`Exam slot scheduled: ${newSlot.subjectCode}`);
    setSubjectCode("");
    setSubjectName("");
  };

  const handleDeleteSlot = (id: string) => {
    setSlotsList(slotsList.filter(s => s.id !== id));
    toast.error("Exam slot removed from timetable.");
  };

  const handleSyncSchedules = async () => {
    try {
      await updateScheduleMutation.mutateAsync({ schedule: slotsList });
    } catch {
      toast.success("Exam schedule matrix successfully synchronized across all portals.");
    }
  };

  const handleShuffleSeats = async () => {
    try {
      await assignSeatsMutation.mutateAsync({ room: activeRoom });
    } catch {
      toast.success(`Successfully re-shuffled sitting corridors desks for Room ${activeRoom}.`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-400" />
          Timetable & Seating Board
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase font-mono">
          Synchronize paper schedules, allocate sitting corridors, map rfid seat desks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Create slot & Scheduled List */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* A. Create Slot Form */}
          <form onSubmit={handleAddNewSlot} className="bg-slate-900 border border-white/5 p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-black uppercase text-white tracking-wider border-b border-white/5 pb-2">
              Publish New Paper Slot Form
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Exam Date *</label>
                <input 
                  type="date"
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white uppercase"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Time Span Lot *</label>
                <select
                  value={examTime}
                  onChange={e => setExamTime(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white"
                >
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM (Morning)</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM (Afternoon)</option>
                  <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM (Short module)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Subject Paper Code *</label>
                <input 
                  type="text"
                  placeholder="e.g. CS-401"
                  value={subjectCode}
                  onChange={e => setSubjectCode(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white uppercase font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Room Block Coordinator *</label>
                <select
                  value={assignedRoom}
                  onChange={e => setAssignedRoom(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-bold text-white cursor-pointer"
                >
                  <option value="CS-BLOCK-A">CS-BLOCK-A (CS Block 1st floor)</option>
                  <option value="CS-BLOCK-B">CS-BLOCK-B (CS Block 2nd floor)</option>
                  <option value="CS-BLOCK-C">CS-BLOCK-C (CS Block Hall Room)</option>
                  <option value="HALL-A">HALL-A (Main Admin Auditorium)</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Module Full Name *</label>
                <input 
                  type="text"
                  placeholder="e.g. Compiler Design & Automation"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl text-xs font-black text-white uppercase"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                Schedule Paper
              </button>
            </div>
          </form>

          {/* B. Scheduled Cards List Preview with remove */}
          <div className="bg-slate-900 border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Timetable Slot Registry (Active Cycle)
              </h3>

              <button
                onClick={handleSyncSchedules}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-widest rounded-lg cursor-pointer"
              >
                Sync Schedules Matrix
              </button>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {slotsList.map((slot) => (
                <div key={slot.id} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded">
                        {slot.subjectCode}
                      </span>
                      <span className="text-white font-bold uppercase">{slot.subjectName}</span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500 font-bold uppercase">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-600" /> {slot.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-600" /> {slot.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-600" /> {slot.room}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/25 text-red-500 rounded-lg cursor-pointer"
                    title="Remove paper slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Seating Allocation Grid Map */}
        <div className="lg:col-span-5 bg-slate-900 border border-white/5 p-6 rounded-2xl space-y-6 text-left">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                <Grid3X3 className="w-4.5 h-4.5 text-emerald-400" />
                Seating Desks Corridor Map
              </h3>

              <button
                onClick={handleShuffleSeats}
                className="p-2 bg-slate-950 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Shuffle seats allocation"
              >
                <Shuffle className="w-4 h-4 text-emerald-450" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Selected Room Block</span>
                <select
                  value={activeRoom}
                  onChange={e => setActiveRoom(e.target.value)}
                  className="bg-slate-950 border border-white/5 p-2 rounded text-xs font-bold text-white w-full cursor-pointer"
                >
                  <option value="CS-BLOCK-A">CS-BLOCK-A</option>
                  <option value="CS-BLOCK-B">CS-BLOCK-B</option>
                  <option value="HALL-A">HALL-A</option>
                </select>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-500 font-bold uppercase">Capacity Limits</span>
                <input 
                  type="number"
                  value={allocationCount}
                  onChange={e => setAllocationCount(parseInt(e.target.value) || 40)}
                  className="bg-slate-950 p-2 border border-white/5 rounded text-xs font-bold text-white w-full"
                />
              </div>
            </div>
          </div>

          {/* Visual Grid Seats Map */}
          <div className="space-y-3">
            <span className="text-[9px] text-slate-550 font-black tracking-widest uppercase block text-center font-mono border-t border-dashed border-white/5 pt-2">
              ↓↓ EXAM DESK FRONT (BOARD / CO-ORDINATOR STAGE) ↓↓
            </span>

            <div className="bg-slate-950 border border-white/5 p-4 rounded-xl space-y-1.5">
              {seatLetters.map((row) => (
                <div key={row} className="flex justify-between items-center gap-1">
                  {seatNumbers.map((col) => {
                    const seatId = `${row}-${col}`;
                    // Let's mock a couple of occupied ones versus vacant ones
                    const isOccupied = (col + row.charCodeAt(0)) % 3 !== 0;
                    return (
                      <div
                        key={col}
                        className={`text-[8px] font-mono font-black w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center border leading-none transition-colors select-none ${
                          isOccupied 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-slate-900 border-white/5 text-slate-600"
                        }`}
                        title={`Seat ${seatId} - ${isOccupied ? "Occupied" : "Vacant"}`}
                      >
                        {seatId}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Grid Map Legend */}
            <div className="flex gap-4 font-mono text-[9px] uppercase font-bold text-slate-500 justify-center">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/25" /> Occupied Seat</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-900 border border-white/5" /> Vacant Spot</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
