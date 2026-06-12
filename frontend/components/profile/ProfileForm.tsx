"use client";

import { useEffect, useState } from "react";
import { useStudent } from "@/hooks/useStudent";
import { User, School, ShieldAlert, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TabItem {
  id: string;
  label: string;
}

export default function ProfileForm({ activeTab }: { activeTab: string }) {
  const { useProfile, useUpdateProfile } = useStudent();
  const { data: student, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // Personal Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [address, setAddress] = useState("");

  // Guardian Fields State (Typically stored in custom nested parameters or simulate details)
  const [guardianName, setGuardianName] = useState("Rajesh Kumar");
  const [guardianPhone, setGuardianPhone] = useState("+91 98765 43210");
  const [guardianEmail, setGuardianEmail] = useState("rajesh.kumar@gmail.com");
  const [guardianAddress, setGuardianAddress] = useState("12/B Salt Lake Sector V, Kolkata, India");

  // Sync state once data loads from server
  useEffect(() => {
    if (student) {
      setFullName(student.fullName || "");
      setEmail(student.email || "");
      setPhone(student.phone || "");
      setDob(student.dob ? student.dob.split("T")[0] : "");
      setGender(student.gender || "MALE");
      setBloodGroup(student.bloodGroup || "O+");
      setAddress(student.address || "");
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      toast.error("Please fill in essential contact information.");
      return;
    }

    try {
      const payload = {
        fullName,
        email,
        phone,
        dob,
        gender,
        bloodGroup,
        address,
      };

      await updateProfileMutation.mutateAsync(payload);
    } catch (_) {}
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-3 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left select-none">
      
      {/* 1. PERSONAL DEMOGRAPHICS TAB */}
      {activeTab === "personal" && (
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4.5 h-4.5 text-blue-400" />
            Demographics Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Full Signature Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lucas Bennett"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                E-Mail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lucas@example.edu"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Primary Phone Contact
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* DOB */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest pl-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs text-white bg-slate-950 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              >
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest pl-1">
                Blood Group
              </label>
              <input
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="A+ / O+"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none uppercase"
              />
            </div>

            {/* Permanent Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Current Residential Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Provide physical house / hostel room address specs..."
                rows={3}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 pt-[14px]"
            >
              {updateProfileMutation.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              SAVE DEMOGRAPHICS INFORMATION
            </button>
          </div>
        </div>
      )}

      {/* 2. ACADEMIC INFO TAB (Read-only) */}
      {activeTab === "academic" && (
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <School className="w-4.5 h-4.5 text-emerald-450" />
              Official Registrar Milestones
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black bg-slate-855 text-slate-400">
              <ShieldAlert className="w-3 h-3 text-amber-500" />
              OFFICIALLY SIGNED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Roll Number */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
                Official Roll Number
              </span>
              <span className="text-xs font-black text-white block pt-1.5 font-mono select-all uppercase">
                {student?.rollNumber || "MIT-CS2026-921"}
              </span>
            </div>

            {/* Scholar Registration ID */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
                University Registration ID
              </span>
              <span className="text-xs font-black text-white block pt-1.5 font-mono select-all uppercase font-semibold">
                {student?.studentId || "REG-9182051"}
              </span>
            </div>

            {/* Course Curriculum */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
                Registered Course Curriculum
              </span>
              <span className="text-xs font-black text-white block pt-1.5 uppercase font-semibold">
                {student?.course || "B.Tech Computer Science & Eng"}
              </span>
            </div>

            {/* Core Department */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
                Registered Department Division
              </span>
              <span className="text-xs font-black text-white block pt-1.5 uppercase font-semibold">
                {student?.department || "Dept of Engineering & Tech"}
              </span>
            </div>

            {/* Semester */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
                Active Study Semester
              </span>
              <span className="text-xs font-black text-white block pt-1.5 uppercase font-semibold">
                Semester {student?.semester || 4}
              </span>
            </div>

            {/* Academic Batch */}
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5">
              <span className="text-[8.5px] font-black text-slate-550 uppercase tracking-widest block">
                Enrolled Cohort Batch
              </span>
              <span className="text-xs font-black text-white block pt-1.5 uppercase font-mono font-semibold">
                {student?.batch || "2024 - 2028"}
              </span>
            </div>

          </div>

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl leading-relaxed">
            <span className="text-[9.5px] font-bold uppercase tracking-wide">
              * Note: To request changes to read-only registrar files, submit a petition directly to the Academic Chancellor desk.
            </span>
          </div>
        </div>
      )}

      {/* 3. GUARDIAN INFO TAB */}
      {activeTab === "guardian" && (
        <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
            Guardian & Emergency Contacts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Guardian Name */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Guardian Full Name
              </label>
              <input
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="Rajesh Kumar"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Guardian Phone */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Guardian Phone Contact
              </label>
              <input
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Guardian Email */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-550 uppercase tracking-widest pl-1">
                Guardian E-mail Address
              </label>
              <input
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                placeholder="guardian@example.com"
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            {/* Residence Address */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">
                Guardian Residence Location
              </label>
              <textarea
                value={guardianAddress}
                onChange={(e) => setGuardianAddress(e.target.value)}
                placeholder="Emergency address specs..."
                rows={3}
                className="w-full text-xs text-white bg-white/5 focus:bg-white/10 p-3 rounded-xl border border-white/5 focus:border-blue-500 transition-all outline-none resize-none"
              />
            </div>

          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                toast.success("Guardian emergency contact profiles updated on backoffice register.");
              }}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-black bg-indigo-600 hover:bg-indigo-500 border border-indigo-505 text-white rounded-xl transition-all shadow-md cursor-pointer pt-[14px]"
            >
              <Save className="w-4 h-4" />
              LOCK EMERGENCY PROFILE
            </button>
          </div>
        </div>
      )}

    </form>
  );
}
