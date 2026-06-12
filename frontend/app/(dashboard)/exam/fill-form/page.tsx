"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useStudent } from "@/hooks/useStudent";
import { useExam } from "@/hooks/useExam";
import SubjectSelector, { SubjectItem } from "@/components/exam/SubjectSelector";
import FeeBreakdown from "@/components/exam/FeeBreakdown";
import DigitalSignaturePad from "@/components/exam/DigitalSignaturePad";
import { Landmark, Compass, ShieldCheck, AlertCircle, Loader2, ArrowLeft, ClipboardList, Wallet, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ExamFillFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = (searchParams.get("type") || "regular").toUpperCase() as "REGULAR" | "BACKLOG" | "SUPPLEMENTARY";

  const { useProfile } = useStudent();
  const { useAvailableExams, useSubmitExamForm } = useExam();

  const { data: student, isLoading: loadingProfile } = useProfile();
  const { data: config, isLoading: loadingRules } = useAvailableExams();
  const submitFormMutation = useSubmitExamForm();

  // Basic lists of subjects depending on course and backlog category
  const getSubjectsList = (): SubjectItem[] => {
    if (formType === "BACKLOG") {
      return [
        { code: "CS-201", name: "Data Structures & Algorithms", credits: 4, isBacklog: true },
        { code: "MA-202", name: "Discrete Mathematical Structures", credits: 3, isBacklog: true },
      ];
    } else if (formType === "SUPPLEMENTARY") {
      return [
        { code: "CS-304", name: "Database Management Systems", credits: 4 },
        { code: "CS-305", name: "Theory of Computation", credits: 3 },
      ];
    } else {
      // REGULAR End Sem subjects
      return [
        { code: "CS-401", name: "Compiler Design & Automation", credits: 4 },
        { code: "CS-402", name: "Artificial Intelligence & Heuristics", credits: 4 },
        { code: "CS-403", name: "Software Testing & Methodologies", credits: 3 },
        { code: "CS-404", name: "Advanced Computer Networks", credits: 3 },
        { code: "HM-402", name: "Professional Ethics & Corporate Law", credits: 2 },
      ];
    }
  };

  const availableSubjects = getSubjectsList();
  
  // States of the form
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [centerPreference, setCenterPreference] = useState("CS_BLOCK_A");
  const [scribeNeeded, setScribeNeeded] = useState(false);
  const [extraTime, setExtraTime] = useState(false);
  const [wheelchairAccess, setWheelchairAccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signature, setSignature] = useState("");
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Auto-select all regular subjects by default for premium usability
  useEffect(() => {
    if (formType === "REGULAR" && availableSubjects.length > 0) {
      setSelectedCodes(availableSubjects.map((s) => s.code));
    }
  }, [formType]);

  const pricing = {
    regularFee: config?.examFee ?? 3000,
    backlogFee: config?.backlogSubjectFee ?? 800,
    lateFee: config?.lateFee ?? 500,
  };

  // Calculations
  const regularCount = formType === "REGULAR" ? selectedCodes.length : 0;
  const backlogCount = formType === "BACKLOG" ? selectedCodes.length : 0;
  const standardBillTotal = (regularCount * pricing.regularFee) + (backlogCount * pricing.backlogFee);
  // Late registration threshold simulated
  const isLate = false; 
  const totalAmount = standardBillTotal + (isLate ? pricing.lateFee : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCodes.length === 0) {
      toast.error("Please pick at least one syllabus subject to proceed.");
      return;
    }
    if (!agreeTerms) {
      toast.error("You must accept the examination conduct declaration.");
      return;
    }
    if (!signature) {
      toast.error("Digital ink signature is required to authorize this document.");
      return;
    }

    // Modal checkout screen trigger
    setIsSubmitModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      await submitFormMutation.mutateAsync({
        semester: student?.semester ?? 1,
        subjects: selectedCodes,
        isBacklog: formType === "BACKLOG",
        examCenter: centerPreference,
        signatureString: signature,
        specialAccommodations: {
          scribe: scribeNeeded,
          extraTime,
          wheelchair: wheelchairAccess,
        },
      });

      setIsSubmitModalOpen(false);
      router.push("/exam/forms");
    } catch (err: any) {
      toast.error("Failed to commit examination entry sheet.");
    }
  };

  if (loadingProfile || loadingRules) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-9 h-9 text-blue-500 animate-spin" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block leading-none">
          Drafting secure exam forms...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-4xl mx-auto py-2">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-400" />
            Exam Entry Application
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase">
            Double-check credentials for {formType} sessions.
          </p>
        </div>

        <button
          onClick={() => router.push("/exam/forms")}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Forms Catalog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Personal profile Details card (Self populated) */}
        <div className="bg-slate-900/15 border border-white/5 p-6 rounded-[28px] space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2">
            1. Authorized Candidate Metadata (Self-Populated)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Student Name</span>
              <span className="text-white text-sm font-bold uppercase font-sans">{student?.fullName || "Candidate"}</span>
            </div>

            <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">ID / Roll No</span>
              <span className="text-white text-sm font-bold uppercase">{student?.rollNumber || "MU-89123"}</span>
            </div>

            <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Major Stream Curriculum</span>
              <span className="text-white text-sm font-bold uppercase font-sans">{student?.course || "Computer Science Eng."}</span>
            </div>

            <div className="space-y-1 bg-slate-950/40 p-3.5 rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black block">Active Semester</span>
              <span className="text-white text-sm font-bold uppercase">Semester {student?.semester || 4}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Subject Selector Module (With fees) */}
        <div className="bg-slate-900/15 border border-white/5 p-6 rounded-[28px] space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2">
            2. Curriculum Syllabus Selection
          </h3>
          <SubjectSelector
            subjects={availableSubjects}
            selectedCodes={selectedCodes}
            onChange={setSelectedCodes}
            feePerRegular={pricing.regularFee}
            feePerBacklog={pricing.backlogFee}
          />
        </div>

        {/* SECTION 3: Hall allocation room choices & Special accommodations */}
        <div className="bg-slate-900/15 border border-white/5 p-6 rounded-[28px] space-y-5">
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-white/5 pb-2">
            3. Seat & Center Preferences & Accommodations
          </h3>

          {/* Hall select dropdown */}
          <div className="space-y-2 select-none text-left">
            <label className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Preferred Examination Building Block
            </label>
            <div className="relative">
              <select
                value={centerPreference}
                onChange={(e) => setCenterPreference(e.target.value)}
                className="w-full bg-slate-950/50 hover:bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-white uppercase font-bold focus:border-blue-500 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="CS_BLOCK_A">Computer Science Block A - Delhi Campus</option>
                <option value="CS_BLOCK_B">Computer Science Block B - Delhi Campus</option>
                <option value="TECH_BUILDING">Main Technology Auditorium Corridors - Bangalore Center</option>
                <option value="AUDITORIUM_HALL">Auditorium Main Dome Hall</option>
              </select>
            </div>
          </div>

          {/* Accommodations checklist */}
          <div className="space-y-3.5 pt-2">
            <span className="text-[10px] font-black tracking-widest text-[#60a5fa] uppercase block">
              Special Disability & Medical Assistant Accommodation
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Scribe */}
              <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-slate-950/20 cursor-pointer select-none hover:bg-slate-950/40 transition-all">
                <input
                  type="checkbox"
                  checked={scribeNeeded}
                  onChange={(e) => setScribeNeeded(e.target.checked)}
                  className="w-4.5 h-4.5 accent-blue-600 rounded bg-slate-900"
                />
                <div className="space-y-0.5">
                  <span className="text-white text-xs font-bold block uppercase leading-none">Scribe Needed</span>
                  <span className="text-[8.5px] text-slate-500 font-bold block leading-none">Medical Assistant scribe</span>
                </div>
              </label>

              {/* Extra Time */}
              <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-slate-950/20 cursor-pointer select-none hover:bg-slate-950/40 transition-all">
                <input
                  type="checkbox"
                  checked={extraTime}
                  onChange={(e) => setExtraTime(e.target.checked)}
                  className="w-4.5 h-4.5 accent-blue-600 rounded bg-slate-900"
                />
                <div className="space-y-0.5">
                  <span className="text-white text-xs font-bold block uppercase leading-none">Extra Time (+60M)</span>
                  <span className="text-[8.5px] text-slate-500 font-bold block leading-none">Special buffer hour grant</span>
                </div>
              </label>

              {/* Wheelchair accessible */}
              <label className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-slate-950/20 cursor-pointer select-none hover:bg-slate-950/40 transition-all">
                <input
                  type="checkbox"
                  checked={wheelchairAccess}
                  onChange={(e) => setWheelchairAccess(e.target.checked)}
                  className="w-4.5 h-4.5 accent-blue-600 rounded bg-slate-900"
                />
                <div className="space-y-0.5">
                  <span className="text-white text-xs font-bold block uppercase leading-none">Desk Ramp Access</span>
                  <span className="text-[8.5px] text-slate-500 font-bold block leading-none">Wheelchair corridor space</span>
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* SECTION 4: Digital Signature Pad */}
        <div className="bg-slate-900/15 border border-white/5 p-6 rounded-[28px]">
          <DigitalSignaturePad onChange={setSignature} savedSignature={student?.signature} />
        </div>

        {/* REAL-TIME COST REPORT INVOICING CARD */}
        <FeeBreakdown
          regularCount={regularCount}
          backlogCount={backlogCount}
          feePerRegular={pricing.regularFee}
          feePerBacklog={pricing.backlogFee}
          lateFee={pricing.lateFee}
          isAfterDeadline={isLate}
        />

        {/* SECTION 5: Accept declaration check box */}
        <div className="p-5 border border-white/5 rounded-2xl bg-slate-905 flex items-start gap-3.5">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            required
            className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
          />
          <div className="space-y-1">
            <span className="text-white text-xs font-black uppercase tracking-wider block">
              Official Candidate Declaration Conduct Check
            </span>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed uppercase">
              I hereby declare that I am fit and compliant with the Metropolitan University bylaws. I certify that all particulars given represent verified truth, and any structural tampering with systems will cause registry cancellation.
            </p>
          </div>
        </div>

        {/* Primary application checkout trigger button */}
        <button
          type="submit"
          className="w-full py-4 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-[16px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-blue-500/5 hover:-translate-y-0.5 cursor-pointer"
        >
          Proceed to Secure Gateways
        </button>

      </form>

      {/* CONFIRMATION CHECKOUT MODAL POPUP */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-md w-full space-y-6 text-left relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
                <Landmark className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">
                  Central Registry Portal
                </span>
                <h4 className="text-base font-black text-white uppercase tracking-wider">
                  Payment Verification Gate
                </h4>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl space-y-2 border border-white/5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider">Course Bundle</span>
                <span className="text-white font-bold">{selectedCodes.length} Modules Selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 uppercase font-black text-[9px] tracking-wider">Session Charge</span>
                <span className="text-white font-bold">₹{standardBillTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/5 font-bold text-white text-sm">
                <span className="text-[10px] uppercase font-black text-blue-400">Grand Total Due</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal uppercase pl-1">
              Note: Fees are securely routed via instant payment systems. Retain your txn tokens upon settlement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="flex-1 py-3 text-xs font-black bg-[#10b981] hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Authenticate & Lock
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
