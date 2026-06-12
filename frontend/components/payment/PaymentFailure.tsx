"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, LifeBuoy, X } from "lucide-react";

interface PaymentFailureProps {
  errorMessage: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function PaymentFailure({
  errorMessage,
  onRetry,
  onClose,
}: PaymentFailureProps) {
  return (
    <div className="text-center p-6 space-y-6 select-none text-left">
      
      {/* 1. Header Visual Ring */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [1.15, 1], opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="p-4 bg-red-500/10 border border-red-500/30 rounded-full text-red-400"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 className animate-pulse" />
        </motion.div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-widest text-red-400 uppercase bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
            TRANSACTION WAIVED / FAILED
          </span>
          <h2 className="text-lg font-black text-white uppercase tracking-tight text-center">
            Payment Core Refused
          </h2>
        </div>
      </div>

      {/* 2. Error Specification box */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-left space-y-1">
        <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase block">
          Gate Processor Reason:
        </span>
        <p className="text-xs font-semibold text-red-400 leading-relaxed uppercase">
          {errorMessage || "Insufficient credits available on linked card or user cancelled standard 3D-secure pin challenge."}
        </p>
      </div>

      <div className="p-3 bg-white/[0.01] border border-white/5 text-slate-400 rounded-xl leading-relaxed text-[10px] uppercase font-bold text-center">
        * No funds have been depleted. If debited, resolutions typically complete inside 24 to 48 hours.
      </div>

      {/* 3. Action controls */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onRetry}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black bg-indigo-600 hover:bg-indigo-500 border border-indigo-505 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
        >
          <RefreshCw className="w-4 h-4 flex-shrink-0" />
          Retry Gateway Sequence
        </button>
        <button
          onClick={() => {
            window.open("mailto:registrar-support@campus.edu?subject=Admissions Payment Query");
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          <LifeBuoy className="w-4 h-4 flex-shrink-0 animate-spin-slow" />
          Contact Support
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="text-[10px] font-black text-slate-500 hover:text-slate-350 tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Dismiss Modal
        </button>
      </div>

    </div>
  );
}
