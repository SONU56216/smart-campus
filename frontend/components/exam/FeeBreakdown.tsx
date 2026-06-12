"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface FeeBreakdownProps {
  regularCount: number;
  backlogCount: number;
  feePerRegular: number;
  feePerBacklog: number;
  lateFee: number;
  isAfterDeadline?: boolean;
}

export default function FeeBreakdown({
  regularCount,
  backlogCount,
  feePerRegular,
  feePerBacklog,
  lateFee,
  isAfterDeadline = false,
}: FeeBreakdownProps) {
  const regularTotal = regularCount * feePerRegular;
  const backlogTotal = backlogCount * feePerBacklog;
  const applicableLateFee = isAfterDeadline ? lateFee : 0;
  const grandTotal = regularTotal + backlogTotal + applicableLateFee;

  const animationVariant = {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 text-left relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="space-y-0.5">
        <h4 className="text-xs font-black text-white uppercase tracking-wider">
          Real-Time Invoice Breakdown
        </h4>
        <p className="text-[10px] text-slate-500 font-bold uppercase">
          Dynamic itemization based on active syllabus selections
        </p>
      </div>

      <div className="border-t border-white/5 pt-2 min-h-24 flex flex-col justify-between">
        <AnimatePresence mode="popLayout">
          <div className="space-y-2.5">
            {/* Regular stream */}
            {regularCount > 0 && (
              <motion.div
                key="regular-row"
                variants={animationVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-slate-400 font-medium font-mono">
                  Regular Curriculum ({regularCount} × ₹{feePerRegular})
                </span>
                <span className="text-white font-bold font-mono">
                  + ₹{regularTotal.toLocaleString("en-IN")}
                </span>
              </motion.div>
            )}

            {/* Backlog stream */}
            {backlogCount > 0 && (
              <motion.div
                key="backlog-row"
                variants={animationVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Backlog Courses ({backlogCount} × ₹{feePerBacklog})
                </span>
                <span className="text-amber-400 font-mono font-bold">
                  + ₹{backlogTotal.toLocaleString("en-IN")}
                </span>
              </motion.div>
            )}

            {/* Late charges */}
            {isAfterDeadline && (
              <motion.div
                key="late-row"
                variants={animationVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-red-400 font-semibold flex items-center gap-1 uppercase tracking-wider text-[10px]">
                  Post-Deadline Fee Penalty
                </span>
                <span className="text-red-400 font-mono font-bold">
                  + ₹{lateFee.toLocaleString("en-IN")}
                </span>
              </motion.div>
            )}

            {/* Empty fallback */}
            {regularCount === 0 && backlogCount === 0 && (
              <motion.div
                key="empty-row"
                variants={animationVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                className="py-4 text-center text-xs text-slate-550 font-bold uppercase tracking-widest leading-none"
              >
                No Subjects Selected
              </motion.div>
            )}
          </div>
        </AnimatePresence>

        {/* Master Total Footer */}
        <div className="border-t border-white/5 mt-4 pt-4 flex justify-between items-center">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Total Examination Due
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={grandTotal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-xl font-black text-white font-mono flex items-center gap-1.5"
            >
              ₹{grandTotal.toLocaleString("en-IN")}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {isAfterDeadline && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex gap-2 text-[10px] uppercase tracking-wide leading-relaxed font-semibold">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          <span>Note: Standard deadline passed. Real-time late billing is active on this session.</span>
        </div>
      )}
    </div>
  );
}
