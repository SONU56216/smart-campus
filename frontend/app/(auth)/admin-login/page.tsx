"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ShieldAlert, ArrowLeft, Mail, Lock, CheckCircle2, Smartphone, Key } from "lucide-react";
import Link from "next/link";
import OTPInput from "@/components/auth/OTPInput";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requires2Fa, setRequires2Fa] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter credentials.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!requires2Fa) {
        // Enforce OTP challenge step
        toast.info("Security code sent. Undergoing secondary authentication audit.");
        setRequires2Fa(true);
        setIsSubmitting(false);
        return;
      }

      if (otpCode.length < 6) {
        toast.error("Please enter the complete 6-digit verification code.");
        setIsSubmitting(false);
        return;
      }

      const result = await login({
        email,
        password,
        role: "ADMIN",
        otp: otpCode,
      });

      toast.success(`Access authorized. Welcome to Admin Command, ${result.firstName || "Administrator"}!`);
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed administrative credentials review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
      {/* Red/Indigo Professional Dark Halo Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-rose-950/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.15],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[420px] h-[420px] rounded-full bg-slate-900/40 blur-3xl"
        />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-rose-950/40 bg-slate-950/80 hover:bg-slate-900 text-slate-300 rounded-xl transition-all self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          General Landing Page
        </Link>

        {/* Console Shield Glass Card */}
        <div className="w-full border border-rose-950/20 bg-slate-950/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
          {/* Card branding header */}
          <div className="p-6 pb-4 text-center border-b border-rose-955/30 bg-rose-950/10 flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-rose-950/50 text-rose-500 rounded-2xl w-fit border border-rose-950">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">
                Console Command Gateway
              </h2>
              <p className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">
                Authorized administrative personnel only
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <AnimatePresence mode="wait">
              {!requires2Fa ? (
                <motion.div
                  key="admin-cred"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Console Mail ID
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="registrar@mit.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-white bg-slate-955 border border-rose-955/10 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Authorization Key Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 pointer-events-none">
                        <Lock className="w-4 h-4" />
                      </span>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-white bg-slate-955 border border-rose-955/10 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 rounded-xl transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="admin-otp"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5 text-center"
                >
                  <div className="mx-auto p-3 w-fit bg-rose-950/30 text-rose-500 rounded-2xl border border-rose-950">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-205">Dual Factor Authentication Challenge</h3>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                      A unique 6-digit physical OTP device pass code is required to complete administrative authorization profiles.
                    </p>
                  </div>

                  <OTPInput
                    value={otpCode}
                    onChange={(val) => setOtpCode(val)}
                    length={6}
                  />

                  <button
                    type="button"
                    onClick={() => setRequires2Fa(false)}
                    className="text-[10px] font-bold text-rose-500 hover:underline block mx-auto mt-2"
                  >
                    Return to Credentials Review
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-rose-650 hover:bg-rose-750 disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isLoading || isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Auditing credentials...
                </>
              ) : requires2Fa ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Security Session
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Request Access Session
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
