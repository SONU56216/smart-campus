"use client";

import { Mail, Phone, UserPlus, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactStepProps {
  formData: any;
  onChange: (fields: Partial<any>) => void;
  errors: Record<string, string>;
}

export default function ContactStep({ formData, onChange, errors }: ContactStepProps) {
  return (
    <div className="space-y-4 text-left select-none">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Step 2: Contacts & Address Details</h3>
        <p className="text-[10px] text-slate-400 font-medium pt-0.5">
          Enter active contact methods and legal residential bounds to enable physical and virtual correspondence.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="name@email.com"
              value={formData.email || ""}
              onChange={(e) => onChange({ email: e.target.value })}
              className={cn(
                "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-100 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.email 
                  ? "border-red-300 focus:ring-red-100 dark:border-red-955 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
          </div>
          {errors.email && <span className="text-[9px] font-bold text-red-500">{errors.email}</span>}
        </div>

        {/* Phone number */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              placeholder="e.g. +1 (555) 012-3456"
              value={formData.phone || ""}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={cn(
                "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-100 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
                errors.phone 
                  ? "border-red-300 focus:ring-red-100 dark:border-red-955 focus:border-red-500" 
                  : "focus:ring-primary/20 focus:border-primary"
              )}
            />
          </div>
          {errors.phone && <span className="text-[9px] font-bold text-red-500">{errors.phone}</span>}
        </div>
      </div>

      {/* Guardian sponsor */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guardian / Sponsor Full Name</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <UserPlus className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="e.g. Robert Miller"
            value={formData.guardian || ""}
            onChange={(e) => onChange({ guardian: e.target.value })}
            className={cn(
              "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-101 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all",
              errors.guardian 
                ? "border-red-300 focus:ring-red-101 dark:border-red-955 focus:border-red-500" 
                : "focus:ring-primary/20 focus:border-primary"
            )}
          />
        </div>
        {errors.guardian && <span className="text-[9px] font-bold text-red-500">{errors.guardian}</span>}
      </div>

      {/* Residential Address */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residential Address</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pt-2 text-slate-400 pointer-events-none">
            <MapPin className="w-4 h-4" />
          </span>
          <textarea
            placeholder="e.g. 128 University Ave, Suite 300, Metropolis"
            rows={3}
            value={formData.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
            className={cn(
              "w-full pl-9 pr-4 py-2 text-xs text-slate-805 dark:text-zinc-102 bg-white hover:bg-slate-50/50 dark:bg-slate-955 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none",
              errors.address 
                ? "border-red-305 focus:ring-red-110 dark:border-red-955 focus:border-red-500" 
                : "focus:ring-primary/20 focus:border-primary"
            )}
          />
        </div>
        {errors.address && <span className="text-[9px] font-bold text-red-500">{errors.address}</span>}
      </div>
    </div>
  );
}
