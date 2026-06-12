"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  CreditCard, 
  User, 
  Calendar, 
  ClipboardList, 
  FileBadge, 
  GraduationCap, 
  Receipt, 
  Wallet, 
  Bell, 
  ChevronLeft, 
  LogOut,
  Menu,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { useStudentInbox } = useNotification();
  const { data: notifications } = useStudentInbox();
  
  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  const links = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Card", href: "/card", icon: CreditCard },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Attendance", href: "/attendance", icon: Calendar },
    { label: "Exam Forms", href: "/exams", icon: ClipboardList },
    { label: "Admit Card", href: "/exams/admit-card", icon: FileBadge },
    { label: "Results", href: "/exams/results", icon: GraduationCap },
    { label: "Payments", href: "/payments", icon: Receipt },
    { label: "Wallet", href: "/wallet", icon: Wallet },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
  ];

  return (
    <aside 
      className={`hidden md:flex flex-col justify-between border-r border-slate-200/10 bg-slate-950 text-slate-100 transition-all duration-350 select-none h-screen sticky top-0 z-40 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Banner */}
      <div className="flex flex-col">
        <div className="p-5 flex items-center justify-between border-b border-slate-900">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            {/* Elegant SVG Badge */}
            <div className="w-9 h-9 flex-shrink-0 bg-blue-600/15 border border-blue-500/30 flex items-center justify-center rounded-xl">
              <svg viewBox="0 0 100 100" className="w-5 h-5 text-blue-400">
                <path d="M50,15 L80,25 L80,55 C80,72 50,85 50,85 C50,85 20,72 20,55 L20,25 L50,15 Z" fill="none" stroke="currentColor" strokeWidth="8" />
                <circle cx="50" cy="50" r="14" fill="currentColor" className="text-blue-500/20" />
                <path d="M50,32 L50,68 M32,50 L68,50" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
            
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col text-left"
              >
                <span className="text-xs font-black tracking-[0.15em] text-white uppercase leading-none">
                  Metropolitan
                </span>
                <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-[0.25em] pt-0.5">
                  Science & Tech
                </span>
              </motion.div>
            )}
          </Link>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-350 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Navigation Links Scroll Container */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-thin scrollbar-thumb-slate-900">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wide group leading-none ${
                  isActive 
                    ? "bg-blue-600 border border-blue-500 text-white shadow-lg shadow-blue-500/10" 
                    : "text-slate-400 hover:text-slate-100 dark:hover:bg-slate-900 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400 transition-colors"}`} />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left"
                  >
                    {link.label}
                  </motion.span>
                )}

                {/* Badge Alert counts */}
                {link.badge && (
                  <span className={`flex-shrink-0 h-4 min-w-4 flex items-center justify-center text-[8.5px] font-black rounded-full px-1 ${
                    isActive ? "bg-white text-blue-600" : "bg-red-500 text-white"
                  }`}>
                    {link.badge}
                  </span>
                )}

                {/* Left Line Accent (Inactive Hover) */}
                {!isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mini Profile Box / Logout Bottom Banner */}
      <div className="p-4 border-t border-slate-900 bg-slate-950 flex flex-col gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar frame */}
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10 relative">
            <img 
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
              alt={user?.fullName || "Scholar Name"}
              className="w-full h-full object-cover" 
            />
            {/* online dot */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-950 rounded-full" />
          </div>

          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 text-left min-w-0"
            >
              <h4 className="text-xs font-black text-white truncate uppercase tracking-wider leading-none">
                {user?.fullName || "Lucas Bennett"}
              </h4>
              <p className="text-[8.5px] text-slate-500 font-bold truncate pt-0.5 select-all font-mono uppercase">
                {user?.studentId || "CS2026-921"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Logout Control */}
        <button
          onClick={logout}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-[10px] font-black border border-slate-900 bg-slate-900/40 hover:bg-red-500/10 hover:border-red-500/20 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          {!isCollapsed && <span className="uppercase tracking-wide leading-none">Terminate Session</span>}
        </button>
      </div>
    </aside>
  );
}
