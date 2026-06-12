"use client";

import { useState, useEffect } from "react";
import { useAdmissionStore } from "@/hooks/useAdmissionStore";
import { useAdmission } from "@/hooks/useAdmission";
import { motion, AnimatePresence } from "framer-motion";
import PersonalDetailsStep from "./PersonalDetailsStep";
import AcademicHistoryStep from "./AcademicHistoryStep";
import CoursePreferencesStep from "./CoursePreferencesStep";
import DocumentUploadStep from "./DocumentUploadStep";
import ReviewSubmitStep from "./ReviewSubmitStep";
import PaymentModal from "@/components/payment/PaymentModal";
import { UserCheck, ShieldCheck, FileCheck, CircleDot, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ApplicationForm() {
  const router = useRouter();
  const { step, setStep, completedSteps, resetStore, personal, academic, courses, documents } = useAdmissionStore();
  const { useSubmitApplication } = useAdmission();
  const submitApplicationMutation = useSubmitApplication();

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stepsMeta = [
    { num: 1, name: "Profile" },
    { num: 2, name: "Academics" },
    { num: 3, name: "Branches" },
    { num: 4, name: "Uploads" },
    { num: 5, name: "Review" },
  ];

  const handleStepClick = (num: number) => {
    // Candidates are permitted to click and navigate back OR jump to any already-validated (completed) steps
    const index = num - 1;
    if (num < step) {
      setStep(num);
    } else {
      // Check if all preceding steps are completed
      let canGo = true;
      for (let i = 0; i < index; i++) {
        if (!completedSteps[i]) {
          canGo = false;
          break;
        }
      }
      if (canGo) {
        setStep(num);
      } else {
        toast.info(`Please complete Step ${index} and preceding checks first.`);
      }
    }
  };

  const handleOpenPayment = () => {
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = async (txnId: string) => {
    try {
      toast.loading("Registering application on central server...");
      
      const payload = {
        personal,
        academic,
        courses,
        documents,
        payment: {
          amount: 500,
          transactionId: txnId,
          method: "GATEWAY",
          status: "SUCCESS"
        }
      };

      await submitApplicationMutation.mutateAsync(payload);
      
      // Clear store since it's final
      resetStore();
      
      setTimeout(() => {
        toast.dismiss();
        router.push("/status");
      }, 1500);
      
    } catch (err: any) {
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-8 select-none max-w-4xl mx-auto text-left relative">
      
      {/* 1. Header Information block */}
      <div className="space-y-1.5 border-b border-white/5 pb-4">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Admissions Enrollment Form
        </h1>
        <p className="text-xs text-slate-550 font-bold uppercase">
          Proceed with your certified profile, specify course preferences, and clear evaluation fees.
        </p>
      </div>

      {/* 2. Visual Horizontal Rail Stepper */}
      <div className="relative flex items-center justify-between border-b border-white/5 pb-6 select-none">
        {stepsMeta.map((s, idx) => {
          const isActive = step === s.num;
          const isDone = completedSteps[idx] || s.num < step;

          return (
            <button
              key={s.num}
              onClick={() => handleStepClick(s.num)}
              className="relative flex flex-col items-center flex-1 cursor-pointer group"
            >
              <div className="flex items-center w-full">
                {/* Horizontal progress connector rail line */}
                {idx > 0 && (
                  <div className={`flex-1 h-[2px] transition-all ${
                    isDone || isActive ? "bg-indigo-500/80" : "bg-slate-900"
                  }`} />
                )}
                
                {/* Visual Step bubble button */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-mono text-xs font-black transition-all ${
                  isActive 
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : isDone
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-950 border-slate-900 text-slate-500 group-hover:border-slate-800"
                }`}>
                  {isDone ? "✓" : s.num}
                </div>
                
                {/* Right horizontal progress connector rail line */}
                {idx < stepsMeta.length - 1 && (
                  <div className={`flex-1 h-[2px] transition-all ${
                    completedSteps[idx] ? "bg-indigo-500/80" : "bg-slate-900"
                  }`} />
                )}
              </div>

              {/* Step name typography labels row */}
              <span className={`text-[9.5px] font-black uppercase tracking-wider pt-2 block transition-colors leading-none truncate max-w-[80px] sm:max-w-none ${
                isActive ? "text-blue-400" : isDone ? "text-emerald-400" : "text-slate-500"
              }`}>
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Steps View Router switches */}
      <div className="min-h-[400px]">
        {step === 1 && (
          <PersonalDetailsStep onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <AcademicHistoryStep 
            onNext={() => setStep(3)} 
            onPrev={() => setStep(1)} 
          />
        )}
        {step === 3 && (
          <CoursePreferencesStep 
            onNext={() => setStep(4)} 
            onPrev={() => setStep(2)} 
          />
        )}
        {step === 4 && (
          <DocumentUploadStep 
            onNext={() => setStep(5)} 
            onPrev={() => setStep(3)} 
          />
        )}
        {step === 5 && (
          <ReviewSubmitStep 
            onPrev={() => setStep(4)} 
            onSubmit={handleOpenPayment} 
          />
        )}
      </div>

      {/* 4. Payment Trigger Modal Instance */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={500}
        purpose="OFFICIAL REGISTRATION EVALUATION ASSESSMENT SERVICE FEES"
        studentName={personal.fullName || "Admissions Candidate"}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
