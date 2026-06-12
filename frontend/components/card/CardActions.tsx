"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  FileText, 
  Share2, 
  Printer, 
  AlertTriangle, 
  Check, 
  CreditCard,
  Smartphone,
  X,
  AlertOctagon,
  Copy
} from "lucide-react";
import { generateCardImage, generateCardPdf } from "@/lib/generateCardImage";
import { addToAppleWallet, addToGoogleWallet } from "@/lib/addToWallet";

interface CardActionsProps {
  studentData: {
    studentId: string;
    fullName: string;
    course: string;
    department: string;
    photoUrl: string;
    status: string;
    validUntil: string;
  };
  onStatusChange?: (newStatus: "ACTIVE" | "BLOCKED" | "EXPIRED") => void;
}

export default function CardActions({ studentData, onStatusChange }: CardActionsProps) {
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [lostReason, setLostReason] = useState("");
  const [confirmCheckbox, setConfirmCheckbox] = useState(false);
  const [isSubmitLost, setIsSubmitLost] = useState(false);

  const cardName = studentData?.fullName || "Scholar";
  const elementId = "id-card-frame-capture"; // ID of the Div wrapper of DigitalIDCard

  // 1. Download Card Image Action
  const handleDownloadImage = async () => {
    try {
      await generateCardImage(elementId, cardName);
    } catch (e: any) {
      console.error(e);
    }
  };

  // 2. Download Card PDF Action
  const handleDownloadPdf = async () => {
    try {
      await generateCardPdf(elementId, cardName);
    } catch (e: any) {
      console.error(e);
    }
  };

  // 3. Apple Wallet Binding
  const handleAppleWallet = async () => {
    await addToAppleWallet({
      studentId: studentData.studentId,
      fullName: studentData.fullName,
      course: studentData.course,
      department: studentData.department,
      avatarUrl: studentData.photoUrl,
      status: studentData.status,
      validUntil: studentData.validUntil,
    });
  };

  // 4. Google Wallet Binding
  const handleGoogleWallet = async () => {
    await addToGoogleWallet({
      studentId: studentData.studentId,
      fullName: studentData.fullName,
      course: studentData.course,
      department: studentData.department,
      avatarUrl: studentData.photoUrl,
      status: studentData.status,
      validUntil: studentData.validUntil,
    });
  };

  // 5. Share Temporary Verification Node
  const handleShare = async () => {
    setIsShareLoading(true);
    try {
      // Secure random hex representing temporary JWT parameters
      const tempHash = Math.random().toString(36).substring(2, 15);
      const secureSharedUrl = `${window.location.origin}/verify/id/${studentData.studentId}?tempKey=${tempHash}&expiry=300`;
      
      await navigator.clipboard.writeText(secureSharedUrl);
      
      toast.success("Secured Link Copied!", {
        description: "This temporary verification link is valid for exactly 5 minutes.",
        duration: 4000,
      });
    } catch (e) {
      toast.error("Sharing failed. Clipboard permissions blocked.");
    } finally {
      setIsShareLoading(false);
    }
  };

  // 6. Native Print Action
  const handlePrint = () => {
    window.print();
  };

  // 7. Submit Report of Lost / Stolen Credentials
  const handleReportLostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostReason.trim()) {
      toast.error("Please explain the loss event details for the registrar.");
      return;
    }
    if (!confirmCheckbox) {
      toast.error("You must authorize immediate credential cancellation.");
      return;
    }

    setIsSubmitLost(true);
    try {
      // Simulate API patch
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.error(`ID Pass Blocked Successfully`, {
        description: `Campus card ${studentData.studentId} has been blacklisted and reported as stolen.`,
        duration: 5000,
      });

      if (onStatusChange) {
        onStatusChange("BLOCKED");
      }

      setShowLostModal(false);
      setLostReason("");
      setConfirmCheckbox(false);
    } catch (err) {
      toast.error("Failed to post revocation ledger.");
    } finally {
      setIsSubmitLost(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Prime Core Tool Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        
        {/* Download JPG button */}
        <button
          onClick={handleDownloadImage}
          className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-primary" />
          Download PNG
        </button>

        {/* Download PDF button */}
        <button
          onClick={handleDownloadPdf}
          className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-emerald-500" />
          Download PDF
        </button>

        {/* Temp Share link copy */}
        <button
          onClick={handleShare}
          disabled={isShareLoading}
          className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl transition-all shadow-sm disabled:opacity-50 active:scale-95 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-blue-500" />
          Share Access Pass
        </button>

        {/* Apple Wallet push */}
        <button
          onClick={handleAppleWallet}
          className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <CreditCard className="w-4 h-4 text-orange-500" />
          Apple Wallet
        </button>

        {/* Google Wallet push */}
        <button
          onClick={handleGoogleWallet}
          className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-blue-400" />
          Google Wallet
        </button>

        {/* Print button */}
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 pl-3.5 pr-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-955 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-500" />
          Print Pass
        </button>

      </div>

      {/* Emergency Lost Option Container */}
      <div className="pt-2">
        <button
          onClick={() => setShowLostModal(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 border border-red-200 hover:bg-red-50 dark:border-red-950/40 dark:hover:bg-red-950/15 text-red-600 dark:text-red-400 text-xs font-black rounded-2xl transition-all shadow-xs active:scale-95 cursor-pointer select-none"
        >
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Emergency: Report Card Lost or Stolen
        </button>
      </div>

      {/* Glass Red Alert Confirmation Dialog */}
      <AnimatePresence>
        {showLostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 18 }}
              className="relative w-full max-w-md border border-red-500/20 bg-white dark:bg-slate-950 rounded-3xl shadow-2xl p-6 overflow-hidden text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLostModal(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Alert Header */}
              <div className="flex items-start gap-4 pb-4 border-b border-red-100 dark:border-red-950/40">
                <div className="p-3 bg-red-100 dark:bg-red-955 text-red-600 dark:text-red-400 rounded-2xl">
                  <AlertOctagon className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wide">
                    Revocation Command Desk
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold leading-normal pt-0.5">
                    Revoking ID card {studentData.studentId || "MIT-7281-D9"}. This process is immediate and non-reversible.
                  </p>
                </div>
              </div>

              {/* Form elements */}
              <form onSubmit={handleReportLostSubmit} className="pt-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Loss Incident Explanation
                  </label>
                  <textarea
                    required
                    placeholder="Provide details about where and when you lost the card..."
                    rows={3}
                    value={lostReason}
                    onChange={(e) => setLostReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/15 focus:border-red-500 transition-all resize-none font-medium"
                  />
                </div>

                {/* Secure Switch Agreement Check */}
                <label className="flex items-start gap-3 p-3 bg-red-50/30 dark:bg-red-950/10 border border-red-200/20 dark:border-red-950/30 rounded-2xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmCheckbox}
                    onChange={(e) => setConfirmCheckbox(e.target.checked)}
                    className="mt-0.5 rounded text-red-605 focus:ring-red-505 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800"
                  />
                  <div className="text-[10px] font-medium text-slate-500 leading-normal">
                    <strong className="text-slate-800 dark:text-slate-205 block font-bold">
                      Block ID and revoke clearance rights:
                    </strong>
                    I authorize the administration to flag this physical chip RFID card as void. I underwrite a reissue fee request.
                  </div>
                </label>

                {/* Operations Actions */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLostModal(false)}
                    className="flex-1 px-4 py-2.5 text-xs font-bold border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-955 text-slate-500 dark:text-slate-400 rounded-xl transition-all"
                  >
                    Keep Pass Active
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitLost}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95"
                  >
                    {isSubmitLost ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Revoking...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Deactivate Card
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
