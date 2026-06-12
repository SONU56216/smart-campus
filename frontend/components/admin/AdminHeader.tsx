"use client";

import { useState } from "react";
import AdminBreadcrumb from "./AdminBreadcrumb";
import { Bell, Search, Settings, ShieldAlert, LogOut, Loader2, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminHeader() {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mocks alerts
  const notifications = [
    { id: "1", title: "New Admission Form Ready", text: "Application #AD-8302 filed by Sonali Shah.", unread: true },
    { id: "2", title: "Admit Cards Issued", text: "Course B.Tech Semester 4 generation complete.", unread: false },
    { id: "3", title: "Gateway Waiver Overriden", text: "Transaction override action taken by CoE.", unread: false }
  ];

  const handleLogout = () => {
    toast.message("Logging session out safely...");
    router.push("/auth/login");
  };

  const markAllRead = () => {
    toast.success("All alerts processed as read.");
    setShowNotifications(false);
  };

  return (
    <header className="h-16 bg-slate-900/40 border-b border-white/5 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-40 select-none">
      
      {/* Left items: Breadcrumbs */}
      <div className="flex items-center gap-3">
        <AdminBreadcrumb />
      </div>

      {/* Right items: Search, notification bells, profile dropdown */}
      <div className="flex items-center gap-4">
        
        {/* Search tool block */}
        <div 
          className={`relative hidden md:block transition-all duration-350 bg-slate-950/30 rounded-xl border ${
            searchFocused ? "border-emerald-500/50 w-72 shadow-lg shadow-emerald-500/5" : "border-white/5 w-60"
          }`}
        >
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Query student records, TXNs..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full bg-transparent text-xs font-semibold pl-10 pr-4 py-2.5 outline-none text-white font-mono placeholder:text-slate-500 placeholder:italic"
          />
        </div>

        {/* Dynamic Audited Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer relative"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-950/95 border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-scale-in text-left">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-white tracking-wider">
                  Audit Alert Inboxes
                </span>
                <button 
                  onClick={markAllRead}
                  className="text-[9px] font-black uppercase text-emerald-400 hover:text-emerald-300"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {notifications.map((item) => (
                  <div key={item.id} className="p-3.5 hover:bg-white/[0.02] transition-colors gap-2 relative">
                    {item.unread && (
                      <span className="absolute left-2.5 top-4.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    )}
                    <div className="pl-3.5 space-y-0.5">
                      <h5 className="text-[11px] font-bold text-slate-200">{item.title}</h5>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed uppercase">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Admin profiles drawer toggle */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-1 py-1 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase flex items-center justify-center">
              A
            </div>
            <span className="text-xs font-mono font-black text-white hidden sm:block">SA-01</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-scale-in text-left">
              <div className="p-3.5 border-b border-slate-800 text-slate-350">
                <p className="text-xs font-black text-white leading-none mb-1 uppercase">Super Admin</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider leading-none">sonuverse10@gmail.com</p>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => { setShowProfileMenu(false); router.push("/admin/settings"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  <Settings className="w-3.5 h-3.5" />
                  College Settings
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); router.push("/admin/admins"); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Privileges Staff
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all cursor-pointer uppercase tracking-wider"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
