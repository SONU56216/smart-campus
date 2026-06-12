"use client";

import { useExam } from "@/hooks/useExam";
import { useState, useMemo } from "react";
import { 
  Award, 
  Search, 
  Download, 
  RefreshCcw, 
  Check, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Square, 
  CheckSquare 
} from "lucide-react";
import { toast } from "sonner";

export default function AdminAdmitCardsListPage() {
  const { useGenerateCards } = useExam();
  const generateMutation = useGenerateCards();

  // Search state
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected row ids
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Robust mock admit card list matching criteria
  const mockCardsList = useMemo(() => [
    { id: "ac-1", studentId: "MU-10401", fullName: "Sonu Kumar", course: "B.Tech CSE", semester: 4, barcode: "9921_MU10401", downloadCount: 2, status: "GENERATED" },
    { id: "ac-2", studentId: "MU-10403", fullName: "Shreya Ghoshal", course: "B.Tech ECE", semester: 4, barcode: "9922_MU10403", downloadCount: 1, status: "GENERATED" },
    { id: "ac-3", studentId: "MU-10404", fullName: "Varun Dhawan", studentIdVal: "MU-10404", course: "B.Tech CSE", semester: 2, barcode: "9923_MU10404", downloadCount: 3, status: "GENERATED" },
    { id: "ac-4", studentId: "MU-10405", fullName: "Kiara Advani", studentIdVal: "MU-10405", course: "B.Des Fashion", semester: 6, barcode: "9924_MU10405", downloadCount: 0, status: "GENERATED" },
    { id: "ac-5", studentId: "MU-10408", fullName: "Alia Bhatt", studentIdVal: "MU-10408", course: "BCA Cloud", semester: 2, barcode: "9925_MU10408", downloadCount: 0, status: "PENDING" },
    { id: "ac-6", studentId: "MU-10409", fullName: "Siddharth Mal", studentIdVal: "MU-10409", course: "B.Tech CSE", semester: 6, barcode: "9926_MU10409", downloadCount: 1, status: "GENERATED" }
  ], []);

  const displayList = useMemo(() => {
    let list = mockCardsList;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(item => 
        item.fullName.toLowerCase().includes(q) || 
        item.studentId.toLowerCase().includes(q) ||
        item.course.toLowerCase().includes(q)
      );
    }

    return list;
  }, [mockCardsList, search]);

  const totalCount = displayList.length;
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayList.slice(startIndex, startIndex + itemsPerPage);
  }, [displayList, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedList.map(item => item.id));
    }
  };

  const handleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRegenerateCard = (card: any) => {
    toast.success(`Identity card barcode compiled for scholar: ${card.fullName}.`);
  };

  const handleDownloadCard = (card: any) => {
    card.downloadCount += 1;
    toast.success(`Admit card pass certificate generated: ${card.studentId}`);
  };

  const triggerBulkRegenerate = () => {
    toast.success(`Security engine batch compiling... Issued ${selectedIds.length} digital biometric admit passes.`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            Admit Passes Dispatch Ledger
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Audit automatic hall pass allocations, verify digital downloads, batch configure barcodes.
          </p>
        </div>
      </div>

      {/* FILTER SEARCH PANEL */}
      <div className="p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
        <div className="relative">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scholar name, student-ID, track..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold pl-10 pr-3 py-2.5 text-white placeholder:text-slate-550 focus:border-emerald-500/50 outline-none"
          />
        </div>
      </div>

      {/* TABLE MATRIX */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-slate-950 border-b border-white/5 text-[10px] font-black text-slate-400 tracking-widest uppercase leading-none">
                <th className="p-4 w-12 text-center">
                  <button onClick={handleSelectAll} className="text-slate-550 hover:text-white">
                    {selectedIds.length === paginatedList.length ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <Square className="w-4 h-4 mx-auto" />
                    )}
                  </button>
                </th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Scholar Full Name</th>
                <th className="p-4">Course Program</th>
                <th className="p-4">Hall Barcode String</th>
                <th className="p-4 text-center">Downloads Limit</th>
                <th className="p-4">Status Label</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs text-slate-350">
              {paginatedList.map((card) => {
                const isChecked = selectedIds.includes(card.id);
                return (
                  <tr key={card.id} className="hover:bg-white/[0.01]">
                    <td className="p-4 text-center">
                      <button onClick={() => handleSelectRow(card.id)} className="text-slate-550 hover:text-white">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 mx-auto" />
                        ) : (
                          <Square className="w-4 h-4 mx-auto" />
                        )}
                      </button>
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-400 uppercase">{card.studentId}</td>
                    <td className="p-4 font-extrabold text-white uppercase">{card.fullName}</td>
                    <td className="p-4 font-bold text-[11px] uppercase text-emerald-400">
                      {card.course} • Sem {card.semester}
                    </td>
                    <td className="p-4 font-mono font-bold text-zinc-500 uppercase">{card.barcode}</td>
                    <td className="p-4 text-center font-mono font-bold">{card.downloadCount} times</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${
                        card.status === "GENERATED" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-red-500/10 text-red-500"
                      }`}>
                        {card.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRegenerateCard(card)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"
                          title="Regenerate credentials barcode"
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDownloadCard(card)}
                          className="p-1.5 hover:bg-emerald-600/10 rounded-lg text-emerald-500"
                          title="Download hall copy PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {paginatedList.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 uppercase font-black font-sans text-[10px]">
                    No generated admit card entries matched search parameter ...
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

      {/* FLOATING ACTION PANEL */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-950 border border-emerald-500/30 px-6 py-4 rounded-[28px] shadow-2xl flex items-center gap-6 animate-slide-up max-w-lg w-full">
          <div className="text-left font-mono leading-none">
            <span className="text-[10px] text-emerald-450 font-black block">ADMIT CARDS MANAGER</span>
            <span className="text-xs text-white font-bold">{selectedIds.length} SYSTEM CARDS SELECTED</span>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex-1 flex gap-2 justify-end">
            <button
              onClick={triggerBulkRegenerate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[9px] uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Regenerate Barcodes Catalog
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-4 py-2 text-slate-500 hover:text-white font-black text-[9px] uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
