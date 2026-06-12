"use client";

import { useState } from "react";
import { useNotification } from "@/hooks/useNotification";
import { 
  Bell, 
  CheckCheck, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Trash2,
  Clock,
  CircleDot
} from "lucide-react";
import { toast } from "sonner";

export default function StudentNotificationsPage() {
  const { useStudentInbox, useMarkRead } = useNotification();
  const { data: notifications, isLoading } = useStudentInbox();
  const markReadMutation = useMarkRead();

  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD">("ALL");

  // Premium template fallback alerts if server holds empty registers
  const fallbackNotifications = [
    {
      id: "notif-1",
      title: "Admit Card Issued",
      message: "Regular B.Tech Semester 4 Admit Card and seating plan has been released by COE. Proceed to download.",
      isRead: false,
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40m ago
      type: "SUCCESS",
    },
    {
      id: "notif-2",
      title: "Security Bypass Enabled",
      message: "As per registrar directives, standard Gate Terminal authentication can now resolve via local phone biometrics.",
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
      type: "INFO",
    },
    {
      id: "notif-3",
      title: "Attendance Cutoff Alert",
      message: "Warning: Your Database Management Course attendance stands at 70.5%. Cutoff is 75%. Clarify with warden.",
      isRead: true,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      type: "WARNING",
    }
  ];

  const activeNotifications = notifications && notifications.length > 0 ? notifications : fallbackNotifications;

  // Filter alerts by read status tab
  const filteredNotifications = activeNotifications.filter((notif) => {
    if (activeTab === "UNREAD" && notif.isRead) return false;
    return true;
  });

  const getNotificationIcon = (title: string, type?: string) => {
    const heading = title.toLowerCase();
    
    if (heading.includes("shortage") || heading.includes("cutoff") || heading.includes("warning")) {
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
    if (heading.includes("dues") || heading.includes("unauthorized") || heading.includes("block")) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (heading.includes("release") || heading.includes("issued") || heading.includes("success") || heading.includes("passed")) {
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    }
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getFormatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      const diffHrs = Math.floor(diffMs / (3600 * 1000));
      const diffDays = Math.floor(diffMs / (24 * 3600 * 1000));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      return `${diffDays}d ago`;
    } catch (_) {
      return "Alert tracked";
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markReadMutation.mutateAsync(id);
      toast.success("Notification marked as read resolved.");
    } catch (_) {}
  };

  const handleMarkAllAsRead = async () => {
    const unreadAlerts = activeNotifications.filter(a => !a.isRead);
    if (unreadAlerts.length === 0) {
      toast.info("All notifications are already marked read.");
      return;
    }

    try {
      toast.loading("Clearing notification counters...");
      // Resolve sequential marks
      for (const alert of unreadAlerts) {
        await markReadMutation.mutateAsync(alert.id);
      }
      toast.dismiss();
      toast.success("Cleared inbox notifications.");
    } catch (_) {
      toast.dismiss();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none text-left">
      
      {/* 1. Header block controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            Alerts & Notification Inbox
          </h1>
          <p className="text-xs text-slate-550 font-bold uppercase leading-normal">
            Acknowledge registrar announcements, clearance checklists, and active gate credentials updates.
          </p>
        </div>

        {/* Clear All action button */}
        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 rounded-xl transition-all cursor-pointer leading-none uppercase tracking-wider"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          Mark all read
        </button>
      </div>

      {/* 2. Slider Tabs row */}
      <div className="flex border-b border-white/5 overflow-x-auto gap-4 scrollbar-none select-none">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`relative pb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer px-1 py-1 ${
            activeTab === "ALL" ? "text-blue-400 font-bold" : "text-slate-500 hover:text-slate-200"
          }`}
        >
          All bulletins ({activeNotifications.length})
          {activeTab === "ALL" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.5)]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("UNREAD")}
          className={`relative pb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer px-1 py-1 ${
            activeTab === "UNREAD" ? "text-blue-405 font-bold" : "text-slate-500 hover:text-slate-200"
          }`}
        >
          Unread boards ({activeNotifications.filter(a => !a.isRead).length})
          {activeTab === "UNREAD" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.5)]" />
          )}
        </button>
      </div>

      {/* 3. Notifications lists database */}
      {isLoading ? (
        <div className="py-24 flex justify-center items-center">
          <div className="w-6 h-6 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-slate-900/30 border border-white/5 rounded-[24px] p-20 text-center flex flex-col items-center justify-center gap-4 select-none">
          <Bell className="w-12 h-12 text-slate-800 animate-pulse" />
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest leading-none">
            No active notification logs found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                notif.isRead 
                  ? "bg-slate-900/10 border-white/[0.03] opacity-60 hover:opacity-90" 
                  : "bg-slate-900/40 border-indigo-500/10 hover:border-indigo-500/20 shadow-md"
              }`}
            >
              {/* Icon classification badge */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex-shrink-0">
                {getNotificationIcon(notif.title, notif.type)}
              </div>

              {/* Text info layout */}
              <div className="flex-1 space-y-1.5 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider leading-none">
                    {notif.title}
                  </h4>
                  
                  {/* Unread spot alert */}
                  {!notif.isRead && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 uppercase tracking-widest leading-none">
                      <CircleDot className="w-2.5 h-2.5 text-indigo-400" />
                      NEW
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 font-bold leading-normal">
                  {notif.message}
                </p>

                {/* Date time tracker stamp */}
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 leading-none pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-700" />
                  {getFormatTime(notif.createdAt)}
                </div>
              </div>

              {/* Action Trigger Buttons */}
              {!notif.isRead && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="p-2 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 text-slate-500 hover:text-emerald-400 rounded-xl transition-all cursor-pointer flex-shrink-0"
                  title="Mark read"
                >
                  <CheckCheck className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
