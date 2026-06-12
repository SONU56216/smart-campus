"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Award, 
  CircleDollarSign, 
  Settings, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Radio,
  FileCheck2
} from "lucide-react";
import Link from "next/link";

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sections: SidebarSection[] = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }
      ]
    },
    {
      title: "Management",
      items: [
        { label: "Students", href: "/admin/students", icon: Users },
        { label: "Admissions", href: "/admin/admissions", icon: FileCheck2 },
        { label: "Exams", href: "/admin/exams", icon: Award },
        { label: "Payments", href: "/admin/payments", icon: CircleDollarSign }
      ]
    },
    {
      title: "Settings",
      items: [
        { label: "College Settings", href: "/admin/settings", icon: Settings },
        { label: "Admin Users", href: "/admin/admins", icon: ShieldAlert }
      ]
    },
    {
      title: "System",
      items: [
        { label: "Activity Logs", href: "/admin/logs", icon: FileSpreadsheet }
      ]
    }
  ];

  const handleLogout = () => {
    // Standard back to login action 
    router.push("/auth/login");
  };

  return (
    <div 
      className={`min-h-screen bg-slate-950 border-r border-white/5 text-slate-300 transition-all duration-300 flex flex-col justify-between select-none relative ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Logo Section */}
      <div className="flex items-center justify-between p-4 border-b border-white/5 h-16">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/15 border border-emerald-500/25 rounded-xl flex items-center justify-center">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="text-left leading-tight">
              <span className="text-xs font-black uppercase text-white tracking-widest block font-mono">
                CAMPUSPASS
              </span>
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 block">
                ADMIN CONSOLE
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Main Sections Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sections.map((section, idx) => {
          // If all links in this section are inactive but we want headings
          const showHeading = !isCollapsed;
          return (
            <div key={idx} className="space-y-1.5 text-left">
              {showHeading && (
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-3 mb-2">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "border border-transparent hover:bg-white/[0.03] text-slate-400 hover:text-white"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapse button floating action */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-18 -right-3.5 z-20 bg-slate-900 hover:bg-slate-800 border border-white/10 p-1.5 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer hidden md:block"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Admin User info & Log Out Block */}
      <div className="p-3 border-t border-white/5 space-y-3 bg-slate-950">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 p-2 bg-slate-900/40 border border-white/5 rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center font-black text-xs text-white uppercase shadow-inner">
              SA
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate max-w-full leading-none mb-1">
                Super Admin
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none truncate">
                Superintendent
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center font-black text-xs text-white uppercase mx-auto" title="Super Admin" />
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-transparent hover:border-red-500/10 transition-all cursor-pointer ${
            isCollapsed ? "justify-center" : "text-left"
          }`}
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>

    </div>
  );
}
