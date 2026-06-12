"use client";

import { useState } from "react";
import { Lock, Fingerprint, ShieldCheck, Smartphone, Eye, EyeOff, AlertCircle, Laptop } from "lucide-react";
import { toast } from "sonner";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);

  const activeDevices = [
    {
      id: "device-1",
      deviceName: "iPhone 15 Pro Max (This Device)",
      location: "Kolkata, WB, India",
      activeTime: "Active Session Now",
      ip: "103.88.22.18",
      type: "MOBILE",
    },
    {
      id: "device-2",
      deviceName: "Apple MacBook Pro M3",
      location: "Bengaluru, KA, India",
      activeTime: "2 hours ago",
      ip: "182.72.100.41",
      type: "LAPTOP",
    }
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all requested fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match. Check spelling.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Security bounds check failed. Password must be 6+ characters.");
      return;
    }

    toast.loading("Encrypting credentials logs...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Security credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  const handleBiometricToggle = () => {
    setIsBiometricEnabled(!isBiometricEnabled);
    if (!isBiometricEnabled) {
      toast.info("Biometric bypass enabled. Local face recognition / fingerprints mapped.");
    } else {
      toast.warning("Biometric pass disabled. Code PIN mandatory on checkin gate.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left select-none">
      
      {/* Change Password Block */}
      <form onSubmit={handlePasswordSubmit} className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4.5 h-4.5 text-blue-400" />
          Update Security Credentials
        </h3>

        {/* Current Password Input */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
            Current PassKey
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password Input */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
            New Secret Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer pt-[14px]"
        >
          APPLY CREDENTIALS AMEND
        </button>
      </form>

      {/* Biometric Safety Tab */}
      <div className="space-y-6">
        
        {/* Biometrics Switcher Card */}
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Fingerprint className="w-4.5 h-4.5 text-indigo-400" />
            Adaptive Biometrics Pass
          </h3>

          <div className="flex items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
            <div className="space-y-1 max-w-[190px]">
              <span className="text-xs font-black text-slate-200 uppercase leading-none block">
                FaceId / TouchID Bypass
              </span>
              <p className="text-[9.5px] text-slate-550 font-bold leading-normal pt-1 break-words">
                Bypass 6-digit pin screen and authorize check-ins via local biometric hardware keys.
              </p>
            </div>

            {/* Slider Switch Toggle */}
            <button 
              type="button"
              onClick={handleBiometricToggle}
              className={`w-11 h-6 rounded-full p-1 transition-all flex items-center cursor-pointer ${
                isBiometricEnabled ? "bg-indigo-600 justify-end" : "bg-slate-800 justify-start"
              }`}
            >
              <div className="w-4.5 h-4.5 bg-white rounded-full shadow" />
            </button>
          </div>
        </div>

        {/* Active Devices Log Table */}
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-slate-302 uppercase tracking-wider flex items-center gap-2">
            <Smartphone className="w-4.5 h-4.5 text-emerald-450" />
            Logged Stations & Devices
          </h3>

          <div className="space-y-3">
            {activeDevices.map((device) => {
              const IsMobile = device.type === "MOBILE";
              return (
                <div key={device.id} className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                      {IsMobile ? <Smartphone className="w-4.5 h-4.5 text-slate-400" /> : <Laptop className="w-4.5 h-4.5 text-slate-400" />}
                    </div>
                    <div className="text-left space-y-1">
                      <h4 className="text-xs font-black text-slate-200">
                        {device.deviceName}
                      </h4>
                      <p className="text-[9.5px] text-slate-500 font-bold leading-none select-all font-mono">
                        {device.ip} • {device.location}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[8.5px] font-black px-2 py-1 rounded leading-none uppercase tracking-wide flex-shrink-0 ${
                    device.activeTime.includes("Now") 
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                      : "bg-slate-800 text-slate-500"
                  }`}>
                    {device.activeTime}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
