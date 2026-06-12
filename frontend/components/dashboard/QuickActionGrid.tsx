"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  ClipboardList, 
  Receipt, 
  Calendar, 
  FileBadge, 
  GraduationCap, 
  Compass, 
  AlertTriangle 
} from "lucide-react";

export default function QuickActionGrid() {
  const actions = [
    {
      title: "View ID Card",
      description: "Digital NFC verification pass",
      href: "/card",
      icon: CreditCard,
      color: "from-blue-500/10 to-blue-500/5 hover:border-blue-500/30 text-blue-405",
      iconBg: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Exam Forms",
      description: "Submit & register backlog forms",
      href: "/exams",
      icon: ClipboardList,
      color: "from-indigo-500/10 to-indigo-500/5 hover:border-indigo-500/30 text-indigo-405",
      iconBg: "bg-indigo-500/10 text-indigo-400",
    },
    {
      title: "Pay Fees",
      description: "Settle semesters & exam dues",
      href: "/payments",
      icon: Receipt,
      color: "from-emerald-500/10 to-emerald-500/5 hover:border-emerald-500/30 text-emerald-405",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Attendance",
      description: "Track gate logging history",
      href: "/attendance",
      icon: Calendar,
      color: "from-amber-500/10 to-amber-500/5 hover:border-amber-500/30 text-amber-505",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      title: "Admit Card",
      description: "Export exam entry tickets",
      href: "/exams/admit-card",
      icon: FileBadge,
      color: "from-pink-500/10 to-pink-500/5 hover:border-pink-500/30 text-pink-405",
      iconBg: "bg-pink-500/10 text-pink-400",
    },
    {
      title: "Results",
      description: "Academic progress scorecards",
      href: "/exams/results",
      icon: GraduationCap,
      color: "from-purple-500/10 to-purple-500/5 hover:border-purple-500/30 text-purple-405",
      iconBg: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Campus Map",
      description: "Explore layouts and labs",
      href: "/dashboard?tab=map",
      icon: Compass,
      color: "from-cyan-500/10 to-cyan-500/5 hover:border-cyan-500/30 text-cyan-405",
      iconBg: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Emergency",
      description: "Campus helplines & wardens",
      href: "/profile",
      icon: AlertTriangle,
      color: "from-red-500/10 to-red-500/5 hover:border-red-500/30 text-red-405",
      iconBg: "bg-red-500/10 text-red-400",
    },
  ];

  return (
    <div className="space-y-3.5 select-none">
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider text-left pl-1">
        Command Terminal Grid
      </h3>
      
      {/* 4x2 responsive layout grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href} className="outline-none">
              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`p-4 border border-white/5 bg-gradient-to-br ${action.color} rounded-[20px] transition-all flex flex-col justify-between items-start gap-4 aspect-square text-left shadow-lg cursor-pointer h-full`}
              >
                {/* Icon wrapper badge */}
                <div className={`p-2.5 rounded-xl ${action.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text blocks */}
                <div className="space-y-0.5 leading-none">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">
                    {action.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold leading-normal pt-1 break-words line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
