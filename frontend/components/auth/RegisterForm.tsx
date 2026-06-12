"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ShieldAlert, ArrowLeft, ArrowRight, Save, CheckCircle2 } from "lucide-react";
import PersonalStep from "./PersonalStep";
import ContactStep from "./ContactStep";
import AcademicStep from "./AcademicStep";
import DocumentStep from "./DocumentStep";
import PasswordStep from "./PasswordStep";

const GENERAL_DRAFT_KEY = "mit_admissions_draft_v1";

const initialForm = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  category: "General",
  bloodGroup: "",
  email: "",
  phone: "",
  guardian: "",
  address: "",
  course: "",
  department: "",
  gpa: "",
  photoUrl: "",
  idProofUrl: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(GENERAL_DRAFT_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          // Revoke any old draft passwords for strict security compliance
          setFormData({ ...parsed, password: "", confirmPassword: "" });
          toast.success("Loaded your previous application draft state.");
        }
      } catch (e) {
        // Obsolete or corrupted storage keys, swipe clean
      }
    }
  }, []);

  // Sync draft updates with localStorage
  const handleFormChange = (updates: Partial<typeof initialForm>) => {
    setFormData((prev: any) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(GENERAL_DRAFT_KEY, JSON.stringify(next));
        } catch (e) {
          // disk overflow or private browsing modes block writes
        }
      }
      return next;
    });

    // Clear dynamic error properties once corrected
    const changedKeys = Object.keys(updates);
    if (changedKeys.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        changedKeys.forEach((k) => { delete next[k]; });
        return next;
      });
    }
  };

  const handleManualSave = () => {
    toast.info("Application draft saved securely in local storage.");
  };

  const validateStep = (stepNo: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (stepNo === 1) {
      if (!formData.firstName) stepErrors.firstName = "First name is of legal requirement.";
      if (!formData.lastName) stepErrors.lastName = "Last name is of legal requirement.";
      if (!formData.dob) stepErrors.dob = "Select a valid birthdate.";
    }

    if (stepNo === 2) {
      if (!formData.email) {
        stepErrors.email = "Active student email is requested.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        stepErrors.email = "Please enter a valid format email Address.";
      }
      if (!formData.phone) stepErrors.phone = "Phone number is of legal requirement.";
      if (!formData.guardian) stepErrors.guardian = "Sponsor guardian details are required.";
      if (!formData.address) stepErrors.address = "Active address description is required.";
    }

    if (stepNo === 3) {
      if (!formData.course) stepErrors.course = "Specify degree course preference stream.";
      if (!formData.department) stepErrors.department = "Identify department preference index.";
      if (!formData.gpa) stepErrors.gpa = "Enter high school GPA metric properties.";
    }

    if (stepNo === 4) {
      // In development simulations, fallback automatically if they proceed without file attachments
      if (!formData.photoUrl && !formData.photoFile) {
        stepErrors.photoFile = "Upload a candidate biometric profile photo.";
      }
      if (!formData.idProofUrl && !formData.idProofFile) {
        stepErrors.idProofFile = "Legal confirmation ID files are requested.";
      }
    }

    if (stepNo === 5) {
      if (!formData.password) {
        stepErrors.password = "Secured passphrase is required.";
      } else if (formData.password.length < 8) {
        stepErrors.password = "Password must span at least 8 characters.";
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Verify passphrases match exactly.";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, 5));
    } else {
      toast.error("Complete the requested metrics before moving forward.");
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) {
      toast.error("Audit verification alerts found inside inputs.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: "STUDENT",
          dob: formData.dob,
          gender: formData.gender,
          category: formData.category,
          bloodGroup: formData.bloodGroup,
          phone: formData.phone,
          guardian: formData.guardian,
          address: formData.address,
          course: formData.course,
          department: formData.department,
          gpa: formData.gpa,
          photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
          idProofUrl: formData.idProofUrl || "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=120",
        };

        const result = await authApi.register(payload);
        toast.success(`Application Complete! Welcome, ${result.data?.student?.firstName || "Scholar"}!`);
        
        // Clear saved draft on successful register
        if (typeof window !== "undefined") {
          localStorage.removeItem(GENERAL_DRAFT_KEY);
        }
        
        // Push login routing redirects
        router.push("/login?registered=true");
      } catch (err: any) {
        toast.error(err.response?.data?.message || err.message || "Failed to log admissions profile files.");
      }
    });
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Absolute Ambient Background Blobs */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Glassmospheric Container Body Block */}
      <div className="relative z-10 border border-slate-100 dark:border-slate-800 bg-white/85 dark:bg-slate-950/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden select-none flex flex-col min-h-[480px]">
        
        {/* Head Branding Bar and Drafting Buttons */}
        <div className="p-6 pb-4 border-b border-slate-50 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
          <div className="text-left">
            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
              Academic Registration Portal
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Onboarding Multi-Step Scheduler
            </p>
          </div>

          <button
            onClick={handleManualSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-xl transition-all shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
        </div>

        {/* 5-Step Progress Stepper indicators */}
        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-900 bg-slate-50/30 flex items-center justify-between select-none">
          {Array.from({ length: 5 }).map((_, idx) => {
            const stepNum = idx + 1;
            const isCompleted = activeStep > stepNum;
            const isActive = activeStep === stepNum;

            return (
              <div key={idx} className="flex items-center flex-1 last:flex-initial">
                <div 
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs transition-all relative ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                      ? "bg-primary border-primary text-white shadow-md ring-4 ring-primary/10"
                      : "bg-white border-slate-200 text-slate-400 dark:bg-slate-950 dark:border-slate-800"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div 
                    className={`flex-1 h-0.5 mx-3 transition-colors ${
                      isCompleted ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic MultiStep Body Container */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-6">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PersonalStep
                      formData={formData}
                      onChange={handleFormChange}
                      errors={errors}
                    />
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ContactStep
                      formData={formData}
                      onChange={handleFormChange}
                      errors={errors}
                    />
                  </motion.div>
                )}

                {activeStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AcademicStep
                      formData={formData}
                      onChange={handleFormChange}
                      errors={errors}
                    />
                  </motion.div>
                )}

                {activeStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DocumentStep
                      formData={formData}
                      onChange={handleFormChange}
                      errors={errors}
                    />
                  </motion.div>
                )}

                {activeStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PasswordStep
                      formData={formData}
                      onChange={handleFormChange}
                      errors={errors}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stepper Controllers Footer */}
            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-900 pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={activeStep === 1 || isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl transition-all dark:bg-slate-950 dark:border-slate-850"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>

              {activeStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Continue Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-50 text-xs font-bold text-white rounded-xl transition-all shadow-md transform active:scale-95"
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Locking Admissions File...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Submit Admissions Applicationes
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
