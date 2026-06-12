"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { useState, useMemo } from "react";
import { 
  Activity, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

export default function AdminAuditLogsPage() {
  const { useAuditLogs } = useAdmin();
  const { data: dbLogs } = useAuditLogs();

  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Track expanded row indices 
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  // Premium mock audit logs matching strict specifications
  const mockLogsList = useMemo(() => [
    { id: 1, user: "Nirmala Sitharaman", action: "Authorized student RFID Card UID bypass mode", ipAddress: "192.168.12.44", timestamp: "11 Jun 2026 12:44 PM", module: "SECURITY_NFC", payload: { prev_uid: "8E:A4:9E:2B", override_by: "Nirmala Sitharaman", justification: "Bypass mode for convocation rehearsal." } },
    { id: 2, user: "Shanta Kumar", action: "Recorded manual offline Semester 4 cash tuition", ipAddress: "192.168.12.50", timestamp: "11 Jun 2026 11:30 AM", module: "TREASURY_CASH", payload: { student_id: "MU-10401", receipt_id: "CASH_OFFLINE-8823", amount: 48000, bank_verified: true } },
    { id: 3, user: "Pranab Mukherjee", action: "Approved B.Tech CSE admission portfolio", ipAddress: "192.168.10.12", timestamp: "11 Jun 2026 10:44 AM", module: "REGISTRAR_PORTAL", payload: { applicant_id: "AP-8301", candidate: "Sonali Shah", highSchoolPct: 94.2, remarks: "Transcripts checked and cleared." } },
    { id: 4, user: "Auto-System Service", action: "Auto-generated exam admit cards passes batch", ipAddress: "127.0.0.1", timestamp: "10 Jun 2026 04:32 PM", module: "SYS_AUTOMATIONS", payload: { total_passes_released: 12, security_key: "SEC_METRO_PASS_9921", backend_cluster_sync: "SUCCESS" } },
    { id: 5, user: "Rajiv Gandhi", action: "Scheduled exam timetable Paper slot CS-401 Compiler", ipAddress: "192.168.12.55", timestamp: "08 Jun 2026 09:12 AM", module: "ACADEMICS_BOARD", payload: { subject_code: "CS-401", date: "16 Dec 2026", room: "CS-BLOCK-A", seatingCapacity: 40 } }
  ], []);

  const displayList = useMemo(() => {
    let list = dbLogs || mockLogsList;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((l: any) => 
        l.user.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.ipAddress.toLowerCase().includes(q)
      );
    }

    if (selectedModule) {
      list = list.filter((l: any) => l.module === selectedModule);
    }

    return list;
  }, [dbLogs, mockLogsList, search, selectedModule]);

  // Pagination indexing
  const totalCount = displayList.length;
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayList.slice(startIndex, startIndex + itemsPerPage);
  }, [displayList, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const toggleRowExpand = (id: number) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-400" />
          General System Journals Audit
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase font-mono">
          Expand entries to inspect database query modifications, track network requests, and manage access security levels.
        </p>
      </div>

      {/* FILTER SEARCH MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
        <div className="relative md:col-span-3">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search operator username, database modifications, terminal IP Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold pl-10 pr-3 py-2.5 text-white placeholder:text-slate-550 focus:border-emerald-500/50 outline-none"
          />
        </div>

        <select
          value={selectedModule}
          onChange={(e) => setSelectedModule(e.target.value)}
          className="bg-slate-950 border border-white/5 text-xs text-slate-300 font-bold rounded-xl p-2.5 cursor-pointer outline-none focus:border-emerald-500/50"
        >
          <option value="">-- All Modules Source --</option>
          <option value="SECURITY_NFC">SECURITY_NFC</option>
          <option value="TREASURY_CASH">TREASURY_CASH</option>
          <option value="REGISTRAR_PORTAL">REGISTRAR_PORTAL</option>
          <option value="SYS_AUTOMATIONS">SYS_AUTOMATIONS</option>
          <option value="ACADEMICS_BOARD">ACADEMICS_BOARD</option>
        </select>
      </div>

      {/* TABLE DATA MATRIX expand rows */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none font-sans">
            <thead>
              <tr className="bg-slate-950 border-b border-white/5 text-[10px] font-black text-slate-400 tracking-widest uppercase leading-none">
                <th className="p-4 w-10"></th>
                <th className="p-4">Staff User</th>
                <th className="p-4">Audit Operation</th>
                <th className="p-4">Module Code</th>
                <th className="p-4">Terminal IP</th>
                <th className="p-4">Timestamp logs</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs text-slate-300 font-mono">
              {paginatedList.map((log: any) => {
                const isExpanded = expandedRowId === log.id;
                return (
                  <>
                    <tr 
                      key={log.id} 
                      onClick={() => toggleRowExpand(log.id)}
                      className={`hover:bg-white/[0.0125] cursor-pointer transition-colors ${
                        isExpanded ? "bg-emerald-500/5" : ""
                      }`}
                    >
                      {/* Chevron Toggle */}
                      <td className="p-4 text-center">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 mx-auto" />
                        )}
                      </td>

                      <td className="p-4 text-white font-black uppercase font-sans">{log.user}</td>
                      <td className="p-4 font-semibold uppercase text-slate-300 font-sans">{log.action}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-950 rounded text-[9px] text-emerald-450 font-black tracking-wider uppercase border border-white/5">
                          {log.module}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 font-bold">{log.ipAddress}</td>
                      <td className="p-4 text-slate-500 font-bold">{log.timestamp}</td>
                    </tr>

                    {/* EXPANDABLE PAYLOAD PREVIEW GRID */}
                    {isExpanded && (
                      <tr key={`${log.id}-payload`} className="bg-slate-950/40">
                        <td colSpan={6} className="p-5 border-t border-white/5">
                          <div className="p-4 bg-slate-950 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/5 pb-1 w-fit">
                              <Terminal className="w-4 h-4 animate-pulse" />
                              Payload JSON Metadata Inspector
                            </div>
                            
                            <pre className="text-[11px] leading-relaxed text-amber-100 font-mono overflow-x-auto p-2 scrollbar-none select-text">
                              {JSON.stringify(log.payload, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}

              {paginatedList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 uppercase font-black font-sans text-[10px]">
                    No corporate journals cleared matching filters ...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 bg-slate-950 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500">
          <span>
            SHOWING <strong className="text-slate-350">{paginatedList.length}</strong> OF <strong className="text-slate-200">{totalCount}</strong> SYSTEM ENTRIES
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-slate-900 border border-white/5 hover:bg-slate-850 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-350 uppercase font-black font-sans px-2">PAGE {currentPage} OF {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-slate-900 border border-white/5 hover:bg-slate-850 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-900 rounded-lg cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
