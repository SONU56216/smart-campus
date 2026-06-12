"use client";

import { motion } from "framer-motion";
import { ArrowDownCircle, ShieldCheck, Cpu } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white px-6">
      {/* Dynamic Animated Floating Shape Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 80, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-12 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.15],
            x: [0, -80, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 -right-12 w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-3xl"
        />
      </div>

      {/* Grid background mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

      {/* Content wrapper */}
      <div className="relative z-10 max-w-4xl text-center space-y-8 select-none">
        {/* Academic accreditation badge bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold backdrop-blur-md"
        >
          <ShieldCheck className="w-4 h-4 text-primary" />
          NBA Accredited · Tier 1 University
        </motion.div>

        <div className="space-y-4">
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-xs uppercase font-extrabold tracking-[0.25em] text-blue-400"
          >
            Smart Campus Portal
          </motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            METROPOLITAN <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">INSTITUTE</span> OF TECHNOLOGY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="text-sm md:text-base text-slate-300 max-w-xl mx-auto font-medium"
          >
            Empowering students with next-generation biometric access passes, automated admissions processing, and instant paperless academic verification routines.
          </motion.p>
        </div>

        {/* Feature badges list */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" /> AI Biometrics</span>
          <span className="text-slate-700 select-none">|</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Zero-Trust Access</span>
          <span className="text-slate-700 select-none">|</span>
          <span className="flex items-center gap-1.5">🎓 Offline Academic ID Passes</span>
        </motion.div>

        {/* Action jump anchor */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pt-10 flex flex-col items-center justify-center text-slate-400 text-xs font-semibold gap-1.5 cursor-pointer"
          onClick={() => {
            const nextEl = document.getElementById("quick-actions");
            if (nextEl) nextEl.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span>Begin Campus Exploration</span>
          <ArrowDownCircle className="w-5 h-5 text-blue-400" />
        </motion.div>
      </div>
    </section>
  );
}
