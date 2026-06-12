"use client";

import { useState } from "react";
import { 
  Settings, 
  School, 
  Coins, 
  Calendar, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Check, 
  Save 
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  // Tabs controller state
  // "college" | "fees" | "calendar" | "system"
  const [activeTab, setActiveTab] = useState<"college" | "fees" | "calendar" | "system">("college");

  // A. College Info states
  const [collegeName, setCollegeName] = useState("METROPOLITAN UNIVERSITY OF TECHNOLOGY");
  const [collegeEmail, setCollegeEmail] = useState("registrar@metrouni.edu.in");
  const [collegePhone, setCollegePhone] = useState("+91 1122334455");
  const [collegeAddress, setCollegeAddress] = useState("Sector 12, Dwarka, New Delhi - 110075");
  const [fbUrl, setFbUrl] = useState("https://facebook.com/metrounitech");
  const [twitterUrl, setTwitterUrl] = useState("https://twitter.com/metrounitech");

  // B. Fee Structure states
  const [tuitionFeeCost, setTuitionFeeCost] = useState("48000");
  const [backlogFeeCost, setBacklogFeeCost] = useState("800");
  const [regularExamFee, setRegularExamFee] = useState("1200");
  const [lateRegistrationFine, setLateRegistrationFine] = useState("500");

  // C. Academic Calendar events states
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("2026-12-16");
  const [newEventIsHoliday, setNewEventIsHoliday] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([
    { id: 1, title: "Odd Semester Theory Lectures End", date: "2026-11-20", isHoliday: false },
    { id: 2, title: "Guru Nanak Jayanti", date: "2026-11-25", isHoliday: true },
    { id: 3, title: "Main Practical Exams Block", date: "2026-12-01", isHoliday: false },
    { id: 4, title: "Christmas Recess Holiday", date: "2026-12-25", isHoliday: true }
  ]);

  // D. System Settings states
  const [autoGeneratePass, setAutoGeneratePass] = useState(true);
  const [turnstileBypassMode, setTurnstileBypassMode] = useState(false);
  const [directMailboxNotif, setDirectMailboxNotif] = useState(true);

  const saveSettingsSuccess = () => {
    toast.success("Settings configuration saved and backed up successfully!");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle) {
      toast.error("Please provide a title for the academic event.");
      return;
    }

    const eventObj = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate,
      isHoliday: newEventIsHoliday
    };

    setCalendarEvents([...calendarEvents, eventObj]);
    setNewEventTitle("");
    toast.success(`Calendar event added: ${eventObj.title}`);
  };

  const handleDeleteEvent = (id: number) => {
    setCalendarEvents(calendarEvents.filter(e => e.id !== id));
    toast.error("Calendar event deleted.");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-400" />
          University Systems Control Desk
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase font-mono">
          Configure physical identity titles, customize tuition fee brackets, and schedule academic timelines.
        </p>
      </div>

      {/* HORIZONTAL CONTROLLER TABS */}
      <div className="border-b border-white/5 flex gap-2 overflow-x-auto select-none py-1 scrollbar-none">
        {[
          { id: "college", label: "School Identity", icon: School },
          { id: "fees", label: "Tuition Rates", icon: Coins },
          { id: "calendar", label: "Academic Calendars", icon: Calendar },
          { id: "system", label: "System Triggers", icon: ShieldAlert }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 cursor-pointer transition-all whitespace-nowrap ${
                isActive 
                  ? "border-emerald-500 text-emerald-400 font-bold bg-white/[0.01]" 
                  : "border-transparent text-slate-500 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* CORE TAB DISPLAY FORMS */}
      <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 max-w-4xl">
        
        {/* T1: COLLEGE INFO DESIGNED FORM */}
        {activeTab === "college" && (
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">School Demographics Identity</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Metropolitan University Legal Title *</label>
                <input 
                  type="text"
                  value={collegeName}
                  onChange={e => setCollegeName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-white uppercase outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Official Registrar Office Email *</label>
                <input 
                  type="email"
                  value={collegeEmail}
                  onChange={e => setCollegeEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-semibold text-white outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Contact Phone Line *</label>
                <input 
                  type="text"
                  value={collegePhone}
                  onChange={e => setCollegePhone(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-semibold text-white outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Street Mailing Address Headquarters *</label>
                <input 
                  type="text"
                  value={collegeAddress}
                  onChange={e => setCollegeAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-semibold text-white uppercase outline-none focus:border-emerald-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Facebook Page Link</label>
                <input 
                  type="text"
                  value={fbUrl}
                  onChange={e => setFbUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-semibold text-slate-400 outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Twitter Handler Link</label>
                <input 
                  type="text"
                  value={twitterUrl}
                  onChange={e => setTwitterUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-semibold text-slate-400 outline-none focus:border-emerald-500/50"
                />
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={saveSettingsSuccess}
                className="inline-flex items-center gap-1.5 px-6 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                Commit Identity Changes
              </button>
            </div>
          </div>
        )}

        {/* T2: FEES STRUCTURE WORKBOOK FORM */}
        {activeTab === "fees" && (
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">Academic Tuition Tariff Structuring</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">Syllabus Tuition Fee (Per Semester/INR) *</label>
                <input 
                  type="number"
                  value={tuitionFeeCost}
                  onChange={e => setTuitionFeeCost(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-emerald-400 text-sm focus:border-emerald-500/50 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">Late Portal Clearance Fine (INR) *</label>
                <input 
                  type="number"
                  value={lateRegistrationFine}
                  onChange={e => setLateRegistrationFine(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-red-400 text-sm focus:border-emerald-500/50 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">Semester Exam Sheet Enrollment Fee (INR) *</label>
                <input 
                  type="number"
                  value={regularExamFee}
                  onChange={e => setRegularExamFee(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-emerald-400 text-sm focus:border-emerald-500/50 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">Backlogged Supplementary Retake Charge (INR) *</label>
                <input 
                  type="number"
                  value={backlogFeeCost}
                  onChange={e => setBacklogFeeCost(e.target.value)}
                  className="w-full bg-slate-950 border border-white/5 p-3 rounded-xl font-bold text-emerald-400 text-sm focus:border-emerald-500/50 outline-none"
                  required
                />
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={saveSettingsSuccess}
                className="inline-flex items-center gap-1.5 px-6 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                Commit Tariff Changes
              </button>
            </div>
          </div>
        )}

        {/* T3: ACADEMIC CALENDAR CONTROLS TAB */}
        {activeTab === "calendar" && (
          <div className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">Interactive Academic Calendar Schedulers</h3>

            {/* Quick adding form */}
            <form onSubmit={handleCreateEvent} className="bg-slate-950 border border-white/5 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end text-xs">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Milestone Date *</label>
                <input 
                  type="date"
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 p-2.5 rounded-lg text-white"
                  required
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Event Title *</label>
                <input 
                  type="text"
                  placeholder="e.g. Winter Semester Practical start"
                  value={newEventTitle}
                  onChange={e => setNewEventTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/5 p-2.5 rounded-lg text-white uppercase font-bold"
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-2 pb-1">
                <label className="flex items-center gap-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEventIsHoliday}
                    onChange={(e) => setNewEventIsHoliday(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-white/10"
                  />
                  <span className="text-[10px] uppercase font-black text-slate-300">Is Holiday?</span>
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-4 py-2 text-[10px] font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg uppercase tracking-wider"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Event
                </button>
              </div>
            </form>

            {/* Current Event Lists */}
            <div className="space-y-2 text-xs font-mono text-left">
              {calendarEvents.map(ev => (
                <div key={ev.id} className="p-3 bg-slate-950 border border-white/5 rounded-xl flex justify-between items-center whitespace-nowrap">
                  <div className="space-y-0.5">
                    <span className="text-white font-extrabold text-[11px] uppercase">{ev.title}</span>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase leading-none">TARGET: {ev.date}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest ${
                      ev.isHoliday ? "bg-amber-550/15 text-amber-500" : "bg-blue-500/10 text-blue-450"
                    }`}>
                      {ev.isHoliday ? "OFFICIAL CLOSED" : "WORK DAY"}
                    </span>

                    <button 
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="text-red-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* T4: SYSTEM TRIGGERS SETTINGS */}
        {activeTab === "system" && (
          <div className="space-y-6 text-xs text-left pb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-white/5 pb-2">Security & System Triggers</h3>

            <div className="space-y-5">
              
              {/* Auto Generate Accounts Toggle */}
              <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between gap-6">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-white uppercase block">Auto-Provision Barcode & RFID Slots</span>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                    New candidate approvals instantly triggers live RFID gates turnstile enrollment mappings.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoGeneratePass}
                    onChange={(e) => setAutoGeneratePass(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* RFID Gates Turnstiles Bypass Toggle */}
              <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between gap-6">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-white uppercase block">Central RFID Gate Bypass Force Match</span>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                    Bypasses campus rfid sensors validation checkpoints. Allows free gate entries for emergency situations.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={turnstileBypassMode}
                    onChange={(e) => setTurnstileBypassMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600" />
                </label>
              </div>

              {/* Direct Mailbox Dispatches */}
              <div className="p-5 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-between gap-6">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-black text-white uppercase block">Direct Mailbox Dispatch Deliveries</span>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                    Transmit notifications and credentials directly to candidate registers mailboxes instantly.
                  </p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={directMailboxNotif}
                    onChange={(e) => setDirectMailboxNotif(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                onClick={saveSettingsSuccess}
                className="inline-flex items-center gap-1.5 px-6 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                Commit Triggers Configuration
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
