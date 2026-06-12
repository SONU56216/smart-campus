"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Lock,
  Menu,
  Sparkles,
  Wifi,
  WifiOff
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNotification } from "@/hooks/useNotification";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const isOnline = useOnlineStatus();
  const { useStudentInbox } = useNotification();
  const { data: notifications } = useStudentInbox();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  // Resolve standard page names based on URL matching
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Academic Console";
    if (pathname.includes("/card")) return "Identity Pass";
    if (pathname.includes("/profile")) return "Student Profile";
    if (pathname.includes("/attendance")) return "Time & Attendance";
    if (pathname.includes("/exams/results")) return "Performance Results";
    if (pathname.includes("/exams/admit-card")) return "Exam Ticket";
    if (pathname.includes("/exams")) return "Exams Office";
    if (pathname.includes("/payments")) return "Transaction Audit";
    if (pathname.includes("/wallet")) return "Decentralized Wallet";
    if (pathname.includes("/notifications")) return "Alerts Inbox";
    return "Campus Desk";
  };

  // Close dropdown on outside clicks
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/5 bg-slate-950/85 backdrop-blur-md px-5 h-16 select-none shadow-sm pb-[1px]">
      {/* Page Title Header */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <svg viewBox="0 0 100 100" className="w-4 h-4">
            <path d="M50,15 L80,25 L80,55 C80,72 50,85 50,85 C50,85 20,72 20,55 L20,25 L50,15 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="text-left select-none">
          <h2 className="text-xs font-black tracking-widest text-slate-400 uppercase leading-none">
            {getPageTitle()}
          </h2>
          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest leading-none pt-0.5 block md:hidden">
            Metropolitan Hub
          </span>
        </div>
      </div>

      {/* Center Search bar */}
      <form 
        onSubmit={handleSearchSubmit} 
        className="hidden md:flex items-center w-full max-w-xs relative bg-white/5 border border-white/5 hover:border-slate-800 focus-within:border-blue-500 rounded-xl px-3 py-1.5 transition-all"
      >
        <Search className="w-4 h-4 text-slate-550 mr-2 flex-shrink-0" />
        <input
          placeholder="Lookup courses or fees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-xs text-slate-200 bg-transparent focus:outline-none w-full font-medium"
        />
      </form>

      {/* Right Icons Row */}
      <div className="flex items-center gap-4">
        
        {/* Network Status Dot */}
        <div className="flex items-center">
          {isOnline ? (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              <Wifi className="w-3 h-3 text-emerald-400 animate-pulse" />
              ONLINE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[9.5px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
              <WifiOff className="w-3 h-3 text-amber-400" />
              OFFLINE
            </span>
          )}
        </div>

        {/* Notifications indicator */}
        <Link 
          href="/notifications" 
          className="relative p-2.5 hover:bg-white/5 border border-transparent hover:border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer active:scale-95"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[8px] font-black bg-red-500 text-white rounded-full flex items-center justify-center animate-bounce">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Interactive User Avatar Menu Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 hover:bg-white/5 border border-transparent hover:border-slate-800 rounded-xl transition-all cursor-pointer select-none active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-800 border border-white/10 relative">
              <img 
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Actual Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-48 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl p-2 select-none z-50">
              <div className="px-3.5 py-2.5 border-b border-white/5 mb-1 text-left">
                <p className="text-xs font-black text-white truncate leading-none uppercase">
                  {user?.fullName || "Lucas Bennett"}
                </p>
                <p className="text-[9px] text-slate-500 font-extrabold truncate pt-1 select-all font-mono">
                  {user?.email || "lucas.b@mit.edu"}
                </p>
              </div>

              {/* Profile Route Link */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile");
                }}
                className="w-full text-left inline-flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer leading-none"
              >
                <User className="w-4 h-4 text-blue-400" />
                My Profile
              </button>

              {/* Settings Route Link */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push("/profile?tab=security");
                }}
                className="w-full text-left inline-flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer leading-none"
              >
                <Settings className="w-4 h-4 text-indigo-400" />
                Settings & Safety
              </button>

              {/* System Session de-auth */}
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full text-left inline-flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer mt-1 border-t border-white/5 pt-2"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
