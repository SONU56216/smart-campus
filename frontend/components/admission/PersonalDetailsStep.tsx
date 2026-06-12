"use client";

import { useAdmissionStore } from "@/hooks/useAdmissionStore";
import { User, Calendar, Users, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

interface StepProps {
  onNext: () => void;
}

export default function PersonalDetailsStep({ onNext }: StepProps) {
  const { personal, setPersonal, markStepComplete } = useAdmissionStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!personal.fullName.trim() || personal.fullName.trim().split(" ").length < 2) {
      toast.error("Please enter your complete signatures (First and Last Name).");
      return;
    }
    if (!personal.dob) {
      toast.error("Please specify your date of birth.");
      return;
    }

    markStepComplete(0, true);
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6 select-none text-left">
      
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] space-y-6 shadow-xl">
        
        {/* Step Header */}
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-blue-400" />
            PART 1: Candidate Demographics
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase pt-0.5">
            Provide official credentials exactly matching passport or High school certificates.
          </p>
        </div>

        {/* Input fields grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-505 text-slate-500 uppercase tracking-widest pl-1 block">
              Full Signature Name *
            </label>
            <input
              value={personal.fullName}
              onChange={(e) => setPersonal({ fullName: e.target.value })}
              placeholder="e.g. Lucas Bennett"
              className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
              required
            />
          </div>

          {/* DOB */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
              Date of Birth *
            </label>
            <div className="relative">
              <input
                type="date"
                value={personal.dob}
                onChange={(e) => setPersonal({ dob: e.target.value })}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 px-3 py-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none uppercase font-bold"
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
              Select Gender
            </label>
            <select
              value={personal.gender}
              onChange={(e) => setPersonal({ gender: e.target.value })}
              className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 px-3 py-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1 block">
              Reservation Category
            </label>
            <select
              value={personal.category}
              onChange={(e) => setPersonal({ category: e.target.value })}
              className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 px-3 py-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none font-bold uppercase"
            >
              <option value="GENERAL">GENERAL</option>
              <option value="OBC">OTHER BACKWARD CLASSES (OBC)</option>
              <option value="SC">SCHEDULED CASTE (SC)</option>
              <option value="ST">SCHEDULED TRIBE (ST)</option>
              <option value="EWS">ECONOMICALLY WEAKER SECTION (EWS)</option>
            </select>
          </div>

          {/* Blood Group */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-505 text-slate-500 uppercase tracking-widest pl-1 block">
              Blood Group
            </label>
            <input
              value={personal.bloodGroup}
              onChange={(e) => setPersonal({ bloodGroup: e.target.value })}
              placeholder="e.g. O+ / B-"
              maxLength={4}
              className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 h-11 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none uppercase font-bold"
            />
          </div>

        </div>

        {/* Form helper note */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center gap-3">
          <HeartHandshake className="w-5 h-5 flex-shrink-0 text-blue-400" />
          <p className="text-[9.5px] uppercase font-bold tracking-wide leading-normal">
            Ensure you possess valid government-issued certificate proofs for high reserve classes & Categories.
          </p>
        </div>

      </div>

      {/* Button controls */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider leading-none pt-[15px]"
        >
          Confirm and Proceed Next Step
        </button>
      </div>

    </form>
  );
}
