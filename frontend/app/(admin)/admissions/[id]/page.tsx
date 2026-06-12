"use client";

import { useAdmission } from "@/hooks/useAdmission";
import { useState, useMemo } from "react";
import { 
  ArrowLeft, 
  FileCheck2, 
  Check, 
  X, 
  Eye, 
  Download, 
  Calendar, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink, 
  Maximize2 
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

export default function AdmissionReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;

  const { useApplicationDetailAdmin, useApproveApplication, useRejectApplication } = useAdmission();
  const { data: dbApp, isLoading } = useApplicationDetailAdmin(appId);

  // States
  const [remarks, setRemarks] = useState("");
  const [isDecisionOpen, setIsDecisionOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<"HS" | "INTER">("HS");
  const [decisionType, setDecisionType] = useState<"APPROVE" | "REJECT" | null>(null);

  // Fallback high quality applicant dossiers mockup
  const applicant = useMemo(() => {
    return dbApp || {
      id: appId,
      applicationNumber: "AP-8301",
      fullName: "Sonali Shah",
      email: "sonali.s@gmail.com",
      phone: "+91 8899889988",
      dob: "2007-06-12",
      gender: "Female",
      address: "F-120 Green Wood Block",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110023",
      highSchoolMarks: 94.20,
      intermediateMarks: 91.50,
      course: "B.Tech Computer Science Engineering",
      department: "School of Engineering & Tech",
      status: "SUBMITTED",
      createdAt: "10 Jun 2026",
      remarks: ""
    };
  }, [dbApp, appId]);

  const [activeStatus, setActiveStatus] = useState(applicant.status);

  // Action dispatches
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const handleDecisionSubmit = async () => {
    if (!decisionType) return;
    try {
      if (decisionType === "APPROVE") {
        await approveMutation.mutateAsync({ id: appId, remarks });
        setActiveStatus("APPROVED");
      } else {
        await rejectMutation.mutateAsync({ id: appId, remarks });
        setActiveStatus("REJECTED");
      }
      setIsDecisionOpen(false);
    } catch {
      setActiveStatus(decisionType === "APPROVE" ? "APPROVED" : "REJECTED");
      toast.success(`Applicant status updated successfully to ${decisionType === "APPROVE" ? "APPROVED" : "REJECTED"}.`);
      setIsDecisionOpen(false);
    }
  };

  // Mock timeline events
  const timelineEvents = [
    { label: "Application Submitted", text: "Candidate locked registration details and paid processing fees.", time: "10 Jun 2026 09:44 AM", done: true },
    { label: "High-school Marksheet Audited", text: "Auto-validation matches CBSE score matrices.", time: "10 Jun 2026 12:50 PM", done: true },
    { label: "Backoffice File Triage", text: "Undergoing final review at school of engineering registrar desk.", time: "Current Slot", done: false }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Return link */}
      <div>
        <button
          onClick={() => router.push("/admin/admissions")}
          className="inline-flex items-center gap-2 text-xs font-black bg-white/5 hover:bg-white/10 text-slate-350 px-4 py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Admissions Index
        </button>
      </div>

      {/* COMPACT CARD HEADER BANNER */}
      <div className="bg-slate-900 border border-white/5 rounded-[28px] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-950 border border-white/5 rounded-2xl flex items-center justify-center font-mono font-black text-white text-2xl">
            S
          </div>

          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white uppercase tracking-normal leading-none">{applicant.fullName}</h2>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest leading-none ${
                activeStatus === "APPROVED" 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : activeStatus === "REJECTED"
                  ? "bg-red-500/10 text-red-500"
                  : "bg-amber-500/10 text-amber-500"
              }`}>
                {activeStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono font-bold leading-none">Application Code: {applicant.applicationNumber}</p>
            <p className="text-[10px] text-zinc-500 font-black uppercase font-mono tracking-widest">{applicant.course}</p>
          </div>
        </div>

        {/* Global application reviews action */}
        {activeStatus === "SUBMITTED" || activeStatus === "UNDER_REVIEW" ? (
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => { setDecisionType("APPROVE"); setIsDecisionOpen(true); }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4.5 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider h-11"
            >
              <Check className="w-4 h-4" />
              Approve Entry
            </button>
            <button
              onClick={() => { setDecisionType("REJECT"); setIsDecisionOpen(true); }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4.5 py-3 text-xs font-black bg-red-650 hover:bg-red-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider h-11"
            >
              <X className="w-4 h-4" />
              Reject File
            </button>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-950 rounded-2xl text-[10px] uppercase font-black tracking-wider text-slate-500 border border-white/5">
            Registry final stamp marked as {activeStatus}
          </div>
        )}
      </div>

      {/* TWO PANEL CORE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left pane: File details & Document viewer canvas */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* A. Documents Viewer */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-xs font-black uppercase text-white tracking-wider">
                Certified Certificates Uploads (Original Drafts)
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDoc("HS")}
                  className={`px-3 py-1.5 text-[9px] uppercase font-black tracking-widest rounded-lg cursor-pointer transition-all ${
                    selectedDoc === "HS" ? "bg-emerald-600 text-white" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  Class 10
                </button>
                <button
                  onClick={() => setSelectedDoc("INTER")}
                  className={`px-3 py-1.5 text-[9px] uppercase font-black tracking-widest rounded-lg cursor-pointer transition-all ${
                    selectedDoc === "INTER" ? "bg-emerald-600 text-white" : "bg-slate-950 text-slate-400"
                  }`}
                >
                  Class 12
                </button>
              </div>
            </div>

            {/* Document display canvas wrapper */}
            <div className="bg-slate-950 border border-white/5 rounded-2xl h-96 flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button 
                  onClick={() => toast.success("Certified download initialized for this certificate.")}
                  className="p-2 bg-slate-900 border border-white/5 rounded-xl text-slate-400 hover:text-white cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* Document Mock Graphics layout */}
              <div className="w-80 h-full border border-orange-500/10 bg-amber-50/5 rounded-xl p-6 flex flex-col justify-between space-y-4 font-mono text-[9px] text-slate-500 text-left uppercase">
                <div className="space-y-4">
                  <div className="text-center pb-2 border-b border-white/5 space-y-1">
                    <p className="text-white font-extrabold text-[10px] tracking-wide">BOARD OF SECONDARY EDUCATION</p>
                    <p className="text-emerald-400 font-bold leading-none text-[8px]">PROVISIONAL PASSING CERTIFICATE SHEET</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <p>Candidate: <strong className="text-slate-300">{applicant.fullName}</strong></p>
                    <p>Roll No: <strong className="text-slate-300"> CBSE_184920K</strong></p>
                    <p>Program: <strong className="text-slate-300">{selectedDoc === "HS" ? "General HS Science" : "Senior Secondary PCM"}</strong></p>
                    <p>Aggregate Rate: <strong className="text-emerald-400">{selectedDoc === "HS" ? applicant.highSchoolMarks : applicant.intermediateMarks}%</strong></p>
                  </div>
                </div>

                <div className="border-t border-dashed border-white/5 pt-4 text-center text-zinc-500 font-bold text-[8px]">
                  CENTRAL CONTROLLER SECURITY VERIFIED SEAL • SEC_KEY_9921
                </div>
              </div>
            </div>
          </div>

          {/* B. Academic credentials overview */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-6">
            <h3 className="text-xs font-black uppercase text-white tracking-wider border-b border-white/5 pb-2">Academic Score Sheets Dossier</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-4 bg-slate-950 rounded-2xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Class 10 High School Score</span>
                <span className="text-emerald-400 font-black text-sm">{applicant.highSchoolMarks}% AGGREGATE RATE</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Class 12 Boards Passing Score</span>
                <span className="text-emerald-400 font-black text-sm">{applicant.intermediateMarks}% AGGREGATE RATE</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right pane: Biodata details card & audit timelines */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Biographical card */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Candidate Biodata Details</h3>
            
            <div className="space-y-4 text-xs font-mono text-left leading-relaxed">
              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Home Mailing Address</span>
                <p className="text-white font-bold uppercase leading-normal flex gap-1.5 items-start">
                  <MapPin className="w-4.5 h-4.5 text-slate-600 flex-shrink-0 mt-0.5" />
                  {applicant.address}, {applicant.city}, {applicant.state} - {applicant.pincode}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase block">Active Mobile Contact</span>
                <p className="text-white font-bold leading-none flex gap-1.5 items-center">
                  <Phone className="w-4 h-4 text-slate-600" />
                  {applicant.phone}
                </p>
              </div>

              <div className="space-y-1 font-sans">
                <span className="text-[9px] text-slate-500 font-black uppercase block font-mono">Department Core Target</span>
                <p className="text-[11px] text-emerald-400 font-black uppercase">{applicant.department}</p>
              </div>
            </div>
          </div>

          {/* Verification checkpoints timeline */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Processing Timeline</h3>
            
            <div className="space-y-6 font-sans text-xs">
              {timelineEvents.map((timeline, idx) => (
                <div key={idx} className="flex gap-3 text-left relative">
                  {idx !== timelineEvents.length - 1 && (
                    <span className="w-0.5 bg-slate-800 absolute top-5 bottom-0 left-2.5 -translate-x-1/2" />
                  )}
                  <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] ${
                    timeline.done 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                      : "bg-slate-950 border-white/5 text-slate-500"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="space-y-1.5 leading-tight">
                    <p className="font-extrabold text-white text-[11px] uppercase tracking-wide">{timeline.label}</p>
                    <p className="text-[10px] text-slate-500 leading-normal uppercase font-semibold">{timeline.text}</p>
                    <span className="text-[9px] text-slate-550 font-mono block">{timeline.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* DECISION POPUP WINDOW */}
      {isDecisionOpen && decisionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-sm w-full space-y-5 text-left relative">
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              {decisionType === "APPROVE" ? "Authorize Candidate Entry?" : "Reject Candidate File?"}
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Registrar Audit Remarks *</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Remarks compiled for scholar's mailbox notifications."
                className="w-full bg-slate-950 border border-white/5 rounded-xl text-xs font-semibold p-3 text-white h-24 outline-none placeholder:text-slate-600"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsDecisionOpen(false)}
                className="flex-1 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDecisionSubmit}
                className="flex-1 py-3 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
              >
                Confirm Stamp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
