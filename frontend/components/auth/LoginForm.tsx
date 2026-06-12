"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Shield, Sparkles, LogIn, Key, Mail, Lock, Smartphone, Check } from "lucide-react";
import Link from "next/link";
import OTPInput from "./OTPInput";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, isLoading, error } = useAuth();

  // "student" | "admin"
  const [activeTab, setActiveTab] = useState<"student" | "admin">("student");

  // Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requires2Fa, setRequires2Fa] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate/Trigger admin 2FA if selected and 2FA isn't showing yet
      if (activeTab === "admin" && !requires2Fa) {
        toast.info("Security code sent. Please enter the 2FA code.");
        setRequires2Fa(true);
        setIsSubmitting(false);
        return;
      }

      // If activeTab is admin and requires2Fa is active, verify OTP
      if (activeTab === "admin" && requires2Fa) {
        if (otpCode.length < 6) {
          toast.error("Please enter a valid 6-digit 2FA code.");
          setIsSubmitting(false);
          return;
        }
      }

      // Call central login store action api
      const result = await login({
        email,
        password,
        role: activeTab === "admin" ? "ADMIN" : "STUDENT",
        otp: activeTab === "admin" ? otpCode : undefined,
      });

      toast.success(`Welcome back, ${result.firstName || "Scholar"}!`);
      
      // Route after successful check-ins
      if (activeTab === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid authentication credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabChange = (tab: "student" | "admin") => {
    setActiveTab(tab);
    setRequires2Fa(false);
    setOtpCode("");
    setPassword("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Absolute Ambient Background Blobs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Glassmospheric Card Wrapper */}
      <div className="relative z-10 border border-slate-100 dark:border-slate-800 bg-white/85 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden select-none">
        {/* Card Header and College Branding Logo */}
        <div className="p-6 pb-4 text-center border-b border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-blue-600/10 dark:bg-blue-900/20 text-blue-600 rounded-2xl w-fit">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Metropolitan Institute of Technology
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-0.5">
              Secure Central Verification Portal
            </p>
          </div>
        </div>

        {/* Tab Controllers */}
        <div className="flex p-1 bg-slate-50 dark:bg-slate-900/50 m-6 mb-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleTabChange("student")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "student"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Student Login
          </button>
          <button
            onClick={() => handleTabChange("admin")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "admin"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Admin Login
          </button>
        </div>

        {/* Form Body Fields */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <AnimatePresence mode="wait">
            {!requires2Fa ? (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Email Address or Student ID Input */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {activeTab === "student" ? "Student Email or ID" : "Administrator Email"}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={activeTab === "student" ? "student.email@campus.edu" : "admin.name@mit.edu"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    {activeTab === "student" && (
                      <Link
                        href="/forgot-password"
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 bg-white hover:bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="two-factor"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-center py-2"
              >
                <div className="mx-auto p-3 w-fit bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <Smartphone className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">2FA Security Token Check</h3>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                    We sent a security OTP to your registered device. Enter the 6-character code below.
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
                  className="text-[10px] font-bold text-primary hover:underline block mx-auto mt-2"
                >
                  Return to credentials change
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-2"
          >
            {isLoading || isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing Verification...
              </>
            ) : requires2Fa ? (
              <>
                <Check className="w-4 h-4" />
                Confirm 2FA Authentication
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Authenticate Identity
              </>
            )}
          </button>

          {/* Bottom helper Links context */}
          {activeTab === "student" && (
            <p className="text-center text-[10px] text-slate-400 font-medium pt-3 select-none">
              Not registered?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline">
                New? Apply Now
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
