"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, RefreshCw, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface PaymentSuccessProps {
  amount: number;
  transactionId: string;
  purpose: string;
  onClose: () => void;
  onDownloadReceipt?: () => void;
}

export default function PaymentSuccess({
  amount,
  transactionId,
  purpose,
  onClose,
  onDownloadReceipt,
}: PaymentSuccessProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  useEffect(() => {
    // Generate simulated confetti stream
    const colors = ["#3b82f6", "#818cf8", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"];
    const items = Array.from({ length: 40 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100 - 50, // Percent offset from center
      y: Math.random() * -120 - 40, // Height rise
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles(items);
  }, []);

  const handleDownload = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
    } else {
      toast.success("Downloading transaction report receipt PDF...");
    }
  };

  return (
    <div className="text-center p-6 space-y-6 relative overflow-hidden select-none">
      
      {/* 1. Interactive Confetti Visual Stream */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: 0, x: 0, opacity: 1, scale: 1, rotate: 0 }}
            animate={{
              y: p.y * 3,
              x: p.x * 4,
              opacity: 0,
              scale: 0.4,
              rotate: Math.random() * 360,
            }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute rounded-full"
            style={{
              backgroundColor: p.color,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      {/* 2. Primary success header */}
      <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: [1.2, 1], opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            TRANSACTION AUTHORIZED
          </span>
          <h2 className="text-lg font-black text-white uppercase tracking-tight pt-1">
            Payment Settled Successful
          </h2>
        </div>
      </div>

      {/* 3. Transaction Meta Checklist details */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 text-left space-y-3 relative z-10">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase">Purpose Category:</span>
          <span className="text-slate-200 font-black uppercase text-right max-w-[180px] truncate">{purpose}</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase">Transaction ID:</span>
          <span className="text-blue-400 font-mono font-black uppercase select-all">{transactionId}</span>
        </div>
        <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-bold uppercase">Settled Amount:</span>
          <span className="text-emerald-400 font-black text-sm">₹{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {/* 4. Action Row Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
        >
          <Download className="w-4 h-4 flex-shrink-0" />
          Download Receipt
        </button>
        <button
          onClick={onClose}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer uppercase tracking-wider"
        >
          <FileCheck className="w-4 h-4 flex-shrink-0" />
          Got it, Close
        </button>
      </div>

    </div>
  );
}
