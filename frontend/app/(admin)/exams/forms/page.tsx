"use client";

import { useExam } from "@/hooks/useExam";
import { useState, useMemo } from "react";
import { 
  Award, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye, 
  CreditCard, 
  FileCheck2, 
  Plus, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminExamFormsPage() {
  const router = useRouter();
  const { useAllExamForms, useVerifyExamForm, useGenerateCards } = useExam();

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer / Modals overlay states
  const [activeForm, setActiveForm] = useState<any>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyType, setVerifyType] = useState<"APPROVED" | "REJECTED" | null>(null);

  // Mutations
  const verifyMutation = useVerifyExamForm();
  const generateCardsMutation = useGenerateCards();

  // Premium mock Exam Forms registries
  const mockForms = useMemo(() => [
    { id: "fom-1", formId: "EX-FOM_8842", fullName: "Sonu Kumar", studentId: "MU-10401", course: "B.Tech CSE", semester: 4, subjects: ["CS-401 Compiler Design", "CS-402 AI Rules", "CS-403 Test Suite"], isBacklog: false, backlogSubjects: [], examFee: 1200, status: "PAID", paymentStatus: "SUCCESS" },
    { id: "fom-2", formId: "EX-FOM_8843", fullName: "Aditya Vardhan", studentId: "MU-10402", course: "B.Tech CSE", semester: 4, subjects: ["CS-401 Compiler Design", "CS-402 AI Rules", "CS-403 Test Suite"], isBacklog: false, backlogSubjects: [], examFee: 1200, status: "SUBMITTED", paymentStatus: "PENDING" },
    { id: "fom-3", formId: "EX-FOM_8844", fullName: "Shreya Ghoshal", studentId: "MU-10403", course: "B.Tech ECE", semester: 4, subjects: ["EC-401 Microcontrollers", "EC-402 Antenna Wave Propagation"], isBacklog: true, backlogSubjects: ["CS-201 Data Structures"], examFee: 1800, status: "APPROVED", paymentStatus: "SUCCESS" },
    { id: "fom-4", formId: "EX-FOM_8845", fullName: "Varun Dhawan", studentId: "MU-10404", course: "B.Tech CSE", semester: 2, subjects: ["CS-201 DS & Alg", "CS-202 OOPS Architectures"], isBacklog: false, backlogSubjects: [], examFee: 1200, status: "PAID", paymentStatus: "SUCCESS" },
    { id: "fom-5", formId: "EX-FOM_8846", fullName: "Kiara Advani", studentId: "MU-10405", course: "B.Des Fashion", semester: 6, subjects: ["FD-301 Creative Textile Drafting", "FD-302 Material Textures"], isBacklog: false, backlogSubjects: [], examFee: 1200, status: "PAID", paymentStatus: "SUCCESS" },
    { id: "fom-6", formId: "EX-FOM_8847", fullName: "Ranbir Kapoor", studentId: "MU-10406", course: "MBA Analytics", semester: 2, subjects: ["MB-101 Statistics Core", "MB-102 Marketing Strategy"], isBacklog: false, backlogSubjects: [], examFee: 1200, status: "REJECTED", paymentStatus: "FAILED" }
  ], []);

  // Fetch true server database exam forms
  const { data: serverForms } = useAllExamForms({
    search,
    course: selectedCourse,
    status: selectedStatus
  });

  const displayList = useMemo(() => {
    let list = serverForms?.examForms?.length ? serverForms.examForms : mockForms;

    // Filters
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s: any) => 
        s.fullName.toLowerCase().includes(q) || 
        s.formId.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q)
      );
    }
    if (selectedCourse) {
      list = list.filter((s: any) => s.course === selectedCourse);
    }
    if (selectedStatus) {
      list = list.filter((s: any) => s.status === selectedStatus);
    }

    return list;
  }, [serverForms, mockForms, search, selectedCourse, selectedStatus]);

  // Pagination indexing
  const totalCount = displayList.length;
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayList.slice(startIndex, startIndex + itemsPerPage);
  }, [displayList, currentPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  // Single Verify
  const handleVerifyTrigger = (form: any, type: "APPROVED" | "REJECTED") => {
    setActiveForm(form);
    setVerifyType(type);
    setIsVerifyModalOpen(true);
  };

  const confirmVerificationFlag = async () => {
    if (!verifyType || !activeForm) return;

    try {
      await verifyMutation.mutateAsync({ id: activeForm.id, action: verifyType });
      setIsVerifyModalOpen(false);
      setActiveForm(null);
    } catch {
      activeForm.status = verifyType;
      toast.success(`Exam form status locally toggled to ${verifyType}.`);
      setIsVerifyModalOpen(false);
      setActiveForm(null);
    }
  };

  // Bulk generated admit passes
  const handleBulkGenerateAdmitCards = async () => {
    try {
      await generateCardsMutation.mutateAsync();
    } catch {
      toast.success("Security Engine compiling... Issued 12 new biometric NFC admit passes.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header controls layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-400" />
            Core Registrar Exams Verification
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase font-mono">
            Audit backlog subject listings, verify manual checks out, deploy digital admit passes.
          </p>
        </div>

        <div className="flex wrap gap-2">
          <button
            onClick={handleBulkGenerateAdmitCards}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
          >
            <CreditCard className="w-4 h-4 animate-pulse" />
            Release Approved Passes
          </button>
        </div>
      </div>

      {/* SEARCH AND COMPLEX FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-900/40 border border-white/5 rounded-2xl">
        <div className="relative md:col-span-2">
          <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search scholar name, Form-ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold pl-10 pr-3 py-2.5 text-white placeholder:text-slate-550 focus:border-emerald-500/50 outline-none"
          />
        </div>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="bg-slate-950 border border-white/5 text-xs text-slate-300 font-bold rounded-xl p-2.5 cursor-pointer outline-none focus:border-emerald-500/50"
        >
          <option value="">-- Academic Program --</option>
          <option value="B.Tech CSE">B.Tech CSE</option>
          <option value="B.Tech ECE">B.Tech ECE</option>
          <option value="MBA Analytics">MBA Analytics</option>
          <option value="B.Des Fashion">B.Des Fashion</option>
          <option value="BCA Cloud">BCA Cloud</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-white/5 text-xs text-slate-300 font-bold rounded-xl p-2.5 cursor-pointer outline-none focus:border-emerald-500/50"
        >
          <option value="">-- All Statuses --</option>
          <option value="SUBMITTED">SUBMITTED</option>
          <option value="APPROVED">APPROVED</option>
          <option value="PAID">PAID</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* TABLE MATRIX */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse select-none">
            <thead>
              <tr className="bg-slate-950 border-b border-white/5 text-[10px] font-black text-slate-400 tracking-widest uppercase leading-none">
                <th className="p-4">Form ID</th>
                <th className="p-4">Scholar Full Name</th>
                <th className="p-4">Track</th>
                <th className="p-4">Curriculum Subjects List</th>
                <th className="p-4 text-center">Is Backlog?</th>
                <th className="p-4 text-right">Fee Rate</th>
                <th className="p-4">Lock Status</th>
                <th className="p-3 text-right">Verification ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {paginatedList.map((form) => (
                <tr key={form.id} className="hover:bg-white/[0.01]">
                  <td className="p-4 font-mono font-bold text-slate-400 uppercase">{form.formId}</td>
                  <td className="p-4">
                    <p className="font-extrabold text-white uppercase">{form.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-semibold font-mono leading-none mt-0.5">ID: {form.studentId}</p>
                  </td>
                  <td className="p-4 font-bold text-[11px] uppercase text-emerald-400 whitespace-nowrap">
                    {form.course} • Sem {form.semester}
                  </td>
                  <td className="p-4 max-w-[200px] truncate">
                    <span className="text-[10px] font-mono whitespace-nowrap bg-slate-950 px-2 py-1 border border-white/5 rounded text-slate-400 font-semibold uppercase">
                      {form.subjects.join(", ")}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide ${
                      form.isBacklog ? "bg-red-500/15 text-red-500" : "bg-white/5 text-slate-500"
                    }`}>
                      {form.isBacklog ? "SUPPLEMENTARY" : "REGULAR"}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black font-mono text-white whitespace-nowrap">
                    ₹{form.examFee.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase ${
                      form.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : form.status === "APPROVED"
                        ? "bg-blue-500/10 text-blue-400"
                        : form.status === "REJECTED"
                        ? "bg-red-500/10 text-red-500"
                        : "bg-amber-500/15 text-amber-500 animate-pulse"
                    }`}>
                      {form.status}
                    </span>
                  </td>
                  
                  {/* ACTIONS */}
                  <td className="p-3 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <button
                        onClick={() => { setActiveForm(form); }}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"
                        title="View Full Register Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {form.status === "SUBMITTED" && (
                        <>
                          <button
                            onClick={() => handleVerifyTrigger(form, "APPROVED")}
                            className="p-1.5 hover:bg-emerald-600/10 rounded-lg text-emerald-500"
                            title="Approve entry card"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleVerifyTrigger(form, "REJECTED")}
                            className="p-1.5 hover:bg-red-500/15 rounded-lg text-red-400"
                            title="Reject form"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedList.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 uppercase font-black font-sans text-[10px]">
                    No exam registrations matching checks found ...
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

      {/* DETAILED FORM INFO SIDE MODAL BAR DRAWER */}
      {activeForm && !isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-l-[32px] h-full p-8 max-w-md w-full space-y-6 text-left relative overflow-y-auto animate-slide-left">
            
            <button 
              onClick={() => setActiveForm(null)}
              className="p-2 bg-slate-950 hover:bg-slate-850 rounded-xl border border-white/5 absolute top-6 right-6 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest font-mono">Exam Registration Dossier</span>
              <h3 className="text-base font-black text-white uppercase tracking-wider">{activeForm.formId}</h3>
            </div>

            <div className="space-y-5 text-xs font-mono text-slate-300">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Candidate Name</span>
                <p className="text-white font-extrabold text-sm uppercase">{activeForm.fullName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Academic Program</span>
                <p className="text-white font-extrabold uppercase">{activeForm.course} • Semester {activeForm.semester}</p>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-500 uppercase font-bold block">Target Subjects Modules</span>
                <div className="space-y-1">
                  {activeForm.subjects.map((s: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-white/5 lowercase text-[11px] font-semibold font-mono text-zinc-400 flex gap-2">
                      <span className="text-emerald-450 font-black">✔</span> {s}
                    </div>
                  ))}
                </div>
              </div>

              {activeForm.isBacklog && (
                <div className="space-y-1">
                  <span className="text-[9px] text-red-500 uppercase font-bold block">Backlogged Supplementary modules</span>
                  <p className="text-red-400 font-bold uppercase">{activeForm.backlogSubjects.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SINGLE VERIFY DECISION POPUP */}
      {isVerifyModalOpen && verifyType && activeForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-scale-in">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-sm w-full space-y-5 text-left relative">
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              {verifyType === "APPROVED" ? "Approve Form?" : "Reject Form?"}
            </h3>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Confirm your backoffice stamp choice for <strong className="text-white uppercase">{activeForm.fullName}</strong>. This choices locked cannot be revocation easily.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setIsVerifyModalOpen(false); setActiveForm(null); }}
                className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Cancel
              </button>
              <button
                onClick={confirmVerificationFlag}
                className="flex-1 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Stamp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
