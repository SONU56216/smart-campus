"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 bg-slate-955 overflow-hidden select-none py-12">
      {/* Background Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-620/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.25],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full bg-indigo-620/10 blur-3xl"
        />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 rounded-xl transition-all self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          General Landing Page
        </Link>

        {/* Core MultiStep Application Form */}
        <RegisterForm />
      </div>
    </main>
  );
}
