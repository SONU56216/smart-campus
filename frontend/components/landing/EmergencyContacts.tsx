"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ChevronDown, ShieldAlert, HeartHandshake, PhoneCall, HelpCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactItem {
  department: string;
  phone: string;
  handler: string;
  icon: React.ReactNode;
  info: string;
}

export default function EmergencyContacts() {
  const [isOpen, setIsOpen] = useState(false);

  const contactList: ContactItem[] = [
    {
      department: "Campus Security General Desk",
      phone: "+1 (555) 019-9111",
      handler: "24/7 Patrol Dispatch Office",
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      info: "Call for immediate escorts, suspicious activities, lost hardware lockers, or medical transit requests."
    },
    {
      department: "Student Medical Center & First-Aid",
      phone: "+1 (555) 019-2244",
      handler: "Supervising On-Duty Nurse",
      icon: <Activity className="w-5 h-5 text-emerald-500" />,
      info: "Outpatient assistance, pharmacy allotments, minor trauma processing, and ambulance routing links."
    },
    {
      department: "Academic Dean Counselor Helplines",
      phone: "+1 (555) 019-3388",
      handler: "Mental Health Guidance Hub",
      icon: <HeartHandshake className="w-5 h-5 text-indigo-500" />,
      info: "Private consultations, stress alleviation, exam-week coping strategies, and support therapy."
    },
    {
      department: "Registrar Admissions Desk Help",
      phone: "+1 (555) 019-5500",
      handler: "Administrative Liaison Desk",
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      info: "Admissions checklist questions, biometric profile uploads, or portal logins password support."
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-6">
        <div className="border border-red-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/5 rounded-2xl overflow-hidden shadow-sm">
          {/* Main Toggle Header */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none select-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 rounded-xl shrink-0">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-slate-950 dark:text-white leading-none">
                  Collapsible Campus Helpdesk & Safety
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-none font-medium">
                  Quick touch dialing for fire safety, biometrics logs, or medical assistance.
                </p>
              </div>
            </div>
            
            <ChevronDown 
              className={cn(
                "w-5 h-5 text-slate-400 transition-transform duration-300",
                isOpen && "transform rotate-180 text-rose-500"
              )} 
            />
          </button>

          {/* Expanded Drawer list */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-red-50 dark:border-rose-950/40 bg-white dark:bg-slate-950"
              >
                <div className="p-6 space-y-4">
                  {contactList.map((contact, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-text"
                    >
                      <div className="flex items-start gap-3 text-left">
                        <div className="p-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg shadow-sm shrink-0">
                          {contact.icon}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                            {contact.department}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">
                            {contact.handler}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold max-w-md pt-0.5">
                            {contact.info}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm select-none shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Dial {contact.phone.split(" ")[2]}
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
