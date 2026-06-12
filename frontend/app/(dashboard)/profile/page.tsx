"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ProfileForm from "@/components/profile/ProfileForm";
import PhotoUpload from "@/components/profile/PhotoUpload";
import ChangePassword from "@/components/profile/ChangePassword";
import { User, School, Shield, Lock, Fingerprint } from "lucide-react";

export default function StudentProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Tab index tracking
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["personal", "academic", "guardian", "security"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.replace(`/profile?tab=${tabId}`);
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "academic", label: "Academic Info", icon: School },
    { id: "guardian", label: "Guardian Info", icon: Shield },
    { id: "security", label: "Security & Safety", icon: Lock },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto select-none">
      
      {/* 1. Header Typography */}
      <div className="text-left space-y-1.5 pb-2">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Student Profile Hub
        </h1>
        <p className="text-xs text-slate-500 font-bold max-w-xl leading-normal uppercase">
          Maintain your emergency contacts, update passport identity prints, and customize security auth factors.
        </p>
      </div>

      {/* 2. Slider Tabs Navigation Bar Row */}
      <div className="flex border-b border-white/5 overflow-x-auto gap-4 scrollbar-none select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative pb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer leading-none px-1 py-1 flex-shrink-0 ${
                isActive ? "text-blue-400" : "text-slate-500 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeProfileTabBorder"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 shadow-[0_2px_8px_rgba(59,130,246,0.5)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Render Form Pages dynamically */}
      <div className="min-h-[400px]">
        
        {/* Profile Image photo uploader only if in personal tabs */}
        {activeTab === "personal" && (
          <div className="mb-6 space-y-6">
            <PhotoUpload label="Official Pass ID Photo" />
          </div>
        )}

        {/* Change Password Panel if in security tab */}
        {activeTab === "security" ? (
          <ChangePassword />
        ) : (
          /* Multi-Forms mappings for other tabs */
          <ProfileForm activeTab={activeTab} />
        )}

      </div>

    </div>
  );
}
