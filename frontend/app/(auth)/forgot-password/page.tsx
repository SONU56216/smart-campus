"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Mail, Smartphone, Key, Lock, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";
import OTPInput from "@/components/auth/OTPInput";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP Countdown Timers
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: any;
    if (activeStep === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [activeStep, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setIsSubmitting(true);
    // Simulated micro-delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Security OTP sent! Please check your mobile or mailbox.");
      setActiveStep(2);
      setTimer(60);
      setCanResend(false);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    // Simulated step change
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Identity verified! Configure your new password properties.");
      setActiveStep(3);
    }, 800);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must span at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Verifying passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    // Simulate updating API
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Password updated successfully! Redirecting you to login.");
      router.push("/login");
    }, 1200);
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    toast.info("A fresh security OTP token has been dispatched.");
  };

  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden select-none">
      {/* Absolute Background Blurs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-12 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-12 w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-6">
        {/* Step Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-slate-800 bg-slate-900/50 hover:bg-slate-900 text-slate-300 rounded-xl transition-all self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Core Wizard Glass Card */}
        <div className="w-full border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4 text-center border-b border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20">
            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
              Emergency Password Recovery
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Verify Credentials · Reset Secrets
            </p>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.form
                  key="step-email"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSendOtp}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Academic Registered Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-800' dark:text-zinc-100 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Send Verification OTP
                  </button>
                </motion.form>
              )}

              {activeStep === 2 && (
                <motion.form
                  key="step-otp"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-5 text-center"
                >
                  <div className="mx-auto p-3 w-fit bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <Smartphone className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">OTP Code Received?</h3>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Enter the 6-digit recovery code routed to your credentials.
                    </p>
                  </div>

                  <OTPInput
                    value={otpCode}
                    onChange={(val) => setOtpCode(val)}
                    length={6}
                  />

                  {/* Countdown action */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 pt-2 select-none">
                    <span>Resend token option:</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Dispatches OTP
                      </button>
                    ) : (
                      <span className="text-slate-500">Wait {timer}s</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Verify Recovery OTP
                  </button>
                </motion.form>
              )}

              {activeStep === 3 && (
                <motion.form
                  key="step-reset"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleResetPassword}
                  className="space-y-4 text-left"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        New Password
                      </label>
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
                          className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-00' dark:text-zinc-100 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-00' dark:text-zinc-100 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <PasswordStrengthMeter password={password} />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Lock New Password
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
