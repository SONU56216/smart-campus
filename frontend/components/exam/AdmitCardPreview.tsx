"use client";

import { useRef, useState, useEffect } from "react";
import { Download, Wallet, Printer, Share2, Compass, ShieldAlert, CheckCircle2, Lock, Sparkles, UserCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react"; // Standard SVG renderer for react
import { useScreenshotProtection } from "@/hooks/useScreenshotProtection";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface AdmitCardPreviewProps {
  student: {
    fullName: string;
    rollNumber: string;
    course: string;
    semester: number;
    photo?: string;
  };
  examCenter: string;
  admitCardId: string;
  schedule: Array<{
    date: string;
    day: string;
    time: string;
    subjectCode: string;
    subjectName: string;
    room: string;
    seatNo: string;
  }>;
  onWalletSync?: () => Promise<void>;
}

export default function AdmitCardPreview({
  student,
  examCenter,
  admitCardId,
  schedule,
  onWalletSync,
}: AdmitCardPreviewProps) {
  const admitCardRef = useRef<HTMLDivElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Hook-up Advanced Screen Guard protection
  const { isBlurred, showWarning, resetProtection } = useScreenshotProtection(true);

  // Download PDF Action using jsPDF + html2canvas
  const generatePdf = async () => {
    if (!admitCardRef.current) return;
    try {
      setDownloading(true);
      toast.loading("Compiling secure high-res identity ticket PDF...");

      // Temporarily expand or sanitize any styling quirks for rendering
      const card = admitCardRef.current;
      const canvas = await html2canvas(card, {
        scale: 2, // High resolution
        useCORS: true,
        backgroundColor: "#030712", // match dark grid slate-950
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 standard width in mm
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`admit_card_sem_${student.semester}_${student.rollNumber}.pdf`);
      toast.dismiss();
      toast.success("Admit Card ticket successfully downloaded as secure PDF!");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to trigger PDF rendering sequence.");
    } finally {
      setDownloading(false);
    }
  };

  const syncToLocalWallet = async () => {
    if (!onWalletSync) return;
    try {
      setSyncing(true);
      await onWalletSync();
    } catch (e: any) {
      toast.error(e.message || "Credential synchronization failed.");
    } finally {
      setSyncing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Admit Card - End Semester Examination Dec 2024",
          text: `My secure admit card for Semester ${student.semester} - Roll ${student.rollNumber}`,
          url: window.location.href,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch(() => toast.error("Sharing sequence canceled."));
    } else {
      // Fallback: Copy link
      try {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Admit card shareable link copied to clipboard.");
      } catch (_) {
        toast.error("Sharing not supported on this device.");
      }
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      
      {/* 1. Header controls & warning reports */}
      <div className="flex flex-wrap gap-3 items-center justify-between border-b border-white/5 pb-4">
        <div className="space-y-1">
          <span className="text-[9px] font-black tracking-widest text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full uppercase border border-[#10b981]/25 inline-flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Verified Registry Token
          </span>
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Secure Entry Pass Preview
          </h4>
        </div>

        {/* Top Control Buttons block */}
        <div className="flex flex-wrap gap-2">
          {onWalletSync && (
            <button
              onClick={syncToLocalWallet}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl bg-slate-900 hover:bg-slate-850 text-white border border-white/5 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              {syncing ? "Syncing..." : "Add to Wallet"}
            </button>
          )}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl bg-slate-900 hover:bg-slate-850 text-white border border-white/5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl bg-slate-900 hover:bg-slate-850 text-white border border-white/5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            onClick={generatePdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Screen Violation Interception Alert banner */}
      {showWarning && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-start gap-3 animate-bounce leading-relaxed text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-500 animate-pulse" />
          <div className="space-y-1">
            <h5 className="font-black uppercase tracking-wider text-[10px]">
              Security Guard Restriction Warning
            </h5>
            <p className="text-[10px] uppercase tracking-wide leading-normal text-red-300">
              Screenshots or printing attempts have triggered security flags. To clear this state in your mockup browser, tap anywhere inside or wait for auto-release.
            </p>
          </div>
        </div>
      )}

      {/* 2. Official Admit Card Template Box */}
      <div className="relative">
        {/* Dynamic active protection blur filter wrapper */}
        <div
          ref={admitCardRef}
          onClick={resetProtection}
          className={`bg-slate-950 border-2 border-slate-800 rounded-[32px] p-6 md:p-8 relative overflow-hidden transition-all ${
            isBlurred ? "blur-xl scale-[0.98] pointer-events-none" : ""
          }`}
          style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(17, 24, 39, 0.4) 0%, rgba(3, 7, 18, 1) 100%)" }}
        >
          {/* SECURE DIAGONAL WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden rotate-[-35deg]">
            <span className="text-[80px] md:text-[110px] font-black tracking-[0.25em] text-white">
              CONFIDENTIAL
            </span>
          </div>

          <div className="absolute -top-16 -right-16 w-44 h-44 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          {/* College Header */}
          <div className="border-b-2 border-slate-800 pb-5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Crest Logo */}
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white border border-blue-400/20">
                <Compass className="w-8 h-8 [animation-duration:15s] animate-spin" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-base font-black text-white uppercase tracking-wider">
                  METROPOLITAN UNIVERSITY OF TECHNOLOGIES
                </h2>
                <h3 className="text-[10px] text-blue-400/80 font-black tracking-widest uppercase">
                  OFFICE OF THE CONTROLLER OF EXAMINATIONS
                </h3>
                <p className="text-[9px] text-slate-505 font-bold uppercase">
                  Accredited Grade A+ • Central Registry Bureau, New Delhi
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-white/5 p-3 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-black text-slate-550 uppercase tracking-widest leading-none">
                Ticket Token
              </span>
              <span className="text-[10px] font-mono font-black text-white uppercase tracking-wider pt-1">
                #{admitCardId.slice(0, 10).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Title tag bar */}
          <div className="py-4 text-center">
            <h3 className="text-sm md:text-base font-black tracking-widest text-[#10b981] uppercase leading-none">
              ADMIT CARD - END SEMESTER EXAMINATION DEC 2024
            </h3>
          </div>

          {/* Student details slot card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start bg-slate-900/30 border border-white/5 p-5 rounded-2xl mt-2">
            
            {/* Student ID Photo Container */}
            <div className="flex flex-col items-center gap-2 md:col-span-1 border-r border-white/5 pr-0 md:pr-4">
              <div className="w-28 h-32 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative flex items-center justify-center">
                {student.photo ? (
                  <img src={student.photo} alt="Student ID Photo" className="w-full h-full object-cover" />
                ) : (
                  <UserCheck className="w-12 h-12 text-slate-800 animate-pulse" />
                )}
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-emerald-600 border border-emerald-500 rounded text-[7px] font-black text-white uppercase leading-none">
                  Audited
                </div>
              </div>
              <span className="text-[8px] font-black uppercase text-slate-550">Photo ID Seal</span>
            </div>

            {/* Profile Identity items */}
            <div className="md:col-span-3 grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">
                  Name of Candidate
                </span>
                <span className="text-white font-black text-sm uppercase block font-sans">
                  {student.fullName}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">
                  Roll / Enrollment Number
                </span>
                <span className="text-white font-black text-sm block">
                  {student.rollNumber}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">
                  Course & Department
                </span>
                <span className="text-white font-black block font-sans uppercase">
                  {student.course}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block">
                  Active Semester
                </span>
                <span className="text-white font-black block">
                  Semester {student.semester}
                </span>
              </div>

              <div className="col-span-2 space-y-1 pt-2 border-t border-white/5">
                <span className="text-[8.5px] font-bold text-[#60a5fa] uppercase tracking-widest block">
                  Allotted Examination Venue Center
                </span>
                <span className="text-white font-black uppercase block font-sans text-[11px] leading-tight">
                  {examCenter}
                </span>
              </div>
            </div>

          </div>

          {/* Course Timetables Ledger */}
          <div className="mt-6 space-y-1.5">
            <h4 className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Schedule Timetables & Seating Indexes
            </h4>
            
            <div className="border border-white/5 rounded-xl overflow-hidden bg-slate-950/80">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-slate-900/40 text-slate-450 uppercase text-[9px] font-black tracking-widest">
                    <th className="py-3 px-4">Slot Time</th>
                    <th className="py-3 px-4">Subject Info</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4 text-center">Desk No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {schedule.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-900/20 text-slate-400">
                      <td className="py-3 px-4 text-white font-bold">
                        <div className="flex flex-col">
                          <span>{item.date}</span>
                          <span className="text-[10px] text-slate-500">{item.time}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white font-sans font-semibold uppercase">
                        {item.subjectName}
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-400 text-xs text-left">
                        {item.subjectCode}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-white text-xs">
                        {item.seatNo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Instructions, QR Verification and Barcode Footer */}
          <div className="mt-8 pt-5 border-t border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Standard instruction notices */}
            <div className="md:col-span-3 text-[10px] text-slate-400 space-y-2 uppercase tracking-wide leading-relaxed">
              <span className="font-black text-white text-[9.5px] block tracking-widest">
                CRITICAL INSTRUCTION DIRECTIVES:
              </span>
              <ul className="list-decimal list-inside space-y-1 pl-1">
                <li>Candidates must reach the exam center 30 minutes early.</li>
                <li>Digital devices, smartwatches and electronic bags are strictly prohibited.</li>
                <li>Carry physical photo ID proofs and student ID credential cards always.</li>
                <li>Tampering or screen modification will result in cancellation of candidate.</li>
              </ul>
            </div>

            {/* QR Verification details and Simulated barcode */}
            <div className="md:col-span-1 flex flex-col items-center justify-center gap-3">
              <div className="bg-white p-2.5 rounded-2xl inline-block border border-slate-800">
                <QRCodeSVG
                  value={`CAP-EXAM-ID-${admitCardId}-ROLL-${student.rollNumber}`}
                  size={84}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>
              <span className="text-[8px] font-black text-slate-550 tracking-wider">
                COE QR VERIFY SEAL
              </span>
            </div>

          </div>

          {/* Barcode line blocks at the very bottom */}
          <div className="mt-8 pt-2 select-none border-t border-white/5 flex flex-col items-center gap-1.5 opacity-40">
            <div className="flex gap-0.5 justify-center h-8 w-64 max-w-full">
              {[...Array(38)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-sm"
                  style={{
                    width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2) * 1.5}px`,
                    opacity: i % 7 === 0 ? 0.35 : 0.85,
                  }}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono tracking-[0.4em] text-slate-400 font-bold">
              *CP-{student.rollNumber}-SEM{student.semester}*
            </span>
          </div>

        </div>

        {/* Security Alert Overlay Panel when blurred */}
        {isBlurred && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-50">
            <div className="bg-slate-950/90 border border-red-500/35 p-8 rounded-3xl max-w-sm space-y-4 animate-scale-in">
              <Lock className="w-12 h-12 text-red-500 mx-auto animate-bounce" />
              <div className="space-y-1.5">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  Credential Vault Blotted
                </h4>
                <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed">
                  Interactive display has locked and blurred due to focus removal or system security prevention triggers.
                </p>
              </div>
              <button
                onClick={resetProtection}
                className="w-full py-2.5 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
              >
                Restore View Check
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
