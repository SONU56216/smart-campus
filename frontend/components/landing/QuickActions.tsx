"use client";

import { motion } from "framer-motion";
import { ArrowRight, UserCheck, ShieldCheck, Compass, Sparkles, BookOpen, QrCode } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function QuickActions() {
  const { user, isAuthenticated } = useAuth();

  // Role resolution
  const userRole = isAuthenticated && user ? user.role : "VISITOR";

  const visitorActions = [
    {
      title: "Admission Center",
      description: "Fill step-by-step applications for state curriculum degrees with document scanning options.",
      href: "/register",
      icon: <Sparkles className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-100 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/20",
      cta: "Apply For Admissions",
    },
    {
      title: "Academic Catalogs",
      description: "Review current course sheets, criteria indexes, and premium research facilities lists.",
      href: "#",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      color: "border-blue-100 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20",
      cta: "Explore Programs",
      onClick: () => {
        const nextEl = document.getElementById("highlights");
        if (nextEl) nextEl.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      title: "Interactive Access Desk",
      description: "Sign in with registered system credentials to query grades, digital IDs, and biometric gates.",
      href: "/login",
      icon: <UserCheck className="w-6 h-6 text-emerald-500" />,
      color: "border-emerald-100 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20",
      cta: "Academic Login Hub",
    },
  ];

  const studentActions = [
    {
      title: "Student Dashboard",
      description: "Access registered classes, request dynamic passes, and view academic progression records.",
      href: "/student/dashboard",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      color: "border-blue-100 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20",
      cta: "Enter Student Portal",
    },
    {
      title: "Digital Access Pass",
      description: "View secure QR code, 1D code, and biometric telemetry for gate terminals and offline security checks.",
      href: "/student/dashboard?tab=id-card",
      icon: <QrCode className="w-6 h-6 text-emerald-500" />,
      color: "border-emerald-100 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20",
      cta: "Show Digital ID Pass",
    },
    {
      title: "Admissions Status",
      description: "Verify details, documents compliance, academic advisor contact, and check fee summaries.",
      href: "/student/dashboard?tab=profile",
      icon: <UserCheck className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-100 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/20",
      cta: "Audit Files Profiling",
    },
  ];

  const adminActions = [
    {
      title: "Admin Console Center",
      description: "Review admissions lists, verify uploaded student documents, and generate system reports.",
      href: "/admin/dashboard",
      icon: <ShieldCheck className="w-6 h-6 text-rose-500" />,
      color: "border-rose-100 dark:border-rose-955 bg-rose-50/20 dark:bg-rose-950/10",
      cta: "Enter Workspace Console",
    },
    {
      title: "Biometric Scanner Gate",
      description: "Scan student pass QR markers to verify authorization and log security access entries instantly.",
      href: "/admin/dashboard?tab=gate-access",
      icon: <QrCode className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-100 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/20",
      cta: "Access Biometric Gates",
    },
    {
      title: "Applications Ledger",
      description: "Inspect outstanding student admissions requests, score evaluations, and documents verification lists.",
      href: "/admin/dashboard?tab=applications",
      icon: <Compass className="w-6 h-6 text-amber-500" />,
      color: "border-amber-100 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/20",
      cta: "Audit Applications Hub",
    },
  ];

  // Resolve active set
  const actions = 
    userRole === "ADMIN" || userRole === "SUPER_ADMIN"
      ? adminActions
      : userRole === "STUDENT"
      ? studentActions
      : visitorActions;

  return (
    <section id="quick-actions" className="py-20 bg-white dark:bg-slate-950 scroll-mt-6">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Adapting Actions to Your Current Profile ({userRole.replace("_", " ")})
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Choose a quick navigation link designed uniquely for student onboarding, daily credential checks, or administrative verification workflows.
          </p>
        </div>

        {/* 3-Row Adaptable Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {actions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`p-6 border rounded-2xl ${action.color} flex flex-col justify-between space-y-6 hover:-translate-y-1.5 transition-all outline-none`}
            >
              <div className="space-y-4">
                <div className="p-3 w-fit bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm">
                  {action.icon}
                </div>
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {action.description}
                  </p>
                </div>
              </div>

              {action.onClick ? (
                <button
                  onClick={action.onClick}
                  className="w-full inline-flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm group"
                >
                  {action.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                </button>
              ) : (
                <Link
                  href={action.href}
                  className="w-full inline-flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm group"
                >
                  {action.cta}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
